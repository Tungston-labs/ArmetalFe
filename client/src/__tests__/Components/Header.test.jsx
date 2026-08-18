import React from "react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";

import Header from "../../Components/Header";

describe("Header Component", () => {
  let onChange;
  let onImageChange;
  let onBack;

  beforeEach(() => {
    onChange = vi.fn();
    onImageChange = vi.fn();
    onBack = vi.fn();

    vi.spyOn(URL, "createObjectURL").mockReturnValue(
      "blob:http://localhost/test-image",
    );
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  const baseEmployee = {
    name: "John Doe",
    employee_code: "EMP001",
    email: "john@example.com",
    address: "123 Main Street",
    dob: "1995-05-15T00:00:00.000Z",
    gender: "Male",
    profile_pic: "https://example.com/profile.jpg",
  };

  // ---------------------------------------------------------
  // BASIC RENDERING
  // ---------------------------------------------------------

  it("renders the Header component with employee information", () => {
    render(
      <Header
        employee={baseEmployee}
        editable={false}
        onChange={onChange}
        onImageChange={onImageChange}
        onBack={onBack}
      />,
    );

    expect(screen.getByText("Full Name")).toBeInTheDocument();
    expect(screen.getByText("Employee Code")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("Address")).toBeInTheDocument();
    expect(screen.getByText("Date of Birth")).toBeInTheDocument();
    expect(screen.getByText("Gender")).toBeInTheDocument();

    expect(screen.getByDisplayValue("John Doe")).toBeInTheDocument();
    expect(screen.getByDisplayValue("EMP001")).toBeInTheDocument();
    expect(screen.getByDisplayValue("john@example.com")).toBeInTheDocument();
    expect(screen.getByDisplayValue("123 Main Street")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Male")).toBeInTheDocument();
  });

  it("renders with default employee object when employee is not provided", () => {
    render(<Header />);

    expect(screen.getByText("Full Name")).toBeInTheDocument();
    expect(screen.getByText("Employee Code")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("Address")).toBeInTheDocument();

    const emptyInputs = screen.getAllByDisplayValue("");
    expect(emptyInputs.length).toBeGreaterThan(0);
  });

  // ---------------------------------------------------------
  // BACK BUTTON
  // ---------------------------------------------------------

  it("renders back button when onBack is provided", () => {
    render(<Header employee={baseEmployee} onBack={onBack} />);

    const backButton = screen.getByTestId("back-button");

    expect(backButton).toBeInTheDocument();

    fireEvent.click(backButton);

    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it("does not render back button when onBack is not provided", () => {
    render(<Header employee={baseEmployee} />);

    expect(screen.queryByTestId("back-button")).not.toBeInTheDocument();
  });

  // ---------------------------------------------------------
  // PROFILE IMAGE
  // ---------------------------------------------------------

  it("renders profile image when profile_pic is a URL", () => {
    render(<Header employee={baseEmployee} editable={false} />);

    const image = screen.getByAltText("Employee Profile");

    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", "https://example.com/profile.jpg");
  });

  it("renders default user icon when profile image is missing", () => {
    render(
      <Header
        employee={{
          ...baseEmployee,
          profile_pic: null,
        }}
      />,
    );

    expect(screen.queryByAltText("Employee Profile")).not.toBeInTheDocument();

    expect(screen.getByTestId("user-icon")).toBeInTheDocument();
  });

  // ---------------------------------------------------------
  // FILE PROFILE IMAGE
  // ---------------------------------------------------------

  it("creates object URL when profile_pic is a File", () => {
    const file = new File(["image-content"], "profile.png", {
      type: "image/png",
    });

    render(
      <Header
        employee={{
          ...baseEmployee,
          profile_pic: file,
        }}
      />,
    );

    const image = screen.getByAltText("Employee Profile");

    expect(URL.createObjectURL).toHaveBeenCalledWith(file);
    expect(image).toHaveAttribute("src", "blob:http://localhost/test-image");
  });

  // ---------------------------------------------------------
  // EDITABLE MODE
  // ---------------------------------------------------------

  it("renders fields as editable when editable is true", () => {
    render(
      <Header employee={baseEmployee} editable={true} onChange={onChange} />,
    );

    const nameInput = screen.getByDisplayValue("John Doe");
    const employeeCodeInput = screen.getByDisplayValue("EMP001");
    const emailInput = screen.getByDisplayValue("john@example.com");
    const addressInput = screen.getByDisplayValue("123 Main Street");
    const genderInput = screen.getByDisplayValue("Male");

    expect(nameInput).not.toHaveAttribute("readonly");
    expect(employeeCodeInput).not.toHaveAttribute("readonly");
    expect(emailInput).not.toHaveAttribute("readonly");
    expect(addressInput).not.toHaveAttribute("readonly");
    expect(genderInput).not.toHaveAttribute("readonly");
  });

  it("renders fields as readonly when editable is false", () => {
    render(<Header employee={baseEmployee} editable={false} />);

    expect(screen.getByDisplayValue("John Doe")).toHaveAttribute("readonly");

    expect(screen.getByDisplayValue("EMP001")).toHaveAttribute("readonly");

    expect(screen.getByDisplayValue("john@example.com")).toHaveAttribute(
      "readonly",
    );

    expect(screen.getByDisplayValue("123 Main Street")).toHaveAttribute(
      "readonly",
    );

    expect(screen.getByDisplayValue("Male")).toHaveAttribute("readonly");
  });

  // ---------------------------------------------------------
  // PLUS BUTTON
  // ---------------------------------------------------------

  it("renders plus button when editable is true", () => {
    render(<Header employee={baseEmployee} editable={true} onChange={onChange} />);

    expect(screen.getByTestId("plus-button")).toBeInTheDocument();
  });

  it("does not render plus button when editable is false", () => {
    render(<Header employee={baseEmployee} editable={false} />);

    expect(screen.queryByTestId("plus-button")).not.toBeInTheDocument();
  });

  // ---------------------------------------------------------
  // IMAGE CLICK
  // ---------------------------------------------------------

  it("opens file input when editable profile image is clicked", () => {
    render(<Header employee={baseEmployee} editable={true} onChange={onChange} />);

    const fileInput = screen.getByTestId("file-input");

    const clickSpy = vi.spyOn(fileInput, "click");

    const image = screen.getByAltText("Employee Profile");

    fireEvent.click(image);

    expect(clickSpy).toHaveBeenCalledTimes(1);
  });

  it("does not open file input when profile image is clicked in non-editable mode", () => {
    render(<Header employee={baseEmployee} editable={false} />);

    const fileInput = screen.getByTestId("file-input");

    const clickSpy = vi.spyOn(fileInput, "click");

    const image = screen.getByAltText("Employee Profile");

    fireEvent.click(image);

    expect(clickSpy).not.toHaveBeenCalled();
  });

  it("opens file input when default user icon is clicked in editable mode", () => {
    render(
      <Header
        employee={{
          profile_pic: null,
        }}
        editable={true}
        onChange={onChange}
      />,
    );

    const fileInput = screen.getByTestId("file-input");

    const clickSpy = vi.spyOn(fileInput, "click");

    fireEvent.click(screen.getByTestId("user-icon"));

    expect(clickSpy).toHaveBeenCalledTimes(1);
  });

  it("opens file input when plus button is clicked", () => {
    render(<Header employee={baseEmployee} editable={true} onChange={onChange} />);

    const fileInput = screen.getByTestId("file-input");

    const clickSpy = vi.spyOn(fileInput, "click");

    fireEvent.click(screen.getByTestId("plus-button"));

    expect(clickSpy).toHaveBeenCalledTimes(1);
  });

  // ---------------------------------------------------------
  // FILE CHANGE
  // ---------------------------------------------------------

  it("calls onImageChange when a file is selected", () => {
    render(
      <Header
        employee={baseEmployee}
        editable={true}
        onImageChange={onImageChange}
        onChange={onChange}
      />,
    );

    const file = new File(["image-content"], "profile.png", {
      type: "image/png",
    });

    const fileInput = screen.getByTestId("file-input");

    fireEvent.change(fileInput, {
      target: {
        files: [file],
      },
    });

    expect(onImageChange).toHaveBeenCalledTimes(1);
    expect(onImageChange).toHaveBeenCalledWith(file);
  });

  it("does not call onImageChange when no file is selected", () => {
    render(
      <Header
        employee={baseEmployee}
        editable={true}
        onImageChange={onImageChange}
        onChange={onChange}
      />,
    );

    const fileInput = screen.getByTestId("file-input");

    fireEvent.change(fileInput, {
      target: {
        files: [],
      },
    });

    expect(onImageChange).not.toHaveBeenCalled();
  });

  it("does not fail when file is selected but onImageChange is not provided", () => {
    render(<Header employee={baseEmployee} editable={true} onChange={onChange} />);

    const file = new File(["image-content"], "profile.png", {
      type: "image/png",
    });

    const fileInput = screen.getByTestId("file-input");

    expect(() => {
      fireEvent.change(fileInput, {
        target: {
          files: [file],
        },
      });
    }).not.toThrow();
  });

  // ---------------------------------------------------------
  // INPUT CHANGE
  // ---------------------------------------------------------

  it("calls onChange when name is changed", () => {
    render(
      <Header employee={baseEmployee} editable={true} onChange={onChange} />,
    );

    const input = screen.getByDisplayValue("John Doe");

    fireEvent.change(input, {
      target: {
        name: "name",
        value: "Jane Doe",
      },
    });

    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("calls onChange when employee code is changed", () => {
    render(
      <Header employee={baseEmployee} editable={true} onChange={onChange} />,
    );

    fireEvent.change(screen.getByDisplayValue("EMP001"), {
      target: {
        name: "employee_code",
        value: "EMP002",
      },
    });

    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("calls onChange when email is changed", () => {
    render(
      <Header employee={baseEmployee} editable={true} onChange={onChange} />,
    );

    fireEvent.change(screen.getByDisplayValue("john@example.com"), {
      target: {
        name: "email",
        value: "new@example.com",
      },
    });

    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("calls onChange when address is changed", () => {
    render(
      <Header employee={baseEmployee} editable={true} onChange={onChange} />,
    );

    fireEvent.change(screen.getByDisplayValue("123 Main Street"), {
      target: {
        name: "address",
        value: "456 New Street",
      },
    });

    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("calls onChange when gender is changed", () => {
    render(
      <Header employee={baseEmployee} editable={true} onChange={onChange} />,
    );

    fireEvent.change(screen.getByDisplayValue("Male"), {
      target: {
        name: "gender",
        value: "Female",
      },
    });

    expect(onChange).toHaveBeenCalledTimes(1);
  });

  // ---------------------------------------------------------
  // DOB
  // ---------------------------------------------------------

  it("formats DOB correctly in non-editable mode", () => {
    render(<Header employee={baseEmployee} editable={false} />);

    expect(screen.getByDisplayValue("15/May/1995")).toBeInTheDocument();
  });

  it("renders DOB as date input in editable mode", () => {
    render(
      <Header employee={baseEmployee} editable={true} onChange={onChange} />,
    );

    const dobInput = screen.getByDisplayValue("1995-05-15");

    expect(dobInput).toHaveAttribute("type", "date");
  });

  it("calls onChange when DOB is changed", () => {
    render(
      <Header employee={baseEmployee} editable={true} onChange={onChange} />,
    );

    const dobInput = screen.getByDisplayValue("1995-05-15");

    fireEvent.change(dobInput, {
      target: {
        name: "dob",
        value: "2000-01-01",
      },
    });

    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("renders empty DOB when editable and DOB is missing", () => {
    render(
      <Header
        employee={{
          ...baseEmployee,
          dob: null,
        }}
        editable={true}
        onChange={onChange}
      />,
    );

    const dobInput = document.querySelector('input[name="dob"]');

    expect(dobInput).toBeInTheDocument();
    expect(dobInput).toHaveValue("");
  });

  it("renders dash when DOB is missing in non-editable mode", () => {
    render(
      <Header
        employee={{
          ...baseEmployee,
          dob: null,
        }}
        editable={false}
      />,
    );

    expect(screen.getByDisplayValue("-")).toBeInTheDocument();
  });

  // ---------------------------------------------------------
  // MISSING EMPLOYEE FIELDS
  // ---------------------------------------------------------

  it("handles missing employee fields safely", () => {
    render(
      <Header
        employee={{
          name: "",
          employee_code: "",
          email: "",
          address: "",
          gender: "",
          dob: "",
          profile_pic: null,
        }}
      />,
    );

    const emptyInputs = screen.getAllByDisplayValue("");
    expect(emptyInputs.length).toBeGreaterThan(0);
    expect(screen.getByTestId("user-icon")).toBeInTheDocument();
  });

  // ---------------------------------------------------------
  // FILE INPUT ATTRIBUTES
  // ---------------------------------------------------------

  it("renders file input with correct attributes", () => {
    render(<Header />);

    const fileInput = screen.getByTestId("file-input");

    expect(fileInput).toHaveAttribute("type", "file");
    expect(fileInput).toHaveAttribute("accept", "image/*");
  });
});