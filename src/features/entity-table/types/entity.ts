import { z } from "zod";

/**
 * Базовый тип сущности для таблицы
 */
export interface EntityItem {
  id: string; // crypto.randomUUID()
  name: string;
  date: string; // ISO 8601 для совместимости с AntD DatePicker
  value: number;
}

/**
 * Тип для формы создания/редактирования сущности
 */
export type EntityFormValues = Omit<EntityItem, "id"> & { id?: string };

/**
 * Тип для ошибок валидации формы
 */
export type FormErrors = Record<keyof EntityFormValues, string | undefined>;

/**
 * Zod схема валидации для EntityFormValues
 */
export const entityFormSchema = z.object({
  id: z.string().optional(),
  name: z
    .string()
    .min(1, { message: "Name is required" })
    .max(100, { message: "Name must be less than 100 characters" }),
  date: z
    .string()
    .min(1, { message: "Date is required" })
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid date format",
    }),
  value: z
    .number({ message: "Value is required" })
    .min(0, { message: "Value must be positive" }),
});

/**
 * Тип для сортировки AntD таблицы
 */
export type SortOrder = "ascend" | "descend" | undefined;

/**
 * Утилитный тип для полей сущности
 */
export type EntityField = keyof EntityItem;

/**
 * Тип для колонки AntD таблицы с явным sorter
 */
export type { CompareFn } from "antd/es/table/interface";
