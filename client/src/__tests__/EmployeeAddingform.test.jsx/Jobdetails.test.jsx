// src/__tests__/JobDetails.test.jsx
//
// Test stack: Vitest + @testing-library/react
//
// Notes on this component's actual behavior (important for why the tests
// are shaped the way they are):
//
// 1. `email` and `dob` are checked inside validateForm() but are NEVER
//    rendered as <Input> fields anywhere in JobDetails' JSX, and
//    renderError("email") / renderError("dob") are never called either.
//    That means:
//      - There is no DOM element to fireEvent.change on for these fields.
//      - No error text for them can ever appear in the document, no matter
//        what validate() computes internally.
//    The only way to exercise these branches is via the `initialValues`
//    prop, and the only observable effect is the boolean returned by
//    ref.current.validate() — not any rendered text. Tests below reflect
//    that reality instead of asserting on DOM text that can never exist.
//
// 2. `total_leave` defaults to 0 and is included in `baseRequired`, so
//    when no leave inputs are filled in, BOTH `errors.total_leave` ("This
//    field is required" - never rendered, no renderError("total_leave")
//    call) and `errors.leave` ("Please enter at least one leave." - IS
//    rendered) get set. Only the second one is visible in the DOM.
//
// 3. `country` is captured once via useState(defaultCountry) on first
//    render and never updates after that, so re-rendering with a new
//    `country` prop after mount will NOT change which fields display.
//    Always assert the initial render's country, and pass `country` via
//    the initial render, not by updating props post-mount.
//
// 4. ref.current.validate() calls setErrors(...) internally. Because it's
//    invoked as a plain imperative ref method (not through a DOM event like
//    fireEvent/userEvent), React Testing Library does NOT automatically
//    wrap it in act(). Every call to ref.current.validate() below goes
//    through the validate() helper, which wraps it in act() so the
//    resulting error-state re-render is flushed to the DOM before
//    assertions run.
//
// 5. The Roles <select> also has an option literally named "HR" (value
//    "hr"), which collides with the Department <select>'s "HR" option
//    (value "2") when querying getByRole("option", { name: "HR" })
//    globally. Department-option lookups are scoped with `within()` to
//    the specific <select name="department_id"> element to disambiguate.

import React from "react";
import { render, screen, fireEvent, act, within } from "@testing-library/react";
import { useSelector } from "react-redux";

vi.mock("react-redux", () => ({
  useSelector: vi.fn(),
}));

import JobDetails from "../../Components/JobDetails";

const departments = [
  { id: 1, name: "Engineering" },
  { id: 2, name: "HR" },
];

const renderJobDetails = (props = {}) => {
  const ref = React.createRef();
  const onFormChange = vi.fn();
  const utils = render(
    <JobDetails
      country="IN"
      departments={departments}
      initialValues={{}}
      onFormChange={onFormChange}
      errors={{}}
      ref={ref}
      {...props}
    />
  );
  return { ref, onFormChange, ...utils };
};

// Wraps ref.current.validate() in act() so the setErrors() state update it
// triggers internally is flushed to the DOM before any assertion runs.
const validate = (ref) => {
  let result;
  act(() => {
    result = ref.current.validate();
  });
  return result;
};

const getDepartmentSelect = () => document.querySelector('select[name="department_id"]');

beforeEach(() => {
  vi.clearAllMocks();
  useSelector.mockReturnValue([]);
  localStorage.clear();
  sessionStorage.clear();
});

describe("JobDetails - rendering by country", () => {
  test("renders India-specific fields (Aadhaar, Contract Expiry) and hides non-IN fields", () => {
    renderJobDetails({ country: "IN" });
    expect(screen.getByText(/aadhaar number/i)).toBeInTheDocument();
    expect(screen.getByText(/contract expiry date/i)).toBeInTheDocument();
    expect(screen.queryByText(/iqama number/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/visa expiry date/i)).not.toBeInTheDocument();
  });

  test("renders non-India fields (Iqama, Visa Expiry) and hides IN-only fields", () => {
    renderJobDetails({ country: "SA" });
    expect(screen.getByText(/iqama number/i)).toBeInTheDocument();
    expect(screen.getByText(/visa expiry date/i)).toBeInTheDocument();
    expect(screen.queryByText(/aadhaar number/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/contract expiry date/i)).not.toBeInTheDocument();
  });

  test("falls back to the country stored in localStorage 'user' when no country prop is given", () => {
    localStorage.setItem("user", JSON.stringify({ company: { country: "SA" } }));
    renderJobDetails({ country: undefined });
    expect(screen.getByText(/iqama number/i)).toBeInTheDocument();
  });

  test("defaults to IN when neither a country prop nor stored user country exists", () => {
    renderJobDetails({ country: undefined });
    expect(screen.getByText(/aadhaar number/i)).toBeInTheDocument();
  });
});

describe("JobDetails - department list", () => {
  test("uses the departments prop when provided, ignoring the redux store", () => {
    useSelector.mockReturnValue([{ id: 99, name: "FromStore" }]);
    renderJobDetails({ departments });

    const departmentSelect = getDepartmentSelect();
    expect(within(departmentSelect).getByRole("option", { name: "Engineering" })).toBeInTheDocument();
    expect(within(departmentSelect).getByRole("option", { name: "HR" })).toBeInTheDocument();
    expect(within(departmentSelect).queryByRole("option", { name: "FromStore" })).not.toBeInTheDocument();
  });

  test("falls back to the redux store's department list when no departments prop is passed", () => {
    useSelector.mockReturnValue([{ id: 99, name: "FromStore" }]);
    renderJobDetails({ departments: [] });

    const departmentSelect = getDepartmentSelect();
    expect(within(departmentSelect).getByRole("option", { name: "FromStore" })).toBeInTheDocument();
  });
});

describe("JobDetails - leave allocation", () => {
  test("computes total leave from individual leave inputs and reports it via onFormChange", () => {
    const { onFormChange } = renderJobDetails();

    fireEvent.change(document.querySelector('input[name="casual_leave"]'), {
      target: { name: "casual_leave", value: "5" },
    });
    fireEvent.change(document.querySelector('input[name="sick_leave"]'), {
      target: { name: "sick_leave", value: "3" },
    });

    expect(screen.getByText(/total leave\s*:\s*8/i)).toBeInTheDocument();
    expect(onFormChange).toHaveBeenCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({ name: "total_leave", value: 8 }),
      })
    );
  });

  test("treats non-numeric leave input as 0 when summing total leave", () => {
    renderJobDetails();
    fireEvent.change(document.querySelector('input[name="casual_leave"]'), {
      target: { name: "casual_leave", value: "abc" },
    });
    expect(screen.getByText(/total leave\s*:\s*0/i)).toBeInTheDocument();
  });
});

describe("JobDetails - validate() required fields", () => {
  test("fails and shows 'This field is required' errors when required fields are empty", () => {
    const { ref } = renderJobDetails();
    const isValid = validate(ref);
    expect(isValid).toBe(false);
    expect(screen.getAllByText(/this field is required/i).length).toBeGreaterThan(0);
  });

  test("flags that at least one leave entry is required when total leave is 0", () => {
    const { ref } = renderJobDetails();
    validate(ref);
    expect(screen.getByText(/please enter at least one leave/i)).toBeInTheDocument();
  });

  test("requires aadar_number for IN and shows a required-field error", () => {
    const { ref } = renderJobDetails({ country: "IN" });
    validate(ref);
    expect(screen.getAllByText(/this field is required/i).length).toBeGreaterThan(0);
  });

  test("requires visa_expiry_date, insurance_number and iqama_number for non-IN countries", () => {
    const { ref } = renderJobDetails({ country: "SA" });
    validate(ref);
    const requiredErrors = screen.getAllByText(/this field is required/i);
    expect(requiredErrors.length).toBeGreaterThan(0);
  });

  test("passes validation once every required field for IN is filled correctly", () => {
    const { ref } = renderJobDetails({
      country: "IN",
      initialValues: {
        designation: "Engineer",
        joining_date: "2020-01-01",
        department_id: "1",
        employment_type: "Full-time",
        casual_leave: "5",
        phno: "9876543210",
        role: "employee",
        aadar_number: "123456789012",
        email: "jane@example.com",
        dob: "1990-01-01",
      },
    });
    expect(validate(ref)).toBe(true);
  });
});

describe("JobDetails - field-format validation", () => {
  test("rejects an Aadhaar number that is not exactly 12 digits (IN)", () => {
    const { ref } = renderJobDetails({ country: "IN" });
    fireEvent.change(document.querySelector('input[name="aadar_number"]'), {
      target: { name: "aadar_number", value: "123" },
    });
    validate(ref);
    expect(screen.getByText(/aadhaar number must be exactly 12 digits/i)).toBeInTheDocument();
  });

  test("rejects a phone number that isn't exactly 10 digits for IN", () => {
    const { ref } = renderJobDetails({ country: "IN" });
    fireEvent.change(document.querySelector('input[name="phno"]'), {
      target: { name: "phno", value: "12345" },
    });
    validate(ref);
    expect(screen.getByText(/enter a valid 10-digit phone number/i)).toBeInTheDocument();
  });

  test("accepts a valid 10-digit phone number for IN", () => {
    const { ref } = renderJobDetails({ country: "IN" });
    fireEvent.change(document.querySelector('input[name="phno"]'), {
      target: { name: "phno", value: "9876543210" },
    });
    validate(ref);
    expect(screen.queryByText(/enter a valid 10-digit phone number/i)).not.toBeInTheDocument();
  });

  test("rejects an invalid international phone number for non-IN countries", () => {
    const { ref } = renderJobDetails({ country: "SA" });
    fireEvent.change(document.querySelector('input[name="phno"]'), {
      target: { name: "phno", value: "abc" },
    });
    validate(ref);
    expect(screen.getByText(/enter a valid international phone number/i)).toBeInTheDocument();
  });

  test("accepts a valid international phone number for non-IN countries", () => {
    const { ref } = renderJobDetails({ country: "SA" });
    fireEvent.change(document.querySelector('input[name="phno"]'), {
      target: { name: "phno", value: "+966512345678" },
    });
    validate(ref);
    expect(screen.queryByText(/enter a valid international phone number/i)).not.toBeInTheDocument();
  });

  test("rejects a joining date set in the future", () => {
    const { ref } = renderJobDetails();
    fireEvent.change(document.querySelector('input[name="joining_date"]'), {
      target: { name: "joining_date", value: "2999-01-01" },
    });
    validate(ref);
    expect(screen.getByText(/joining date cannot be in the future/i)).toBeInTheDocument();
  });

  test("rejects a contract expiry date that is today or in the past (IN)", () => {
    const { ref } = renderJobDetails({ country: "IN" });
    fireEvent.change(document.querySelector('input[name="contract_expiry_date"]'), {
      target: { name: "contract_expiry_date", value: "2000-01-01" },
    });
    validate(ref);
    expect(screen.getByText(/contract expiry must be in the future/i)).toBeInTheDocument();
  });

  test("rejects a visa expiry date that is today or in the past (non-IN)", () => {
    const { ref } = renderJobDetails({ country: "SA" });
    fireEvent.change(document.querySelector('input[name="visa_expiry_date"]'), {
      target: { name: "visa_expiry_date", value: "2000-01-01" },
    });
    validate(ref);
    expect(screen.getByText(/visa expiry must be in the future/i)).toBeInTheDocument();
  });

  // email/dob are validated internally but have no rendered <Input> or
  // <ErrorText>, so they can only be driven via initialValues, and only
  // the boolean result of validate() is observable — never DOM text.
  test("validate() returns false when initialValues.email is not a valid email, with no other errors", () => {
    const { ref } = renderJobDetails({
      country: "IN",
      initialValues: {
        designation: "Engineer",
        joining_date: "2020-01-01",
        department_id: "1",
        employment_type: "Full-time",
        casual_leave: "5",
        phno: "9876543210",
        role: "employee",
        aadar_number: "123456789012",
        email: "not-an-email",
        dob: "1990-01-01",
      },
    });
    expect(validate(ref)).toBe(false);
  });

  test("validate() returns false when initialValues.dob is in the future, with no other errors", () => {
    const { ref } = renderJobDetails({
      country: "IN",
      initialValues: {
        designation: "Engineer",
        joining_date: "2020-01-01",
        department_id: "1",
        employment_type: "Full-time",
        casual_leave: "5",
        phno: "9876543210",
        role: "employee",
        aadar_number: "123456789012",
        email: "jane@example.com",
        dob: "2999-01-01",
      },
    });
    expect(validate(ref)).toBe(false);
  });
});

describe("JobDetails - getData()", () => {
  test("reflects the current form state after user input", () => {
    const { ref } = renderJobDetails();
    fireEvent.change(document.querySelector('input[name="designation"]'), {
      target: { name: "designation", value: "Engineer" },
    });
    expect(ref.current.getData().designation).toBe("Engineer");
  });

  test("merges initialValues into the returned data", () => {
    const { ref } = renderJobDetails({
      initialValues: { designation: "Senior Engineer", role: "manager" },
    });
    const data = ref.current.getData();
    expect(data.designation).toBe("Senior Engineer");
    expect(data.role).toBe("manager");
  });
});

describe("JobDetails - ID card file upload", () => {
  test("rejects a file with a disallowed type", () => {
    renderJobDetails();
    const input = document.getElementById("idcard");
    const badTypeFile = new File(["x"], "doc.pdf", { type: "application/pdf" });
    fireEvent.change(input, { target: { files: [badTypeFile] } });
    expect(
      screen.getByText(/only jpg, jpeg, png and webp images are allowed/i)
    ).toBeInTheDocument();
  });

  test("rejects a file larger than 5 MB", () => {
    renderJobDetails();
    const input = document.getElementById("idcard");
    const bigFile = new File([new ArrayBuffer(6 * 1024 * 1024)], "id.png", {
      type: "image/png",
    });
    fireEvent.change(input, { target: { files: [bigFile] } });
    expect(screen.getByText(/image size must be less than 5 mb/i)).toBeInTheDocument();
  });

  test("accepts a valid image, clears prior errors, updates the label, and calls onFormChange", () => {
    const { onFormChange } = renderJobDetails();
    const input = document.getElementById("idcard");

    // First trigger an error...
    const badTypeFile = new File(["x"], "doc.pdf", { type: "application/pdf" });
    fireEvent.change(input, { target: { files: [badTypeFile] } });
    expect(
      screen.getByText(/only jpg, jpeg, png and webp images are allowed/i)
    ).toBeInTheDocument();

    // ...then upload a valid image and confirm the error clears.
    const goodFile = new File(["x"], "id.png", { type: "image/png" });
    fireEvent.change(input, { target: { files: [goodFile] } });

    expect(
      screen.queryByText(/only jpg, jpeg, png and webp images are allowed/i)
    ).not.toBeInTheDocument();
    expect(screen.getByText("id.png")).toBeInTheDocument();
    expect(onFormChange).toHaveBeenCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({ name: "idcard", type: "file" }),
      })
    );
  });

  test("clears the idcard value when the file input is cleared (no file selected)", () => {
    const { ref, onFormChange } = renderJobDetails();
    const input = document.getElementById("idcard");

    const goodFile = new File(["x"], "id.png", { type: "image/png" });
    fireEvent.change(input, { target: { files: [goodFile] } });
    expect(ref.current.getData().idcard).toBe(goodFile);

    fireEvent.change(input, { target: { files: [] } });
    expect(ref.current.getData().idcard).toBeNull();
    expect(onFormChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ target: expect.objectContaining({ name: "idcard" }) })
    );
  });
});

describe("JobDetails - generic text field updates", () => {
  test("updates a plain text field via handleChange and calls onFormChange", () => {
    const { onFormChange } = renderJobDetails();
    fireEvent.change(document.querySelector('input[name="passport_number"]'), {
      target: { name: "passport_number", value: "P1234567" },
    });
    expect(document.querySelector('input[name="passport_number"]').value).toBe("P1234567");
    expect(onFormChange).toHaveBeenCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({ name: "passport_number", value: "P1234567" }),
      })
    );
  });
});