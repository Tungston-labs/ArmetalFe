import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import EditProjectModal from "../../Components/EditProjectModal";

describe("EditProjectModal", () => {
  const onClose = vi.fn();
  const onSave = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders nothing when isOpen is false", () => {
    const { container } = render(
      <EditProjectModal isOpen={false} onClose={onClose} onSave={onSave} projectData={null} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  test("renders the form when isOpen is true with no projectData", () => {
    render(<EditProjectModal isOpen={true} onClose={onClose} onSave={onSave} projectData={null} />);
    expect(screen.getByText("Edit Field")).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/project name/i)).toHaveValue("");
  });

  test("prefills the form from projectData, normalizing 'On Site' punch type", () => {
    render(
      <EditProjectModal
        isOpen={true}
        onClose={onClose}
        onSave={onSave}
        projectData={{
          projectName: "HQ",
          punchInType: "On Site",
          latitude: "12.34",
          longitude: "56.78",
          status: "completed",
        }}
      />
    );
    expect(screen.getByPlaceholderText(/project name/i)).toHaveValue("HQ");
    expect(screen.getByPlaceholderText(/enter latitude/i)).toHaveValue("12.34");
    expect(screen.getByPlaceholderText(/enter longitude/i)).toHaveValue("56.78");
    expect(document.querySelectorAll("select")[0]).toHaveValue("on_site");
    expect(document.querySelectorAll("select")[1]).toHaveValue("completed");
  });

  test("normalizes 'variant' and 'bench' punch types on prefill", () => {
    const { rerender } = render(
      <EditProjectModal
        isOpen={true}
        onClose={onClose}
        onSave={onSave}
        projectData={{ projectName: "A", punchInType: "Variant", status: "in_progress" }}
      />
    );
    expect(document.querySelectorAll("select")[0]).toHaveValue("variant");

    rerender(
      <EditProjectModal
        isOpen={true}
        onClose={onClose}
        onSave={onSave}
        projectData={{ projectName: "B", punchInType: "Bench", status: "in_progress" }}
      />
    );
    expect(document.querySelectorAll("select")[0]).toHaveValue("bench");
  });

  // NEW: closes the branch gap on lines 46-47 — punchType that matches none of
  // the three normalization checks should pass through untouched.
 test("leaves punchType unresolved when it doesn't match any known normalization case", () => {
  render(
    <EditProjectModal
      isOpen={true}
      onClose={onClose}
      onSave={onSave}
      projectData={{ projectName: "X", punchInType: "unknown_type", status: "in_progress" }}
    />
  );
  // "unknown_type" matches none of the <Option> values. Since the placeholder
  // option ("Select type") is disabled, the browser/jsdom falls back to the
  // first non-disabled option, which is "on_site" — not an empty string.
  expect(document.querySelectorAll("select")[0]).toHaveValue("on_site");
});

  test("defaults status to 'in_progress' when projectData has no status", () => {
    render(
      <EditProjectModal
        isOpen={true}
        onClose={onClose}
        onSave={onSave}
        projectData={{ projectName: "HQ", punchInType: "on_site" }}
      />
    );
    expect(document.querySelectorAll("select")[1]).toHaveValue("in_progress");
  });

  test("disables latitude and longitude inputs when punchInType is 'bench'", () => {
    render(
      <EditProjectModal
        isOpen={true}
        onClose={onClose}
        onSave={onSave}
        projectData={{ projectName: "HQ", punchInType: "bench", status: "in_progress" }}
      />
    );
    expect(screen.getByPlaceholderText(/enter latitude/i)).toBeDisabled();
    expect(screen.getByPlaceholderText(/enter longitude/i)).toBeDisabled();
  });

  test("does not disable latitude/longitude for 'on_site' or 'variant'", () => {
    render(
      <EditProjectModal
        isOpen={true}
        onClose={onClose}
        onSave={onSave}
        projectData={{ projectName: "HQ", punchInType: "on_site", status: "in_progress" }}
      />
    );
    expect(screen.getByPlaceholderText(/enter latitude/i)).not.toBeDisabled();
    expect(screen.getByPlaceholderText(/enter longitude/i)).not.toBeDisabled();
  });

  // NEW: closes the branch gap on lines 86, 90 — the disabled check when
  // punchInType is still empty (no projectData, nothing selected yet).
  test("does not disable latitude/longitude when punchInType is empty (unselected)", () => {
    render(<EditProjectModal isOpen={true} onClose={onClose} onSave={onSave} projectData={null} />);
    expect(screen.getByPlaceholderText(/enter latitude/i)).not.toBeDisabled();
    expect(screen.getByPlaceholderText(/enter longitude/i)).not.toBeDisabled();
  });

  test("clicking the overlay calls onClose", () => {
    const { container } = render(
      <EditProjectModal isOpen={true} onClose={onClose} onSave={onSave} projectData={null} />
    );
    fireEvent.click(container.firstChild);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test("clicking inside the modal content does not call onClose", () => {
    render(<EditProjectModal isOpen={true} onClose={onClose} onSave={onSave} projectData={null} />);
    fireEvent.click(screen.getByText("Edit Field"));
    expect(onClose).not.toHaveBeenCalled();
  });

  test("clicking Cancel calls onClose", () => {
    render(<EditProjectModal isOpen={true} onClose={onClose} onSave={onSave} projectData={null} />);
    fireEvent.click(screen.getByText("Cancel"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test("shows validation errors when required fields are empty on Update", () => {
    render(<EditProjectModal isOpen={true} onClose={onClose} onSave={onSave} projectData={null} />);
    fireEvent.click(screen.getByText("Update"));

    expect(screen.getByText(/project name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/punch in type is required/i)).toBeInTheDocument();
    expect(onSave).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
  });

  test("clears a field's error as soon as it is edited", () => {
    render(<EditProjectModal isOpen={true} onClose={onClose} onSave={onSave} projectData={null} />);
    fireEvent.click(screen.getByText("Update"));
    expect(screen.getByText(/project name is required/i)).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText(/project name/i), {
      target: { value: "HQ" },
    });
    expect(screen.queryByText(/project name is required/i)).not.toBeInTheDocument();
  });

  test("saves with latitude/longitude preserved when punchInType is 'on_site'", () => {
    render(<EditProjectModal isOpen={true} onClose={onClose} onSave={onSave} projectData={null} />);

    fireEvent.change(screen.getByPlaceholderText(/project name/i), { target: { value: "HQ" } });
    fireEvent.change(document.querySelectorAll("select")[0], { target: { value: "on_site" } });
    fireEvent.change(screen.getByPlaceholderText(/enter latitude/i), { target: { value: "12.34" } });
    fireEvent.change(screen.getByPlaceholderText(/enter longitude/i), { target: { value: "56.78" } });
    fireEvent.change(document.querySelectorAll("select")[1], { target: { value: "in_progress" } });

    fireEvent.click(screen.getByText("Update"));

    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({
        projectName: "HQ",
        punchInType: "on_site",
        latitude: "12.34",
        longitude: "56.78",
        status: "in_progress",
      })
    );
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test("nulls latitude/longitude on save when punchInType is 'bench'", () => {
    render(<EditProjectModal isOpen={true} onClose={onClose} onSave={onSave} projectData={null} />);

    fireEvent.change(screen.getByPlaceholderText(/project name/i), { target: { value: "HQ" } });
    fireEvent.change(document.querySelectorAll("select")[0], { target: { value: "bench" } });
    fireEvent.change(document.querySelectorAll("select")[1], { target: { value: "in_progress" } });

    fireEvent.click(screen.getByText("Update"));

    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({ latitude: null, longitude: null })
    );
  });

  test("nulls latitude/longitude on save when punchInType is 'variant'", () => {
    render(<EditProjectModal isOpen={true} onClose={onClose} onSave={onSave} projectData={null} />);

    fireEvent.change(screen.getByPlaceholderText(/project name/i), { target: { value: "HQ" } });
    fireEvent.change(document.querySelectorAll("select")[0], { target: { value: "variant" } });
    fireEvent.change(document.querySelectorAll("select")[1], { target: { value: "in_progress" } });

    fireEvent.click(screen.getByText("Update"));

    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({ latitude: null, longitude: null })
    );
  });
});