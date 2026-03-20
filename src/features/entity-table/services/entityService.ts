import type { EntityItem } from "../types/entity";

const STORAGE_KEY = "entity-table-data";

/**
 * Интерфейс сервиса для CRUD-операций с сущностями
 */
export interface EntityService {
  getAll: () => Promise<EntityItem[]>;
  create: (data: Omit<EntityItem, "id">) => Promise<EntityItem>;
  update: (
    id: string,
    data: Partial<Omit<EntityItem, "id">>,
  ) => Promise<EntityItem>;
  delete: (id: string) => Promise<void>;
}

/**
 * Мок-реализация EntityService с localStorage для сохранения данных
 */
export const createMockEntityService = (): EntityService => {
  // Инициализируем данные из localStorage или создаём демо-данные
  const getStoredEntities = (): EntityItem[] => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error("Failed to parse stored entities:", e);
      }
    }
    // Демо-данные по умолчанию
    return [
      {
        id: "1",
        name: "Entity 1",
        date: new Date("2023-01-15").toISOString(),
        value: 100,
      },
      {
        id: "2",
        name: "Entity 2",
        date: new Date("2023-02-10").toISOString(),
        value: 200,
      },
      {
        id: "3",
        name: "Entity 3",
        date: new Date("2023-03-05").toISOString(),
        value: 150,
      },
    ];
  };

  const saveEntities = (entities: EntityItem[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entities));
  };

  return {
    getAll: (): Promise<EntityItem[]> => {
      // Remove artificial delay for better performance
      return Promise.resolve(getStoredEntities());
    },

    create: (data: Omit<EntityItem, "id">): Promise<EntityItem> => {
      // Remove artificial delay for better performance
      const entities = getStoredEntities();
      const newEntity: EntityItem = {
        id: crypto.randomUUID(),
        ...data,
      };
      entities.push(newEntity);
      saveEntities(entities);
      return Promise.resolve(newEntity);
    },

    update: (
      id: string,
      data: Partial<Omit<EntityItem, "id">>,
    ): Promise<EntityItem> => {
      // Remove artificial delay for better performance
      const entities = getStoredEntities();
      const entity = entities.find((e) => e.id === id);
      if (entity) {
        const updatedEntity: EntityItem = {
          id: entity.id,
          name: data.name ?? entity.name,
          date: data.date ?? entity.date,
          value: data.value ?? entity.value,
        };
        const index = entities.findIndex((e) => e.id === id);
        entities[index] = updatedEntity;
        saveEntities(entities);
        return Promise.resolve(updatedEntity);
      } else {
        return Promise.resolve({
          id,
          name: data.name ?? "Updated Entity",
          date: data.date ?? new Date().toISOString(),
          value: data.value ?? 0,
        });
      }
    },

    delete: (id: string): Promise<void> => {
      // Remove artificial delay for better performance
      const entities = getStoredEntities();
      const filtered = entities.filter((e) => e.id !== id);
      saveEntities(filtered);
      return Promise.resolve();
    },
  };
};
