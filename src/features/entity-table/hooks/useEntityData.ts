import { useState, useEffect } from "react";
import type { Entity } from "../types/entity";

// Mock API service - in real app this would be an actual API call
const mockApiService = {
  getAll: (): Promise<Entity[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: "1",
            name: "Entity 1",
            description: "First test entity",
            createdAt: new Date("2023-01-15"),
            updatedAt: new Date("2023-01-20"),
            status: "active",
          },
          {
            id: "2",
            name: "Entity 2",
            description: "Second test entity",
            createdAt: new Date("2023-02-10"),
            updatedAt: new Date("2023-02-15"),
            status: "inactive",
          },
          {
            id: "3",
            name: "Entity 3",
            description: "Third test entity",
            createdAt: new Date("2023-03-05"),
            updatedAt: new Date("2023-03-10"),
            status: "pending",
          },
        ]);
      }, 500);
    });
  },

  create: (
    data: Omit<Entity, "id" | "createdAt" | "updatedAt">,
  ): Promise<Entity> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: `${Date.now()}`,
          ...data,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }, 500);
    });
  },

  update: (
    id: string,
    data: Partial<Omit<Entity, "id" | "createdAt">>,
  ): Promise<Entity> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id,
          name: data.name || "Updated Entity",
          description: data.description || "",
          createdAt: new Date("2023-01-15"),
          updatedAt: new Date(),
          status: data.status || "active",
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
  const [entities, setEntities] = useState<Entity[]>([]);
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

  const createEntity = async (
    data: Omit<Entity, "id" | "createdAt" | "updatedAt">,
  ) => {
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
    data: Partial<Omit<Entity, "id" | "createdAt">>,
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
