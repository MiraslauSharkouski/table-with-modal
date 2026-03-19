import type { Entity } from "../types/entity";

/**
 * Utility functions for searching entities
 */

export const searchEntities = (
  entities: Entity[],
  searchTerm: string,
): Entity[] => {
  if (!searchTerm) return entities;

  const term = searchTerm.toLowerCase().trim();

  return entities.filter(
    (entity) =>
      entity.id.toLowerCase().includes(term) ||
      entity.name.toLowerCase().includes(term) ||
      (entity.description && entity.description.toLowerCase().includes(term)) ||
      (entity.status && entity.status.toLowerCase().includes(term)),
  );
};
