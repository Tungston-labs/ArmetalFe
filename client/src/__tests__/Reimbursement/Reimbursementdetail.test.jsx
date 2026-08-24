import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { vi } from "vitest";

import ReimbursementDetail from "../../Pages/reimbursement/Reimb_info";

import {
  fetchReimbursementDetail,
  updateReimbursementStatus,
} from "../../services/reimbursement";

// ============================================================
// MOCKS
// ============================================================

vi.mock("../../services/reimbursement", () => ({
  fetchReimbursementDetail: vi.fn(),
  updateReimbursementStatus: vi.fn(),
}));

// IMPORTANT:
// Actual component imports:
// ../../Components/Loader/Loader
vi.mock("../../Components/Loader/Loader", () => ({
  default: () => <div data-testid="loader">Loading...</div>,
}));

// Mock ReusableHeader because it is not the component under test
vi.mock("../../Components/ReusableTable/ReusableHeader", () => ({
  default: ({ title, breadcrumbs = [], showBack }) => (
    <div data-testid="reusable-header">
      <h1>{title}</h1>

      {breadcrumbs.map((breadcrumb, index) => (
        <span key={index}>{breadcrumb}</span>
      ))}

      {showBack && <button type="button">Back</button>}
    </div>
  ),
}));

// Mock the STYLED COMPONENTS.
// IMPORTANT:
// Do NOT mock Reimb_info.jsx itself.
// We only mock Reimb_info.Styles.
vi.mock("../../Pages/reimbursement/Reimb_info.Styles", () => {
  const passthrough =
    (Tag = "div") =>
    ({ children, ...props }) =>
      React.createElement(Tag, props, children);

  return {
    PageWrapper: passthrough("div"),
    Card: passthrough("div"),
    SectionTitle: passthrough("h3"),
    ProfileRow: passthrough("div"),
    ProfileImage: (props) => <img alt="profile" {...props} />,
    ProfileInfo: passthrough("div"),
    InfoRow: passthrough("div"),
    Label: passthrough("span"),
    Value: passthrough("span"),

    StatusSelect: ({ children, ...props }) => (
      <select {...props}>{children}</select>
    ),

    TopStatusBar: passthrough("div"),
    TopStatusLabel: passthrough("span"),

    Divider: passthrough("hr"),
    NoteBox: passthrough("div"),
    BillsGrid: passthrough("div"),
    BillImageWrapper: passthrough("div"),

    BillImage: (props) => <img alt="bill" {...props} />,

    NoteCard: passthrough("div"),
    NoteHeader: passthrough("div"),
    Arrow: passthrough("span"),
  };
});

// ============================================================
// TEST DATA
// ============================================================

const baseReimbursement = {
  id: "1",
  status: "In Verification",
  employee_name: "Jane Doe",
  employee_id: "EMP-100",

  department: {
    name: "Engineering",
  },

  profile_pic: null,

  date: "2026-03-15T00:00:00.000Z",

  amount: 1200,

  note: "Client dinner reimbursement",

  images: [
    {
      id: "b1",
      image: "https://example.com/bill1.png",
    },
    {
      id: "b2",
      image: "https://example.com/bill2.png",
    },
  ],
};

// ============================================================
// ROUTER HELPER
// ============================================================

const renderWithRouter = (id = "1") => {
  return render(
    <MemoryRouter initialEntries={[`/reimbursements/${id}`]}>
      <Routes>
        <Route path="/reimbursements/:id" element={<ReimbursementDetail />} />
      </Routes>
    </MemoryRouter>,
  );
};

// ============================================================
// RESET MOCKS
// ============================================================

beforeEach(() => {
  vi.clearAllMocks();
});

// ============================================================
// TESTS
// ============================================================

describe("ReimbursementDetail", () => {
  // ----------------------------------------------------------
  // LOADING
  // ----------------------------------------------------------

  test("shows the loader while the detail is being fetched", async () => {
    let resolvePromise;

    fetchReimbursementDetail.mockReturnValue(
      new Promise((resolve) => {
        resolvePromise = resolve;
      }),
    );

    renderWithRouter();

    expect(screen.getByTestId("loader")).toBeInTheDocument();

    resolvePromise(baseReimbursement);

    await waitFor(() => {
      expect(screen.queryByTestId("loader")).not.toBeInTheDocument();
    });
  });

  // ----------------------------------------------------------
  // NULL RESPONSE
  // ----------------------------------------------------------

  test("renders 'No reimbursement found.' when fetch resolves to null", async () => {
    fetchReimbursementDetail.mockResolvedValue(null);

    renderWithRouter();

    expect(
      await screen.findByText("No reimbursement found."),
    ).toBeInTheDocument();
  });

  // ----------------------------------------------------------
  // API ERROR
  // ----------------------------------------------------------

  test("renders 'No reimbursement found.' when fetch throws", async () => {
    fetchReimbursementDetail.mockRejectedValue(new Error("network error"));

    renderWithRouter();

    expect(
      await screen.findByText("No reimbursement found."),
    ).toBeInTheDocument();
  });

  // ----------------------------------------------------------
  // FETCH ID
  // ----------------------------------------------------------

  test("calls fetchReimbursementDetail with the id from the route params", async () => {
    fetchReimbursementDetail.mockResolvedValue(baseReimbursement);

    renderWithRouter("42");

    await waitFor(() => {
      expect(fetchReimbursementDetail).toHaveBeenCalledWith("42");
    });
  });

  // ----------------------------------------------------------
  // HEADER
  // ----------------------------------------------------------

  test("renders the reusable header", async () => {
    fetchReimbursementDetail.mockResolvedValue(baseReimbursement);

    renderWithRouter();

    expect(
      await screen.findByText("Reimbursement Details"),
    ).toBeInTheDocument();

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Reimbursement")).toBeInTheDocument();

    expect(screen.getAllByText("Reimbursement Details").length).toBeGreaterThan(
      0,
    );
  });

  // ----------------------------------------------------------
  // EMPLOYEE INFORMATION
  // ----------------------------------------------------------

  test("renders employee information once loaded", async () => {
    fetchReimbursementDetail.mockResolvedValue(baseReimbursement);

    renderWithRouter();

    expect(await screen.findByText("Jane Doe")).toBeInTheDocument();

    expect(screen.getByText("EMP-100")).toBeInTheDocument();

    expect(screen.getByText("Engineering")).toBeInTheDocument();
  });

  // ----------------------------------------------------------
  // DATE
  // ----------------------------------------------------------

  test("formats the date as DD/Mon/YYYY", async () => {
    fetchReimbursementDetail.mockResolvedValue(baseReimbursement);

    renderWithRouter();

    expect(await screen.findByText("15/Mar/2026")).toBeInTheDocument();
  });

  test("renders '----' when date is missing", async () => {
    fetchReimbursementDetail.mockResolvedValue({
      ...baseReimbursement,
      date: null,
    });

    renderWithRouter();

    expect(await screen.findByText("----")).toBeInTheDocument();
  });

  // ----------------------------------------------------------
  // AMOUNT
  // ----------------------------------------------------------

  test("renders the reimbursement amount", async () => {
    fetchReimbursementDetail.mockResolvedValue(baseReimbursement);

    renderWithRouter();

    expect(await screen.findByText("1200")).toBeInTheDocument();
  });

  // ----------------------------------------------------------
  // PROFILE IMAGE
  // ----------------------------------------------------------

  test("falls back to ui-avatars when profile_pic is missing", async () => {
    fetchReimbursementDetail.mockResolvedValue(baseReimbursement);

    renderWithRouter();

    const img = await screen.findByAltText("profile");

    expect(img).toHaveAttribute(
      "src",
      expect.stringContaining("https://ui-avatars.com/api/"),
    );

    expect(img.src).toContain(encodeURIComponent("Jane Doe"));
  });

  test("uses the provided profile_pic when present", async () => {
    fetchReimbursementDetail.mockResolvedValue({
      ...baseReimbursement,
      profile_pic: "https://example.com/avatar.png",
    });

    renderWithRouter();

    const img = await screen.findByAltText("profile");

    expect(img).toHaveAttribute("src", "https://example.com/avatar.png");
  });

  // ----------------------------------------------------------
  // BILLS
  // ----------------------------------------------------------

  test("renders one image per bill", async () => {
    fetchReimbursementDetail.mockResolvedValue(baseReimbursement);

    renderWithRouter();

    const bills = await screen.findAllByAltText("bill");

    expect(bills).toHaveLength(2);

    expect(bills[0]).toHaveAttribute("src", "https://example.com/bill1.png");

    expect(bills[1]).toHaveAttribute("src", "https://example.com/bill2.png");
  });

  test("renders bill images inside links", async () => {
    fetchReimbursementDetail.mockResolvedValue(baseReimbursement);

    renderWithRouter();

    const bills = await screen.findAllByAltText("bill");

    expect(bills[0].closest("a")).toHaveAttribute(
      "href",
      "https://example.com/bill1.png",
    );

    expect(bills[1].closest("a")).toHaveAttribute(
      "href",
      "https://example.com/bill2.png",
    );

    expect(bills[0].closest("a")).toHaveAttribute("target", "_blank");

    expect(bills[0].closest("a")).toHaveAttribute("rel", "noreferrer");
  });

  // ----------------------------------------------------------
  // NOTE
  // ----------------------------------------------------------

  test("note is hidden by default", async () => {
    fetchReimbursementDetail.mockResolvedValue(baseReimbursement);

    renderWithRouter();

    await screen.findByText("Jane Doe");

    expect(
      screen.queryByText("Client dinner reimbursement"),
    ).not.toBeInTheDocument();

    expect(screen.getByText("▼")).toBeInTheDocument();
  });

  test("opens the note when Note is clicked", async () => {
    fetchReimbursementDetail.mockResolvedValue(baseReimbursement);

    renderWithRouter();

    await screen.findByText("Jane Doe");

    fireEvent.click(screen.getByText("Note"));

    expect(
      await screen.findByText("Client dinner reimbursement"),
    ).toBeInTheDocument();

    expect(screen.getByText("▲")).toBeInTheDocument();
  });

  test("closes the note when Note is clicked again", async () => {
    fetchReimbursementDetail.mockResolvedValue(baseReimbursement);

    renderWithRouter();

    await screen.findByText("Jane Doe");

    const noteHeader = screen.getByText("Note");

    fireEvent.click(noteHeader);

    expect(
      await screen.findByText("Client dinner reimbursement"),
    ).toBeInTheDocument();

    fireEvent.click(noteHeader);

    await waitFor(() => {
      expect(
        screen.queryByText("Client dinner reimbursement"),
      ).not.toBeInTheDocument();
    });

    expect(screen.getByText("▼")).toBeInTheDocument();
  });

  // ----------------------------------------------------------
  // STATUS
  // ----------------------------------------------------------

  test("status select shows the current status", async () => {
    fetchReimbursementDetail.mockResolvedValue(baseReimbursement);

    renderWithRouter();

    const select = await screen.findByDisplayValue("In Verification");

    expect(select).toBeInTheDocument();
    expect(select).not.toBeDisabled();
  });

  test("status select contains all available statuses", async () => {
    fetchReimbursementDetail.mockResolvedValue(baseReimbursement);

    renderWithRouter();

    const select = await screen.findByDisplayValue("In Verification");

    expect(select).toHaveDisplayValue("In Verification");

    expect(
      screen.getByRole("option", {
        name: "Approved",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("option", {
        name: "On Hold",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("option", {
        name: "In Verification",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("option", {
        name: "Reject",
      }),
    ).toBeInTheDocument();
  });

  // ----------------------------------------------------------
  // APPROVED STATUS
  // ----------------------------------------------------------

  test("status select is disabled when status is Approve", async () => {
    fetchReimbursementDetail.mockResolvedValue({
      ...baseReimbursement,
      status: "Approve",
    });

    renderWithRouter();

    const select = await screen.findByDisplayValue("Approved");

    expect(select).toBeDisabled();

    expect(select).toHaveValue("Approve");
  });

  test("does not update status when current status is Approve", async () => {
    fetchReimbursementDetail.mockResolvedValue({
      ...baseReimbursement,
      status: "Approve",
    });

    renderWithRouter();

    const select = await screen.findByDisplayValue("Approved");

    expect(select).toBeDisabled();

    fireEvent.change(select, {
      target: {
        value: "Reject",
      },
    });

    expect(updateReimbursementStatus).not.toHaveBeenCalled();

    expect(select).toHaveValue("Approve");
  });

  // ----------------------------------------------------------
  // STATUS UPDATE
  // ----------------------------------------------------------

  test("optimistically updates status when status is changed", async () => {
    fetchReimbursementDetail.mockResolvedValue(baseReimbursement);

    updateReimbursementStatus.mockResolvedValue({});

    renderWithRouter();

    const select = await screen.findByDisplayValue("In Verification");

    fireEvent.change(select, {
      target: {
        value: "On Hold",
      },
    });

    expect(select).toHaveValue("On Hold");

    await waitFor(() => {
      expect(updateReimbursementStatus).toHaveBeenCalledWith("1", "On Hold");
    });
  });

  test("updates status to Reject", async () => {
    fetchReimbursementDetail.mockResolvedValue(baseReimbursement);

    updateReimbursementStatus.mockResolvedValue({});

    renderWithRouter();

    const select = await screen.findByDisplayValue("In Verification");

    fireEvent.change(select, {
      target: {
        value: "Reject",
      },
    });

    expect(select).toHaveValue("Reject");

    await waitFor(() => {
      expect(updateReimbursementStatus).toHaveBeenCalledWith("1", "Reject");
    });
  });

  test("updates status to On Hold", async () => {
    fetchReimbursementDetail.mockResolvedValue(baseReimbursement);

    updateReimbursementStatus.mockResolvedValue({});

    renderWithRouter();

    const select = await screen.findByDisplayValue("In Verification");

    fireEvent.change(select, {
      target: {
        value: "On Hold",
      },
    });

    await waitFor(() => {
      expect(updateReimbursementStatus).toHaveBeenCalledTimes(1);

      expect(updateReimbursementStatus).toHaveBeenCalledWith("1", "On Hold");
    });
  });

  // ----------------------------------------------------------
  // STATUS UPDATE FAILURE
  // ----------------------------------------------------------

  test("reverts to the previous status when update fails", async () => {
    fetchReimbursementDetail.mockResolvedValue(baseReimbursement);

    updateReimbursementStatus.mockRejectedValue(new Error("failed"));

    renderWithRouter();

    const select = await screen.findByDisplayValue("In Verification");

    fireEvent.change(select, {
      target: {
        value: "Reject",
      },
    });

    // Optimistic update
    expect(select).toHaveValue("Reject");

    // After API failure it should revert
    await waitFor(() => {
      expect(select).toHaveValue("In Verification");
    });
  });

  test("reverts status to On Hold when API update fails", async () => {
    fetchReimbursementDetail.mockResolvedValue({
      ...baseReimbursement,
      status: "On Hold",
    });

    updateReimbursementStatus.mockRejectedValue(new Error("failed"));

    renderWithRouter();

    const select = await screen.findByDisplayValue("On Hold");

    fireEvent.change(select, {
      target: {
        value: "Reject",
      },
    });

    expect(select).toHaveValue("Reject");

    await waitFor(() => {
      expect(select).toHaveValue("On Hold");
    });
  });

  // ----------------------------------------------------------
  // EMPTY IMAGES
  // ----------------------------------------------------------

  test("renders no bill images when images array is empty", async () => {
    fetchReimbursementDetail.mockResolvedValue({
      ...baseReimbursement,
      images: [],
    });

    renderWithRouter();

    await screen.findByText("Jane Doe");

    expect(screen.queryAllByAltText("bill")).toHaveLength(0);
  });

  // ----------------------------------------------------------
  // MISSING DEPARTMENT
  // ----------------------------------------------------------

  test("renders employee information when department is missing", async () => {
    fetchReimbursementDetail.mockResolvedValue({
      ...baseReimbursement,
      department: null,
    });

    renderWithRouter();

    expect(await screen.findByText("Jane Doe")).toBeInTheDocument();

    expect(screen.getByText("EMP-100")).toBeInTheDocument();
  });

  // ----------------------------------------------------------
  // MISSING NOTE
  // ----------------------------------------------------------

  test("renders the note section even when note is empty", async () => {
    fetchReimbursementDetail.mockResolvedValue({
      ...baseReimbursement,
      note: "",
    });

    renderWithRouter();

    await screen.findByText("Jane Doe");

    expect(screen.getByText("Note")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Note"));

    expect(screen.getByText("Note")).toBeInTheDocument();
  });

  // ----------------------------------------------------------
  // COMPLETE PAGE
  // ----------------------------------------------------------

  test("renders all main sections", async () => {
    fetchReimbursementDetail.mockResolvedValue(baseReimbursement);

    renderWithRouter();

    expect(await screen.findByText("Employee Information")).toBeInTheDocument();

    expect(screen.getAllByText("Reimbursement Details").length).toBeGreaterThan(
      0,
    );

    expect(screen.getByText("Bills Uploaded")).toBeInTheDocument();

    expect(screen.getByText("Date:")).toBeInTheDocument();

    expect(screen.getByText("Amount:")).toBeInTheDocument();

    expect(screen.getByText("Note")).toBeInTheDocument();
  });
});
