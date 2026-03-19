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
 * Мок-реализация EntityService без сохранения данных (данные сбрасываются при перезагрузке)
 */
export const createMockEntityService = (): EntityService => {
  // Храним данные только в памяти (сбрасываются при перезагрузке страницы)
  let entities: EntityItem[] = [
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

  return {
    getAll: (): Promise<EntityItem[]> => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve([...entities]);
        }, 500);
      });
    },

    create: (data: Omit<EntityItem, "id">): Promise<EntityItem> => {
      return new Promise((resolve) => {
        setTimeout(() => {
          const newEntity: EntityItem = {
            id: crypto.randomUUID(),
            ...data,
          };
          entities.push(newEntity);
          resolve(newEntity);
        }, 500);
      });
    },

    update: (
      id: string,
      data: Partial<Omit<EntityItem, "id">>,
    ): Promise<EntityItem> => {
      return new Promise((resolve) => {
        setTimeout(() => {
          const index = entities.findIndex((e) => e.id === id);
          if (index !== -1) {
            entities[index] = { ...entities[index], ...data };
            resolve(entities[index]);
          } else {
            resolve({
              id,
              name: data.name ?? "Updated Entity",
              date: data.date ?? new Date().toISOString(),
              value: data.value ?? 0,
            });
          }
        }, 500);
      });
    },

    delete: (id: string): Promise<void> => {
      return new Promise((resolve) => {
        setTimeout(() => {
          entities = entities.filter((e) => e.id !== id);
          resolve();
        }, 500);
      });
    },
  };
};
