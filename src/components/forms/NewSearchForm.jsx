import { Modal, Form, Input, Select } from 'antd';

export default function NewSearchForm({ open, onCancel, onCreate, campaignId }) {
  const [form] = Form.useForm();

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        campaignId: campaignId || null,
        name: values.name,
        keywords: values.keywords,
        location: values.location || '',
        industry: values.industry || [],
        companySize: values.companySize || [],
        note: values.note || '',
      };
      onCreate?.(payload);
      form.resetFields();
    } catch { return; }
  };

  return (
    <Modal
      title="Create New Search"
      open={open}
      onOk={handleOk}
      onCancel={() => { form.resetFields(); onCancel?.(); }}
      okText="Create"
    >
      <Form form={form} layout="vertical">
        <Form.Item label="Search Name" name="name" rules={[{ required: true, message: 'Please enter a name' }]}>
          <Input placeholder="e.g., US SaaS Sales Managers" />
        </Form.Item>

        <Form.Item label="Keywords" name="keywords" rules={[{ required: true, message: 'Please enter keywords' }]}>
          <Input.TextArea rows={3} placeholder={'e.g., sales AND manager AND (SaaS OR "software as a service")'} />
        </Form.Item>

        <Form.Item label="Location" name="location">
          <Input placeholder="e.g., United States" />
        </Form.Item>

        <Form.Item label="Industry" name="industry">
          <Select
            mode="multiple"
            allowClear
            placeholder="Select industries"
            options={[
              { label: 'Technology', value: 'Technology' },
              { label: 'Software', value: 'Software' },
              { label: 'IT Services', value: 'IT Services' },
              { label: 'Finance', value: 'Finance' },
            ]}
          />
        </Form.Item>

        <Form.Item label="Company Size" name="companySize">
          <Select
            mode="multiple"
            allowClear
            placeholder="Select company sizes"
            options={[
              { label: '1-10', value: '1-10' },
              { label: '11-50', value: '11-50' },
              { label: '51-200', value: '51-200' },
              { label: '201-500', value: '201-500' },
              { label: '501-1000', value: '501-1000' },
              { label: '1001-5000', value: '1001-5000' },
              { label: '5000+', value: '5000+' },
            ]}
          />
        </Form.Item>

        <Form.Item label="Note" name="note">
          <Input.TextArea rows={3} placeholder="Optional notes" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
