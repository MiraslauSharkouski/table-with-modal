import type { EntityItem } from "../types/entity";

/**
 * Utility functions for searching entities
 */

export const searchEntities = (
  entities: EntityItem[],
  searchTerm: string,
): EntityItem[] => {
  if (!searchTerm) return entities;

  const term = searchTerm.toLowerCase().trim();

  return entities.filter(
    (entity) =>
      entity.id.toLowerCase().includes(term) ||
      entity.name.toLowerCase().includes(term) ||
      entity.date.toLowerCase().includes(term) ||
      String(entity.value).includes(term),
  );
};
