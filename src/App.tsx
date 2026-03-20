import { useState, useCallback, useMemo, lazy, Suspense } from "react";
import { App as AntdApp, Spin } from "antd";
import dayjs from "dayjs";
import {
  EntityTable,
  SearchBar,
  TableActions,
  useEntityData,
  useTypedSort,
  useDebouncedSearch,
  searchEntities,
  type EntityItem,
  type EntityFormValues,
} from "./features/entity-table";

// Lazy load the modal component to reduce initial bundle size
const EntityFormModal = lazy(
  () => import("./features/entity-table/components/EntityFormModal"),
);

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

  // Memoize the edit handler to prevent unnecessary re-renders
  const handleEdit = useCallback((entity: EntityItem) => {
    setEditingEntity(entity);
    setModalOpen(true);
  }, []);

  // Memoize the delete handler to prevent unnecessary re-renders
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

  // Memoize the submit handler to prevent unnecessary re-renders
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

  // Memoize the table actions to prevent unnecessary re-renders
  const tableActionsMemo = useMemo(
    () => <TableActions onAddNew={handleAddNew} loading={loading} />,
    [handleAddNew, loading],
  );

  // Memoize the search bar to prevent unnecessary re-renders
  const searchBarMemo = useMemo(
    () => (
      <SearchBar
        onSearch={setSearchTerm}
        onClear={handleClear}
        value={debouncedSearchTerm}
        placeholder="Search entities..."
      />
    ),
    [setSearchTerm, handleClear, debouncedSearchTerm],
  );

  // Memoize the entity table to prevent unnecessary re-renders
  const entityTableMemo = useMemo(
    () => (
      <EntityTable
        entities={filteredEntities}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onChange={handleTableChange}
      />
    ),
    [filteredEntities, loading, handleEdit, handleDelete, handleTableChange],
  );

  return (
    <div style={{ padding: 24 }}>
      <h1>Entity Table</h1>
      {tableActionsMemo}
      {searchBarMemo}
      {entityTableMemo}
      {modalOpen && (
        <Suspense
          fallback={
            <Spin
              size="large"
              style={{ position: "absolute", top: "50%", left: "50%" }}
            />
          }
        >
          <EntityFormModal
            open={modalOpen}
            onCancel={handleCancel}
            onSubmit={handleSubmit}
            initialValues={editingEntity}
            loading={loading}
          />
        </Suspense>
      )}
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
