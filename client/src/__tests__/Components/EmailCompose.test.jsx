import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from "@testing-library/react";
import "@testing-library/jest-dom";

import EmailCompose from "../../Components/superadmin/EmailCompose/EmailCompose";

describe("EmailCompose Component", () => {
  let onClose;
  let alertMock;
  let consoleLogMock;

  const company = {
    name: "ABC Technologies",
    email: "abc@example.com",
    expiry_date: "2026-12-31",
  };

  beforeEach(() => {
    onClose = vi.fn();

    alertMock = vi.spyOn(window, "alert").mockImplementation(() => {});

    consoleLogMock = vi.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  // --------------------------------------------------
  // 1. Basic rendering
  // --------------------------------------------------

  it("renders the compose email modal", () => {
    render(<EmailCompose company={company} onClose={onClose} />);

    expect(screen.getByText("New Message")).toBeInTheDocument();
    expect(screen.getByText("To")).toBeInTheDocument();
    expect(screen.getByText("Subject")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Send" })).toBeInTheDocument();
  });

  // --------------------------------------------------
  // 2. Renders empty values when company is not provided
  // --------------------------------------------------

  it("renders empty email fields when company is not provided", () => {
    render(<EmailCompose onClose={onClose} />);

    const emailInput = screen.getByPlaceholderText("Recipient Email");
    const subjectInput = screen.getByPlaceholderText("Enter Subject");
    const messageInput = screen.getByPlaceholderText("Write your message...");

    expect(emailInput).toHaveValue("");
    expect(subjectInput).toHaveValue("");
    expect(messageInput).toHaveValue("");
  });

  // --------------------------------------------------
  // 3. useEffect populates company information
  // --------------------------------------------------

  it("populates email data when company is provided", async () => {
    render(<EmailCompose company={company} onClose={onClose} />);

    const emailInput = screen.getByPlaceholderText("Recipient Email");
    const subjectInput = screen.getByPlaceholderText("Enter Subject");
    const messageInput = screen.getByPlaceholderText("Write your message...");

    await waitFor(() => {
      expect(emailInput).toHaveValue("abc@example.com");

      expect(subjectInput).toHaveValue(
        "Your Rekory HR Subscription is Expiring Soon",
      );

      expect(messageInput.value).toContain("Dear ABC Technologies");
    });
  });

  // --------------------------------------------------
  // 4. Message contains company name
  // --------------------------------------------------

  it("includes company name in the generated message", async () => {
    render(<EmailCompose company={company} onClose={onClose} />);

    const messageInput = screen.getByPlaceholderText("Write your message...");

    await waitFor(() => {
      expect(messageInput.value).toContain("Company Name : ABC Technologies");
    });
  });

  // --------------------------------------------------
  // 5. Message contains expiry date
  // --------------------------------------------------

  it("includes expiry date in the generated message", async () => {
    render(<EmailCompose company={company} onClose={onClose} />);

    const messageInput = screen.getByPlaceholderText("Write your message...");

    await waitFor(() => {
      expect(messageInput.value).toContain("Expiry Date   : 2026-12-31");
    });
  });

  // --------------------------------------------------
  // 6. Handles company without email
  // --------------------------------------------------

  it("uses empty email when company email is missing", async () => {
    const companyWithoutEmail = {
      name: "XYZ Company",
      expiry_date: "2026-11-30",
    };

    render(<EmailCompose company={companyWithoutEmail} onClose={onClose} />);

    const emailInput = screen.getByPlaceholderText("Recipient Email");

    await waitFor(() => {
      expect(emailInput).toHaveValue("");
    });
  });

  // --------------------------------------------------
  // 7. Handles company with missing name
  // --------------------------------------------------

  it("handles company with missing name", async () => {
    const companyWithoutName = {
      email: "test@example.com",
      expiry_date: "2026-11-30",
    };

    render(<EmailCompose company={companyWithoutName} onClose={onClose} />);

    const messageInput = screen.getByPlaceholderText("Write your message...");

    await waitFor(() => {
      expect(messageInput.value).toContain("Dear undefined");
    });
  });

  // --------------------------------------------------
  // 8. Handles company with missing expiry date
  // --------------------------------------------------

  it("handles company with missing expiry date", async () => {
    const companyWithoutExpiry = {
      name: "Test Company",
      email: "test@example.com",
    };

    render(<EmailCompose company={companyWithoutExpiry} onClose={onClose} />);

    const messageInput = screen.getByPlaceholderText("Write your message...");

    await waitFor(() => {
      expect(messageInput.value).toContain("Expiry Date   : undefined");
    });
  });

  // --------------------------------------------------
  // 9. Handles email input change
  // --------------------------------------------------

  it("updates recipient email when email input changes", async () => {
    render(<EmailCompose company={company} onClose={onClose} />);

    const emailInput = screen.getByPlaceholderText("Recipient Email");

    await waitFor(() => {
      expect(emailInput).toHaveValue("abc@example.com");
    });

    fireEvent.change(emailInput, {
      target: {
        name: "to",
        value: "new@example.com",
      },
    });

    expect(emailInput).toHaveValue("new@example.com");
  });

  // --------------------------------------------------
  // 10. Handles subject input change
  // --------------------------------------------------

  it("updates subject when subject input changes", async () => {
    render(<EmailCompose company={company} onClose={onClose} />);

    const subjectInput = screen.getByPlaceholderText("Enter Subject");

    await waitFor(() => {
      expect(subjectInput).toHaveValue(
        "Your Rekory HR Subscription is Expiring Soon",
      );
    });

    fireEvent.change(subjectInput, {
      target: {
        name: "subject",
        value: "New Subject",
      },
    });

    expect(subjectInput).toHaveValue("New Subject");
  });

  // --------------------------------------------------
  // 11. Handles message change
  // --------------------------------------------------

  it("updates message when textarea changes", async () => {
    render(<EmailCompose company={company} onClose={onClose} />);

    const messageInput = screen.getByPlaceholderText("Write your message...");

    fireEvent.change(messageInput, {
      target: {
        name: "message",
        value: "This is a test email message.",
      },
    });

    expect(messageInput).toHaveValue("This is a test email message.");
  });

  // --------------------------------------------------
  // 12. Handles multiple input changes
  // --------------------------------------------------

  it("handles changes to all email fields", async () => {
    render(<EmailCompose company={company} onClose={onClose} />);

    const emailInput = screen.getByPlaceholderText("Recipient Email");
    const subjectInput = screen.getByPlaceholderText("Enter Subject");
    const messageInput = screen.getByPlaceholderText("Write your message...");

    fireEvent.change(emailInput, {
      target: {
        name: "to",
        value: "changed@example.com",
      },
    });

    fireEvent.change(subjectInput, {
      target: {
        name: "subject",
        value: "Updated Subject",
      },
    });

    fireEvent.change(messageInput, {
      target: {
        name: "message",
        value: "Updated message",
      },
    });

    expect(emailInput).toHaveValue("changed@example.com");
    expect(subjectInput).toHaveValue("Updated Subject");
    expect(messageInput).toHaveValue("Updated message");
  });

  // --------------------------------------------------
  // 13. Close button
  // --------------------------------------------------

  it("calls onClose when close button is clicked", () => {
    render(<EmailCompose company={company} onClose={onClose} />);

    const buttons = screen.getAllByRole("button");

    // Close button is the first button
    fireEvent.click(buttons[0]);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  // --------------------------------------------------
  // 14. Send button
  // --------------------------------------------------

  it("calls alert when Send button is clicked", async () => {
    render(<EmailCompose company={company} onClose={onClose} />);

    const sendButton = screen.getByRole("button", {
      name: "Send",
    });

    fireEvent.click(sendButton);

    expect(alertMock).toHaveBeenCalledWith("Email sent successfully!");
  });

  // --------------------------------------------------
  // 15. Send button calls onClose
  // --------------------------------------------------

  it("calls onClose after sending the email", () => {
    render(<EmailCompose company={company} onClose={onClose} />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Send",
      }),
    );

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  // --------------------------------------------------
  // 16. Logs correct payload
  // --------------------------------------------------

  it("logs the correct email payload when sending", async () => {
    render(<EmailCompose company={company} onClose={onClose} />);

    const emailInput = screen.getByPlaceholderText("Recipient Email");
    const subjectInput = screen.getByPlaceholderText("Enter Subject");
    const messageInput = screen.getByPlaceholderText("Write your message...");

    fireEvent.change(emailInput, {
      target: {
        name: "to",
        value: "recipient@example.com",
      },
    });

    fireEvent.change(subjectInput, {
      target: {
        name: "subject",
        value: "Test Subject",
      },
    });

    fireEvent.change(messageInput, {
      target: {
        name: "message",
        value: "Test Message",
      },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Send",
      }),
    );

    expect(consoleLogMock).toHaveBeenCalledWith("Email Payload:", {
      email: "recipient@example.com",
      subject: "Test Subject",
      message: "Test Message",
    });
  });

  // --------------------------------------------------
  // 17. Send with default/empty values
  // --------------------------------------------------

  it("can send email when company is not provided", () => {
    render(<EmailCompose onClose={onClose} />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Send",
      }),
    );

    expect(consoleLogMock).toHaveBeenCalledWith("Email Payload:", {
      email: "",
      subject: "",
      message: "",
    });

    expect(alertMock).toHaveBeenCalledWith("Email sent successfully!");

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  // --------------------------------------------------
  // 18. Updates data when company changes
  // --------------------------------------------------

  it("updates email fields when company prop changes", async () => {
    const { rerender } = render(
      <EmailCompose company={company} onClose={onClose} />,
    );

    const newCompany = {
      name: "New Company",
      email: "new@example.com",
      expiry_date: "2027-01-15",
    };

    rerender(<EmailCompose company={newCompany} onClose={onClose} />);

    const emailInput = screen.getByPlaceholderText("Recipient Email");
    const subjectInput = screen.getByPlaceholderText("Enter Subject");
    const messageInput = screen.getByPlaceholderText("Write your message...");

    await waitFor(() => {
      expect(emailInput).toHaveValue("new@example.com");

      expect(subjectInput).toHaveValue(
        "Your Rekory HR Subscription is Expiring Soon",
      );

      expect(messageInput.value).toContain("New Company");

      expect(messageInput.value).toContain("2027-01-15");
    });
  });

  // --------------------------------------------------
  // 19. Company with null email
  // --------------------------------------------------

  it("uses empty string when company email is null", async () => {
    const companyWithNullEmail = {
      name: "Null Email Company",
      email: null,
      expiry_date: "2026-12-20",
    };

    render(<EmailCompose company={companyWithNullEmail} onClose={onClose} />);

    const emailInput = screen.getByPlaceholderText("Recipient Email");

    await waitFor(() => {
      expect(emailInput).toHaveValue("");
    });
  });

  // --------------------------------------------------
  // 20. Company with empty email
  // --------------------------------------------------

  it("uses empty string when company email is empty", async () => {
    const companyWithEmptyEmail = {
      name: "Empty Email Company",
      email: "",
      expiry_date: "2026-12-20",
    };

    render(<EmailCompose company={companyWithEmptyEmail} onClose={onClose} />);

    const emailInput = screen.getByPlaceholderText("Recipient Email");

    await waitFor(() => {
      expect(emailInput).toHaveValue("");
    });
  });
});
