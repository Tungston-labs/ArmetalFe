import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import AddCompany from "../../Pages/superAdmin/AddCompany/AddCompany";
import { addCompany, editCompany, getCompanyById, clearSelectedCompany } from "../../Redux/companySlice";
import Swal from "sweetalert2";

// Mocks
vi.mock("react-redux", () => ({
  useDispatch: vi.fn(),
  useSelector: vi.fn(),
}));

vi.mock("../../Redux/companySlice", () => ({
  addCompany: vi.fn(),
  editCompany: vi.fn(),
  getCompanyById: vi.fn(),
  clearSelectedCompany: vi.fn(),
}));

vi.mock("sweetalert2", () => ({
  default: {
    fire: vi.fn(),
  },
}));

vi.mock("../../Components/Loader/Loader", () => ({
  default: () => <div data-testid="loader">Loading...</div>,
}));

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ id: undefined }),
  };
});

describe("AddCompany", () => {
  const mockDispatch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useDispatch.mockReturnValue(mockDispatch);
    mockDispatch.mockImplementation(() => ({
      unwrap: () => Promise.resolve({})
    }));
    useSelector.mockReturnValue({
      selectedCompany: null,
      loading: false,
      success: false,
      error: null,
    });
    
    // Mock URL.createObjectURL since it is used on file upload
    global.URL.createObjectURL = vi.fn().mockReturnValue("blob:http://localhost/mock-logo-url");
  });

  const renderWithRouter = (path = "/addcompany", routePath = "/addcompany") =>
    render(
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path={routePath} element={<AddCompany />} />
        </Routes>
      </MemoryRouter>
    );

  test("renders Add Company form with fields", () => {
    renderWithRouter();

    expect(screen.getByText("Add Company")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter company name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter location")).toBeInTheDocument();
  });

  test("form displays both HR and Finance modules and their features", () => {
    renderWithRouter();

    // Verify HR features checkbox is checked and visible
    expect(screen.getByText("EMPLOYEE")).toBeInTheDocument();
    expect(screen.getByText("DASHBOARD")).toBeInTheDocument();

    // Verify Finance card is present
    expect(screen.getByText("Finance Module")).toBeInTheDocument();
  });

  test("validation errors are shown for required fields when submitting empty", async () => {
    renderWithRouter();

    const submitBtn = screen.getByText("SAVE COMPANY");
    fireEvent.click(submitBtn);

    expect(await screen.findByText("Company name is required")).toBeInTheDocument();
    expect(screen.getByText("Email is required")).toBeInTheDocument();
    expect(screen.getByText("Address is required")).toBeInTheDocument();
    expect(screen.getByText("Location is required")).toBeInTheDocument();
    expect(screen.getByText("Company logo is required")).toBeInTheDocument();
    expect(screen.getByText("Contact number is required")).toBeInTheDocument();
  });

  test("submitting a valid form dispatches addCompany", async () => {
    addCompany.mockReturnValue({ type: "company/addCompany" });

    renderWithRouter();

    // 1. Fill basic details
    fireEvent.change(screen.getByPlaceholderText("Enter company name"), { target: { value: "Tesla" } });
    fireEvent.change(screen.getByPlaceholderText("Enter Email"), { target: { value: "tesla@tesla.com" } });
    fireEvent.change(screen.getByPlaceholderText("Enter company address"), { target: { value: "123 Main St" } });
    fireEvent.change(screen.getByPlaceholderText("Enter location"), { target: { value: "Austin" } });
    
    // 2. Select country & currency
    fireEvent.change(document.querySelector('select[name="country"]'), { target: { value: "AE" } });
    fireEvent.change(document.querySelector('select[name="currency"]'), { target: { value: "AED" } });
    
    // 3. Contact & Location coords
    fireEvent.change(screen.getByPlaceholderText("Phone number"), { target: { value: "501234567" } });
    fireEvent.change(screen.getByPlaceholderText("Enter Latitude"), { target: { value: "30.2672" } });
    fireEvent.change(screen.getByPlaceholderText("Enter Longitude"), { target: { value: "-97.7431" } });
    
    // 4. Subscription & Advance Info
    fireEvent.change(screen.getByPlaceholderText("Enter amount"), { target: { value: "10" } });
    fireEvent.change(screen.getByPlaceholderText("Enter initial advance"), { target: { value: "500" } });

    // 5. Upload Logo
    const file = new File(["dummy logo"], "logo.png", { type: "image/png" });
    const logoInput = document.querySelector('input[type="file"]');
    fireEvent.change(logoInput, { target: { files: [file] } });

    // 6. Salary structure (Must total 100%)
    fireEvent.change(screen.getByPlaceholderText("Basic"), { target: { value: "50" } });
    fireEvent.change(screen.getByPlaceholderText("HRA"), { target: { value: "20" } });
    fireEvent.change(screen.getByPlaceholderText("Transport"), { target: { value: "20" } });
    fireEvent.change(screen.getByPlaceholderText("Special"), { target: { value: "10" } });

    // 7. Shift Info
    fireEvent.change(screen.getByPlaceholderText("e.g. 8"), { target: { value: "8" } });
    fireEvent.change(screen.getByPlaceholderText("e.g. 4"), { target: { value: "4" } });

    // Submit
    const submitBtn = screen.getByText("SAVE COMPANY");
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalled();
    });
  });
});
