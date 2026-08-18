import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from "@testing-library/react";

import "@testing-library/jest-dom";

/* =========================================================
   MOCKS
========================================================= */

const mocks = vi.hoisted(() => ({
  dispatch: vi.fn(),

  getEmployeeDocumentsThunk: vi.fn(),
  updateEmployeeDocumentsThunk: vi.fn(),
  uploadImageThunk: vi.fn(),

  useParams: vi.fn(),

  swalFire: vi.fn(),

  selectorState: {
    employeeDetail: {
      id: "101",
      first_name: "John",
      last_name: "Doe",
    },

    employeeDocuments: {
      passport_image1_url: "/media/passport1.jpg",
      passport_image2_url: "/media/passport2.jpg",

      work_permit_urls: ["/media/work-permit.jpg"],

      contract_urls: ["/media/contract.jpg"],

      insurance_image_url: "/media/insurance.jpg",

      certificate_urls: ["/media/certificate.jpg"],
    },

    loading: false,
  },
}));

/* =========================================================
   REACT REDUX
========================================================= */

vi.mock("react-redux", () => ({
  useDispatch: () => mocks.dispatch,

  useSelector: (selector) => {
    return selector({
      employees: mocks.selectorState,
    });
  },
}));

/* =========================================================
   REACT ROUTER
========================================================= */

vi.mock("react-router-dom", () => ({
  useParams: () => mocks.useParams(),
}));

/* =========================================================
   SWEET ALERT
========================================================= */

vi.mock("sweetalert2", () => ({
  default: {
    fire: mocks.swalFire,
  },
}));

/* =========================================================
   EMPLOYEE SLICE
========================================================= */

vi.mock("../../Redux/employeeSlice", () => ({
  uploadImageThunk: mocks.uploadImageThunk,
  getEmployeeDocumentsThunk: mocks.getEmployeeDocumentsThunk,
  updateEmployeeDocumentsThunk: mocks.updateEmployeeDocumentsThunk,
}));

/* =========================================================
   SYNC LOADER
========================================================= */

vi.mock("react-spinners/SyncLoader", () => ({
  default: (props) => (
    <div
      data-testid="sync-loader"
      data-color={props.color}
      data-size={props.size}
    >
      Loading...
    </div>
  ),
}));

/* =========================================================
   VIEW BASIC LAYOUT
========================================================= */

vi.mock("../../Pages/employee/layout/ViewLayout", () => ({
  default: ({ children, handleSubmit, id }) => (
    <div data-testid="view-basic-layout" data-employee-id={id}>
      <button type="button" onClick={handleSubmit}>
        Save Documents
      </button>

      {children}
    </div>
  ),
}));

/* =========================================================
   IMPORT COMPONENT
========================================================= */

import ViewDocument from "../../Pages/employee/ViewDocument";

/* =========================================================
   TEST DATA
========================================================= */

const employeeDetail = {
  id: "101",
  first_name: "John",
  last_name: "Doe",
};

const employeeDocuments = {
  passport_image1_url: "/media/passport1.jpg",

  passport_image2_url: "/media/passport2.jpg",

  work_permit_urls: ["/media/work-permit1.jpg", "/media/work-permit2.jpg"],

  contract_urls: ["/media/contract1.jpg"],

  insurance_image_url: "/media/insurance.jpg",

  certificate_urls: ["/media/certificate1.jpg"],
};

/* =========================================================
   HELPERS
========================================================= */

const renderComponent = () => {
  return render(<ViewDocument />);
};

const createMockFile = (name = "test-image.jpg", type = "image/jpeg") => {
  return new File(["test image content"], name, {
    type,
  });
};

const uploadFileToInput = (input, file) => {
  fireEvent.change(input, {
    target: {
      files: [file],
    },
  });
};

/* =========================================================
   SETUP
========================================================= */

beforeEach(() => {
  cleanup();

  vi.clearAllMocks();

  mocks.useParams.mockReturnValue({
    id: "101",
  });

  mocks.selectorState.employeeDetail = employeeDetail;

  mocks.selectorState.employeeDocuments = employeeDocuments;

  mocks.selectorState.loading = false;

  mocks.uploadImageThunk.mockReturnValue({
    type: "employees/uploadImage",
  });

  mocks.getEmployeeDocumentsThunk.mockReturnValue({
    type: "employees/getEmployeeDocuments",
  });

  mocks.updateEmployeeDocumentsThunk.mockReturnValue({
    type: "employees/updateEmployeeDocuments",
  });

  mocks.dispatch.mockImplementation((action) => {
    return {
      unwrap: vi
        .fn()
        .mockResolvedValue("https://example.com/uploaded-image.jpg"),
    };
  });

  mocks.swalFire.mockResolvedValue({
    isConfirmed: true,
  });

  globalThis.URL.createObjectURL = vi.fn(
    () => "blob:http://localhost/mock-image",
  );
});

/* =========================================================
   CLEANUP
========================================================= */

afterEach(() => {
  cleanup();

  vi.clearAllMocks();
});

/* =========================================================
   TEST SUITE
========================================================= */

describe("ViewDocument Component", () => {
  /* =======================================================
     1. RENDER
  ======================================================= */

  it("renders the ViewDocument component", () => {
    renderComponent();

    expect(screen.getByTestId("view-basic-layout")).toBeInTheDocument();

    expect(screen.getByText("Documents")).toBeInTheDocument();

    expect(screen.getByText("Passport")).toBeInTheDocument();

    expect(screen.getByText("Work Permit")).toBeInTheDocument();

    expect(screen.getByText("Employment Contract")).toBeInTheDocument();

    expect(screen.getByText("Insurance")).toBeInTheDocument();

    expect(screen.getByText("Certificate")).toBeInTheDocument();
  });

  /* =======================================================
     2. GET ID FROM ROUTE
  ======================================================= */

  it("gets employee id from route params", () => {
    mocks.useParams.mockReturnValue({
      id: "555",
    });

    renderComponent();

    expect(mocks.useParams).toHaveBeenCalled();
  });

  /* =======================================================
     3. PASSES EMPLOYEE ID TO LAYOUT
  ======================================================= */

  it("passes employee id to ViewBasicLayout", () => {
    renderComponent();

    expect(screen.getByTestId("view-basic-layout")).toHaveAttribute(
      "data-employee-id",
      "101",
    );
  });

  /* =======================================================
     4. FETCH DOCUMENTS ON MOUNT
  ======================================================= */

  it("fetches employee documents when id exists", async () => {
    renderComponent();

    await waitFor(() => {
      expect(mocks.getEmployeeDocumentsThunk).toHaveBeenCalledWith("101");
    });

    expect(mocks.dispatch).toHaveBeenCalled();
  });

  /* =======================================================
     5. DOES NOT FETCH WITHOUT ID
  ======================================================= */

  it("does not fetch employee documents when id is missing", async () => {
    mocks.useParams.mockReturnValue({
      id: undefined,
    });

    renderComponent();

    await waitFor(() => {
      expect(mocks.getEmployeeDocumentsThunk).not.toHaveBeenCalled();
    });
  });

  /* =======================================================
     6. LOADING STATE
  ======================================================= */

  it("renders full page loader when loading is true", () => {
    mocks.selectorState.loading = true;

    renderComponent();

    expect(screen.getByTestId("sync-loader")).toBeInTheDocument();

    expect(screen.queryByText("Documents")).not.toBeInTheDocument();
  });

  /* =======================================================
     7. LOADER WHEN DOCUMENTS ARE MISSING
  ======================================================= */

  it("renders loader when employee documents are missing", () => {
    mocks.selectorState.employeeDocuments = null;

    renderComponent();

    expect(screen.getByTestId("sync-loader")).toBeInTheDocument();
  });

  /* =======================================================
     8. NO LOADER WHEN DATA EXISTS
  ======================================================= */

  it("does not render loader when loading is false and documents exist", () => {
    mocks.selectorState.loading = false;

    mocks.selectorState.employeeDocuments = employeeDocuments;

    renderComponent();

    expect(screen.queryByTestId("sync-loader")).not.toBeInTheDocument();
  });

  /* =======================================================
     9. PASSPORT SECTION
  ======================================================= */

  it("renders passport upload section", () => {
    renderComponent();

    expect(screen.getByText("Passport")).toBeInTheDocument();

    const inputs = screen.getAllByLabelText(/choose image/i);

    expect(inputs.length).toBeGreaterThan(0);
  });

  /* =======================================================
     10. ALL DOCUMENT SECTIONS
  ======================================================= */

  it("renders all document sections", () => {
    renderComponent();

    expect(screen.getByText("Passport")).toBeInTheDocument();

    expect(screen.getByText("Work Permit")).toBeInTheDocument();

    expect(screen.getByText("Employment Contract")).toBeInTheDocument();

    expect(screen.getByText("Insurance")).toBeInTheDocument();

    expect(screen.getByText("Certificate")).toBeInTheDocument();
  });

  /* =======================================================
     11. EXISTING IMAGES
  ======================================================= */

  it("renders existing document images", () => {
    renderComponent();

    const images = screen.getAllByRole("img");

    expect(images.length).toBeGreaterThan(0);

    expect(
      images.some((image) =>
        image.getAttribute("src")?.includes("/media/passport1.jpg"),
      ),
    ).toBe(true);
  });

  /* =======================================================
     12. LOCAL IMAGE URL
  ======================================================= */

  it("builds full URL for relative image paths", () => {
    renderComponent();

    const images = screen.getAllByRole("img");

    const passportImage = images.find((image) =>
      image.getAttribute("src")?.includes("/media/passport1.jpg"),
    );

    expect(passportImage).toBeDefined();

    expect(passportImage.getAttribute("src")).toContain(
      "http://localhost:8000/media/passport1.jpg",
    );
  });

  /* =======================================================
     13. HTTP IMAGE URL
  ======================================================= */

  it("keeps an absolute HTTP image URL unchanged", () => {
    mocks.selectorState.employeeDocuments = {
      ...employeeDocuments,

      passport_image1_url: "https://example.com/passport.jpg",
    };

    renderComponent();

    const images = screen.getAllByRole("img");

    const passportImage = images.find((image) =>
      image.getAttribute("src")?.includes("https://example.com/passport.jpg"),
    );

    expect(passportImage).toBeDefined();
  });

  /* =======================================================
     14. CHOOSE IMAGE INPUTS
  ======================================================= */

  it("renders image file inputs", () => {
    renderComponent();

    /*
     * File inputs do not have the "textbox"
     * accessibility role.
     *
     * The component renders:
     *
     * Passport       -> 2 inputs
     * Work Permit    -> 1 input
     * Contract       -> 1 input
     * Insurance      -> 1 input
     * Certificate    -> 1 input
     *
     * Total = 6
     */

    const fileInputs = document.querySelectorAll(
      'input[type="file"][accept="image/*"]',
    );

    expect(fileInputs).toHaveLength(6);

    fileInputs.forEach((input) => {
      expect(input).toHaveAttribute("type", "file");

      expect(input).toHaveAttribute("accept", "image/*");
    });
  });

  /* =======================================================
     15. HANDLE PASSPORT IMAGE CHANGE
  ======================================================= */

  it("handles passport image upload and displays preview", async () => {
    renderComponent();

    const inputs = document.querySelectorAll('input[type="file"]');

    const file = createMockFile("passport.jpg");

    uploadFileToInput(inputs[0], file);

    await waitFor(() => {
      expect(globalThis.URL.createObjectURL).toHaveBeenCalledWith(file);
    });

    const preview = screen.getByAltText("Preview 1");

    expect(preview).toBeInTheDocument();

    expect(preview.getAttribute("src")).toBe(
      "blob:http://localhost/mock-image",
    );
  });

  /* =======================================================
     16. HANDLE SECOND PASSPORT IMAGE
  ======================================================= */

  it("handles second passport image upload", async () => {
    renderComponent();

    const inputs = document.querySelectorAll('input[type="file"]');

    const file = createMockFile("passport2.jpg");

    uploadFileToInput(inputs[1], file);

    await waitFor(() => {
      expect(globalThis.URL.createObjectURL).toHaveBeenCalledWith(file);
    });

    expect(screen.getByAltText("Preview 2")).toBeInTheDocument();
  });

  /* =======================================================
     17. HANDLE WORK PERMIT IMAGE
  ======================================================= */

  it("handles work permit image upload", async () => {
    renderComponent();

    const inputs = document.querySelectorAll('input[type="file"]');

    const file = createMockFile("work-permit.jpg");

    uploadFileToInput(inputs[2], file);

    await waitFor(() => {
      expect(globalThis.URL.createObjectURL).toHaveBeenCalledWith(file);
    });

    expect(screen.getByAltText("Preview 1")).toBeInTheDocument();
  });

  /* =======================================================
     18. HANDLE CONTRACT IMAGE
  ======================================================= */

  it("handles employment contract image upload", async () => {
    renderComponent();

    const inputs = document.querySelectorAll('input[type="file"]');

    const file = createMockFile("contract.jpg");

    uploadFileToInput(inputs[3], file);

    await waitFor(() => {
      expect(globalThis.URL.createObjectURL).toHaveBeenCalledWith(file);
    });
  });

  /* =======================================================
     19. HANDLE INSURANCE IMAGE
  ======================================================= */

  it("handles insurance image upload", async () => {
    renderComponent();

    const inputs = document.querySelectorAll('input[type="file"]');

    const file = createMockFile("insurance.jpg");

    uploadFileToInput(inputs[4], file);

    await waitFor(() => {
      expect(globalThis.URL.createObjectURL).toHaveBeenCalledWith(file);
    });
  });

  /* =======================================================
     20. HANDLE CERTIFICATE IMAGE
  ======================================================= */

  it("handles certificate image upload", async () => {
    renderComponent();

    const inputs = document.querySelectorAll('input[type="file"]');

    const file = createMockFile("certificate.jpg");

    uploadFileToInput(inputs[5], file);

    await waitFor(() => {
      expect(globalThis.URL.createObjectURL).toHaveBeenCalledWith(file);
    });
  });

  /* =======================================================
     21. SAVE WITHOUT NEW FILES
  ======================================================= */

  it("updates employee documents when no new images are selected", async () => {
    renderComponent();

    fireEvent.click(
      screen.getByRole("button", {
        name: /save documents/i,
      }),
    );

    await waitFor(() => {
      expect(mocks.updateEmployeeDocumentsThunk).toHaveBeenCalled();
    });

    expect(mocks.getEmployeeDocumentsThunk).toHaveBeenCalledWith("101");

    expect(mocks.swalFire).toHaveBeenCalledWith(
      expect.objectContaining({
        icon: "success",
        title: "Saved!",
      }),
    );
  });

  /* =======================================================
     22. UPLOAD PASSPORT IMAGE
  ======================================================= */

  it("uploads passport image before updating documents", async () => {
    renderComponent();

    const inputs = document.querySelectorAll('input[type="file"]');

    const file = createMockFile("passport-upload.jpg");

    uploadFileToInput(inputs[0], file);

    await waitFor(() => {
      expect(globalThis.URL.createObjectURL).toHaveBeenCalled();
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: /save documents/i,
      }),
    );

    await waitFor(() => {
      expect(mocks.uploadImageThunk).toHaveBeenCalledWith(file);
    });

    expect(mocks.updateEmployeeDocumentsThunk).toHaveBeenCalled();
  });

  /* =======================================================
     23. UPLOAD ALL SINGLE FILE TYPES
  ======================================================= */

  it("uploads passport and insurance files", async () => {
    renderComponent();

    const inputs = document.querySelectorAll('input[type="file"]');

    const passportFile = createMockFile("passport.jpg");

    const insuranceFile = createMockFile("insurance.jpg");

    uploadFileToInput(inputs[0], passportFile);

    uploadFileToInput(inputs[4], insuranceFile);

    fireEvent.click(
      screen.getByRole("button", {
        name: /save documents/i,
      }),
    );

    await waitFor(() => {
      expect(mocks.uploadImageThunk).toHaveBeenCalledWith(passportFile);

      expect(mocks.uploadImageThunk).toHaveBeenCalledWith(insuranceFile);
    });
  });

  /* =======================================================
     24. SUCCESS ALERT
  ======================================================= */

  it("shows success alert after documents are updated", async () => {
    renderComponent();

    fireEvent.click(
      screen.getByRole("button", {
        name: /save documents/i,
      }),
    );

    await waitFor(() => {
      expect(mocks.swalFire).toHaveBeenCalledWith(
        expect.objectContaining({
          icon: "success",
          title: "Saved!",
          text: "Employee documents updated successfully.",
          confirmButtonColor: "#304EB0",
        }),
      );
    });
  });

  /* =======================================================
     25. REFRESH DOCUMENTS AFTER SAVE
  ======================================================= */

  it("fetches employee documents again after successful update", async () => {
    renderComponent();

    await waitFor(() => {
      expect(mocks.getEmployeeDocumentsThunk).toHaveBeenCalledWith("101");
    });

    mocks.getEmployeeDocumentsThunk.mockClear();

    fireEvent.click(
      screen.getByRole("button", {
        name: /save documents/i,
      }),
    );

    await waitFor(() => {
      expect(mocks.getEmployeeDocumentsThunk).toHaveBeenCalledWith("101");
    });
  });

  /* =======================================================
     26. UPDATE THUNK PAYLOAD
  ======================================================= */

  it("passes employee id and FormData to update thunk", async () => {
    renderComponent();

    fireEvent.click(
      screen.getByRole("button", {
        name: /save documents/i,
      }),
    );

    await waitFor(() => {
      expect(mocks.updateEmployeeDocumentsThunk).toHaveBeenCalledWith(
        expect.objectContaining({
          id: "101",
          form: expect.any(FormData),
        }),
      );
    });
  });

  /* =======================================================
     27. ERROR HANDLING
  ======================================================= */

  it("shows error alert when document update fails", async () => {
    mocks.dispatch.mockImplementation((action) => {
      if (action?.type === "employees/updateEmployeeDocuments") {
        return Promise.reject(new Error("Update failed"));
      }

      return {
        unwrap: vi.fn().mockResolvedValue("uploaded-url"),
      };
    });

    renderComponent();

    fireEvent.click(
      screen.getByRole("button", {
        name: /save documents/i,
      }),
    );

    await waitFor(() => {
      expect(mocks.swalFire).toHaveBeenCalledWith(
        expect.objectContaining({
          icon: "error",
          title: "Update Failed",
          text: "There was an error updating employee documents.",
          confirmButtonColor: "#d33",
        }),
      );
    });
  });

  /* =======================================================
     28. UPLOAD ERROR
  ======================================================= */

  it("shows error alert when image upload fails", async () => {
    mocks.dispatch.mockImplementation((action) => {
      if (action?.type === "employees/uploadImage") {
        return {
          unwrap: vi.fn().mockRejectedValue(new Error("Upload failed")),
        };
      }

      return {
        unwrap: vi.fn().mockResolvedValue("success"),
      };
    });

    renderComponent();

    const inputs = document.querySelectorAll('input[type="file"]');

    const file = createMockFile("failed-upload.jpg");

    uploadFileToInput(inputs[0], file);

    fireEvent.click(
      screen.getByRole("button", {
        name: /save documents/i,
      }),
    );

    await waitFor(() => {
      expect(mocks.swalFire).toHaveBeenCalledWith(
        expect.objectContaining({
          icon: "error",
          title: "Update Failed",
        }),
      );
    });
  });

  /* =======================================================
     29. CORRECT ID ON UPDATE
  ======================================================= */

  it("uses the correct employee id when updating documents", async () => {
    mocks.useParams.mockReturnValue({
      id: "777",
    });

    renderComponent();

    fireEvent.click(
      screen.getByRole("button", {
        name: /save documents/i,
      }),
    );

    await waitFor(() => {
      expect(mocks.updateEmployeeDocumentsThunk).toHaveBeenCalledWith(
        expect.objectContaining({
          id: "777",
          form: expect.any(FormData),
        }),
      );
    });
  });

  /* =======================================================
     30. CLEAR FORM AFTER SUCCESS
  ======================================================= */

  it("clears uploaded image preview after successful save", async () => {
    renderComponent();

    const inputs = document.querySelectorAll('input[type="file"]');

    const file = createMockFile("passport.jpg");

    uploadFileToInput(inputs[0], file);

    await waitFor(() => {
      expect(screen.getByAltText("Preview 1")).toBeInTheDocument();
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: /save documents/i,
      }),
    );

    await waitFor(() => {
      expect(mocks.swalFire).toHaveBeenCalledWith(
        expect.objectContaining({
          icon: "success",
        }),
      );
    });
  });
});
