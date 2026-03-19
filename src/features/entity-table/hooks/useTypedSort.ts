import { useState, useCallback } from "react";
import type { SorterResult } from "antd/es/table/interface";
import type { Entity } from "../types/entity";

type SortOrder = "ascend" | "descend" | undefined;

export const useTypedSort = () => {
  const [sortField, setSortField] = useState<string | undefined>(undefined);
  const [sortOrder, setSortOrder] = useState<SortOrder>(undefined);

  const handleTableChange = useCallback(
    (pagination: any, filters: any, sorter: SorterResult<Entity>) => {
      setSortField(sorter.field as string);
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
