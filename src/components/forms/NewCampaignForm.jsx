import { Modal, Form, Input, Select, DatePicker } from 'antd';

const { RangePicker } = DatePicker;

export default function NewCampaignForm({ open, onCancel, onCreate }) {
  const [form] = Form.useForm();

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const [start, end] = values.dateRange || [];
      const payload = {
        name: values.name,
        type: values.type,
        description: values.description || '',
        startDate: start ? start.format('YYYY-MM-DD') : '',
        endDate: end ? end.format('YYYY-MM-DD') : '',
      };
      onCreate?.(payload);
      form.resetFields();
    } catch { return; }
  };

  return (
    <Modal
      title="Create New Campaign"
      open={open}
      onOk={handleOk}
      onCancel={() => {
        form.resetFields();
        onCancel?.();
      }}
      okText="Create"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Campaign Name"
          name="name"
          rules={[{ required: true, message: 'Please enter a campaign name' }]}
        >
          <Input placeholder="e.g., Q4 Sales Push" />
        </Form.Item>

        <Form.Item
          label="Type"
          name="type"
          rules={[{ required: true, message: 'Please select a type' }]}
        >
          <Select
            placeholder="Select type"
            options={[
              { value: 'Email', label: 'Email' },
              { value: 'LinkedIn', label: 'LinkedIn' },
              { value: 'Calls', label: 'Calls' },
            ]}
          />
        </Form.Item>

        <Form.Item label="Duration" name="dateRange">
          <RangePicker style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item label="Description" name="description">
          <Input.TextArea rows={3} placeholder="What is this campaign about?" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
