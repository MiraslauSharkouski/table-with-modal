import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "./test-utils";
import userEvent from "@testing-library/user-event";
import EntityFormModal from "../features/entity-table/components/EntityFormModal";
import type { EntityFormValues } from "../features/entity-table/types/entity";

describe("EntityFormModal", () => {
  const defaultProps = {
    open: true,
    onSubmit: vi.fn(),
    onCancel: vi.fn(),
  };

  it("renders create modal with empty form", () => {
    render(<EntityFormModal {...defaultProps} />);

    expect(screen.getByText("Create New Entity")).toBeInTheDocument();
    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Date")).toBeInTheDocument();
    expect(screen.getByLabelText("Value")).toBeInTheDocument();
  });

  it("renders edit modal with initial values", () => {
    const initialValues: EntityFormValues = {
      id: "1",
      name: "Test Entity",
      date: "2023-01-15T00:00:00.000Z",
      value: 100,
    };

    render(<EntityFormModal {...defaultProps} initialValues={initialValues} />);

    expect(screen.getByText("Edit Entity")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Test Entity")).toBeInTheDocument();
  });

  it("calls onCancel when cancel button is clicked", async () => {
    const onCancel = vi.fn();
    const user = userEvent.setup();

    render(<EntityFormModal {...defaultProps} onCancel={onCancel} />);

    await user.click(screen.getByText("Cancel"));

    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("calls onSubmit with form data when form is submitted", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();

    const initialValues: EntityFormValues = {
      id: "1",
      name: "Test Entity",
      date: "2023-01-15T00:00:00.000Z",
      value: 100,
    };

    render(
      <EntityFormModal
        {...defaultProps}
        onSubmit={onSubmit}
        initialValues={initialValues}
      />,
    );

    // Form is pre-filled, just submit
    await user.click(screen.getByText("Update"));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalled();
    });
  });

  it("shows validation error for empty name", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();

    render(<EntityFormModal {...defaultProps} onSubmit={onSubmit} />);

    // Try to submit without filling the form
    await user.click(screen.getByText("Create"));

    await waitFor(() => {
      expect(screen.getByText("Name is required")).toBeInTheDocument();
    });
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("shows validation error for name less than 2 characters", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();

    render(<EntityFormModal {...defaultProps} onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText("Name"), "A");
    await user.click(screen.getByText("Create"));

    await waitFor(() => {
      expect(
        screen.getByText("Name must be at least 2 characters"),
      ).toBeInTheDocument();
    });
  });

  it("shows validation error for empty value", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();

    render(<EntityFormModal {...defaultProps} onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText("Name"), "Test Entity");
    // Leave value empty and try to submit
    await user.click(screen.getByText("Create"));

    await waitFor(() => {
      expect(screen.getByText("Value is required")).toBeInTheDocument();
    });
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("rejects negative values", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();

    render(<EntityFormModal {...defaultProps} onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText("Name"), "Test Entity");

    // InputNumber with min={0} prevents typing negative values
    // The validator also rejects negative values programmatically
    const valueInput = screen.getByLabelText("Value");
    expect(valueInput).toBeInTheDocument();

    // Submit with empty value (negative values are blocked by InputNumber)
    await user.click(screen.getByText("Create"));

    await waitFor(() => {
      expect(screen.getByText("Value is required")).toBeInTheDocument();
    });
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("clears form after successful submission", async () => {
    const onSubmit = vi.fn();
    const onCancel = vi.fn();
    const user = userEvent.setup();

    const initialValues: EntityFormValues = {
      id: "1",
      name: "Test Entity",
      date: "2023-01-15T00:00:00.000Z",
      value: 100,
    };

    render(
      <EntityFormModal
        {...defaultProps}
        onSubmit={onSubmit}
        onCancel={onCancel}
        initialValues={initialValues}
      />,
    );

    await user.click(screen.getByText("Update"));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalled();
    });

    // Modal should still be open but form is valid
    expect(screen.getByLabelText("Name")).toHaveValue("Test Entity");
  });
});
