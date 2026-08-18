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

const createErrors = (overrides = {}) => ({
  ...overrides,
});

/* ============================================================
   RENDER HELPER
============================================================ */

const renderComponent = (formOverrides = {}, errorOverrides = {}) => {
  const formData = createFormData(formOverrides);

  const setFormData = vi.fn();
  const setIsFormDirty = vi.fn();
  const setErrors = vi.fn();

  const errors = createErrors(errorOverrides);

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
    it("renders EmployeeHeader component", () => {
      renderComponent();

      expect(screen.getByText("Name")).toBeInTheDocument();
      expect(screen.getByText("Date of Birth")).toBeInTheDocument();
      expect(screen.getByText("Gender")).toBeInTheDocument();
      expect(screen.getByText("Address")).toBeInTheDocument();
      expect(screen.getByText("Email")).toBeInTheDocument();
      expect(screen.getByText("Employee ID")).toBeInTheDocument();
      expect(screen.getByText("Username")).toBeInTheDocument();
    });

    it("renders all form fields", () => {
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

    it("renders gender options", () => {
      renderComponent();

      const genderSelect = screen.getByRole("combobox", {
        name: "Gender",
      });

      expect(genderSelect).toBeInTheDocument();

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

    it("renders upload text when profile picture is not present", () => {
      renderComponent({
        profile_pic: null,
      });

      expect(screen.getByText("Upload")).toBeInTheDocument();

      expect(screen.getByText("JPG, PNG · Max 5 MB")).toBeInTheDocument();
    });

    it("renders the camera picker button with accessible name", () => {
      renderComponent();

      const cameraButton = screen.getByRole("button", {
        name: "Open profile image picker",
      });

      expect(cameraButton).toBeInTheDocument();
    });

    it("does not render remove button when profile picture is absent", () => {
      renderComponent({
        profile_pic: null,
      });

      expect(
        screen.queryByRole("button", {
          name: "Remove profile photo",
        }),
      ).not.toBeInTheDocument();
    });
  });

  /* ==========================================================
     FORM FIELD CHANGES
  ========================================================== */

  describe("Form field changes", () => {
    it("updates name field", () => {
      const { setFormData, setIsFormDirty } = renderComponent();

      const input = screen.getByPlaceholderText("Enter full name");

      fireEvent.change(input, {
        target: {
          name: "name",
          value: "John Doe",
        },
      });

      expect(setFormData).toHaveBeenCalledTimes(1);
      expect(setIsFormDirty).toHaveBeenCalledWith(true);

      const updater = setFormData.mock.calls[0][0];

      expect(updater(createFormData())).toEqual(
        createFormData({
          name: "John Doe",
        }),
      );
    });

    it("updates email field", () => {
      const { setFormData, setIsFormDirty } = renderComponent();

      const input = screen.getByPlaceholderText("Enter email address");

      fireEvent.change(input, {
        target: {
          name: "email",
          value: "john@example.com",
        },
      });

      expect(setFormData).toHaveBeenCalledTimes(1);
      expect(setIsFormDirty).toHaveBeenCalledWith(true);

      const updater = setFormData.mock.calls[0][0];

      expect(updater(createFormData())).toEqual(
        createFormData({
          email: "john@example.com",
        }),
      );
    });

    it("updates employee code field", () => {
      const { setFormData, setIsFormDirty } = renderComponent();

      const input = screen.getByPlaceholderText("Enter employee code");

      fireEvent.change(input, {
        target: {
          name: "employee_code",
          value: "EMP001",
        },
      });

      expect(setFormData).toHaveBeenCalledTimes(1);
      expect(setIsFormDirty).toHaveBeenCalledWith(true);

      const updater = setFormData.mock.calls[0][0];

      expect(updater(createFormData())).toEqual(
        createFormData({
          employee_code: "EMP001",
        }),
      );
    });

    it("updates username field", () => {
      const { setFormData, setIsFormDirty } = renderComponent();

      const input = screen.getByPlaceholderText("Enter username");

      fireEvent.change(input, {
        target: {
          name: "employee_id",
          value: "john123",
        },
      });

      expect(setFormData).toHaveBeenCalledTimes(1);
      expect(setIsFormDirty).toHaveBeenCalledWith(true);

      const updater = setFormData.mock.calls[0][0];

      expect(updater(createFormData())).toEqual(
        createFormData({
          employee_id: "john123",
        }),
      );
    });

    it("updates address field", () => {
      const { setFormData, setIsFormDirty } = renderComponent();

      const input = screen.getByPlaceholderText("Enter full address");

      fireEvent.change(input, {
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

    it("updates date of birth field", () => {
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

    it("updates gender field", () => {
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
     ERROR MESSAGES
  ========================================================== */

  describe("Validation errors", () => {
    it("displays name error", () => {
      renderComponent(
        {},
        {
          name: "Name is required",
        },
      );

      expect(screen.getByText("Name is required")).toBeInTheDocument();
    });

    it("displays date of birth error", () => {
      renderComponent(
        {},
        {
          dob: "Date of birth is required",
        },
      );

      expect(screen.getByText("Date of birth is required")).toBeInTheDocument();
    });

    it("displays gender error", () => {
      renderComponent(
        {},
        {
          gender: "Gender is required",
        },
      );

      expect(screen.getByText("Gender is required")).toBeInTheDocument();
    });

    it("displays address error", () => {
      renderComponent(
        {},
        {
          address: "Address is required",
        },
      );

      expect(screen.getByText("Address is required")).toBeInTheDocument();
    });

    it("displays email error", () => {
      renderComponent(
        {},
        {
          email: "Invalid email",
        },
      );

      expect(screen.getByText("Invalid email")).toBeInTheDocument();
    });

    it("displays employee code error", () => {
      renderComponent(
        {},
        {
          employee_code: "Employee ID is required",
        },
      );

      expect(screen.getByText("Employee ID is required")).toBeInTheDocument();
    });

    it("displays employee ID error", () => {
      renderComponent(
        {},
        {
          employee_id: "Username is required",
        },
      );

      expect(screen.getByText("Username is required")).toBeInTheDocument();
    });

    it("displays profile picture error", () => {
      renderComponent(
        {},
        {
          profile_pic: "Please upload a valid image.",
        },
      );

      expect(
        screen.getByText("Please upload a valid image."),
      ).toBeInTheDocument();
    });

    it("renders multiple validation errors at the same time", () => {
      renderComponent(
        {},
        {
          name: "Name is required",
          email: "Email is required",
          gender: "Gender is required",
        },
      );

      expect(screen.getByText("Name is required")).toBeInTheDocument();

      expect(screen.getByText("Email is required")).toBeInTheDocument();

      expect(screen.getByText("Gender is required")).toBeInTheDocument();
    });
  });

  /* ==========================================================
     FILE UPLOAD
  ========================================================== */

  describe("Profile image upload", () => {
    it("does nothing when no file is selected", () => {
      const { setFormData, setIsFormDirty, setErrors } = renderComponent();

      const fileInput = document.getElementById("profile-upload");

      fireEvent.change(fileInput, {
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

    it("rejects non-image file", () => {
      const { setErrors, setFormData, setIsFormDirty } = renderComponent();

      const file = new File(["text content"], "document.pdf", {
        type: "application/pdf",
      });

      const fileInput = document.getElementById("profile-upload");

      fireEvent.change(fileInput, {
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

    it("rejects image larger than 5 MB", () => {
      const { setErrors, setFormData, setIsFormDirty } = renderComponent();

      const largeFile = createLargeImageFile();

      const fileInput = document.getElementById("profile-upload");

      fireEvent.change(fileInput, {
        target: {
          name: "profile_pic",
          type: "file",
          files: [largeFile],
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

    it("accepts valid JPG image file", () => {
      const { setErrors, setFormData, setIsFormDirty } = renderComponent();

      const file = createImageFile("profile.jpg", "image/jpeg");

      Object.defineProperty(file, "size", {
        value: 1024,
        configurable: true,
      });

      const fileInput = document.getElementById("profile-upload");

      fireEvent.change(fileInput, {
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
          profile_pic: "old error",
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

    it("accepts PNG image file", () => {
      const { setFormData, setIsFormDirty } = renderComponent();

      const file = createImageFile("profile.png", "image/png");

      const fileInput = document.getElementById("profile-upload");

      fireEvent.change(fileInput, {
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

    it("accepts image exactly at 5 MB", () => {
      const { setErrors, setFormData, setIsFormDirty } = renderComponent();

      const file = createExactFiveMBImageFile();

      const fileInput = document.getElementById("profile-upload");

      fireEvent.change(fileInput, {
        target: {
          name: "profile_pic",
          type: "file",
          files: [file],
        },
      });

      expect(setErrors).toHaveBeenCalledTimes(1);
      expect(setFormData).toHaveBeenCalledTimes(1);
      expect(setIsFormDirty).toHaveBeenCalledWith(true);
    });

    it("does not update form data for an invalid file", () => {
      const { setFormData, setIsFormDirty } = renderComponent();

      const file = new File(["not an image"], "test.txt", {
        type: "text/plain",
      });

      const fileInput = document.getElementById("profile-upload");

      fireEvent.change(fileInput, {
        target: {
          name: "profile_pic",
          type: "file",
          files: [file],
        },
      });

      expect(setFormData).not.toHaveBeenCalled();
      expect(setIsFormDirty).not.toHaveBeenCalled();
    });

    it("clears an existing profile picture error when valid image is uploaded", () => {
      const { setErrors } = renderComponent(
        {},
        {
          profile_pic: "Previous error",
        },
      );

      const file = createImageFile("profile.jpg", "image/jpeg");

      const fileInput = document.getElementById("profile-upload");

      fireEvent.change(fileInput, {
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

    it("does not mark form dirty when image type is invalid", () => {
      const { setIsFormDirty } = renderComponent();

      const file = new File(["document"], "document.pdf", {
        type: "application/pdf",
      });

      const fileInput = document.getElementById("profile-upload");

      fireEvent.change(fileInput, {
        target: {
          name: "profile_pic",
          type: "file",
          files: [file],
        },
      });

      expect(setIsFormDirty).not.toHaveBeenCalled();
    });

    it("does not mark form dirty when image exceeds maximum size", () => {
      const { setIsFormDirty } = renderComponent();

      const file = createLargeImageFile();

      const fileInput = document.getElementById("profile-upload");

      fireEvent.change(fileInput, {
        target: {
          name: "profile_pic",
          type: "file",
          files: [file],
        },
      });

      expect(setIsFormDirty).not.toHaveBeenCalled();
    });
  });

  /* ==========================================================
     PROFILE IMAGE DISPLAY
  ========================================================== */

  describe("Profile image display", () => {
    it("renders profile image when profile_pic exists", () => {
      const file = createImageFile("profile.jpg", "image/jpeg");

      renderComponent({
        profile_pic: file,
      });

      const image = screen.getByAltText("Profile");

      expect(image).toBeInTheDocument();

      expect(image).toHaveAttribute(
        "src",
        "blob:http://localhost/profile-image",
      );

      expect(screen.getByText("Change")).toBeInTheDocument();

      expect(global.URL.createObjectURL).toHaveBeenCalledWith(file);
    });

    it("renders upload text when profile picture is null", () => {
      renderComponent({
        profile_pic: null,
      });

      expect(screen.getByText("Upload")).toBeInTheDocument();

      expect(screen.queryByAltText("Profile")).not.toBeInTheDocument();
    });

    it("renders remove button when profile picture exists", () => {
      const file = createImageFile();

      renderComponent({
        profile_pic: file,
      });

      expect(
        screen.getByRole("button", {
          name: "Remove profile photo",
        }),
      ).toBeInTheDocument();
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

      const removeButton = screen.getByRole("button", {
        name: "Remove profile photo",
      });

      fireEvent.click(removeButton);

      expect(setFormData).toHaveBeenCalledTimes(1);

      expect(setErrors).toHaveBeenCalledTimes(1);

      expect(setIsFormDirty).toHaveBeenCalledWith(true);

      const formUpdater = setFormData.mock.calls[0][0];

      expect(
        formUpdater({
          ...createFormData(),
          profile_pic: file,
        }),
      ).toEqual(
        createFormData({
          profile_pic: null,
        }),
      );

      const errorUpdater = setErrors.mock.calls[0][0];

      expect(
        errorUpdater({
          profile_pic: "old error",
        }),
      ).toEqual({
        profile_pic: "",
      });
    });

    it("clears profile picture error when removing image", () => {
      const file = createImageFile();

      const { setErrors } = renderComponent(
        {
          profile_pic: file,
        },
        {
          profile_pic: "Previous error",
        },
      );

      const removeButton = screen.getByRole("button", {
        name: "Remove profile photo",
      });

      fireEvent.click(removeButton);

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
     CAMERA BUTTON
  ========================================================== */

  describe("Camera button", () => {
    it("opens file input when camera badge is clicked", () => {
      renderComponent();

      const fileInput = document.getElementById("profile-upload");

      expect(fileInput).toBeInTheDocument();

      const clickSpy = vi
        .spyOn(fileInput, "click")
        .mockImplementation(() => {});

      const cameraButton = screen.getByRole("button", {
        name: "Open profile image picker",
      });

      expect(cameraButton).toBeInTheDocument();

      fireEvent.click(cameraButton);

      expect(clickSpy).toHaveBeenCalledTimes(1);

      clickSpy.mockRestore();
    });

    it("camera button has button type", () => {
      renderComponent();

      const cameraButton = screen.getByRole("button", {
        name: "Open profile image picker",
      });

      expect(cameraButton).toHaveAttribute("type", "button");
    });
  });

  /* ==========================================================
     EXISTING FORM VALUES
  ========================================================== */

  describe("Existing form values", () => {
    it("displays existing form values", () => {
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

    it("renders existing profile image and Change text", () => {
      const file = createImageFile("existing.jpg", "image/jpeg");

      renderComponent({
        profile_pic: file,
      });

      expect(screen.getByAltText("Profile")).toBeInTheDocument();

      expect(screen.getByText("Change")).toBeInTheDocument();
    });
  });

  /* ==========================================================
     MULTIPLE INTERACTIONS
  ========================================================== */

  describe("Multiple interactions", () => {
    it("updates different form fields independently", () => {
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
