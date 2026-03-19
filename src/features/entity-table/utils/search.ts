import type { EntityItem } from "../types/entity";

/**
 * Проверяет, соответствует ли сущность поисковому запросу
 * Оптимизированная версия без RegExp для лучшей производительности
 */
export const matchesSearch = (entity: EntityItem, query: string): boolean => {
  const q = query.toLowerCase().trim();

  return (
    entity.name.toLowerCase().includes(q) ||
    entity.date.toLowerCase().includes(q) ||
    String(entity.value).includes(q) ||
    entity.id.toLowerCase().includes(q)
  );
};

/**
 * Фильтрует сущности по поисковому запросу
 */
export const searchEntities = (
  entities: EntityItem[],
  searchTerm: string,
): EntityItem[] => {
  if (!searchTerm) return entities;

  return entities.filter((entity) => matchesSearch(entity, searchTerm));
};
