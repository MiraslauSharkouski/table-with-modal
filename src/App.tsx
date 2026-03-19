import { useState, useCallback, useMemo } from "react";
import { App as AntdApp } from "antd";
import dayjs from "dayjs";
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

function AppContent() {
  const { modal } = AntdApp.useApp();
  const { entities, loading, createEntity, updateEntity, deleteEntity } =
    useEntityData();
  const { handleTableChange } = useTypedSort();

  // Debounced search with 20ms delay for faster response
  const [debouncedSearchTerm, setSearchTerm] = useDebouncedSearch("", 20);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingEntity, setEditingEntity] = useState<EntityItem | null>(null);

  // Memoize filtered entities to prevent unnecessary re-calculations
  const filteredEntities = useMemo(
    () => searchEntities(entities, debouncedSearchTerm),
    [entities, debouncedSearchTerm],
  );

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
      modal.confirm({
        title: "Delete Entity",
        content: "Are you sure you want to delete this entity?",
        okText: "Delete",
        cancelText: "Cancel",
        okButtonProps: { danger: true },
        onOk: () => deleteEntity(id),
      });
    },
    [deleteEntity, modal],
  );

  const handleSubmit = useCallback(
    async (data: EntityFormValues) => {
      // Convert Dayjs date to ISO string if needed
      const payload = {
        ...data,
        date: dayjs.isDayjs(data.date) ? data.date.toISOString() : data.date,
      };

      if (editingEntity) {
        await updateEntity(editingEntity.id, payload);
      } else {
        await createEntity(payload);
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

function App() {
  return (
    <AntdApp>
      <AppContent />
    </AntdApp>
  );
}

export default App;
