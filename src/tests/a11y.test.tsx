import { describe, it, expect, vi } from "vitest";
import { render, screen } from "./test-utils";
import userEvent from "@testing-library/user-event";
import EntityTable from "../features/entity-table/components/EntityTable";
import EntityFormModal from "../features/entity-table/components/EntityFormModal";
import SearchBar from "../features/entity-table/components/SearchBar";
import TableActions from "../features/entity-table/components/TableActions";
import type { EntityItem } from "../features/entity-table/types/entity";

const mockEntities: EntityItem[] = [
  {
    id: "1",
    name: "Test Entity",
    date: "2023-01-15T00:00:00.000Z",
    value: 100,
  },
];

describe("Accessibility (a11y) Tests", () => {
  describe("EntityTable", () => {
    it("has accessible table headers", () => {
      const onEdit = vi.fn();
      const onDelete = vi.fn();

      render(
        <EntityTable
          entities={mockEntities}
          onEdit={onEdit}
          onDelete={onDelete}
        />,
      );

      expect(screen.getByRole("table")).toBeInTheDocument();
      expect(screen.getByText("Name")).toBeInTheDocument();
      expect(screen.getByText("Date")).toBeInTheDocument();
      expect(screen.getByText("Value")).toBeInTheDocument();
    });

    it("has accessible action buttons", () => {
      const onEdit = vi.fn();
      const onDelete = vi.fn();

      render(
        <EntityTable
          entities={mockEntities}
          onEdit={onEdit}
          onDelete={onDelete}
        />,
      );

      const editButton = screen.getByText("Edit");
      const deleteButton = screen.getByText("Delete");

      expect(editButton).toBeInTheDocument();
      expect(deleteButton).toBeInTheDocument();
    });
  });

  describe("SearchBar", () => {
    it("has accessible search input", () => {
      const onSearch = vi.fn();

      render(<SearchBar onSearch={onSearch} placeholder="Search entities" />);

      const input = screen.getByPlaceholderText("Search entities");
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute("type", "text");
    });

    it("has clear button for accessibility", () => {
      const onSearch = vi.fn();
      const onClear = vi.fn();

      render(
        <SearchBar
          onSearch={onSearch}
          onClear={onClear}
          value="test"
          placeholder="Search"
        />,
      );

      // AntD Input with allowClear should have a clear button
      const clearButton = screen.getByRole("button", { name: /clear/i });
      expect(clearButton).toBeInTheDocument();
    });
  });

  describe("TableActions", () => {
    it("has accessible add button", () => {
      const onAddNew = vi.fn();

      render(<TableActions onAddNew={onAddNew} />);

      const addButton = screen.getByText("Add New");
      expect(addButton).toBeInTheDocument();
      expect(addButton.closest("button")).toBeInTheDocument();
    });
  });

  describe("EntityFormModal", () => {
    it("has accessible form labels", () => {
      const onSubmit = vi.fn();
      const onCancel = vi.fn();

      render(
        <EntityFormModal open={true} onSubmit={onSubmit} onCancel={onCancel} />,
      );

      expect(screen.getByLabelText("Name")).toBeInTheDocument();
      expect(screen.getByLabelText("Date")).toBeInTheDocument();
      expect(screen.getByLabelText("Value")).toBeInTheDocument();
    });

    it("has accessible modal title", () => {
      const onSubmit = vi.fn();
      const onCancel = vi.fn();

      render(
        <EntityFormModal open={true} onSubmit={onSubmit} onCancel={onCancel} />,
      );

      expect(screen.getByText("Create New Entity")).toBeInTheDocument();
    });

    it("has accessible cancel and submit buttons", () => {
      const onSubmit = vi.fn();
      const onCancel = vi.fn();

      render(
        <EntityFormModal open={true} onSubmit={onSubmit} onCancel={onCancel} />,
      );

      expect(screen.getByText("Cancel")).toBeInTheDocument();
      expect(screen.getByText("Create")).toBeInTheDocument();
    });

    it("has keyboard accessible form", async () => {
      const onSubmit = vi.fn();
      const onCancel = vi.fn();

      render(
        <EntityFormModal open={true} onSubmit={onSubmit} onCancel={onCancel} />,
      );

      // Test tab navigation through form fields
      const nameInput = screen.getByLabelText("Name");
      const dateInput = screen.getByLabelText("Date");
      const valueInput = screen.getByLabelText("Value");

      expect(nameInput).toBeInTheDocument();
      expect(dateInput).toBeInTheDocument();
      expect(valueInput).toBeInTheDocument();

      // Focus should be manageable
      nameInput.focus();
      expect(nameInput).toHaveFocus();
    });
  });

  describe("Modal keyboard navigation", () => {
    it("can be closed with Escape key", async () => {
      const onCancel = vi.fn();
      const user = userEvent.setup();

      render(
        <EntityFormModal open={true} onSubmit={vi.fn()} onCancel={onCancel} />,
      );

      // Press Escape key
      await user.keyboard("{Escape}");

      expect(onCancel).toHaveBeenCalledTimes(1);
    });
  });
});
