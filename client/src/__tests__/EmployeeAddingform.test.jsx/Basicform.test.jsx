import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

// Adjust these import paths to match where you drop this file relative to
// AddEmployeeForm.jsx / EmployeeHeader.jsx / JobDetails.jsx in your project.
import AddEmployeeForm from "./AddEmployeeForm";
import EmployeeHeader from "../../Components/EmployeeHeader";

jest.mock("../../assets/employeeicon.svg", () => "employee-icon.svg");

jest.mock("react-redux", () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));

jest.mock("../../Components/Multistep", () => () => <div data-testid="multistep" />);
jest.mock("../../Components/UnsavedChangesGuard", () => () => null);
jest.mock("../../Components/EmployeeTitle", () => () => null);
jest.mock("../../Components/Loader", () => () => <div data-testid="loader">Loading...</div>);

// JobDetails is mocked file-wide (AddEmployeeForm needs the mocked version to
// stay isolated). Variable names must start with "mock" - that's a hard Jest
// requirement for anything referenced inside a jest.mock() factory. The
// dedicated "JobDetails (sub-component)" tests below bypass this mock with
// jest.requireActual() to get the real implementation.
const mockJobDetailsValidate = jest.fn(() => true);
let mockJobDetailsData = {};

jest.mock("../../Components/JobDetails", () => {
  const ReactLib = require("react");
  return ReactLib.forwardRef((props, ref) => {
    ReactLib.useEffect(() => {
      Object.entries(mockJobDetailsData).forEach(([name, value]) => {
        props.onFormChange({ target: { name, value, type: "text" } });
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    ReactLib.useImperativeHandle(ref, () => ({
      validate: mockJobDetailsValidate,
      getData: () => mockJobDetailsData,
    }));

    return ReactLib.createElement("div", { "data-testid": "job-details-mock" });
  });
});

beforeAll(() => {
  global.URL.createObjectURL = jest.fn(() => "blob:mock-url");
});

/* ============================================================
 * PAGE: AddEmployeeForm (Basic Info + Job Details step)
 * ============================================================
 * EmployeeHeader is left un-mocked here: it receives `setFormData`
 * directly from AddEmployeeForm, so typing into its inputs really
 * updates the parent's validation state.
 *
 * JobDetails uses the file-level mock above: on mount it feeds a
 * fully-valid job-details payload back up through `onFormChange`
 * (mirroring what a user would enter in step 2), while exposing
 * `validate`/`getData` via the ref, same shape as the real component.
 * ============================================================ */
describe("AddEmployeeForm (page)", () => {
  const mockDispatch = jest.fn();
  const mockNavigate = jest.fn();

  const setUser = (country = "IN") => {
    localStorage.setItem("user", JSON.stringify({ company: { country } }));
  };

  const fillRequiredHeaderFields = async () => {
    await userEvent.type(screen.getByPlaceholderText(/enter full name/i), "Jane Doe");
    await userEvent.type(screen.getByPlaceholderText(/enter email address/i), "jane@example.com");
    fireEvent.change(document.querySelector('input[name="dob"]'), {
      target: { name: "dob", value: "1990-01-01" },
    });
    fireEvent.change(document.querySelector('select[name="gender"]'), {
      target: { name: "gender", value: "Female" },
    });
    await userEvent.type(screen.getByPlaceholderText(/enter full address/i), "123 Main St");
    await userEvent.type(screen.getByPlaceholderText(/enter employee code/i), "EMP001");
  };

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    sessionStorage.clear();

    mockJobDetailsValidate.mockReturnValue(true);
    mockJobDetailsData = {
      designation: "Software Engineer",
      joining_date: "2020-01-01",
      department_id: "1",
      employment_type: "Full-time",
      total_leave: "10",
      role: "employee",
      phno: "9876543210",
      aadar_number: "123456789012",
    };

    useDispatch.mockReturnValue(mockDispatch);
    useNavigate.mockReturnValue(mockNavigate);
    useSelector.mockImplementation((selectorFn) =>
      selectorFn({
        employee: { formData: {} },
        departments: { list: [{ id: 1, name: "Engineering" }] },
      })
    );

    // Generic thunk-aware dispatch mock:
    // - plain action creators (setBasicFormData, setEmployeeId) => returned as-is
    // - thunk calls (submitEmployee) => resolved "fulfilled" result
    mockDispatch.mockImplementation((action) => {
      if (typeof action === "function") {
        return {
          meta: { requestStatus: "fulfilled" },
          payload: { employee: { id: 101 } },
        };
      }
      return action;
    });
  });

  test("renders Basic Info + Job Details step and the Next button", () => {
    setUser();
    render(<AddEmployeeForm />);
    expect(screen.getByTestId("job-details-mock")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /next/i })).toBeInTheDocument();
  });

  test("fetches departments on mount when the department list is empty", () => {
    useSelector.mockImplementation((selectorFn) =>
      selectorFn({ employee: { formData: {} }, departments: { list: [] } })
    );
    setUser();
    render(<AddEmployeeForm />);
    expect(mockDispatch).toHaveBeenCalled();
  });

  test("blocks submission and shows field errors when required fields are empty", async () => {
    setUser();
    render(<AddEmployeeForm />);

    fireEvent.click(screen.getByRole("button", { name: /next/i }));

    await waitFor(() => {
      expect(screen.getAllByText(/this field is required/i).length).toBeGreaterThan(0);
    });
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test("rejects a future date of birth", async () => {
    setUser();
    render(<AddEmployeeForm />);
    await fillRequiredHeaderFields();
    fireEvent.change(document.querySelector('input[name="dob"]'), {
      target: { name: "dob", value: "2999-01-01" },
    });

    fireEvent.click(screen.getByRole("button", { name: /next/i }));

    await waitFor(() => {
      expect(screen.getByText(/date of birth must be in the past/i)).toBeInTheDocument();
    });
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test("does not submit when Job Details validation fails, even if Basic Info is valid", async () => {
    mockJobDetailsValidate.mockReturnValue(false);
    setUser();
    render(<AddEmployeeForm />);
    await fillRequiredHeaderFields();

    fireEvent.click(screen.getByRole("button", { name: /next/i }));

    await waitFor(() => {
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  test("submits successfully, stores the employee id, and navigates to /bank-payment", async () => {
    setUser();
    render(<AddEmployeeForm />);
    await fillRequiredHeaderFields();

    fireEvent.click(screen.getByRole("button", { name: /next/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/bank-payment");
    });
  });

  test("shows a loader and disables the Next button while submitting", async () => {
    let resolveDispatch;
    mockDispatch.mockImplementation((action) => {
      if (typeof action === "function") {
        return new Promise((resolve) => {
          resolveDispatch = () =>
            resolve({ meta: { requestStatus: "fulfilled" }, payload: { employee: { id: 1 } } });
        });
      }
      return action;
    });

    setUser();
    render(<AddEmployeeForm />);
    await fillRequiredHeaderFields();

    fireEvent.click(screen.getByRole("button", { name: /next/i }));

    await waitFor(() => {
      expect(screen.getByTestId("loader")).toBeInTheDocument();
    });
    expect(screen.getByRole("button", { name: /saving/i })).toBeDisabled();

    resolveDispatch();
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalled();
    });
  });

  test("maps backend field errors on a rejected submission and shows a friendly duplicate-email message", async () => {
    mockDispatch.mockImplementation((action) => {
      if (typeof action === "function") {
        return {
          meta: { requestStatus: "rejected" },
          payload: { email: ["Email already exists"] },
        };
      }
      return action;
    });

    setUser();
    render(<AddEmployeeForm />);
    await fillRequiredHeaderFields();

    fireEvent.click(screen.getByRole("button", { name: /next/i }));

    await waitFor(() => {
      expect(screen.getByText(/this email is already registered/i)).toBeInTheDocument();
    });
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});

/* ============================================================
 * SUB-COMPONENT: EmployeeHeader (rendered inside the Basic form)
 * ============================================================ */
describe("EmployeeHeader (sub-component)", () => {
  const baseFormData = {
    name: "",
    email: "",
    employee_code: "",
    dob: "",
    gender: "",
    address: "",
    profile_pic: null,
  };

  const renderComponent = (overrides = {}) => {
    const setFormData = jest.fn();
    const setIsFormDirty = jest.fn();
    const setErrors = jest.fn();
    const props = {
      formData: baseFormData,
      setFormData,
      setIsFormDirty,
      errors: {},
      setErrors,
      ...overrides,
    };
    render(<EmployeeHeader {...props} />);
    return { setFormData, setIsFormDirty, setErrors };
  };

  test("renders all basic info fields", () => {
    renderComponent();
    expect(screen.getByPlaceholderText(/enter full name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter email address/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter employee code/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter full address/i)).toBeInTheDocument();
  });

  test("updates the name field and marks the form dirty", async () => {
    const { setFormData, setIsFormDirty } = renderComponent();
    await userEvent.type(screen.getByPlaceholderText(/enter full name/i), "J");
    expect(setFormData).toHaveBeenCalled();
    expect(setIsFormDirty).toHaveBeenCalledWith(true);
  });

  test("rejects a non-image file for the profile picture", () => {
    const { setErrors, setFormData } = renderComponent();
    const file = new File(["dummy"], "resume.pdf", { type: "application/pdf" });
    const input = document.getElementById("profile-upload");
    fireEvent.change(input, { target: { files: [file] } });

    const updater = setErrors.mock.calls[0][0];
    expect(updater({})).toEqual({ profile_pic: "Please upload a valid image." });
    expect(setFormData).not.toHaveBeenCalled();
  });

  test("rejects an image larger than 5 MB", () => {
    const { setErrors, setFormData } = renderComponent();
    const bigFile = new File([new ArrayBuffer(6 * 1024 * 1024)], "big.png", { type: "image/png" });
    const input = document.getElementById("profile-upload");
    fireEvent.change(input, { target: { files: [bigFile] } });

    const updater = setErrors.mock.calls[0][0];
    expect(updater({})).toEqual({ profile_pic: "Image size must be less than 5 MB." });
    expect(setFormData).not.toHaveBeenCalled();
  });

  test("accepts a valid image and clears any previous error", () => {
    const { setErrors, setFormData, setIsFormDirty } = renderComponent();
    const file = new File(["dummy"], "avatar.png", { type: "image/png" });
    const input = document.getElementById("profile-upload");
    fireEvent.change(input, { target: { files: [file] } });

    const clearUpdater = setErrors.mock.calls[0][0];
    expect(clearUpdater({ profile_pic: "old error" })).toEqual({ profile_pic: "" });

    const formUpdater = setFormData.mock.calls[0][0];
    expect(formUpdater(baseFormData)).toEqual({ ...baseFormData, profile_pic: file });
    expect(setIsFormDirty).toHaveBeenCalledWith(true);
  });

  test("shows the remove button when a photo is set and clears it on click", () => {
    const file = new File(["dummy"], "avatar.png", { type: "image/png" });
    const { setFormData, setIsFormDirty } = renderComponent({
      formData: { ...baseFormData, profile_pic: file },
    });

    const removeButton = screen.getByTitle(/remove photo/i);
    fireEvent.click(removeButton);

    const formUpdater = setFormData.mock.calls[0][0];
    expect(formUpdater({ ...baseFormData, profile_pic: file })).toEqual({
      ...baseFormData,
      profile_pic: null,
    });
    expect(setIsFormDirty).toHaveBeenCalledWith(true);
  });

  test("does not render the remove button when there is no photo", () => {
    renderComponent();
    expect(screen.queryByTitle(/remove photo/i)).not.toBeInTheDocument();
  });

  test("displays a field-level error message when provided", () => {
    renderComponent({ errors: { name: "This field is required" } });
    expect(screen.getByText(/this field is required/i)).toBeInTheDocument();
  });
});

/* ============================================================
 * SUB-COMPONENT: JobDetails (rendered inside the Basic form)
 * ============================================================
 * JobDetails is mocked file-wide above (for AddEmployeeForm's sake), so
 * these tests pull in the REAL implementation via jest.requireActual to
 * exercise its actual validation logic, unaffected by the mock.
 * ============================================================ */
describe("JobDetails (sub-component)", () => {
  const JobDetails = jest.requireActual("../../Components/JobDetails").default;

  const departments = [
    { id: 1, name: "Engineering" },
    { id: 2, name: "HR" },
  ];

  const renderJobDetails = (props = {}) => {
    const ref = React.createRef();
    const onFormChange = jest.fn();
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

  beforeEach(() => {
    useSelector.mockReturnValue([]);
  });

  test("renders India-specific fields (Aadhaar, Contract Expiry)", () => {
    renderJobDetails({ country: "IN" });
    expect(screen.getByText(/aadhaar number/i)).toBeInTheDocument();
    expect(screen.getByText(/contract expiry date/i)).toBeInTheDocument();
    expect(screen.queryByText(/iqama number/i)).not.toBeInTheDocument();
  });

  test("renders non-India fields (Iqama, Visa Expiry)", () => {
    renderJobDetails({ country: "SA" });
    expect(screen.getByText(/iqama number/i)).toBeInTheDocument();
    expect(screen.getByText(/visa expiry date/i)).toBeInTheDocument();
    expect(screen.queryByText(/aadhaar number/i)).not.toBeInTheDocument();
  });

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

  test("validate() fails when required fields are missing and flags that a leave entry is required", () => {
    const { ref } = renderJobDetails();
    const isValid = ref.current.validate();
    expect(isValid).toBe(false);
    expect(screen.getByText(/please enter at least one leave/i)).toBeInTheDocument();
  });

  test("validates Aadhaar must be exactly 12 digits for India", () => {
    const { ref } = renderJobDetails({ country: "IN" });
    fireEvent.change(document.querySelector('input[name="aadar_number"]'), {
      target: { name: "aadar_number", value: "123" },
    });
    ref.current.validate();
    expect(screen.getByText(/aadhaar number must be exactly 12 digits/i)).toBeInTheDocument();
  });

  test("validates a 10-digit Indian phone number", () => {
    const { ref } = renderJobDetails({ country: "IN" });
    fireEvent.change(document.querySelector('input[name="phno"]'), {
      target: { name: "phno", value: "12345" },
    });
    ref.current.validate();
    expect(screen.getByText(/enter a valid 10-digit phone number/i)).toBeInTheDocument();
  });

  test("validates international phone number format for non-IN companies", () => {
    const { ref } = renderJobDetails({ country: "SA" });
    fireEvent.change(document.querySelector('input[name="phno"]'), {
      target: { name: "phno", value: "abc" },
    });
    ref.current.validate();
    expect(screen.getByText(/enter a valid international phone number/i)).toBeInTheDocument();
  });

  test("validates email format", () => {
    const { ref } = renderJobDetails();
    fireEvent.change(document.querySelector('input[name="email"]'), {
      target: { name: "email", value: "not-an-email" },
    });
    ref.current.validate();
    expect(screen.getByText(/enter a valid email/i)).toBeInTheDocument();
  });

  test("rejects a future date of birth and a past contract expiry date", () => {
    const { ref } = renderJobDetails({ country: "IN" });
    fireEvent.change(document.querySelector('input[name="dob"]'), {
      target: { name: "dob", value: "2999-01-01" },
    });
    fireEvent.change(document.querySelector('input[name="contract_expiry_date"]'), {
      target: { name: "contract_expiry_date", value: "2000-01-01" },
    });
    ref.current.validate();
    expect(screen.getByText(/date of birth must be in the past/i)).toBeInTheDocument();
    expect(screen.getByText(/contract expiry must be in the future/i)).toBeInTheDocument();
  });

  test("getData() reflects the current form state", () => {
    const { ref } = renderJobDetails();
    fireEvent.change(document.querySelector('input[name="designation"]'), {
      target: { name: "designation", value: "Engineer" },
    });
    expect(ref.current.getData().designation).toBe("Engineer");
  });

  test("rejects an ID card image that is the wrong type or over 5 MB", () => {
    renderJobDetails();
    const input = document.getElementById("idcard");

    const badTypeFile = new File(["x"], "doc.pdf", { type: "application/pdf" });
    fireEvent.change(input, { target: { files: [badTypeFile] } });
    expect(
      screen.getByText(/only jpg, jpeg, png and webp images are allowed/i)
    ).toBeInTheDocument();

    const bigFile = new File([new ArrayBuffer(6 * 1024 * 1024)], "id.png", {
      type: "image/png",
    });
    fireEvent.change(input, { target: { files: [bigFile] } });
    expect(screen.getByText(/image size must be less than 5 mb/i)).toBeInTheDocument();
  });
});