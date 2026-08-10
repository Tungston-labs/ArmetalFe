import React from "react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";

import EditProfileModal from "../../Components/homepage/EditProfileModal";

/* =========================================================
   MOCKS SETUP
========================================================= */
const mocks = vi.hoisted(() => ({
  dispatch: vi.fn(),
  onClose: vi.fn(),
  getCompanySelf: vi.fn(() => ({ type: "company/getCompanySelf" })),
  patchCompanySelf: vi.fn((payload) => ({ type: "company/patchCompanySelf", payload })),
  swalFire: vi.fn(() => Promise.resolve()),
  createObjectURL: vi.fn(() => "blob:test-logo-url"),
}));

const companyData = {
  name: "Test Company",
  address: "123 Test Street",
  email: "test@example.com",
  location: "Kochi",
  country: "IN",
  contact_number: "+919876543210",
  latitude: 10,
  longitude: 76,
  logo: "https://example.com/logo.png",
};

vi.mock("react-redux", () => ({
  useDispatch: () => mocks.dispatch,
  useSelector: (selector) =>
    selector({
      company: {
        company: companyData,
        loading: false,
      },
    }),
}));

vi.mock("../../Redux/companySlice", () => ({
  getCompanySelf: mocks.getCompanySelf,
  patchCompanySelf: mocks.patchCompanySelf,
}));

vi.mock("sweetalert2", () => ({
  default: {
    fire: mocks.swalFire,
  },
}));

vi.mock("react-icons/go", () => ({
  GoArrowLeft: ({ onClick, ...props }) => (
    <button type="button" data-testid="back-button" onClick={onClick} {...props}>
      Back
    </button>
  ),
}));

vi.mock("react-icons/ai", () => ({
  AiOutlineClose: () => <span>X</span>,
}));

vi.mock("react-spinners", () => ({
  ClipLoader: (props) => (
    <span data-testid="clip-loader" {...props}>
      Loading
    </span>
  ),
}));

const renderComponent = (props = {}) =>
  render(<EditProfileModal onClose={mocks.onClose} {...props} />);

const getInput = (name) => document.querySelector(`input[name="${name}"]`);

/* =========================================================
   TEST SUITE
========================================================= */
describe("EditProfileModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mocks.dispatch.mockImplementation((action) => {
      if (action?.type === "company/getCompanySelf") {
        return Promise.resolve({
          type: "company/getCompanySelf/fulfilled",
          payload: companyData,
        });
      }

      if (action?.type === "company/patchCompanySelf") {
        return {
          unwrap: () => Promise.resolve({ success: true }),
        };
      }

      return Promise.resolve(action);
    });

    if (typeof window !== "undefined") {
      window.URL.createObjectURL = mocks.createObjectURL;
    }
    global.URL.createObjectURL = mocks.createObjectURL;
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("renders the company profile form completely", () => {
    renderComponent();
    expect(screen.getByText("Company Profile")).toBeInTheDocument();
    expect(screen.getByLabelText("Company Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Address")).toBeInTheDocument();
    expect(screen.getByLabelText("Location")).toBeInTheDocument();
    expect(screen.getByLabelText("Contact Number")).toBeInTheDocument();
    expect(screen.getByLabelText("Country")).toBeInTheDocument();
    expect(screen.getByLabelText("Latitude")).toBeInTheDocument();
    expect(screen.getByLabelText("Longitude")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Update/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Cancel/i })).toBeInTheDocument();
  });

  it("dispatches getCompanySelf on initial mount", () => {
    renderComponent();
    expect(mocks.getCompanySelf).toHaveBeenCalledTimes(1);
    expect(mocks.dispatch).toHaveBeenCalledWith({
      type: "company/getCompanySelf",
    });
  });

  it("loads existing company data into inputs", async () => {
    renderComponent();
    await waitFor(() => {
      expect(getInput("name")).toHaveValue("Test Company");
      expect(getInput("address")).toHaveValue("123 Test Street");
      expect(getInput("location")).toHaveValue("Kochi");
      expect(getInput("latitude")).toHaveValue(10);
      expect(getInput("longitude")).toHaveValue(76);
    });
  });

  it("loads existing company logo", async () => {
    renderComponent();
    const logoImage = await waitFor(() => {
      const img = screen.queryByAltText("company logo");
      expect(img).not.toBeNull();
      return img;
    });

    expect(logoImage).toHaveAttribute("src", companyData.logo);
  });

  it("handles valid logo upload (PNG/SVG)", async () => {
    renderComponent();

    const fileInput = screen.getByTestId("logo-file-input");
    const file = new File(["dummy content"], "logo.png", { type: "image/png" });

    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      const img = screen.getByAltText("company logo");
      expect(img).toHaveAttribute("src", "blob:test-logo-url");
    });
  });

  it("rejects invalid logo file types with alert", async () => {
    renderComponent();

    const fileInput = screen.getByTestId("logo-file-input");
    const invalidFile = new File(["dummy content"], "doc.pdf", { type: "application/pdf" });

    fireEvent.change(fileInput, { target: { files: [invalidFile] } });

    expect(mocks.swalFire).toHaveBeenCalledWith({
      icon: "error",
      title: "Invalid file type",
      text: "Only PNG or SVG files are allowed.",
      confirmButtonColor: "#3250B5",
    });
  });

  it("removes logo when remove button is clicked", async () => {
    renderComponent();

    const removeBtn = await waitFor(() => screen.getByTestId("remove-logo-button"));
    fireEvent.click(removeBtn);

    expect(screen.queryByAltText("company logo")).toBeNull();
  });

  it("validates empty form inputs on submit", async () => {
    renderComponent();

    fireEvent.change(getInput("name"), { target: { name: "name", value: "" } });
    fireEvent.change(getInput("address"), { target: { name: "address", value: "" } });
    fireEvent.change(getInput("location"), { target: { name: "location", value: "" } });
    fireEvent.change(getInput("latitude"), { target: { name: "latitude", value: "" } });
    fireEvent.change(getInput("longitude"), { target: { name: "longitude", value: "" } });

    fireEvent.submit(screen.getByRole("button", { name: /Update/i }));

    await waitFor(() => {
      expect(screen.getByText("Company name is required")).toBeInTheDocument();
      expect(screen.getByText("Address is required")).toBeInTheDocument();
      expect(screen.getByText("Location is required")).toBeInTheDocument();
      expect(screen.getByText("Latitude must be between -90 and 90")).toBeInTheDocument();
      expect(screen.getByText("Longitude must be between -180 and 180")).toBeInTheDocument();
    });

    expect(mocks.patchCompanySelf).not.toHaveBeenCalled();
  });

  it("submits updated form payload successfully", async () => {
    renderComponent();

    await waitFor(() => {
      expect(getInput("name")).toHaveValue("Test Company");
    });

    fireEvent.change(getInput("name"), { target: { name: "name", value: "Updated Corp" } });
    fireEvent.change(getInput("address"), { target: { name: "address", value: "456 New Road" } });
    fireEvent.change(getInput("location"), { target: { name: "location", value: "Mumbai" } });
    fireEvent.change(getInput("latitude"), { target: { name: "latitude", value: "19" } });
    fireEvent.change(getInput("longitude"), { target: { name: "longitude", value: "72" } });

    fireEvent.submit(screen.getByRole("button", { name: /Update/i }));

    await waitFor(() => {
      expect(mocks.patchCompanySelf).toHaveBeenCalledTimes(1);
    });

    expect(mocks.patchCompanySelf).toHaveBeenCalledWith({
      name: "Updated Corp",
      address: "456 New Road",
      location: "Mumbai",
      country: "IN",
      latitude: 19,
      longitude: 72,
      contact_number: "+919876543210",
      logo: null,
    });

    await waitFor(() => {
      expect(mocks.swalFire).toHaveBeenCalledWith({
        title: "Updated!",
        text: "Company profile updated successfully.",
        icon: "success",
        confirmButtonColor: "#3250B5",
      });
    });

    expect(mocks.onClose).toHaveBeenCalledTimes(1);
  });

  it("handles dispatch failure gracefully", async () => {
    mocks.dispatch.mockImplementation((action) => {
      if (action?.type === "company/patchCompanySelf") {
        return {
          unwrap: () => Promise.reject(new Error("Update failed")),
        };
      }
      return Promise.resolve(action);
    });

    renderComponent();

    fireEvent.submit(screen.getByRole("button", { name: /Update/i }));

    await waitFor(() => {
      expect(mocks.swalFire).toHaveBeenCalledWith({
        title: "Error!",
        text: "Failed to update company profile.",
        icon: "error",
        confirmButtonColor: "#D33",
      });
    });
  });

  it("closes modal on Cancel click", () => {
    renderComponent();
    fireEvent.click(screen.getByRole("button", { name: /Cancel/i }));
    expect(mocks.onClose).toHaveBeenCalledTimes(1);
  });

  it("closes modal on Back button click", () => {
    renderComponent();
    fireEvent.click(screen.getByTestId("back-button"));
    expect(mocks.onClose).toHaveBeenCalledTimes(1);
  });
});