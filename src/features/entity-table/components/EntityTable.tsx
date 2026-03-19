import { Table, Space, Button, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { SorterResult } from "antd/es/table/interface";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import type { EntityItem, SortOrder } from "../types/entity";
import {
  sortByName,
  sortByDate,
  sortByValue,
  sortById,
} from "../utils/sorters";

interface EntityTableProps {
  entities: EntityItem[];
  loading?: boolean;
  onEdit: (entity: EntityItem) => void;
  onDelete: (id: string) => void;
  onAddNew?: () => void;
  onChange?: (
    pagination: any,
    filters: Record<string, any>,
    sorter: SorterResult<EntityItem> | SorterResult<EntityItem>[],
    extra?: any,
  ) => void;
  sortField?: keyof EntityItem | undefined;
  sortOrder?: SortOrder;
}

const EntityTable = ({
  entities,
  loading = false,
  onEdit,
  onDelete,
  onAddNew,
  onChange = () => {},
  sortField,
  sortOrder,
}: EntityTableProps) => {
  const columns: ColumnsType<EntityItem> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => sortById(a, b, "asc"),
      defaultSortOrder: null,
      showSorterTooltip: true,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => sortByName(a, b, "asc"),
      defaultSortOrder: null,
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      sorter: (a, b) => sortByDate(a, b, "asc"),
      defaultSortOrder: null,
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Value",
      dataIndex: "value",
      key: "value",
      sorter: (a, b) => sortByValue(a, b, "asc"),
      defaultSortOrder: null,
      render: (value: number) => value.toLocaleString(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
          >
            Edit
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => onDelete(record.id)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

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
      />
    </div>
  );
};

export default EntityTable;
