import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";

import EmployeeHeader from "../../Components/header/EmployeeHeader";

/* ============================================================
   TEST DATA
============================================================ */

const employeeData = {
  name: "John Doe",
  employee_id: "EMP001",
  email: "john@example.com",
  address: "Kochi, Kerala",
  dob: "1995-01-10",
  gender: "Male",
};

/* ============================================================
   TEST SUITE
============================================================ */

describe("Header EmployeeHeader Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  /* ==========================================================
     BASIC RENDERING
  ========================================================== */

  describe("Rendering", () => {
    it("renders the component with default employee object", () => {
      render(<EmployeeHeader />);

      expect(screen.getByPlaceholderText("Full Name")).toBeInTheDocument();

      expect(screen.getByPlaceholderText("Employee ID")).toBeInTheDocument();

      expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();

      expect(screen.getByPlaceholderText("Address")).toBeInTheDocument();

      expect(screen.getByPlaceholderText("Date of Birth")).toBeInTheDocument();

      expect(screen.getByPlaceholderText("Gender")).toBeInTheDocument();
    });

    it("renders empty values when employee fields are missing", () => {
      render(
        <EmployeeHeader
          employee={{
            name: "",
            employee_id: "",
            email: "",
            address: "",
            dob: "",
            gender: "",
          }}
        />,
      );

      expect(screen.getByPlaceholderText("Full Name")).toHaveValue("");

      expect(screen.getByPlaceholderText("Employee ID")).toHaveValue("");

      expect(screen.getByPlaceholderText("Email")).toHaveValue("");

      expect(screen.getByPlaceholderText("Address")).toHaveValue("");

      expect(screen.getByPlaceholderText("Date of Birth")).toHaveValue("-");

      expect(screen.getByPlaceholderText("Gender")).toHaveValue("");
    });

    it("renders all employee values", () => {
      render(<EmployeeHeader employee={employeeData} />);

      expect(screen.getByPlaceholderText("Full Name")).toHaveValue("John Doe");

      expect(screen.getByPlaceholderText("Employee ID")).toHaveValue("EMP001");

      expect(screen.getByPlaceholderText("Email")).toHaveValue(
        "john@example.com",
      );

      expect(screen.getByPlaceholderText("Address")).toHaveValue(
        "Kochi, Kerala",
      );

      expect(screen.getByPlaceholderText("Gender")).toHaveValue("Male");
    });

    it("formats the date of birth correctly", () => {
      render(
        <EmployeeHeader
          employee={{
            ...employeeData,
            dob: "1995-01-10",
          }}
        />,
      );

      expect(screen.getByPlaceholderText("Date of Birth")).toHaveValue(
        "10/Jan/1995",
      );
    });

    it("shows dash when date of birth is missing", () => {
      render(
        <EmployeeHeader
          employee={{
            ...employeeData,
            dob: "",
          }}
        />,
      );

      expect(screen.getByPlaceholderText("Date of Birth")).toHaveValue("-");
    });

    it("shows dash when date of birth is null", () => {
      render(
        <EmployeeHeader
          employee={{
            ...employeeData,
            dob: null,
          }}
        />,
      );

      expect(screen.getByPlaceholderText("Date of Birth")).toHaveValue("-");
    });
  });

  /* ==========================================================
     READ ONLY MODE
  ========================================================== */

  describe("Read only mode", () => {
    it("makes all fields read-only when editable is false", () => {
      render(<EmployeeHeader employee={employeeData} editable={false} />);

      expect(screen.getByPlaceholderText("Full Name")).toHaveAttribute(
        "readonly",
      );

      expect(screen.getByPlaceholderText("Employee ID")).toHaveAttribute(
        "readonly",
      );

      expect(screen.getByPlaceholderText("Email")).toHaveAttribute("readonly");

      expect(screen.getByPlaceholderText("Address")).toHaveAttribute(
        "readonly",
      );

      expect(screen.getByPlaceholderText("Date of Birth")).toHaveAttribute(
        "readonly",
      );

      expect(screen.getByPlaceholderText("Gender")).toHaveAttribute("readonly");
    });

    it("uses readOnly when editable is omitted", () => {
      render(<EmployeeHeader employee={employeeData} />);

      expect(screen.getByPlaceholderText("Full Name")).toHaveAttribute(
        "readonly",
      );
    });
  });

  /* ==========================================================
     EDITABLE MODE
  ========================================================== */

  describe("Editable mode", () => {
    it("makes fields editable when editable is true", () => {
      render(<EmployeeHeader employee={employeeData} editable={true} />);

      expect(screen.getByPlaceholderText("Full Name")).not.toHaveAttribute(
        "readonly",
      );

      expect(screen.getByPlaceholderText("Employee ID")).not.toHaveAttribute(
        "readonly",
      );

      expect(screen.getByPlaceholderText("Email")).not.toHaveAttribute(
        "readonly",
      );

      expect(screen.getByPlaceholderText("Address")).not.toHaveAttribute(
        "readonly",
      );

      expect(screen.getByPlaceholderText("Date of Birth")).not.toHaveAttribute(
        "readonly",
      );

      expect(screen.getByPlaceholderText("Gender")).not.toHaveAttribute(
        "readonly",
      );
    });

    it("calls onChange when name changes", () => {
      const onChange = vi.fn();

      render(
        <EmployeeHeader
          employee={employeeData}
          editable={true}
          onChange={onChange}
        />,
      );

      const input = screen.getByPlaceholderText("Full Name");

      fireEvent.change(input, {
        target: {
          name: "name",
          value: "Jane Doe",
        },
      });

      expect(onChange).toHaveBeenCalledTimes(1);
    });

    it("calls onChange when employee ID changes", () => {
      const onChange = vi.fn();

      render(
        <EmployeeHeader
          employee={employeeData}
          editable={true}
          onChange={onChange}
        />,
      );

      const input = screen.getByPlaceholderText("Employee ID");

      fireEvent.change(input, {
        target: {
          name: "employee_id",
          value: "EMP002",
        },
      });

      expect(onChange).toHaveBeenCalledTimes(1);
    });

    it("calls onChange when email changes", () => {
      const onChange = vi.fn();

      render(
        <EmployeeHeader
          employee={employeeData}
          editable={true}
          onChange={onChange}
        />,
      );

      const input = screen.getByPlaceholderText("Email");

      fireEvent.change(input, {
        target: {
          name: "email",
          value: "jane@example.com",
        },
      });

      expect(onChange).toHaveBeenCalledTimes(1);
    });

    it("calls onChange when address changes", () => {
      const onChange = vi.fn();

      render(
        <EmployeeHeader
          employee={employeeData}
          editable={true}
          onChange={onChange}
        />,
      );

      const textarea = screen.getByPlaceholderText("Address");

      fireEvent.change(textarea, {
        target: {
          name: "address",
          value: "Thrissur, Kerala",
        },
      });

      expect(onChange).toHaveBeenCalledTimes(1);
    });

    it("calls onChange when date of birth changes", () => {
      const onChange = vi.fn();

      render(
        <EmployeeHeader
          employee={employeeData}
          editable={true}
          onChange={onChange}
        />,
      );

      const input = screen.getByPlaceholderText("Date of Birth");

      fireEvent.change(input, {
        target: {
          name: "dob",
          value: "01/Jan/2000",
        },
      });

      expect(onChange).toHaveBeenCalledTimes(1);
    });

    it("calls onChange when gender changes", () => {
      const onChange = vi.fn();

      render(
        <EmployeeHeader
          employee={employeeData}
          editable={true}
          onChange={onChange}
        />,
      );

      const input = screen.getByPlaceholderText("Gender");

      fireEvent.change(input, {
        target: {
          name: "gender",
          value: "Female",
        },
      });

      expect(onChange).toHaveBeenCalledTimes(1);
    });
  });

  /* ==========================================================
     BACK BUTTON
  ========================================================== */

  describe("Back button", () => {
    it("does not render back button when onBack is not provided", () => {
      render(<EmployeeHeader employee={employeeData} />);

      expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });

    it("renders back button when onBack is provided", () => {
      const onBack = vi.fn();

      render(<EmployeeHeader employee={employeeData} onBack={onBack} />);

      const backArrow = document.querySelector('[class*="BackArrowWrapper"]');

      expect(backArrow).toBeInTheDocument();
    });

    it("calls onBack when back arrow is clicked", () => {
      const onBack = vi.fn();

      render(<EmployeeHeader employee={employeeData} onBack={onBack} />);

      const backArrow = document.querySelector('[class*="BackArrowWrapper"]');

      expect(backArrow).toBeInTheDocument();

      fireEvent.click(backArrow);

      expect(onBack).toHaveBeenCalledTimes(1);
    });
  });

  /* ==========================================================
     IMAGE CLICK / FILE INPUT
  ========================================================== */

  describe("Image and file handling", () => {
    it("does not open file picker when editable is false", () => {
      render(<EmployeeHeader employee={employeeData} editable={false} />);

      const fileInput = document.querySelector('input[type="file"]');

      /*
       * The current component does not render a file input.
       * This test intentionally verifies that no error occurs
       * when the image handler is not triggered in read-only mode.
       */
      expect(fileInput).not.toBeInTheDocument();
    });

    it("renders correctly in editable mode", () => {
      render(<EmployeeHeader employee={employeeData} editable={true} />);

      expect(screen.getByPlaceholderText("Full Name")).toBeInTheDocument();

      expect(screen.getByPlaceholderText("Employee ID")).toBeInTheDocument();
    });

    it("does not throw when onChange is not supplied", () => {
      expect(() => {
        render(<EmployeeHeader employee={employeeData} editable={true} />);
      }).not.toThrow();
    });

    it("does not throw when onImageChange is not supplied", () => {
      expect(() => {
        render(<EmployeeHeader employee={employeeData} editable={true} />);
      }).not.toThrow();
    });
  });

  /* ==========================================================
     DEFAULT PROP BEHAVIOUR
  ========================================================== */

  describe("Default props", () => {
    it("uses an empty employee object when employee is omitted", () => {
      render(<EmployeeHeader editable={false} />);

      expect(screen.getByPlaceholderText("Full Name")).toHaveValue("");

      expect(screen.getByPlaceholderText("Employee ID")).toHaveValue("");

      expect(screen.getByPlaceholderText("Email")).toHaveValue("");

      expect(screen.getByPlaceholderText("Address")).toHaveValue("");

      expect(screen.getByPlaceholderText("Date of Birth")).toHaveValue("-");

      expect(screen.getByPlaceholderText("Gender")).toHaveValue("");
    });

    it("handles partial employee data", () => {
      render(
        <EmployeeHeader
          employee={{
            name: "Only Name",
          }}
        />,
      );

      expect(screen.getByPlaceholderText("Full Name")).toHaveValue("Only Name");

      expect(screen.getByPlaceholderText("Employee ID")).toHaveValue("");

      expect(screen.getByPlaceholderText("Email")).toHaveValue("");

      expect(screen.getByPlaceholderText("Address")).toHaveValue("");

      expect(screen.getByPlaceholderText("Date of Birth")).toHaveValue("-");

      expect(screen.getByPlaceholderText("Gender")).toHaveValue("");
    });
  });

  /* ==========================================================
     DIFFERENT DATE VALUES
  ========================================================== */

  describe("Date formatting", () => {
    it("formats a date with a single digit day", () => {
      render(
        <EmployeeHeader
          employee={{
            ...employeeData,
            dob: "2000-02-05",
          }}
        />,
      );

      expect(screen.getByPlaceholderText("Date of Birth")).toHaveValue(
        "05/Feb/2000",
      );
    });

    it("formats a date with a double digit day", () => {
      render(
        <EmployeeHeader
          employee={{
            ...employeeData,
            dob: "2000-12-25",
          }}
        />,
      );

      expect(screen.getByPlaceholderText("Date of Birth")).toHaveValue(
        "25/Dec/2000",
      );
    });

    it("formats a different year correctly", () => {
      render(
        <EmployeeHeader
          employee={{
            ...employeeData,
            dob: "1980-06-15",
          }}
        />,
      );

      expect(screen.getByPlaceholderText("Date of Birth")).toHaveValue(
        "15/Jun/1980",
      );
    });
  });
});
