import { Modal, Form, Input, InputNumber, DatePicker, Button } from "antd";
import type { EntityItem, EntityFormValues } from "../types/entity";
import dayjs from "dayjs";

interface EntityFormModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (data: EntityFormValues) => void;
  initialValues?: EntityItem | null;
  loading?: boolean;
}

const EntityFormModal = ({
  visible,
  onCancel,
  onSubmit,
  initialValues,
  loading = false,
}: EntityFormModalProps) => {
  const [form] = Form.useForm<EntityFormValues>();

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const sanitizedValues = {
        ...values,
        date: values.date.toString(),
      };
      onSubmit(sanitizedValues);
      form.resetFields();
    } catch (error) {
      // Validation errors are handled by AntD Form internally
    }
  };

  return (
    <Modal
      title={initialValues ? "Edit Entity" : "Create New Entity"}
      open={visible}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={handleSubmit}
        >
          {initialValues ? "Update" : "Create"}
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          name: initialValues?.name ?? "",
          date: initialValues?.date ? dayjs(initialValues.date) : undefined,
          value: initialValues?.value ?? 0,
        }}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[
            { required: true, message: "Name is required" },
            { max: 100, message: "Name must be less than 100 characters" },
          ]}
        >
          <Input placeholder="Enter entity name" />
        </Form.Item>
        <Form.Item
          label="Date"
          name="date"
          rules={[{ required: true, message: "Date is required" }]}
        >
          <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
        </Form.Item>
        <Form.Item
          label="Value"
          name="value"
          rules={[
            { required: true, message: "Value is required" },
            { type: "number", min: 0, message: "Value must be positive" },
          ]}
        >
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EntityFormModal;
