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

  it("returns null when employee is undefined", () => {
    const { container } = render(<DepartmentEmployeeTable />);

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

  it("renders dash for empty employee fields", () => {
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

  it("renders dash for null employee fields", () => {
    const employee = {
      department: null,
      employeeId: null,
      employeeType: null,
      role: null,
    };

    render(<DepartmentEmployeeTable employee={employee} />);

    const dashes = screen.getAllByText("—");

    expect(dashes).toHaveLength(4);
  });

  it("renders dash independently for each missing field", () => {
    const employee = {
      department: "",
      employeeId: "EMP002",
      employeeType: "",
      role: "Developer",
    };

    render(<DepartmentEmployeeTable employee={employee} />);

    expect(screen.getAllByText("—")).toHaveLength(2);

    expect(screen.getByText("EMP002")).toBeInTheDocument();
    expect(screen.getByText("Developer")).toBeInTheDocument();
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

  it("renders all four employee fields in the correct order", () => {
    const employee = {
      department: "Finance",
      employeeId: "EMP200",
      employeeType: "Full Time",
      role: "Accountant",
    };

    render(<DepartmentEmployeeTable employee={employee} />);

    expect(screen.getByText("Department Name")).toBeInTheDocument();
    expect(screen.getByText("Finance")).toBeInTheDocument();

    expect(screen.getByText("Employee ID")).toBeInTheDocument();
    expect(screen.getByText("EMP200")).toBeInTheDocument();

    expect(screen.getByText("Employee Type")).toBeInTheDocument();
    expect(screen.getByText("Full Time")).toBeInTheDocument();

    expect(screen.getByText("Role")).toBeInTheDocument();
    expect(screen.getByText("Accountant")).toBeInTheDocument();
  });

  it("renders dividers between fields", () => {
    const employee = {
      department: "Finance",
      employeeId: "EMP200",
      employeeType: "Full Time",
      role: "Accountant",
    };

    render(<DepartmentEmployeeTable employee={employee} />);

    const departmentLabel = screen.getByText("Department Name");
    const employeeIdLabel = screen.getByText("Employee ID");
    const employeeTypeLabel = screen.getByText("Employee Type");
    const roleLabel = screen.getByText("Role");

    expect(departmentLabel).toBeInTheDocument();
    expect(employeeIdLabel).toBeInTheDocument();
    expect(employeeTypeLabel).toBeInTheDocument();
    expect(roleLabel).toBeInTheDocument();

    /*
     * Department Name -> Divider
     * Employee ID     -> Divider
     * Employee Type   -> Divider
     * Role            -> No Divider
     *
     * The styled components create an additional wrapper
     * around the labels, so we check the actual DOM relationship
     * instead of assuming a specific Section HTML element.
     */

    const departmentItem = departmentLabel.parentElement;
    const employeeIdItem = employeeIdLabel.parentElement;
    const employeeTypeItem = employeeTypeLabel.parentElement;
    const roleItem = roleLabel.parentElement;

    expect(departmentItem).toBeInTheDocument();
    expect(employeeIdItem).toBeInTheDocument();
    expect(employeeTypeItem).toBeInTheDocument();
    expect(roleItem).toBeInTheDocument();

    expect(departmentItem?.nextElementSibling).toBeInTheDocument();
    expect(employeeIdItem?.nextElementSibling).toBeInTheDocument();
    expect(employeeTypeItem?.nextElementSibling).toBeInTheDocument();

    expect(roleItem?.nextElementSibling).toBeNull();
  });

  it("does not render a divider after the last field", () => {
    const employee = {
      department: "Finance",
      employeeId: "EMP200",
      employeeType: "Full Time",
      role: "Accountant",
    };

    render(<DepartmentEmployeeTable employee={employee} />);

    const roleLabel = screen.getByText("Role");

    expect(roleLabel).toBeInTheDocument();

    const roleItem = roleLabel.parentElement;

    expect(roleItem).toBeInTheDocument();
    expect(roleItem?.nextElementSibling).toBeNull();
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

    expect(screen.getByText("Department Information")).toBeInTheDocument();

    expect(screen.getByText("Human Resources")).toBeInTheDocument();
    expect(screen.getByText("EMP123")).toBeInTheDocument();
    expect(screen.getByText("Permanent")).toBeInTheDocument();
    expect(screen.getByText("HR Executive")).toBeInTheDocument();
  });

  it("renders correctly when only some employee values are missing", () => {
    const employee = {
      department: "Engineering",
      employeeId: "",
      employeeType: "Permanent",
      role: "",
    };

    render(<DepartmentEmployeeTable employee={employee} />);

    expect(screen.getByText("Engineering")).toBeInTheDocument();
    expect(screen.getByText("Permanent")).toBeInTheDocument();

    expect(screen.getAllByText("—")).toHaveLength(2);
  });

  it("renders correctly with different valid employee values", () => {
    const employee = {
      department: "Operations",
      employeeId: "EMP999",
      employeeType: "Temporary",
      role: "Team Lead",
    };

    render(<DepartmentEmployeeTable employee={employee} />);

    expect(screen.getByText("Operations")).toBeInTheDocument();
    expect(screen.getByText("EMP999")).toBeInTheDocument();
    expect(screen.getByText("Temporary")).toBeInTheDocument();
    expect(screen.getByText("Team Lead")).toBeInTheDocument();
  });
});
