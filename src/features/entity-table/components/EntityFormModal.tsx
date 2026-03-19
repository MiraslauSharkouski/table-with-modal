import { Modal, Form, Input, InputNumber, DatePicker, Button } from "antd";
import type { EntityItem, EntityFormValues } from "../types/entity";
import dayjs, { Dayjs } from "dayjs";

interface EntityFormModalProps {
  open: boolean;
  title?: string;
  initialValues?: EntityFormValues | null;
  onSubmit: (data: EntityFormValues) => void;
  onCancel: () => void;
  loading?: boolean;
}

const EntityFormModal = ({
  open,
  title,
  initialValues,
  onSubmit,
  onCancel,
  loading = false,
}: EntityFormModalProps) => {
  const [form] = Form.useForm<EntityFormValues>();

  const isEditMode = !!initialValues?.id;

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const payload: EntityFormValues = {
        ...values,
        ...(initialValues?.id ? { id: initialValues.id } : {}),
        date: dayjs(values.date).toISOString(),
      };
      onSubmit(payload);
      form.resetFields();
    } catch (error) {
      // AntD Form handles validation errors internally
    }
  };

  return (
    <Modal
      title={title ?? (isEditMode ? "Edit Entity" : "Create New Entity")}
      open={open}
      onCancel={handleCancel}
      destroyOnClose
      maskClosable
      keyboard
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={handleSubmit}
          disabled={loading}
        >
          {isEditMode ? "Update" : "Create"}
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          name: initialValues?.name ?? "",
          date: initialValues?.date ? dayjs(initialValues.date) : undefined,
          value: initialValues?.value ?? undefined,
        }}
        autoComplete="off"
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[
            { required: true, message: "Name is required" },
            { min: 2, message: "Name must be at least 2 characters" },
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
          <DatePicker
            style={{ width: "100%" }}
            format="DD.MM.YYYY"
            placeholder="Select date"
          />
        </Form.Item>
        <Form.Item
          label="Value"
          name="value"
          rules={[
            { required: true, message: "Value is required" },
            {
              validator: (_, value) =>
                value === undefined || value === null || value >= 0
                  ? Promise.resolve()
                  : Promise.reject(new Error("Value must be positive")),
            },
          ]}
        >
          <InputNumber
            min={0}
            step={0.01}
            style={{ width: "100%" }}
            placeholder="Enter value"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EntityFormModal;
