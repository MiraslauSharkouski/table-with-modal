import type { EntityItem, EntityField } from "../types/entity";
import type { CompareFn } from "antd/es/table/interface";

/**
 * Utility functions for sorting entities
 */

export const sortByName = (
  a: EntityItem,
  b: EntityItem,
  order: "asc" | "desc" = "asc",
): number => {
  const comparison = a.name.localeCompare(b.name);
  return order === "asc" ? comparison : -comparison;
};

export const sortByDate = (
  a: EntityItem,
  b: EntityItem,
  order: "asc" | "desc" = "asc",
): number => {
  const dateA = new Date(a.date).getTime();
  const dateB = new Date(b.date).getTime();
  const comparison = dateA - dateB;
  return order === "asc" ? comparison : -comparison;
};

export const sortById = (
  a: EntityItem,
  b: EntityItem,
  order: "asc" | "desc" = "asc",
): number => {
  const comparison = a.id.localeCompare(b.id);
  return order === "asc" ? comparison : -comparison;
};

export const sortByValue = (
  a: EntityItem,
  b: EntityItem,
  order: "asc" | "desc" = "asc",
): number => {
  const comparison = a.value - b.value;
  return order === "asc" ? comparison : -comparison;
};

/**
 * Generic sorter for any entity field
 */
export const sortByField = (
  a: EntityItem,
  b: EntityItem,
  field: EntityField,
  order: "asc" | "desc" = "asc",
): number => {
  let comparison = 0;

  if (field === "value") {
    comparison = a.value - b.value;
  } else {
    comparison = String(a[field]).localeCompare(String(b[field]));
  }

  return order === "asc" ? comparison : -comparison;
};

/**
 * Typизированная функция сортировки для AntD Table
 * Возвращает CompareFn для указанного поля
 */
export const getTypedSorter = (field: EntityField): CompareFn<EntityItem> => {
  const sorters: Record<EntityField, CompareFn<EntityItem>> = {
    id: (a, b) => a.id.localeCompare(b.id),
    name: (a, b) => a.name.localeCompare(b.name, "ru"),
    date: (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    value: (a, b) => a.value - b.value,
  };
  return sorters[field];
};
