import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

import MailModal from "../../Pages/employeDashboard/MailModal";

import { sendEmail } from "../../services/employeeService";
import Swal from "sweetalert2";

/* =========================================================
   MOCKS
========================================================= */

vi.mock("../../services/employeeService", () => ({
  sendEmail: vi.fn(),
}));

vi.mock("sweetalert2", () => ({
  default: {
    fire: vi.fn(),
    showLoading: vi.fn(),
  },
}));

/* =========================================================
   TEST DATA
========================================================= */

const employee = {
  email: "employee@example.com",
};

describe("MailModal", () => {
  let onClose;

  beforeEach(() => {
    onClose = vi.fn();

    vi.clearAllMocks();

    sendEmail.mockResolvedValue({
      success: true,
    });

    Swal.fire.mockImplementation(() => Promise.resolve());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  /* =========================================================
     CLOSED MODAL
  ========================================================= */

  it("returns null when modal is closed", () => {
    const { container } = render(
      <MailModal isOpen={false} onClose={onClose} employee={employee} />,
    );

    expect(container.firstChild).toBeNull();
  });

  /* =========================================================
     OPEN MODAL
  ========================================================= */

  it("renders the modal when isOpen is true", () => {
    render(<MailModal isOpen={true} onClose={onClose} employee={employee} />);

    expect(screen.getByText("New Message")).toBeInTheDocument();

    expect(screen.getByText("To")).toBeInTheDocument();

    expect(screen.getByText("Subject")).toBeInTheDocument();

    expect(screen.getByPlaceholderText("Enter subject")).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText("Write your message......"),
    ).toBeInTheDocument();

    expect(screen.getByRole("button", { name: "Send" })).toBeInTheDocument();
  });

  /* =========================================================
     EMPLOYEE EMAIL
  ========================================================= */

  it("prefills the employee email", () => {
    render(<MailModal isOpen={true} onClose={onClose} employee={employee} />);

    const emailInput = screen.getByDisplayValue("employee@example.com");

    expect(emailInput).toBeInTheDocument();
    expect(emailInput).toHaveValue("employee@example.com");
  });

  /* =========================================================
     NO EMPLOYEE EMAIL
  ========================================================= */

  it("renders an empty email when employee email is missing", () => {
    render(<MailModal isOpen={true} onClose={onClose} employee={{}} />);

    const inputs = screen.getAllByRole("textbox");

    expect(inputs[0]).toHaveValue("");
  });

  it("renders an empty email when employee is not provided", () => {
    render(<MailModal isOpen={true} onClose={onClose} />);

    const inputs = screen.getAllByRole("textbox");

    expect(inputs[0]).toHaveValue("");
  });

  /* =========================================================
     INPUT CHANGES
  ========================================================= */

  it("updates the subject field when user types", () => {
    render(<MailModal isOpen={true} onClose={onClose} employee={employee} />);

    const subjectInput = screen.getByPlaceholderText("Enter subject");

    fireEvent.change(subjectInput, {
      target: {
        name: "subject",
        value: "Important Update",
      },
    });

    expect(subjectInput).toHaveValue("Important Update");
  });

  it("updates the body field when user types", () => {
    render(<MailModal isOpen={true} onClose={onClose} employee={employee} />);

    const bodyInput = screen.getByPlaceholderText("Write your message......");

    fireEvent.change(bodyInput, {
      target: {
        name: "body",
        value: "Hello, this is an important message.",
      },
    });

    expect(bodyInput).toHaveValue("Hello, this is an important message.");
  });

  it("updates the email field when user changes it", () => {
    render(<MailModal isOpen={true} onClose={onClose} employee={employee} />);

    const emailInput = screen.getByDisplayValue("employee@example.com");

    fireEvent.change(emailInput, {
      target: {
        name: "to",
        value: "newemployee@example.com",
      },
    });

    expect(emailInput).toHaveValue("newemployee@example.com");
  });

  /* =========================================================
     VALIDATION
  ========================================================= */

  it("shows warning when required fields are empty", async () => {
    render(<MailModal isOpen={true} onClose={onClose} employee={{}} />);

    fireEvent.click(screen.getByRole("button", { name: "Send" }));

    expect(Swal.fire).toHaveBeenCalledWith({
      icon: "warning",
      title: "Missing fields",
      text: "Please fill all fields!",
      confirmButtonColor: "#2563eb",
    });

    expect(sendEmail).not.toHaveBeenCalled();
  });

  it("does not send email when subject is empty", () => {
    render(<MailModal isOpen={true} onClose={onClose} employee={employee} />);

    const bodyInput = screen.getByPlaceholderText("Write your message......");

    fireEvent.change(bodyInput, {
      target: {
        name: "body",
        value: "Message body",
      },
    });

    fireEvent.click(screen.getByRole("button", { name: "Send" }));

    expect(sendEmail).not.toHaveBeenCalled();

    expect(Swal.fire).toHaveBeenCalledWith(
      expect.objectContaining({
        icon: "warning",
        title: "Missing fields",
      }),
    );
  });

  it("does not send email when body is empty", () => {
    render(<MailModal isOpen={true} onClose={onClose} employee={employee} />);

    const subjectInput = screen.getByPlaceholderText("Enter subject");

    fireEvent.change(subjectInput, {
      target: {
        name: "subject",
        value: "Test Subject",
      },
    });

    fireEvent.click(screen.getByRole("button", { name: "Send" }));

    expect(sendEmail).not.toHaveBeenCalled();

    expect(Swal.fire).toHaveBeenCalledWith(
      expect.objectContaining({
        icon: "warning",
        title: "Missing fields",
      }),
    );
  });

  /* =========================================================
     SUCCESSFUL SEND
  ========================================================= */

  it("sends email successfully when all fields are filled", async () => {
    render(<MailModal isOpen={true} onClose={onClose} employee={employee} />);

    const subjectInput = screen.getByPlaceholderText("Enter subject");

    const bodyInput = screen.getByPlaceholderText("Write your message......");

    fireEvent.change(subjectInput, {
      target: {
        name: "subject",
        value: "Test Subject",
      },
    });

    fireEvent.change(bodyInput, {
      target: {
        name: "body",
        value: "Test message body",
      },
    });

    fireEvent.click(screen.getByRole("button", { name: "Send" }));

    await waitFor(() => {
      expect(sendEmail).toHaveBeenCalledTimes(1);
    });

    expect(sendEmail).toHaveBeenCalledWith({
      to: "employee@example.com",
      subject: "Test Subject",
      body: "Test message body",
    });

    expect(Swal.fire).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Sending email...",
        text: "Please wait",
        allowOutsideClick: false,
      }),
    );

    expect(Swal.fire).toHaveBeenCalledWith(
      expect.objectContaining({
        icon: "success",
        title: "Sent!",
        text: "Email sent successfully",
      }),
    );

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  /* =========================================================
     LOADING STATE
  ========================================================= */

  it("shows Sending while email is being sent", async () => {
    let resolveRequest;

    sendEmail.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveRequest = resolve;
        }),
    );

    render(<MailModal isOpen={true} onClose={onClose} employee={employee} />);

    fireEvent.change(screen.getByPlaceholderText("Enter subject"), {
      target: {
        name: "subject",
        value: "Test",
      },
    });

    fireEvent.change(screen.getByPlaceholderText("Write your message......"), {
      target: {
        name: "body",
        value: "Test body",
      },
    });

    fireEvent.click(screen.getByRole("button", { name: "Send" }));

    await waitFor(() => {
      expect(
        screen.getByRole("button", {
          name: "Sending...",
        }),
      ).toBeDisabled();
    });

    resolveRequest({ success: true });

    await waitFor(() => {
      expect(onClose).toHaveBeenCalled();
    });
  });

  /* =========================================================
     FAILED SEND
  ========================================================= */

  it("shows error when sendEmail fails", async () => {
    sendEmail.mockRejectedValue(new Error("Network error"));

    render(<MailModal isOpen={true} onClose={onClose} employee={employee} />);

    fireEvent.change(screen.getByPlaceholderText("Enter subject"), {
      target: {
        name: "subject",
        value: "Test Subject",
      },
    });

    fireEvent.change(screen.getByPlaceholderText("Write your message......"), {
      target: {
        name: "body",
        value: "Test body",
      },
    });

    fireEvent.click(screen.getByRole("button", { name: "Send" }));

    await waitFor(() => {
      expect(sendEmail).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith({
        icon: "error",
        title: "Failed",
        text: "Failed to send email!",
        confirmButtonColor: "#dc2626",
      });
    });

    expect(onClose).not.toHaveBeenCalled();
  });

  /* =========================================================
     CLOSE BUTTON
  ========================================================= */

  it("calls onClose when close button is clicked", () => {
    render(<MailModal isOpen={true} onClose={onClose} employee={employee} />);

    fireEvent.click(screen.getByRole("button", { name: "✕" }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  /* =========================================================
     OVERLAY CLICK
  ========================================================= */

  it("calls onClose when modal overlay is clicked", () => {
    const { container } = render(
      <MailModal isOpen={true} onClose={onClose} employee={employee} />,
    );

    const overlay = container.firstChild;

    fireEvent.click(overlay);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  /* =========================================================
     MODAL BOX CLICK
  ========================================================= */

  it("does not close when clicking inside the modal box", () => {
    render(<MailModal isOpen={true} onClose={onClose} employee={employee} />);

    fireEvent.click(screen.getByText("New Message"));

    expect(onClose).not.toHaveBeenCalled();
  });

  /* =========================================================
     RESET WHEN MODAL OPENS
  ========================================================= */

  it("resets the form when the modal is reopened", async () => {
    const { rerender } = render(
      <MailModal isOpen={true} onClose={onClose} employee={employee} />,
    );

    const subjectInput = screen.getByPlaceholderText("Enter subject");

    fireEvent.change(subjectInput, {
      target: {
        name: "subject",
        value: "Old Subject",
      },
    });

    expect(subjectInput).toHaveValue("Old Subject");

    rerender(
      <MailModal isOpen={false} onClose={onClose} employee={employee} />,
    );

    rerender(<MailModal isOpen={true} onClose={onClose} employee={employee} />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText("Enter subject")).toHaveValue("");
    });

    expect(
      screen.getByDisplayValue("employee@example.com"),
    ).toBeInTheDocument();
  });

  /* =========================================================
     RESET WHEN EMPLOYEE CHANGES
  ========================================================= */

  it("resets the form when employee changes", async () => {
    const { rerender } = render(
      <MailModal
        isOpen={true}
        onClose={onClose}
        employee={{
          email: "first@example.com",
        }}
      />,
    );

    const subjectInput = screen.getByPlaceholderText("Enter subject");

    fireEvent.change(subjectInput, {
      target: {
        name: "subject",
        value: "Old Subject",
      },
    });

    rerender(
      <MailModal
        isOpen={true}
        onClose={onClose}
        employee={{
          email: "second@example.com",
        }}
      />,
    );

    await waitFor(() => {
      expect(
        screen.getByDisplayValue("second@example.com"),
      ).toBeInTheDocument();
    });

    expect(screen.getByPlaceholderText("Enter subject")).toHaveValue("");
  });
});
