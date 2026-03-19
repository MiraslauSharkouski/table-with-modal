import { useState, useEffect, useActionState } from "react";
import type { EntityItem } from "../types/entity";
import type { EntityService } from "../services/entityService";
import { createMockEntityService } from "../services/entityService";

interface EntityDataState {
  entities: EntityItem[];
  loading: boolean;
  error: string | null;
}

type MutationAction =
  | { type: "CREATE"; data: Omit<EntityItem, "id"> }
  | { type: "UPDATE"; id: string; data: Partial<Omit<EntityItem, "id">> }
  | { type: "DELETE"; id: string };

/**
 * Хук для управления данными сущностей с поддержкой оптимистичного UI
 * Использует useActionState (React 19) для мутаций
 */
export const useEntityData = (
  service: EntityService = createMockEntityService(),
) => {
  const [entities, setEntities] = useState<EntityItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Состояние для оптимистичных обновлений через useActionState
  const [mutationState, mutate, isMutating] = useActionState(
    async (
      prevState: {
        entities: EntityItem[];
        pendingMutation: MutationAction | null;
      } | null,
      action: MutationAction,
    ) => {
      const currentEntities = prevState?.entities ?? entities;

      try {
        let optimisticEntities: EntityItem[];

        // Оптимистичное обновление UI
        switch (action.type) {
          case "CREATE": {
            const tempId = `temp-${Date.now()}`;
            optimisticEntities = [
              ...currentEntities,
              { ...action.data, id: tempId } as EntityItem,
            ];
            break;
          }
          case "UPDATE": {
            optimisticEntities = currentEntities.map((entity) =>
              entity.id === action.id ? { ...entity, ...action.data } : entity,
            );
            break;
          }
          case "DELETE": {
            optimisticEntities = currentEntities.filter(
              (entity) => entity.id !== action.id,
            );
            break;
          }
        }

        // Возвращаем оптимистичное состояние
        return { entities: optimisticEntities, pendingMutation: action };
      } catch {
        // При ошибке возвращаем предыдущее состояние
        return { entities: currentEntities, pendingMutation: null };
      }
    },
    null,
  );

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
    mutate({ type: "CREATE", data });
    try {
      const newEntity = await service.create(data);
      // Обновляем с реальным ID после успешного создания
      setEntities((prev) =>
        prev.map((entity) =>
          entity.id.startsWith("temp-") ? newEntity : entity,
        ),
      );
      return newEntity;
    } catch (err) {
      setError("Failed to create entity");
      console.error(err);
      // Откат при ошибке
      await loadEntities();
      throw err;
    }
  };

  const updateEntity = async (
    id: string,
    data: Partial<Omit<EntityItem, "id">>,
  ) => {
    mutate({ type: "UPDATE", id, data });
    try {
      const updatedEntity = await service.update(id, data);
      setEntities((prev) =>
        prev.map((entity) => (entity.id === id ? updatedEntity : entity)),
      );
      return updatedEntity;
    } catch (err) {
      setError("Failed to update entity");
      console.error(err);
      await loadEntities();
      throw err;
    }
  };

  const deleteEntity = async (id: string) => {
    mutate({ type: "DELETE", id });
    try {
      await service.delete(id);
      setEntities((prev) => prev.filter((entity) => entity.id !== id));
    } catch (err) {
      setError("Failed to delete entity");
      console.error(err);
      await loadEntities();
      throw err;
    }
  };

  useEffect(() => {
    loadEntities();
  }, []);

  return {
    entities,
    loading,
    error,
    isMutating,
    loadEntities,
    createEntity,
    updateEntity,
    deleteEntity,
  };
};
