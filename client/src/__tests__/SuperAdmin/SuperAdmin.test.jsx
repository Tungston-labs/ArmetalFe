import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import CompanyTable from "../../Pages/superAdmin/SuperAdmin";
import { useDispatch, useSelector } from "react-redux";
import {
  getCompanies,
  removeCompany,
} from "../../Redux/superAdminSlice";

// -------------------- MOCKS --------------------

jest.mock("react-redux", () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock("../../Redux/superAdminSlice", () => ({
  getCompanies: jest.fn((payload) => ({
    type: "GET_COMPANIES",
    payload,
  })),
  removeCompany: jest.fn((id) => ({
    type: "REMOVE_COMPANY",
    payload: id,
  })),
}));

jest.mock("../../Components/Loader", () => () => (
  <div>Loading...</div>
));

jest.mock("../superAdmin/AddCompany", () => () => (
  <div>Add Company Modal</div>
));

jest.mock(
  "../../Components/superadmin/EmailCompose/EmailCompose",
  () => () => <div>Email Compose Modal</div>
);

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

// -------------------- TEST DATA --------------------

const companyData = [
  {
    id: 1,
    name: "ABC Technologies",
    company_id: "CMP001",
    contact_number: "9876543210",
    number_of_employees: 25,
  },
];

describe("CompanyTable", () => {
  const dispatch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    useDispatch.mockReturnValue(dispatch);

    useSelector.mockReturnValue({
      companies: companyData,
      loading: false,
      pagination: {
        total_pages: 3,
      },
    });
  });

  test("dispatches getCompanies on mount", () => {
    render(
      <BrowserRouter>
        <CompanyTable />
      </BrowserRouter>
    );

    expect(dispatch).toHaveBeenCalledWith(
      getCompanies({
        page: 1,
        search: "",
      })
    );
  });

  test("shows loader", () => {
    useSelector.mockReturnValue({
      companies: [],
      loading: true,
      pagination: {
        total_pages: 1,
      },
    });

    render(
      <BrowserRouter>
        <CompanyTable />
      </BrowserRouter>
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  test("renders company details", () => {
    render(
      <BrowserRouter>
        <CompanyTable />
      </BrowserRouter>
    );

    expect(screen.getByText("ABC Technologies")).toBeInTheDocument();
    expect(screen.getByText("CMP001")).toBeInTheDocument();
    expect(screen.getByText("9876543210")).toBeInTheDocument();
    expect(screen.getByText("25")).toBeInTheDocument();
  });

  test("shows no companies found", () => {
    useSelector.mockReturnValue({
      companies: [],
      loading: false,
      pagination: {
        total_pages: 1,
      },
    });

    render(
      <BrowserRouter>
        <CompanyTable />
      </BrowserRouter>
    );

    expect(
      screen.getByText("No companies found")
    ).toBeInTheDocument();
  });

  test("search input updates", () => {
    render(
      <BrowserRouter>
        <CompanyTable />
      </BrowserRouter>
    );

    const input = screen.getByPlaceholderText(
      "Search by Company ID"
    );

    fireEvent.change(input, {
      target: { value: "CMP001" },
    });

    expect(input.value).toBe("CMP001");
  });

  test("opens add company modal", () => {
    render(
      <BrowserRouter>
        <CompanyTable />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText(/Add Company/i));

    expect(
      screen.getByText("Add Company Modal")
    ).toBeInTheDocument();
  });

  test("opens edit modal", () => {
    render(
      <BrowserRouter>
        <CompanyTable />
      </BrowserRouter>
    );

    const buttons = screen.getAllByRole("button");

    fireEvent.click(buttons[2]);

    expect(
      screen.getByText("Add Company Modal")
    ).toBeInTheDocument();
  });

  test("opens delete confirmation modal", () => {
    render(
      <BrowserRouter>
        <CompanyTable />
      </BrowserRouter>
    );

    const buttons = screen.getAllByRole("button");

    fireEvent.click(buttons[3]);

    expect(
      screen.getByText("Confirm Deletion")
    ).toBeInTheDocument();
  });

  test("confirm delete dispatches removeCompany", () => {
    render(
      <BrowserRouter>
        <CompanyTable />
      </BrowserRouter>
    );

    const buttons = screen.getAllByRole("button");

    fireEvent.click(buttons[3]);

    fireEvent.click(screen.getByText("Delete"));

    expect(dispatch).toHaveBeenCalledWith(removeCompany(1));
  });

  test("cancel delete closes modal", () => {
    render(
      <BrowserRouter>
        <CompanyTable />
      </BrowserRouter>
    );

    const buttons = screen.getAllByRole("button");

    fireEvent.click(buttons[3]);

    fireEvent.click(screen.getByText("Cancel"));

    expect(
      screen.queryByText("Confirm Deletion")
    ).not.toBeInTheDocument();
  });

  test("navigates to company details", () => {
    render(
      <BrowserRouter>
        <CompanyTable />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText("ⓘ"));

    expect(mockNavigate).toHaveBeenCalledWith(
      "/superadmin/view/1"
    );
  });

  test("opens email compose modal", () => {
    render(
      <BrowserRouter>
        <CompanyTable />
      </BrowserRouter>
    );

    const buttons = screen.getAllByRole("button");

    fireEvent.click(buttons[1]);

    expect(
      screen.getByText("Email Compose Modal")
    ).toBeInTheDocument();
  });

  test("pagination changes page", () => {
    render(
      <BrowserRouter>
        <CompanyTable />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText("2"));

    expect(dispatch).toHaveBeenCalled();
  });
});