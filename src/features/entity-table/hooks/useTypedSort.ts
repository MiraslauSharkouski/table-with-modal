import { useState, useCallback } from "react";
import type { SorterResult } from "antd/es/table/interface";
import type { EntityItem, SortOrder, EntityField } from "../types/entity";

export const useTypedSort = () => {
  const [sortField, setSortField] = useState<EntityField | undefined>(
    undefined,
  );
  const [sortOrder, setSortOrder] = useState<SortOrder>(undefined);

  const handleTableChange = useCallback(
    (pagination: any, filters: any, sorter: SorterResult<EntityItem>) => {
      setSortField(sorter.field as EntityField);
      // Handle the case where sorter.order might be null by converting it to undefined
      setSortOrder(sorter.order ?? undefined);
    },
    [],
  );

  return {
    sortField,
    sortOrder,
    handleTableChange,
  };
};
