import { useState, useCallback } from "react";
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
  const [searchTerm, setSearchTerm] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [editingEntity, setEditingEntity] = useState<EntityItem | null>(null);

  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  const filteredEntities = searchEntities(entities, searchTerm);

  const handleAddNew = useCallback(() => {
    setEditingEntity(null);
    setModalVisible(true);
  }, []);

  const handleEdit = useCallback((entity: EntityItem) => {
    setEditingEntity(entity);
    setModalVisible(true);
  }, []);

  const handleDelete = useCallback(
    async (id: string) => {
      await deleteEntity(id);
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
      setModalVisible(false);
    },
    [editingEntity, createEntity, updateEntity],
  );

  const handleCancel = useCallback(() => {
    setModalVisible(false);
    setEditingEntity(null);
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h1>Entity Table</h1>
      <TableActions onAddNew={handleAddNew} loading={loading} />
      <SearchBar
        onSearch={handleSearch}
        value={searchTerm}
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
        visible={modalVisible}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
        initialValues={editingEntity}
        loading={loading}
      />
    </div>
  );
}

export default App;
