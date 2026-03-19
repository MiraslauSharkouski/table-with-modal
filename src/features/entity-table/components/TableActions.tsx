import React from "react";
import { Button, Space } from "antd";
import { PlusOutlined } from "@ant-design/icons";

interface TableActionsProps {
  onAddNew?: () => void;
  extraActions?: React.ReactNode;
  loading?: boolean;
}

const TableActions: React.FC<TableActionsProps> = ({
  onAddNew,
  extraActions,
  loading = false,
}) => {
  return (
    <div style={{ marginBottom: 16 }}>
      <Space>
        {onAddNew && (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={onAddNew}
            loading={loading}
          >
            Add New
          </Button>
        )}
        {extraActions}
      </Space>
    </div>
  );
};

export default TableActions;
