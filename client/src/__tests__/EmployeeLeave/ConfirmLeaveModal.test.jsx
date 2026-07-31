import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useNavigate } from "react-router-dom";
import ConfirmLeaveModal from "../../Components/ConfirmLeaveModal";

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useNavigate: vi.fn() };
});

describe("ConfirmLeaveModal", () => {
  const onConfirm = vi.fn();
  const onClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useNavigate.mockReturnValue(vi.fn());
  });

  test("renders nothing when show is false", () => {
    const { container } = render(
      <ConfirmLeaveModal show={false} leaveId={1} onConfirm={onConfirm} onClose={onClose} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  test("renders nothing when leaveId is missing, even if show is true", () => {
    const { container } = render(
      <ConfirmLeaveModal show={true} leaveId={null} onConfirm={onConfirm} onClose={onClose} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  test("renders the confirmation message when show is true and leaveId is present", () => {
    render(
      <ConfirmLeaveModal show={true} leaveId={7} onConfirm={onConfirm} onClose={onClose} />
    );
    expect(screen.getByText(/are you sure you want to/i)).toBeInTheDocument();
  });

  test("shows 'Approve leave' text by default (no actionType passed)", () => {
    render(
      <ConfirmLeaveModal show={true} leaveId={7} onConfirm={onConfirm} onClose={onClose} />
    );
    expect(screen.getByText(/approve leave/i)).toBeInTheDocument();
  });

  test("shows 'Approve leave' text when actionType is 'approve'", () => {
    render(
      <ConfirmLeaveModal
        show={true}
        leaveId={7}
        actionType="approve"
        onConfirm={onConfirm}
        onClose={onClose}
      />
    );
    expect(screen.getByText(/approve leave/i)).toBeInTheDocument();
  });

  test("shows 'Reject leave' text when actionType is 'reject'", () => {
    render(
      <ConfirmLeaveModal
        show={true}
        leaveId={7}
        actionType="reject"
        onConfirm={onConfirm}
        onClose={onClose}
      />
    );
    expect(screen.getByText(/reject leave/i)).toBeInTheDocument();
  });

  test("shows 'Reject leave' text when actionType is 'rejected'", () => {
    render(
      <ConfirmLeaveModal
        show={true}
        leaveId={7}
        actionType="rejected"
        onConfirm={onConfirm}
        onClose={onClose}
      />
    );
    expect(screen.getByText(/reject leave/i)).toBeInTheDocument();
  });

  test("shows 'Approve leave' text for any other unrecognized actionType", () => {
    render(
      <ConfirmLeaveModal
        show={true}
        leaveId={7}
        actionType="something-else"
        onConfirm={onConfirm}
        onClose={onClose}
      />
    );
    expect(screen.getByText(/approve leave/i)).toBeInTheDocument();
  });

  test("clicking Cancel calls onClose", () => {
    render(
      <ConfirmLeaveModal show={true} leaveId={7} onConfirm={onConfirm} onClose={onClose} />
    );
    fireEvent.click(screen.getByText("Cancel"));
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onConfirm).not.toHaveBeenCalled();
  });

  test("clicking Yes calls onConfirm", async () => {
    onConfirm.mockResolvedValueOnce();
    render(
      <ConfirmLeaveModal show={true} leaveId={7} onConfirm={onConfirm} onClose={onClose} />
    );
    fireEvent.click(screen.getByText("Yes"));
    await waitFor(() => {
      expect(onConfirm).toHaveBeenCalledTimes(1);
    });
  });

  test("shows 'Processing...' and disables both buttons while onConfirm is in flight", async () => {
    let resolveConfirm;
    onConfirm.mockReturnValueOnce(
      new Promise((resolve) => {
        resolveConfirm = resolve;
      })
    );

    render(
      <ConfirmLeaveModal show={true} leaveId={7} onConfirm={onConfirm} onClose={onClose} />
    );

    fireEvent.click(screen.getByText("Yes"));

    expect(screen.getByText(/processing\.\.\./i)).toBeInTheDocument();
    expect(screen.getByText(/processing\.\.\./i)).toBeDisabled();
    expect(screen.getByText("Cancel")).toBeDisabled();

    resolveConfirm();
    await waitFor(() => {
      expect(screen.queryByText(/processing\.\.\./i)).not.toBeInTheDocument();
    });
    expect(screen.getByText("Yes")).toBeInTheDocument();
  });

  test("re-enables buttons after the confirm action completes", async () => {
    onConfirm.mockResolvedValueOnce();
    render(
      <ConfirmLeaveModal show={true} leaveId={7} onConfirm={onConfirm} onClose={onClose} />
    );

    fireEvent.click(screen.getByText("Yes"));

    await waitFor(() => {
      expect(screen.getByText("Yes")).not.toBeDisabled();
    });
    expect(screen.getByText("Cancel")).not.toBeDisabled();
  });
});