// Export all public components, hooks, and types from the entity-table feature
export { default as EntityTable } from "./components/EntityTable";
export { default as EntityFormModal } from "./components/EntityFormModal";
export { default as SearchBar } from "./components/SearchBar";
export { default as TableActions } from "./components/TableActions";

export { useEntityData } from "./hooks/useEntityData";
export { useTypedSort } from "./hooks/useTypedSort";
export {
  useDebouncedSearch,
  useDebouncedSearchWithCallback,
} from "./hooks/useDebouncedSearch";

export type {
  EntityItem,
  EntityFormValues,
  FormErrors,
  EntityField,
  SortOrder,
} from "./types/entity";
export { entityFormSchema } from "./types/entity";

export type { EntityService } from "./services/entityService";
export { createMockEntityService } from "./services/entityService";

export { createColumns } from "./components/columns";
export { getTypedSorter } from "./utils/sorters";

export {
  searchEntities,
  searchEntitiesMultiTerm,
  matchesSearch,
} from "./utils/search";
export { validateEntityForm, sanitizeEntityData } from "./utils/validation";
