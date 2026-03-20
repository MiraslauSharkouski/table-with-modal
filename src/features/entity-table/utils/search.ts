import type { EntityItem } from "../types/entity";

/**
 * Проверяет, соответствует ли сущность поисковому запросу
 * Оптимизированная версия без RegExp для лучшей производительности
 */
export const matchesSearch = (entity: EntityItem, query: string): boolean => {
  const q = query.toLowerCase().trim();

  if (!q) return false;

  // Pre-compute lowercase values to avoid repeated conversions
  const entityName = entity.name.toLowerCase();
  const entityDate = entity.date.toLowerCase();
  const entityId = entity.id.toLowerCase();
  const entityValueStr = String(entity.value);

  return (
    entityName.includes(q) ||
    entityDate.includes(q) ||
    entityValueStr.includes(q) ||
    entityId.includes(q)
  );
};

/**
 * Фильтрует сущности по поисковому запросу
 * Optimized version with early termination and pre-computation
 */
export const searchEntities = (
  entities: EntityItem[],
  searchTerm: string,
): EntityItem[] => {
  if (!searchTerm) return entities;

  const query = searchTerm.toLowerCase().trim();
  if (!query) return entities;

  // Pre-compute query to avoid repeated string operations
  return entities.filter((entity) => {
    // Pre-compute entity values to avoid repeated conversions
    const entityName = entity.name.toLowerCase();
    const entityDate = entity.date.toLowerCase();
    const entityId = entity.id.toLowerCase();
    const entityValueStr = String(entity.value);

    return (
      entityName.includes(query) ||
      entityDate.includes(query) ||
      entityValueStr.includes(query) ||
      entityId.includes(query)
    );
  });
};

/**
 * Фильтрует сущности по нескольким поисковым терминам
 * Разбивает запрос на слова и ищет совпадения по каждому термину
 * Optimized version with pre-computation
 */
export const searchEntitiesMultiTerm = (
  entities: EntityItem[],
  searchTerm: string,
): EntityItem[] => {
  if (!searchTerm) return entities;

  const terms = searchTerm.toLowerCase().trim().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return entities;

  return entities.filter((entity) => {
    // Pre-compute the search text once
    const searchText =
      `${entity.name} ${entity.date} ${entity.value} ${entity.id}`.toLowerCase();

    // Check if all terms match (early termination)
    for (const term of terms) {
      if (!searchText.includes(term)) {
        return false;
      }
    }
    return true;
  });
};
