import { Space, Button } from "antd";
import type { ColumnsType } from "antd/es/table";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import type { EntityItem } from "../types/entity";
import { getTypedSorter } from "../utils/sorters";

/**
 * Создаёт массив колонок для таблицы EntityTable
 * Вынесено вне компонента для стабильности ссылок (React Compiler friendly)
 */
export const createColumns = (
  onEdit: (entity: EntityItem) => void,
  onDelete: (id: string) => void,
): ColumnsType<EntityItem> => [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
    sorter: getTypedSorter("id"),
    sortDirections: ["ascend", "descend"],
    hidden: true, // Скрываем ID по умолчанию
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    sorter: getTypedSorter("name"),
    sortDirections: ["ascend", "descend"],
  },
  {
    title: "Date",
    dataIndex: "date",
    key: "date",
    render: (date: string) => new Date(date).toLocaleDateString(),
    sorter: getTypedSorter("date"),
    sortDirections: ["ascend", "descend"],
  },
  {
    title: "Value",
    dataIndex: "value",
    key: "value",
    render: (val: number) => val.toLocaleString(),
    sorter: getTypedSorter("value"),
    sortDirections: ["ascend", "descend"],
    align: "right",
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
          className="p-0"
        >
          <span className="edit-btn-text">Edit</span>
        </Button>
        <Button
          type="link"
          danger
          icon={<DeleteOutlined />}
          onClick={() => onDelete(record.id)}
          className="p-0"
        >
          <span className="delete-btn-text">Delete</span>
        </Button>
      </Space>
    ),
    width: 150,
  },
];
