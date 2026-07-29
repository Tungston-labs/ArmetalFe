// src/__tests__/pages/reimbursement/Side_detail.test.jsx
//
// Test stack: Jest + @testing-library/react + @testing-library/user-event

import React from "react";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Side_detail from "../../../pages/reimbursement/Side_detail.jsx"; // adjust path to match your project
import { getGroupedReimbursements } from "../../../services/reimbursement";

jest.mock("../../../services/reimbursement", () => ({
  getGroupedReimbursements: jest.fn(),
}));

jest.mock("../../../Components/Loader", () => () => (
  <div data-testid="loader" />
));

// Styled-components mocked as plain passthrough elements so tests aren't
// coupled to the real styling implementation.
jest.mock("../../../pages/reimbursement/Side_detail.Styles", () => {
  const passthrough = (tag) => (props) =>
    React.createElement(tag, props, props.children);
  return {
    ModalOverlay: (props) => (
      <div data-testid="modal-overlay" onClick={props.onClick}>
        {props.children}
      </div>
    ),
    ModalContent: (props) => (
      <div data-testid="modal-content" onClick={props.onClick}>
        {props.children}
      </div>
    ),
    PageWrapper: passthrough("div"),
    Header: passthrough("div"),
    Title: passthrough("h2"),
    CloseButton: (props) => <button {...props}>{props.children}</button>,
    DateHeading: passthrough("h3"),
    Card: passthrough("div"),
    ProfileImage: (props) => <img {...props} />,
    Info: passthrough("div"),
    Label: passthrough("span"),
    Value: passthrough("span"),
    RightSection: passthrough("div"),
    Amount: passthrough("span"),
  };
});

const groupedFixture = [
  {
    date: "2026-01-15",
    reimbursements: [
      {
        id: 1,
        employee_name: "Alice",
        department: { name: "Engineering" },
        designation: "Developer",
        amount: 250,
        profile_pic: "alice.png",
      },
      {
        id: 2,
        employee_name: "Bob",
        department: null,
        designation: null,
        amount: 100,
        profile_pic: "",
      },
    ],
  },
  {
    date: "2026-01-10",
    reimbursements: [
      {
        id: 3,
        employee_name: "Carol",
        department: { name: "Sales" },
        designation: "Manager",
        amount: 400,
        profile_pic: "",
      },
    ],
  },
];

const onClose = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Side_detail (ReimbursementHistory)", () => {
  test("shows the Loader while reimbursements are being fetched", async () => {
    let resolvePromise;
    getGroupedReimbursements.mockReturnValue(
      new Promise((resolve) => {
        resolvePromise = resolve;
      })
    );

    render(<Side_detail onClose={onClose} />);

    expect(screen.getByTestId("loader")).toBeInTheDocument();

    resolvePromise([]);
    await waitFor(() =>
      expect(screen.queryByTestId("loader")).not.toBeInTheDocument()
    );
  });

  test("shows 'No reimbursements found.' when the fetch resolves empty", async () => {
    getGroupedReimbursements.mockResolvedValue([]);

    render(<Side_detail onClose={onClose} />);

    expect(
      await screen.findByText("No reimbursements found.")
    ).toBeInTheDocument();
  });

  test("shows 'No reimbursements found.' when the fetch fails", async () => {
    getGroupedReimbursements.mockRejectedValue(new Error("network error"));

    render(<Side_detail onClose={onClose} />);

    expect(
      await screen.findByText("No reimbursements found.")
    ).toBeInTheDocument();
  });

  test("renders a date heading per group, formatted as DD/Mon/YYYY", async () => {
    getGroupedReimbursements.mockResolvedValue(groupedFixture);

    render(<Side_detail onClose={onClose} />);

    expect(await screen.findByText("15/Jan/2026")).toBeInTheDocument();
    expect(screen.getByText("10/Jan/2026")).toBeInTheDocument();
  });

  test("renders every reimbursement card with name, department, position, and amount", async () => {
    getGroupedReimbursements.mockResolvedValue(groupedFixture);

    render(<Side_detail onClose={onClose} />);

    expect(await screen.findByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Engineering")).toBeInTheDocument();
    expect(screen.getByText("Developer")).toBeInTheDocument();
    expect(screen.getByText("250")).toBeInTheDocument();

    expect(screen.getByText("Carol")).toBeInTheDocument();
    expect(screen.getByText("Sales")).toBeInTheDocument();
    expect(screen.getByText("Manager")).toBeInTheDocument();
    expect(screen.getByText("400")).toBeInTheDocument();
  });

  test("falls back to 'N/A' when department or designation is missing", async () => {
    getGroupedReimbursements.mockResolvedValue(groupedFixture);

    render(<Side_detail onClose={onClose} />);
    await screen.findByText("Bob");

    const bobCard = screen.getByText("Bob").closest("div");
    expect(within(bobCard).getAllByText("N/A")).toHaveLength(2);
  });

  test("uses the provided profile_pic, falling back to a placeholder image when missing", async () => {
    getGroupedReimbursements.mockResolvedValue(groupedFixture);

    render(<Side_detail onClose={onClose} />);
    await screen.findByText("Alice");

    const aliceImg = screen.getByAltText("Alice");
    expect(aliceImg).toHaveAttribute("src", "alice.png");

    const bobImg = screen.getByAltText("Bob");
    expect(bobImg).toHaveAttribute("src", "https://via.placeholder.com/50");
  });

  test("clicking the Close button calls onClose", async () => {
    getGroupedReimbursements.mockResolvedValue(groupedFixture);
    const user = userEvent.setup();

    render(<Side_detail onClose={onClose} />);
    await screen.findByText("Alice");

    await user.click(screen.getByText("Close"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test("clicking directly on the overlay calls onClose", async () => {
    getGroupedReimbursements.mockResolvedValue(groupedFixture);
    const user = userEvent.setup();

    render(<Side_detail onClose={onClose} />);
    await screen.findByText("Alice");

    await user.click(screen.getByTestId("modal-overlay"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test("clicking inside the modal content does not call onClose", async () => {
    getGroupedReimbursements.mockResolvedValue(groupedFixture);
    const user = userEvent.setup();

    render(<Side_detail onClose={onClose} />);
    await screen.findByText("Alice");

    await user.click(screen.getByTestId("modal-content"));
    expect(onClose).not.toHaveBeenCalled();
  });
});