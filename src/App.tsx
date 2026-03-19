import { useState, useCallback } from "react";
import { Modal } from "antd";
import {
  EntityTable,
  EntityFormModal,
  SearchBar,
  TableActions,
  useEntityData,
  useTypedSort,
  useDebouncedSearch,
  searchEntities,
  type EntityItem,
  type EntityFormValues,
} from "./features/entity-table";

function App() {
  const { entities, loading, createEntity, updateEntity, deleteEntity } =
    useEntityData();
  const { sortField, sortOrder, handleTableChange } = useTypedSort();

  // Debounced search with 300ms delay
  const [debouncedSearchTerm, setSearchTerm] = useDebouncedSearch("", 300);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingEntity, setEditingEntity] = useState<EntityItem | null>(null);

  // Filter entities using debounced search term
  const filteredEntities = searchEntities(entities, debouncedSearchTerm);

  const handleAddNew = useCallback(() => {
    setEditingEntity(null);
    setModalOpen(true);
  }, []);

  const handleEdit = useCallback((entity: EntityItem) => {
    setEditingEntity(entity);
    setModalOpen(true);
  }, []);

  const handleDelete = useCallback(
    (id: string) => {
      Modal.confirm({
        title: "Delete Entity",
        content: "Are you sure you want to delete this entity?",
        okText: "Delete",
        cancelText: "Cancel",
        okButtonProps: { danger: true },
        onOk: () => deleteEntity(id),
      });
    },
    [deleteEntity],
  );

  const handleSubmit = useCallback(
    async (data: EntityFormValues) => {
      if (editingEntity) {
        await updateEntity(editingEntity.id, data);
      } else {
        await createEntity(data);
      }
      setModalOpen(false);
      setEditingEntity(null);
    },
    [editingEntity, createEntity, updateEntity],
  );

  const handleCancel = useCallback(() => {
    setModalOpen(false);
    setEditingEntity(null);
  }, []);

  const handleClear = useCallback(() => {
    setSearchTerm("");
  }, [setSearchTerm]);

  return (
    <div style={{ padding: 24 }}>
      <h1>Entity Table</h1>
      <TableActions onAddNew={handleAddNew} loading={loading} />
      <SearchBar
        onSearch={setSearchTerm}
        onClear={handleClear}
        value={debouncedSearchTerm}
        placeholder="Search entities..."
      />
      <EntityTable
        entities={filteredEntities}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onChange={handleTableChange}
        sortField={sortField}
        sortOrder={sortOrder}
      />
      <EntityFormModal
        open={modalOpen}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
        initialValues={editingEntity}
        loading={loading}
      />
    </div>
  );
}

export default App;
