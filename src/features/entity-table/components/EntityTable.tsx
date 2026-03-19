import { memo, useMemo } from "react";
import { Table, Button } from "antd";
import type { TablePaginationConfig } from "antd/es/table";
import type { SorterResult } from "antd/es/table/interface";
import type { EntityItem } from "../types/entity";
import { createColumns } from "./columns";

interface EntityTableProps {
  entities: EntityItem[];
  loading?: boolean;
  onEdit: (entity: EntityItem) => void;
  onDelete: (id: string) => void;
  onAddNew?: () => void;
  onChange?: (
    pagination: TablePaginationConfig,
    filters: Record<string, any>,
    sorter: SorterResult<EntityItem> | SorterResult<EntityItem>[],
    extra?: any,
  ) => void;
  pagination?: TablePaginationConfig | false;
}

const EntityTable = ({
  entities,
  loading = false,
  onEdit,
  onDelete,
  onAddNew,
  onChange = () => {},
  pagination = false,
}: EntityTableProps) => {
  // Memoize columns to prevent re-creation on every render
  const columns = useMemo(
    () => createColumns(onEdit, onDelete),
    [onEdit, onDelete],
  );

  return (
    <div>
      {onAddNew && (
        <div style={{ marginBottom: 16 }}>
          <Button type="primary" onClick={onAddNew}>
            Add New Entity
          </Button>
        </div>
      )}
      <Table
        dataSource={entities}
        columns={columns}
        rowKey="id"
        loading={loading}
        onChange={onChange}
        sortDirections={["ascend", "descend"] as const}
        pagination={pagination}
      />
    </div>
  );
};

export default memo(EntityTable);
