import { useState, useEffect } from "react";
import type { EntityItem } from "../types/entity";

// Mock API service - in real app this would be an actual API call
const mockApiService = {
  getAll: (): Promise<EntityItem[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: crypto.randomUUID(),
            name: "Entity 1",
            date: new Date("2023-01-15").toISOString(),
            value: 100,
          },
          {
            id: crypto.randomUUID(),
            name: "Entity 2",
            date: new Date("2023-02-10").toISOString(),
            value: 200,
          },
          {
            id: crypto.randomUUID(),
            name: "Entity 3",
            date: new Date("2023-03-05").toISOString(),
            value: 150,
          },
        ]);
      }, 500);
    });
  },

  create: (data: Omit<EntityItem, "id">): Promise<EntityItem> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: crypto.randomUUID(),
          ...data,
        });
      }, 500);
    });
  },

  update: (
    id: string,
    data: Partial<Omit<EntityItem, "id">>,
  ): Promise<EntityItem> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id,
          name: data.name ?? "Updated Entity",
          date: data.date ?? new Date().toISOString(),
          value: data.value ?? 0,
        });
      }, 500);
    });
  },

  delete: (id: string): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 500);
    });
  },
};

export const useEntityData = () => {
  const [entities, setEntities] = useState<EntityItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadEntities = async () => {
    try {
      setLoading(true);
      const data = await mockApiService.getAll();
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
      const newEntity = await mockApiService.create(data);
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
      const updatedEntity = await mockApiService.update(id, data);
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
      await mockApiService.delete(id);
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
