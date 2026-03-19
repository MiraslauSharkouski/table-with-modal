import type { EntityItem } from "../types/entity";

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
 * Мок-реализация EntityService для разработки и тестирования
 */
export const createMockEntityService = (): EntityService => ({
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
});
