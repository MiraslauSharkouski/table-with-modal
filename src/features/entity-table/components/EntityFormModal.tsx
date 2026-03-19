import React from "react";
import { Modal, Form, Input, Select, Button } from "antd";
import type { Entity, EntityFormData } from "../types/entity";

const { Option } = Select;

interface EntityFormModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (data: EntityFormData) => void;
  initialValues?: Entity | null;
  loading?: boolean;
}

const EntityFormModal: React.FC<EntityFormModalProps> = ({
  visible,
  onCancel,
  onSubmit,
  initialValues,
  loading = false,
}) => {
  const [form] = Form.useForm();

  React.useEffect(() => {
    if (visible) {
      if (initialValues) {
        form.setFieldsValue({
          name: initialValues.name,
          description: initialValues.description || "",
          status: initialValues.status || "active",
        });
      } else {
        form.resetFields();
      }
    }
  }, [visible, initialValues, form]);

  const handleSubmit = (values: EntityFormData) => {
    onSubmit(values);
    form.resetFields();
  };

  return (
    <Modal
      title={initialValues ? "Edit Entity" : "Create New Entity"}
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={() => form.submit()}
        >
          {initialValues ? "Update" : "Create"}
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          name: "",
          description: "",
          status: "active",
        }}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please enter a name" }]}
        >
          <Input placeholder="Enter entity name" />
        </Form.Item>
        <Form.Item label="Description" name="description">
          <Input.TextArea placeholder="Enter entity description" rows={4} />
        </Form.Item>
        <Form.Item
          label="Status"
          name="status"
          rules={[{ required: true, message: "Please select a status" }]}
        >
          <Select placeholder="Select status">
            <Option value="active">Active</Option>
            <Option value="inactive">Inactive</Option>
            <Option value="pending">Pending</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EntityFormModal;
