import type { Entity } from "../types/entity";

/**
 * Utility functions for sorting entities
 */

export const sortByName = (
  a: Entity,
  b: Entity,
  order: "asc" | "desc" = "asc",
): number => {
  const comparison = a.name.localeCompare(b.name);
  return order === "asc" ? comparison : -comparison;
};

export const sortByDate = (
  a: Entity,
  b: Entity,
  field: keyof Entity,
  order: "asc" | "desc" = "asc",
): number => {
  const dateA = new Date(a[field] as string | Date).getTime();
  const dateB = new Date(b[field] as string | Date).getTime();
  const comparison = dateA - dateB;
  return order === "asc" ? comparison : -comparison;
};

export const sortById = (
  a: Entity,
  b: Entity,
  order: "asc" | "desc" = "asc",
): number => {
  const comparison = a.id.localeCompare(b.id);
  return order === "asc" ? comparison : -comparison;
};

export const sortByStatus = (
  a: Entity,
  b: Entity,
  order: "asc" | "desc" = "asc",
): number => {
  const statusOrder = {
    active: 1,
    pending: 2,
    inactive: 3,
  };

  const comparison =
    (statusOrder[a.status || "active"] || 4) -
    (statusOrder[b.status || "active"] || 4);
  return order === "asc" ? comparison : -comparison;
};
