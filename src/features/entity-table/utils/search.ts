import { escapeRegExp } from "lodash-es";
import type { EntityItem } from "../types/entity";

/**
 * Проверяет, соответствует ли сущность поисковому запросу
 * Использует escapeRegExp для безопасного поиска специальных символов
 */
export const matchesSearch = (entity: EntityItem, query: string): boolean => {
  const q = query.toLowerCase().trim();
  const escapedQuery = escapeRegExp(q);
  const regex = new RegExp(escapedQuery, "i");

  return (
    regex.test(entity.name) ||
    regex.test(new Date(entity.date).toLocaleDateString()) ||
    regex.test(entity.value.toString()) ||
    regex.test(entity.id)
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

/**
 * Расширенная функция поиска с поддержкой нескольких терминов
 * Разделяет запрос по пробелам и ищет все термины
 */
export const searchEntitiesMultiTerm = (
  entities: EntityItem[],
  searchTerm: string,
): EntityItem[] => {
  if (!searchTerm) return entities;

  const terms = searchTerm.split(/\s+/).filter((t) => t.trim().length > 0);

  if (terms.length === 0) return entities;

  return entities.filter((entity) =>
    terms.every((term) => matchesSearch(entity, term)),
  );
};
