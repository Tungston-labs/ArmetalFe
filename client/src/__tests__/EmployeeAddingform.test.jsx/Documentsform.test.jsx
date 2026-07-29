import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import DocumentUploadForm from "./DocumentUploadForm";

jest.mock("../../assets/employeeicon.svg", () => "employee-icon.svg");

jest.mock("react-redux", () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));

jest.mock("../../Components/Multistep", () => () => <div data-testid="multistep" />);
jest.mock("../../Components/Loader", () => () => <div data-testid="loader">Loading...</div>);
jest.mock("../../Components/Succes", () => (props) => (
  <div data-testid="success-modal">
    <button onClick={props.onClose}>Close</button>
  </div>
));

const mockDispatch = jest.fn();
const mockNavigate = jest.fn();

beforeAll(() => {
  global.URL.createObjectURL = jest.fn(() => "blob:mock-url");
  global.URL.revokeObjectURL = jest.fn();
  window.alert = jest.fn();
});

beforeEach(() => {
  jest.clearAllMocks();
  useDispatch.mockReturnValue(mockDispatch);
  useNavigate.mockReturnValue(mockNavigate);
  useSelector.mockImplementation((selectorFn) =>
    selectorFn({
      employee: {
        employeeId: 42,
        documentUrls: {
          passport: [],
          workPermit: [],
          contract: [],
          insurance: [],
          certificate: [],
        },
      },
    })
  );

  // uploadImageThunk / submitDocumentsThunk are createAsyncThunk calls (functions)
  // chained with .unwrap(); addDocumentUrl is a plain action creator.
  mockDispatch.mockImplementation((action) => {
    if (typeof action === "function") {
      return { unwrap: () => Promise.resolve("https://cdn.example.com/uploaded.png") };
    }
    return action;
  });
});

describe("DocumentUploadForm", () => {
  test("renders all upload sections", () => {
    render(<DocumentUploadForm />);
    expect(screen.getByText(/passport-front \/ passport-back/i)).toBeInTheDocument();
    expect(screen.getByText(/work permit/i)).toBeInTheDocument();
    expect(screen.getByText(/employment contract/i)).toBeInTheDocument();
    expect(screen.getByText(/^insurance$/i)).toBeInTheDocument();
    expect(screen.getByText(/^certificate$/i)).toBeInTheDocument();
  });

  test("rejects a file larger than 1 MB", () => {
    render(<DocumentUploadForm />);
    const bigFile = new File([new ArrayBuffer(2 * 1024 * 1024)], "big.png", {
      type: "image/png",
    });
    const passportInput = document.querySelectorAll('input[type="file"]')[0];
    fireEvent.change(passportInput, { target: { files: [bigFile] } });
    expect(screen.getByText(/each image must be smaller than 1 mb/i)).toBeInTheDocument();
  });

  test("rejects a non-image file", () => {
    render(<DocumentUploadForm />);
    const badFile = new File(["x"], "resume.pdf", { type: "application/pdf" });
    const passportInput = document.querySelectorAll('input[type="file"]')[0];
    fireEvent.change(passportInput, { target: { files: [badFile] } });
    expect(screen.getByText(/only image files are allowed/i)).toBeInTheDocument();
  });

  test("shows a preview for a selected image and allows removing it before upload", () => {
    render(<DocumentUploadForm />);
    const goodFile = new File(["x"], "front.png", { type: "image/png" });
    const passportInput = document.querySelectorAll('input[type="file"]')[0];
    fireEvent.change(passportInput, { target: { files: [goodFile] } });

    expect(screen.getByAltText(/preview/i)).toBeInTheDocument();

    const deleteIcon = document.querySelector("svg");
    fireEvent.click(deleteIcon);

    expect(screen.queryByAltText(/preview/i)).not.toBeInTheDocument();
  });

  test("submits selected files, uploads them, and shows the success modal", async () => {
    render(<DocumentUploadForm />);
    const goodFile = new File(["x"], "front.png", { type: "image/png" });
    const passportInput = document.querySelectorAll('input[type="file"]')[0];
    fireEvent.change(passportInput, { target: { files: [goodFile] } });

    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByTestId("success-modal")).toBeInTheDocument();
    });
  });

  test("shows an alert if the final submission fails", async () => {
    mockDispatch.mockImplementation((action) => {
      if (typeof action === "function") {
        return { unwrap: () => Promise.reject(new Error("Network error")) };
      }
      return action;
    });

    render(<DocumentUploadForm />);
    const goodFile = new File(["x"], "front.png", { type: "image/png" });
    const passportInput = document.querySelectorAll('input[type="file"]')[0];
    fireEvent.change(passportInput, { target: { files: [goodFile] } });

    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(expect.stringContaining("Final submission failed"));
    });
  });
}); 