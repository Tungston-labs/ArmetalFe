import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";

import EmployeeHeader from "../../Components/EmployeeHeader";

/* ============================================================
   TEST DATA
============================================================ */

const createFormData = (overrides = {}) => ({
  name: "",
  dob: "",
  gender: "",
  address: "",
  email: "",
  employee_code: "",
  employee_id: "",
  profile_pic: null,
  ...overrides,
});

/* ============================================================
   FILE HELPERS
============================================================ */

const createImageFile = (
  name = "profile.jpg",
  type = "image/jpeg",
  content = "image content",
) => {
  return new File([content], name, {
    type,
  });
};

const createLargeImageFile = () => {
  const file = createImageFile();

  Object.defineProperty(file, "size", {
    value: 5 * 1024 * 1024 + 1,
    configurable: true,
  });

  return file;
};

const createExactFiveMBImageFile = () => {
  const file = createImageFile();

  Object.defineProperty(file, "size", {
    value: 5 * 1024 * 1024,
    configurable: true,
  });

  return file;
};

/* ============================================================
   RENDER HELPER
============================================================ */

const renderComponent = (formOverrides = {}, errorOverrides = {}) => {
  const formData = createFormData(formOverrides);

  const setFormData = vi.fn();
  const setIsFormDirty = vi.fn();
  const setErrors = vi.fn();

  const errors = {
    ...errorOverrides,
  };

  render(
    <EmployeeHeader
      formData={formData}
      setFormData={setFormData}
      setIsFormDirty={setIsFormDirty}
      errors={errors}
      setErrors={setErrors}
    />,
  );

  return {
    formData,
    setFormData,
    setIsFormDirty,
    setErrors,
    errors,
  };
};

/* ============================================================
   TEST SUITE
============================================================ */

describe("EmployeeHeader Component", () => {
  beforeEach(() => {
    vi.restoreAllMocks();

    global.URL.createObjectURL = vi.fn(
      () => "blob:http://localhost/profile-image",
    );
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  /* ==========================================================
     RENDERING
  ========================================================== */

  describe("Rendering", () => {
    it("renders all employee fields", () => {
      renderComponent();

      expect(screen.getByText("Name")).toBeInTheDocument();
      expect(screen.getByText("Date of Birth")).toBeInTheDocument();
      expect(screen.getByText("Gender")).toBeInTheDocument();
      expect(screen.getByText("Address")).toBeInTheDocument();
      expect(screen.getByText("Email")).toBeInTheDocument();
      expect(screen.getByText("Employee ID")).toBeInTheDocument();
      expect(screen.getByText("Username")).toBeInTheDocument();
    });

    it("renders all form controls", () => {
      renderComponent();

      expect(
        screen.getByPlaceholderText("Enter full name"),
      ).toBeInTheDocument();

      expect(screen.getByLabelText("Date of Birth")).toBeInTheDocument();

      expect(
        screen.getByRole("combobox", {
          name: "Gender",
        }),
      ).toBeInTheDocument();

      expect(
        screen.getByPlaceholderText("Enter full address"),
      ).toBeInTheDocument();

      expect(
        screen.getByPlaceholderText("Enter email address"),
      ).toBeInTheDocument();

      expect(
        screen.getByPlaceholderText("Enter employee code"),
      ).toBeInTheDocument();

      expect(screen.getByPlaceholderText("Enter username")).toBeInTheDocument();

      expect(document.getElementById("profile-upload")).toBeInTheDocument();
    });

    it("renders all gender options", () => {
      renderComponent();

      const select = screen.getByRole("combobox", {
        name: "Gender",
      });

      expect(select).toBeInTheDocument();

      expect(
        screen.getByRole("option", {
          name: "Select Gender",
        }),
      ).toBeInTheDocument();

      expect(
        screen.getByRole("option", {
          name: "Male",
        }),
      ).toBeInTheDocument();

      expect(
        screen.getByRole("option", {
          name: "Female",
        }),
      ).toBeInTheDocument();

      expect(
        screen.getByRole("option", {
          name: "Other",
        }),
      ).toBeInTheDocument();
    });

    it("shows Upload when profile picture is missing", () => {
      renderComponent({
        profile_pic: null,
      });

      expect(screen.getByText("Upload")).toBeInTheDocument();
      expect(screen.queryByText("Change")).not.toBeInTheDocument();

      expect(screen.queryByAltText("Profile")).not.toBeInTheDocument();

      expect(
        screen.queryByRole("button", {
          name: "Remove profile photo",
        }),
      ).not.toBeInTheDocument();
    });

    it("shows Change and profile image when profile picture exists", () => {
      const file = createImageFile("profile.jpg", "image/jpeg");

      renderComponent({
        profile_pic: file,
      });

      expect(screen.getByAltText("Profile")).toBeInTheDocument();

      expect(screen.getByText("Change")).toBeInTheDocument();

      expect(screen.queryByText("Upload")).not.toBeInTheDocument();

      expect(
        screen.getByRole("button", {
          name: "Remove profile photo",
        }),
      ).toBeInTheDocument();

      expect(global.URL.createObjectURL).toHaveBeenCalledWith(file);
    });

    it("renders camera button correctly", () => {
      renderComponent();

      const button = screen.getByRole("button", {
        name: "Open profile image picker",
      });

      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute("type", "button");
    });

    it("renders hidden profile upload input correctly", () => {
      renderComponent();

      const input = document.getElementById("profile-upload");

      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute("type", "file");
      expect(input).toHaveAttribute("accept", "image/*");
      expect(input).toHaveAttribute("name", "profile_pic");
    });
  });

  /* ==========================================================
     NORMAL FORM CHANGES
  ========================================================== */

  describe("Form field changes", () => {
    it.each([
      ["name", "Enter full name", "John Doe"],
      ["email", "Enter email address", "john@example.com"],
      ["employee_code", "Enter employee code", "EMP001"],
      ["employee_id", "Enter username", "john123"],
    ])("updates %s field", (fieldName, placeholder, value) => {
      const { setFormData, setIsFormDirty } = renderComponent();

      const input = screen.getByPlaceholderText(placeholder);

      fireEvent.change(input, {
        target: {
          name: fieldName,
          value,
        },
      });

      expect(setFormData).toHaveBeenCalledTimes(1);
      expect(setIsFormDirty).toHaveBeenCalledWith(true);

      const updater = setFormData.mock.calls[0][0];

      expect(updater(createFormData())).toEqual(
        createFormData({
          [fieldName]: value,
        }),
      );
    });

    it("updates address field", () => {
      const { setFormData, setIsFormDirty } = renderComponent();

      const textarea = screen.getByPlaceholderText("Enter full address");

      fireEvent.change(textarea, {
        target: {
          name: "address",
          value: "Kochi, Kerala",
        },
      });

      expect(setFormData).toHaveBeenCalledTimes(1);
      expect(setIsFormDirty).toHaveBeenCalledWith(true);

      const updater = setFormData.mock.calls[0][0];

      expect(updater(createFormData())).toEqual(
        createFormData({
          address: "Kochi, Kerala",
        }),
      );
    });

    it("updates date of birth", () => {
      const { setFormData, setIsFormDirty } = renderComponent();

      const input = screen.getByLabelText("Date of Birth");

      fireEvent.change(input, {
        target: {
          name: "dob",
          value: "1995-01-10",
        },
      });

      expect(setFormData).toHaveBeenCalledTimes(1);
      expect(setIsFormDirty).toHaveBeenCalledWith(true);

      const updater = setFormData.mock.calls[0][0];

      expect(updater(createFormData())).toEqual(
        createFormData({
          dob: "1995-01-10",
        }),
      );
    });

    it("updates gender", () => {
      const { setFormData, setIsFormDirty } = renderComponent();

      const select = screen.getByRole("combobox", {
        name: "Gender",
      });

      fireEvent.change(select, {
        target: {
          name: "gender",
          value: "Male",
        },
      });

      expect(setFormData).toHaveBeenCalledTimes(1);
      expect(setIsFormDirty).toHaveBeenCalledWith(true);

      const updater = setFormData.mock.calls[0][0];

      expect(updater(createFormData())).toEqual(
        createFormData({
          gender: "Male",
        }),
      );
    });
  });

  /* ==========================================================
     VALIDATION ERROR DISPLAY
  ========================================================== */

  describe("Validation errors", () => {
    it("displays all validation errors", () => {
      renderComponent(
        {},
        {
          profile_pic: "Profile picture error",
          name: "Name is required",
          dob: "Date of birth is required",
          gender: "Gender is required",
          address: "Address is required",
          email: "Invalid email",
          employee_code: "Employee ID is required",
          employee_id: "Username is required",
        },
      );

      expect(screen.getByText("Profile picture error")).toBeInTheDocument();

      expect(screen.getByText("Name is required")).toBeInTheDocument();

      expect(screen.getByText("Date of birth is required")).toBeInTheDocument();

      expect(screen.getByText("Gender is required")).toBeInTheDocument();

      expect(screen.getByText("Address is required")).toBeInTheDocument();

      expect(screen.getByText("Invalid email")).toBeInTheDocument();

      expect(screen.getByText("Employee ID is required")).toBeInTheDocument();

      expect(screen.getByText("Username is required")).toBeInTheDocument();
    });

    it("does not render validation messages when errors are empty", () => {
      renderComponent();

      expect(screen.queryByText("Name is required")).not.toBeInTheDocument();

      expect(screen.queryByText("Invalid email")).not.toBeInTheDocument();
    });

    it("handles undefined errors object", () => {
      const formData = createFormData();

      render(
        <EmployeeHeader
          formData={formData}
          setFormData={vi.fn()}
          setIsFormDirty={vi.fn()}
          errors={undefined}
          setErrors={vi.fn()}
        />,
      );

      expect(screen.getByText("JPG, PNG · Max 5 MB")).toBeInTheDocument();

      expect(screen.queryByText("Name is required")).not.toBeInTheDocument();
    });

    it("handles null errors object", () => {
      const formData = createFormData();

      render(
        <EmployeeHeader
          formData={formData}
          setFormData={vi.fn()}
          setIsFormDirty={vi.fn()}
          errors={null}
          setErrors={vi.fn()}
        />,
      );

      expect(screen.getByText("JPG, PNG · Max 5 MB")).toBeInTheDocument();
    });
  });

  /* ==========================================================
     PROFILE IMAGE UPLOAD
  ========================================================== */

  describe("Profile image upload", () => {
    it("does nothing when no file is selected", () => {
      const { setFormData, setErrors, setIsFormDirty } = renderComponent();

      const input = document.getElementById("profile-upload");

      fireEvent.change(input, {
        target: {
          name: "profile_pic",
          type: "file",
          files: [],
        },
      });

      expect(setFormData).not.toHaveBeenCalled();
      expect(setErrors).not.toHaveBeenCalled();
      expect(setIsFormDirty).not.toHaveBeenCalled();
    });

    it("rejects a non-image file", () => {
      const { setFormData, setErrors, setIsFormDirty } = renderComponent();

      const file = new File(["text content"], "document.pdf", {
        type: "application/pdf",
      });

      const input = document.getElementById("profile-upload");

      fireEvent.change(input, {
        target: {
          name: "profile_pic",
          type: "file",
          files: [file],
        },
      });

      expect(setErrors).toHaveBeenCalledTimes(1);
      expect(setFormData).not.toHaveBeenCalled();
      expect(setIsFormDirty).not.toHaveBeenCalled();

      const updater = setErrors.mock.calls[0][0];

      expect(updater({})).toEqual({
        profile_pic: "Please upload a valid image.",
      });
    });

    it("rejects an image larger than 5 MB", () => {
      const { setFormData, setErrors, setIsFormDirty } = renderComponent();

      const file = createLargeImageFile();

      const input = document.getElementById("profile-upload");

      fireEvent.change(input, {
        target: {
          name: "profile_pic",
          type: "file",
          files: [file],
        },
      });

      expect(setErrors).toHaveBeenCalledTimes(1);
      expect(setFormData).not.toHaveBeenCalled();
      expect(setIsFormDirty).not.toHaveBeenCalled();

      const updater = setErrors.mock.calls[0][0];

      expect(updater({})).toEqual({
        profile_pic: "Image size must be less than 5 MB.",
      });
    });

    it("accepts an image exactly 5 MB", () => {
      const { setErrors, setFormData, setIsFormDirty } = renderComponent();

      const file = createExactFiveMBImageFile();

      const input = document.getElementById("profile-upload");

      fireEvent.change(input, {
        target: {
          name: "profile_pic",
          type: "file",
          files: [file],
        },
      });

      expect(setErrors).toHaveBeenCalledTimes(1);
      expect(setFormData).toHaveBeenCalledTimes(1);
      expect(setIsFormDirty).toHaveBeenCalledWith(true);

      const errorUpdater = setErrors.mock.calls[0][0];

      expect(
        errorUpdater({
          profile_pic: "Previous error",
        }),
      ).toEqual({
        profile_pic: "",
      });

      const formUpdater = setFormData.mock.calls[0][0];

      expect(formUpdater(createFormData())).toEqual(
        createFormData({
          profile_pic: file,
        }),
      );
    });

    it("accepts a valid JPG image", () => {
      const { setErrors, setFormData, setIsFormDirty } = renderComponent();

      const file = createImageFile("profile.jpg", "image/jpeg");

      Object.defineProperty(file, "size", {
        value: 1024,
        configurable: true,
      });

      const input = document.getElementById("profile-upload");

      fireEvent.change(input, {
        target: {
          name: "profile_pic",
          type: "file",
          files: [file],
        },
      });

      expect(setErrors).toHaveBeenCalledTimes(1);
      expect(setFormData).toHaveBeenCalledTimes(1);
      expect(setIsFormDirty).toHaveBeenCalledWith(true);

      const errorUpdater = setErrors.mock.calls[0][0];

      expect(
        errorUpdater({
          profile_pic: "Previous error",
        }),
      ).toEqual({
        profile_pic: "",
      });

      const formUpdater = setFormData.mock.calls[0][0];

      expect(formUpdater(createFormData())).toEqual(
        createFormData({
          profile_pic: file,
        }),
      );
    });

    it("accepts a valid PNG image", () => {
      const { setFormData, setIsFormDirty } = renderComponent();

      const file = createImageFile("profile.png", "image/png");

      const input = document.getElementById("profile-upload");

      fireEvent.change(input, {
        target: {
          name: "profile_pic",
          type: "file",
          files: [file],
        },
      });

      expect(setFormData).toHaveBeenCalledTimes(1);
      expect(setIsFormDirty).toHaveBeenCalledWith(true);

      const updater = setFormData.mock.calls[0][0];

      expect(updater(createFormData())).toEqual(
        createFormData({
          profile_pic: file,
        }),
      );
    });

    it("clears an existing profile image error after valid upload", () => {
      const { setErrors } = renderComponent(
        {},
        {
          profile_pic: "Previous error",
        },
      );

      const file = createImageFile();

      const input = document.getElementById("profile-upload");

      fireEvent.change(input, {
        target: {
          name: "profile_pic",
          type: "file",
          files: [file],
        },
      });

      expect(setErrors).toHaveBeenCalledTimes(1);

      const updater = setErrors.mock.calls[0][0];

      expect(
        updater({
          profile_pic: "Previous error",
        }),
      ).toEqual({
        profile_pic: "",
      });
    });
  });

  /* ==========================================================
     REMOVE PROFILE IMAGE
  ========================================================== */

  describe("Remove profile image", () => {
    it("removes profile picture", () => {
      const file = createImageFile();

      const { setFormData, setErrors, setIsFormDirty } = renderComponent({
        profile_pic: file,
      });

      const button = screen.getByRole("button", {
        name: "Remove profile photo",
      });

      fireEvent.click(button);

      expect(setFormData).toHaveBeenCalledTimes(1);
      expect(setErrors).toHaveBeenCalledTimes(1);
      expect(setIsFormDirty).toHaveBeenCalledWith(true);

      const formUpdater = setFormData.mock.calls[0][0];

      expect(
        formUpdater(
          createFormData({
            profile_pic: file,
          }),
        ),
      ).toEqual(
        createFormData({
          profile_pic: null,
        }),
      );

      const errorUpdater = setErrors.mock.calls[0][0];

      expect(
        errorUpdater({
          profile_pic: "Old error",
          name: "Name error",
        }),
      ).toEqual({
        profile_pic: "",
        name: "Name error",
      });
    });

    it("prevents default action and stops event propagation", () => {
      const file = createImageFile();

      renderComponent({
        profile_pic: file,
      });

      const button = screen.getByRole("button", {
        name: "Remove profile photo",
      });

      const event = new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
      });

      const stopPropagationSpy = vi.spyOn(event, "stopPropagation");

      fireEvent(button, event);

      expect(event.defaultPrevented).toBe(true);
      expect(stopPropagationSpy).toHaveBeenCalledTimes(1);
    });
  });

  /* ==========================================================
     CAMERA BUTTON
  ========================================================== */

  describe("Camera button", () => {
    it("opens the profile file picker", () => {
      renderComponent();

      const fileInput = document.getElementById("profile-upload");

      const clickSpy = vi
        .spyOn(fileInput, "click")
        .mockImplementation(() => {});

      const cameraButton = screen.getByRole("button", {
        name: "Open profile image picker",
      });

      fireEvent.click(cameraButton);

      expect(clickSpy).toHaveBeenCalledTimes(1);

      clickSpy.mockRestore();
    });

    it("does not throw when profile upload input does not exist", () => {
      renderComponent();

      const originalGetElementById = document.getElementById;

      const getElementSpy = vi
        .spyOn(document, "getElementById")
        .mockImplementation((id) => {
          if (id === "profile-upload") {
            return null;
          }

          return originalGetElementById.call(document, id);
        });

      const cameraButton = screen.getByRole("button", {
        name: "Open profile image picker",
      });

      expect(() => {
        fireEvent.click(cameraButton);
      }).not.toThrow();

      expect(getElementSpy).toHaveBeenCalledWith("profile-upload");

      getElementSpy.mockRestore();
    });
  });

  /* ==========================================================
     EXISTING FORM VALUES
  ========================================================== */

  describe("Existing form values", () => {
    it("displays existing employee values", () => {
      renderComponent({
        name: "John Doe",
        dob: "1995-01-10",
        gender: "Male",
        address: "Kochi",
        email: "john@example.com",
        employee_code: "EMP001",
        employee_id: "john123",
      });

      expect(screen.getByDisplayValue("John Doe")).toBeInTheDocument();

      expect(screen.getByDisplayValue("1995-01-10")).toBeInTheDocument();

      expect(screen.getByDisplayValue("Male")).toBeInTheDocument();

      expect(screen.getByDisplayValue("Kochi")).toBeInTheDocument();

      expect(screen.getByDisplayValue("john@example.com")).toBeInTheDocument();

      expect(screen.getByDisplayValue("EMP001")).toBeInTheDocument();

      expect(screen.getByDisplayValue("john123")).toBeInTheDocument();
    });
  });

  /* ==========================================================
     MULTIPLE INTERACTIONS
  ========================================================== */

  describe("Multiple interactions", () => {
    it("marks form dirty for multiple normal field changes", () => {
      const { setFormData, setIsFormDirty } = renderComponent();

      fireEvent.change(screen.getByPlaceholderText("Enter full name"), {
        target: {
          name: "name",
          value: "Jane Doe",
        },
      });

      fireEvent.change(screen.getByPlaceholderText("Enter email address"), {
        target: {
          name: "email",
          value: "jane@example.com",
        },
      });

      fireEvent.change(screen.getByPlaceholderText("Enter username"), {
        target: {
          name: "employee_id",
          value: "jane123",
        },
      });

      expect(setFormData).toHaveBeenCalledTimes(3);
      expect(setIsFormDirty).toHaveBeenCalledTimes(3);
      expect(setIsFormDirty).toHaveBeenLastCalledWith(true);
    });
  });
});
