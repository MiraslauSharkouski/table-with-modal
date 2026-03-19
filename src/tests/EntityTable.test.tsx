import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "./test-utils";
import EntityTable from "../features/entity-table/components/EntityTable";
import type { EntityItem } from "../features/entity-table/types/entity";

const mockEntities: EntityItem[] = [
  {
    id: "1",
    name: "Test Entity 1",
    date: "2023-01-15T00:00:00.000Z",
    value: 100,
  },
  {
    id: "2",
    name: "Test Entity 2",
    date: "2023-02-10T00:00:00.000Z",
    value: 200,
  },
  {
    id: "3",
    name: "Test Entity 3",
    date: "2023-03-05T00:00:00.000Z",
    value: 150,
  },
];

describe("EntityTable", () => {
  it("renders table with mock data", () => {
    const onEdit = vi.fn();
    const onDelete = vi.fn();

    render(
      <EntityTable
        entities={mockEntities}
        onEdit={onEdit}
        onDelete={onDelete}
      />,
    );

    // Check if table headers are rendered
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Date")).toBeInTheDocument();
    expect(screen.getByText("Value")).toBeInTheDocument();
    expect(screen.getByText("Actions")).toBeInTheDocument();

    // Check if data is rendered
    expect(screen.getByText("Test Entity 1")).toBeInTheDocument();
    expect(screen.getByText("Test Entity 2")).toBeInTheDocument();
    expect(screen.getByText("Test Entity 3")).toBeInTheDocument();
  });

  it("displays loading state", () => {
    const onEdit = vi.fn();
    const onDelete = vi.fn();

    render(
      <EntityTable
        entities={[]}
        loading={true}
        onEdit={onEdit}
        onDelete={onDelete}
      />,
    );

    expect(screen.getByText("loading")).toBeInTheDocument();
  });

  it("calls onEdit when edit button is clicked", () => {
    const onEdit = vi.fn();
    const onDelete = vi.fn();

    render(
      <EntityTable
        entities={mockEntities}
        onEdit={onEdit}
        onDelete={onDelete}
      />,
    );

    const editButtons = screen.getAllByText("Edit");
    fireEvent.click(editButtons[0]);

    expect(onEdit).toHaveBeenCalledWith(mockEntities[0]);
    expect(onEdit).toHaveBeenCalledTimes(1);
  });

  it("calls onDelete when delete button is clicked", () => {
    const onEdit = vi.fn();
    const onDelete = vi.fn();

    render(
      <EntityTable
        entities={mockEntities}
        onEdit={onEdit}
        onDelete={onDelete}
      />,
    );

    const deleteButtons = screen.getAllByText("Delete");
    fireEvent.click(deleteButtons[0]);

    expect(onDelete).toHaveBeenCalledWith(mockEntities[0].id);
    expect(onDelete).toHaveBeenCalledTimes(1);
  });

  it("renders Add New button when onAddNew is provided", () => {
    const onEdit = vi.fn();
    const onDelete = vi.fn();
    const onAddNew = vi.fn();

    render(
      <EntityTable
        entities={mockEntities}
        onEdit={onEdit}
        onDelete={onDelete}
        onAddNew={onAddNew}
      />,
    );

    expect(screen.getByText("Add New Entity")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Add New Entity"));
    expect(onAddNew).toHaveBeenCalledTimes(1);
  });

  it("does not render Add New button when onAddNew is not provided", () => {
    const onEdit = vi.fn();
    const onDelete = vi.fn();

    render(
      <EntityTable
        entities={mockEntities}
        onEdit={onEdit}
        onDelete={onDelete}
      />,
    );

    expect(screen.queryByText("Add New Entity")).not.toBeInTheDocument();
  });

  it("renders values with locale formatting", () => {
    const onEdit = vi.fn();
    const onDelete = vi.fn();

    render(
      <EntityTable
        entities={mockEntities}
        onEdit={onEdit}
        onDelete={onDelete}
      />,
    );

    expect(screen.getByText("100")).toBeInTheDocument();
    expect(screen.getByText("200")).toBeInTheDocument();
    expect(screen.getByText("150")).toBeInTheDocument();
  });

  it("renders dates in locale format", () => {
    const onEdit = vi.fn();
    const onDelete = vi.fn();

    render(
      <EntityTable
        entities={mockEntities}
        onEdit={onEdit}
        onDelete={onDelete}
      />,
    );

    // Check if dates are rendered (format may vary by locale)
    expect(screen.getByText("15.01.2023")).toBeInTheDocument();
  });
});
