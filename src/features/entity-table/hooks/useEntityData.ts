import { useState, useEffect } from "react";
import type { EntityItem } from "../types/entity";
import type { EntityService } from "../services/entityService";
import { createMockEntityService } from "../services/entityService";

/**
 * Хук для управления данными сущностей
 */
export const useEntityData = (
  service: EntityService = createMockEntityService(),
) => {
  const [entities, setEntities] = useState<EntityItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadEntities = async () => {
    try {
      setLoading(true);
      const data = await service.getAll();
      setEntities(data);
      setError(null);
    } catch (err) {
      setError("Failed to load entities");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const createEntity = async (data: Omit<EntityItem, "id">) => {
    try {
      setLoading(true);
      const newEntity = await service.create(data);
      setEntities((prev) => [...prev, newEntity]);
      setError(null);
      return newEntity;
    } catch (err) {
      setError("Failed to create entity");
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateEntity = async (
    id: string,
    data: Partial<Omit<EntityItem, "id">>,
  ) => {
    try {
      setLoading(true);
      const updatedEntity = await service.update(id, data);
      setEntities((prev) =>
        prev.map((entity) => (entity.id === id ? updatedEntity : entity)),
      );
      setError(null);
      return updatedEntity;
    } catch (err) {
      setError("Failed to update entity");
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteEntity = async (id: string) => {
    try {
      setLoading(true);
      await service.delete(id);
      setEntities((prev) => prev.filter((entity) => entity.id !== id));
      setError(null);
    } catch (err) {
      setError("Failed to delete entity");
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEntities();
  }, []);

  return {
    entities,
    loading,
    error,
    loadEntities,
    createEntity,
    updateEntity,
    deleteEntity,
  };
};
