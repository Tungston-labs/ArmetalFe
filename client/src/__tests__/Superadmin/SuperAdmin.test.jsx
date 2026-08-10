import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import CompanyTable from "../../Pages/SuperAdmin/SuperAdmin";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getCompanies, removeCompany } from "../../Redux/superAdminSlice";

vi.mock("react-redux", () => ({
  useDispatch: vi.fn(),
  useSelector: vi.fn(),
}));

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("../../Redux/superAdminSlice", () => ({
  getCompanies: vi.fn(() => ({
    type: "GET_COMPANIES",
  })),
  removeCompany: vi.fn((id) => ({
    type: "REMOVE_COMPANY",
    payload: id,
  })),
}));

vi.mock("../../Components/Loader", () => ({
  default: () => <div>Loader</div>,
}));

vi.mock("../../Pages/superAdmin/AddCompany", () => ({
  default: ({ isEdit }) => (
    <div>{isEdit ? "Edit Company Modal" : "Add Company Modal"}</div>
  ),
}));

vi.mock("../../Components/superadmin/EmailCompose/EmailCompose", () => ({
  default: () => <div>Email Modal</div>,
}));

describe("CompanyTable", () => {
  const dispatch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useDispatch.mockReturnValue(dispatch);

    useSelector.mockImplementation((cb) =>
      cb({
        superAdmin: {
          loading: false,
          companies: [
            {
              id: 1,
              name: "ABC Company",
              company_id: "CMP001",
              contact_number: "9999999999",
              number_of_employees: 25,
            },
          ],
          pagination: {
            total_pages: 3,
          },
        },
      }),
    );
  });

  it("dispatches getCompanies on mount", () => {
    render(<CompanyTable />);

    expect(dispatch).toHaveBeenCalled();
    expect(getCompanies).toHaveBeenCalled();
  });

  it("renders company details", () => {
    render(<CompanyTable />);

    expect(screen.getByText("ABC Company")).toBeInTheDocument();
    expect(screen.getByText("CMP001")).toBeInTheDocument();
    expect(screen.getByText("9999999999")).toBeInTheDocument();
  });

  it("opens add company modal", () => {
    render(<CompanyTable />);

    fireEvent.click(screen.getByText(/Add Company/i));

    expect(screen.getByText("Add Company Modal")).toBeInTheDocument();
  });

  it("opens edit company modal", () => {
    render(<CompanyTable />);

    fireEvent.click(screen.getByTestId("edit-btn-1"));

    expect(screen.getByText("Edit Company Modal")).toBeInTheDocument();
  });

  it("opens email modal", () => {
    render(<CompanyTable />);

    fireEvent.click(screen.getByTestId("email-btn-1"));

    expect(screen.getByText("Email Modal")).toBeInTheDocument();
  });

  it("navigates to company details", () => {
    render(<CompanyTable />);

    fireEvent.click(screen.getByTestId("info-cell-1"));

    expect(mockNavigate).toHaveBeenCalledWith("/superadmin/view/1");
  });

  it("opens delete confirmation", () => {
    render(<CompanyTable />);

    fireEvent.click(screen.getByTestId("delete-btn-1"));

    expect(screen.getByText("Confirm Deletion")).toBeInTheDocument();
  });

  it("deletes company after confirmation", async () => {
    render(<CompanyTable />);

    const buttons = screen.getAllByRole("button");

    fireEvent.click(buttons[3]);

    fireEvent.click(screen.getByRole("button", { name: "Delete" }));

    await waitFor(() => {
      expect(removeCompany).toHaveBeenCalledWith(1);
      expect(dispatch).toHaveBeenCalled();
    });
  });

  it("closes delete modal when cancel clicked", () => {
    render(<CompanyTable />);

    const buttons = screen.getAllByRole("button");

    fireEvent.click(buttons[3]);

    fireEvent.click(screen.getByText("Cancel"));

    expect(screen.queryByText("Confirm Deletion")).not.toBeInTheDocument();
  });

  it("changes search value", () => {
    render(<CompanyTable />);

    const input = screen.getByPlaceholderText("Search by Company ID");

    fireEvent.change(input, {
      target: {
        value: "CMP001",
      },
    });

    expect(input.value).toBe("CMP001");
  });

  it("changes page", () => {
    render(<CompanyTable />);

    fireEvent.click(screen.getByText("2"));

    expect(getCompanies).toHaveBeenLastCalledWith({
      page: 2,
      search: "",
    });
  });

  it("shows no companies found", () => {
    useSelector.mockImplementation((cb) =>
      cb({
        superAdmin: {
          loading: false,
          companies: [],
          pagination: {
            total_pages: 1,
          },
        },
      }),
    );

    render(<CompanyTable />);

    expect(screen.getByText("No companies found")).toBeInTheDocument();
  });

  it("shows loader", () => {
    useSelector.mockImplementation((cb) =>
      cb({
        superAdmin: {
          loading: true,
          companies: [],
          pagination: {
            total_pages: 1,
          },
        },
      }),
    );

    render(<CompanyTable />);

    expect(screen.getByText("Loader")).toBeInTheDocument();
  });
});
