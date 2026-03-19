import React from "react";
import { Table, Space, Button, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import type { Entity } from "../types/entity";

interface EntityTableProps {
  entities: Entity[];
  loading?: boolean;
  onEdit: (entity: Entity) => void;
  onDelete: (id: string) => void;
  onAddNew?: () => void;
}

const EntityTable: React.FC<EntityTableProps> = ({
  entities,
  loading = false,
  onEdit,
  onDelete,
  onAddNew,
}) => {
  const columns: ColumnsType<Entity> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      sorter: (a: Entity, b: Entity) => a.id.localeCompare(b.id),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a: Entity, b: Entity) => a.name.localeCompare(b.name),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: Entity["status"]) => {
        let color = "default";
        if (status === "active") color = "green";
        if (status === "inactive") color = "red";
        if (status === "pending") color = "orange";

        return <Tag color={color}>{status?.toUpperCase()}</Tag>;
      },
      filters: [
        { text: "Active", value: "active" },
        { text: "Inactive", value: "inactive" },
        { text: "Pending", value: "pending" },
      ],
      onFilter: (value: unknown, record: Entity) => {
        if (typeof value === "string") {
          return record.status === (value as Entity["status"]);
        }
        return false;
      },
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: Date) => new Date(date).toLocaleDateString(),
      sorter: (a: Entity, b: Entity) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Entity) => (
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
      />
    </div>
  );
};

export default EntityTable;
