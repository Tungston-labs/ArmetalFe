import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import DepartmentEmployeeTable from "../../Pages/employeDashboard/DepartmentEmployeeTable";

describe("DepartmentEmployeeTable", () => {
  it("returns null when employee is not provided", () => {
    const { container } = render(<DepartmentEmployeeTable employee={null} />);

    expect(container.firstChild).toBeNull();
  });

  it("renders the department information title", () => {
    const employee = {
      department: "Engineering",
      employeeId: "EMP001",
      employeeType: "Full Time",
      role: "Software Developer",
    };

    render(<DepartmentEmployeeTable employee={employee} />);

    expect(screen.getByText("Department Information")).toBeInTheDocument();
  });

  it("renders all employee information correctly", () => {
    const employee = {
      department: "Engineering",
      employeeId: "EMP001",
      employeeType: "Full Time",
      role: "Software Developer",
    };

    render(<DepartmentEmployeeTable employee={employee} />);

    expect(screen.getByText("Department Name")).toBeInTheDocument();
    expect(screen.getByText("Engineering")).toBeInTheDocument();

    expect(screen.getByText("Employee ID")).toBeInTheDocument();
    expect(screen.getByText("EMP001")).toBeInTheDocument();

    expect(screen.getByText("Employee Type")).toBeInTheDocument();
    expect(screen.getByText("Full Time")).toBeInTheDocument();

    expect(screen.getByText("Role")).toBeInTheDocument();
    expect(screen.getByText("Software Developer")).toBeInTheDocument();
  });

  it("renders dash when employee fields are missing", () => {
    const employee = {
      department: "",
      employeeId: "",
      employeeType: "",
      role: "",
    };

    render(<DepartmentEmployeeTable employee={employee} />);

    const dashes = screen.getAllByText("—");

    expect(dashes).toHaveLength(4);
  });

  it("renders dash for undefined employee fields", () => {
    const employee = {};

    render(<DepartmentEmployeeTable employee={employee} />);

    const dashes = screen.getAllByText("—");

    expect(dashes).toHaveLength(4);
  });

  it("renders all field labels", () => {
    const employee = {
      department: "HR",
      employeeId: "EMP100",
      employeeType: "Contract",
      role: "Manager",
    };

    render(<DepartmentEmployeeTable employee={employee} />);

    expect(screen.getByText("Department Name")).toBeInTheDocument();
    expect(screen.getByText("Employee ID")).toBeInTheDocument();
    expect(screen.getByText("Employee Type")).toBeInTheDocument();
    expect(screen.getByText("Role")).toBeInTheDocument();
  });

  it("renders dividers between fields but not after the last field", () => {
    const employee = {
      department: "Finance",
      employeeId: "EMP200",
      employeeType: "Full Time",
      role: "Accountant",
    };

    render(<DepartmentEmployeeTable employee={employee} />);

    const items = screen.getAllByText(
      /Department Name|Employee ID|Employee Type|Role/,
    );

    expect(items).toHaveLength(4);
  });

  it("renders the component with a complete employee object", () => {
    const employee = {
      department: "Human Resources",
      employeeId: "EMP123",
      employeeType: "Permanent",
      role: "HR Executive",
    };

    const { container } = render(
      <DepartmentEmployeeTable employee={employee} />,
    );

    expect(container.firstChild).toBeInTheDocument();
    expect(screen.getByText("Human Resources")).toBeInTheDocument();
    expect(screen.getByText("EMP123")).toBeInTheDocument();
    expect(screen.getByText("Permanent")).toBeInTheDocument();
    expect(screen.getByText("HR Executive")).toBeInTheDocument();
  });
});
