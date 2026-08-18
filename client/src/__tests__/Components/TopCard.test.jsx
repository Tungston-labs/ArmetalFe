import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

import TopCard from "../../Components/TopCard";

describe("TopCard Component", () => {
  const mockEmployees = [
    {
      name: "John Doe",
      empId: "EMP001",
      department: "HR",
      avatar: "/images/john.png",
    },
    {
      name: "Jane Smith",
      empId: "EMP002",
      department: "Finance",
      avatar: "/images/jane.png",
    },
    {
      name: "Robert Brown",
      empId: "EMP003",
      department: "IT",
      avatar: "/images/robert.png",
    },
    {
      name: "Emily Davis",
      empId: "EMP004",
      department: "Payroll",
      avatar: "/images/emily.png",
    },
  ];

  it("renders the card title and count", () => {
    render(
      <TopCard
        icon={<span data-testid="card-icon">Icon</span>}
        title="New Employees"
        count={10}
        employees={[]}
      />,
    );

    expect(screen.getByText("New Employees")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
  });

  it("renders the provided icon", () => {
    render(
      <TopCard
        icon={<span data-testid="card-icon">Icon</span>}
        title="Employees"
        count={5}
        employees={[]}
      />,
    );

    expect(screen.getByTestId("card-icon")).toBeInTheDocument();
  });

  it("renders employee information correctly", () => {
    render(
      <TopCard
        icon={<span>Icon</span>}
        title="Employees"
        count={4}
        employees={mockEmployees}
      />,
    );

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("EMP001")).toBeInTheDocument();
    expect(screen.getByText("HR")).toBeInTheDocument();

    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    expect(screen.getByText("EMP002")).toBeInTheDocument();
    expect(screen.getByText("Finance")).toBeInTheDocument();

    expect(screen.getByText("Robert Brown")).toBeInTheDocument();
    expect(screen.getByText("EMP003")).toBeInTheDocument();
    expect(screen.getByText("IT")).toBeInTheDocument();

    expect(screen.getByText("Emily Davis")).toBeInTheDocument();
    expect(screen.getByText("EMP004")).toBeInTheDocument();
    expect(screen.getByText("Payroll")).toBeInTheDocument();
  });

  it("renders employee avatar when avatar is provided", () => {
    render(
      <TopCard
        icon={<span>Icon</span>}
        title="Employees"
        count={1}
        employees={[mockEmployees[0]]}
      />,
    );

    const avatar = screen.getByRole("img");

    expect(avatar).toHaveAttribute(
      "src",
      "/images/john.png",
    );
  });

  it("uses default avatar when employee avatar is missing", () => {
    const employeeWithoutAvatar = {
      name: "No Avatar",
      empId: "EMP005",
      department: "Admin",
    };

    render(
      <TopCard
        icon={<span>Icon</span>}
        title="Employees"
        count={1}
        employees={[employeeWithoutAvatar]}
      />,
    );

    const avatar = screen.getByRole("img");

    expect(avatar).toHaveAttribute(
      "src",
      "/default-avatar.png",
    );
  });

  it("renders only the first four employees", () => {
    const employees = [
      ...mockEmployees,
      {
        name: "Fifth Employee",
        empId: "EMP005",
        department: "Sales",
        avatar: "/images/fifth.png",
      },
      {
        name: "Sixth Employee",
        empId: "EMP006",
        department: "Marketing",
        avatar: "/images/sixth.png",
      },
    ];

    render(
      <TopCard
        icon={<span>Icon</span>}
        title="Employees"
        count={6}
        employees={employees}
      />,
    );

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    expect(screen.getByText("Robert Brown")).toBeInTheDocument();
    expect(screen.getByText("Emily Davis")).toBeInTheDocument();

    expect(screen.queryByText("Fifth Employee")).not.toBeInTheDocument();
    expect(screen.queryByText("Sixth Employee")).not.toBeInTheDocument();
  });

  it("handles an empty employees array", () => {
    render(
      <TopCard
        icon={<span>Icon</span>}
        title="Employees"
        count={0}
        employees={[]}
      />,
    );

    expect(screen.getByText("Employees")).toBeInTheDocument();
    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("handles undefined employees", () => {
    render(
      <TopCard
        icon={<span>Icon</span>}
        title="Employees"
        count={0}
      />,
    );

    expect(screen.getByText("Employees")).toBeInTheDocument();
    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("calls onClick when the card is clicked", () => {
    const handleClick = vi.fn();

    render(
      <TopCard
        icon={<span>Icon</span>}
        title="Employees"
        count={5}
        employees={[]}
        onClick={handleClick}
      />,
    );

    const title = screen.getByText("Employees");

    fireEvent.click(title);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("renders the arrow icon", () => {
    render(
      <TopCard
        icon={<span>Icon</span>}
        title="Employees"
        count={5}
        employees={[]}
      />,
    );

    expect(screen.getByText("↗")).toBeInTheDocument();
  });
});