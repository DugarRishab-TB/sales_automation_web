import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Card, Typography, Space, Button, Descriptions, Tag, Modal, Form, Input } from 'antd';
import { getLead, updateLead, deleteLead } from '../../services/leads.js';
import { getEmail, updateEmail, deleteEmail } from '../../services/emails.js';
import { getTeam, updateTeam, deleteTeam } from '../../services/salesTeam.js';
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import toast from '../../components/Toast.js';

const { Title, Text, Paragraph } = Typography;

export default function RecordDetails() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [record, setRecord] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [form] = Form.useForm();

  const mode = useMemo(() => {
    const p = location.pathname || '';
    if (p.includes('/sales_team')) return 'sales';
    if (p.includes('/emails')) return 'emails';
    return 'leads';
  }, [location.pathname]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        if (mode === 'sales') {
          const res = await getTeam(id);
          setRecord(res?.data?.team || null);
        } else if (mode === 'emails') {
          const res = await getEmail(id);
          setRecord(res?.data?.email || null);
        } else {
          const res = await getLead(id);
          setRecord(res?.data?.lead || null);
        }
      } catch (err) {
        const detail = err?.response?.data?.message || 'Failed to load record';
        toast.error(detail);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, mode]);

  const title = mode === 'sales' ? 'Sales Team' : mode === 'emails' ? 'Email' : 'Lead';

  const onEdit = () => {
    if (!record) return;
    form.setFieldsValue({ ...record });
    setEditOpen(true);
  };

  const onDelete = () => {
    toast.confirm({
      title: 'Delete this record?',
      icon: <ExclamationCircleOutlined />,
      okText: 'Delete',
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          setLoading(true);
          if (mode === 'sales') await deleteTeam(Number(id));
          else if (mode === 'emails') await deleteEmail(Number(id));
          else await deleteLead(Number(id));
          toast.success('Record deleted');
          navigate(-1);
        } catch (err) {
          const detail = err?.response?.data?.message || 'Failed to delete record';
          toast.error(detail);
        } finally {
          setLoading(false);
        }
      }
    });
  };

  const onUpdate = async (values) => {
    try {
      setLoading(true);
      if (mode === 'sales') {
        await updateTeam(Number(id), values);
      } else if (mode === 'emails') {
        await updateEmail(Number(id), values);
      } else {
        const payload = { ...values };
        if (payload.status) payload.status = String(payload.status).toUpperCase();
        if (payload.jobTitle !== undefined) {
          payload.job_title = payload.jobTitle;
          delete payload.jobTitle;
        }
        await updateLead(Number(id), payload);
      }
      toast.success('Record updated');
      setEditOpen(false);
      // reload record
      const reload = async () => {
        if (mode === 'sales') {
          const res = await getTeam(id);
          setRecord(res?.data?.team || null);
        } else if (mode === 'emails') {
          const res = await getEmail(id);
          setRecord(res?.data?.email || null);
        } else {
          const res = await getLead(id);
          setRecord(res?.data?.lead || null);
        }
      };
      await reload();
    } catch (err) {
      const detail = err?.response?.data?.message || 'Failed to update record';
      toast.error(detail);
    } finally {
      setLoading(false);
    }
  };

  const formFields = useMemo(() => {
    if (mode === 'sales') return [
      { name: 'name', label: 'Name' },
      { name: 'email', label: 'Email' },
      { name: 'phone', label: 'Phone' },
      { name: 'server', label: 'Server' },
      { name: 'password', label: 'Password' },
    ];
    if (mode === "emails")
		return [
			{ name: "subject", label: "Subject" },
			{ name: "toEmail", label: "To" },
			{ name: "fromEmail", label: "From" },
			{ name: "body", label: "Body" },
			{ name: "status", label: "Status" },
			{ name: "error_message", label: "Error Message" },
		];
	return [
		{ name: "name", label: "Name" },
		{ name: "email", label: "Email" },
		{ name: "status", label: "Status" },
		{ name: "company", label: "Company" },
		{ name: "website", label: "Website" },
		{ name: "linkedin", label: "LinkedIn" },
		{ name: "jobTitle", label: "Job Title" },
		{ name: "notes", label: "Notes" },
		{ name: "error_message", label: "Error Message" },
	];
  }, [mode]);

  return (
		<div className="page-container">
			<div className="page-header">
				<div>
					<Title level={2} style={{ margin: 0 }}>
						{title} Details
					</Title>
					<Text type="secondary">ID: {id}</Text>
				</div>
				<Space>
					<Button
						icon={<EditOutlined />}
						type="primary"
						onClick={onEdit}
					>
						Edit
					</Button>
					<Button icon={<DeleteOutlined />} danger onClick={onDelete}>
						Delete
					</Button>
					<Button onClick={() => navigate(-1)}>Back</Button>
				</Space>
			</div>

			<Card className="page-content" loading={loading}>
				{record && mode === "leads" && (
					<Descriptions bordered column={1} size="middle">
						<Descriptions.Item label="ID">
							{record.id}
						</Descriptions.Item>
						<Descriptions.Item label="Name">
							{record.name}
						</Descriptions.Item>
						<Descriptions.Item label="Email">
							{record.email || "-"}
						</Descriptions.Item>
						<Descriptions.Item label="Phone">
							{record.phone || "-"}
						</Descriptions.Item>
						<Descriptions.Item label="Status">
							{record.status ? <Tag>{record.status}</Tag> : "-"}
						</Descriptions.Item>
						<Descriptions.Item label="Error Message">
							{record.error_message || "-"}
						</Descriptions.Item>
						<Descriptions.Item label="Company">
							{record.company || "-"}
						</Descriptions.Item>
						<Descriptions.Item label="Website">
							{record.website || "-"}
						</Descriptions.Item>
						<Descriptions.Item label="LinkedIn">
							{record.linkedin || "-"}
						</Descriptions.Item>
						<Descriptions.Item label="Job Title">
							{record.jobTitle || "-"}
						</Descriptions.Item>
						<Descriptions.Item label="Sales Team">
							{record.salesTeam?.name ||
								record.salesTeamId ||
								"-"}
						</Descriptions.Item>
						<Descriptions.Item label="Notes">
							{record.notes || "-"}
						</Descriptions.Item>
						<Descriptions.Item label="Created At">
							{record.createdAt
								? new Date(record.createdAt).toLocaleString()
								: "-"}
						</Descriptions.Item>
						<Descriptions.Item label="Updated At">
							{record.updatedAt
								? new Date(record.updatedAt).toLocaleString()
								: "-"}
						</Descriptions.Item>
					</Descriptions>
				)}

				{record && mode === "emails" && (
					<Descriptions bordered column={1} size="middle">
						<Descriptions.Item label="ID">
							{record.id}
						</Descriptions.Item>
						<Descriptions.Item label="Subject">
							{record.subject || "-"}
						</Descriptions.Item>
						<Descriptions.Item label="To">
							{record.toEmail || "-"}
						</Descriptions.Item>
						<Descriptions.Item label="From">
							{record.fromEmail}
						</Descriptions.Item>
						<Descriptions.Item label="Status">
							{record.status ? <Tag>{record.status}</Tag> : "-"}
						</Descriptions.Item>
						<Descriptions.Item label="Error Message">
							{record.error_message || "-"}
						</Descriptions.Item>
						<Descriptions.Item label="Lead">
							{record.lead?.name || record.leadId || "-"}
						</Descriptions.Item>
						<Descriptions.Item label="Sales Team">
							{record.salesTeam?.name ||
								record.salesTeamId ||
								"-"}
						</Descriptions.Item>
						<Descriptions.Item label="Open Count">
							{record.openCount}
						</Descriptions.Item>
						<Descriptions.Item label="Click Count">
							{record.clickCount}
						</Descriptions.Item>
						<Descriptions.Item label="Sent At">
							{record.sentAt
								? new Date(record.sentAt).toLocaleString()
								: "-"}
						</Descriptions.Item>
						<Descriptions.Item label="Opened At">
							{record.openedAt
								? new Date(record.openedAt).toLocaleString()
								: "-"}
						</Descriptions.Item>
						<Descriptions.Item label="Clicked At">
							{record.clickedAt
								? new Date(record.clickedAt).toLocaleString()
								: "-"}
						</Descriptions.Item>
						<Descriptions.Item label="Created At">
							{record.createdAt
								? new Date(record.createdAt).toLocaleString()
								: "-"}
						</Descriptions.Item>
						<Descriptions.Item label="Updated At">
							{record.updatedAt
								? new Date(record.updatedAt).toLocaleString()
								: "-"}
						</Descriptions.Item>
						<Descriptions.Item label="Body">
							<Card size="small" bordered>
								<Paragraph
									style={{
										whiteSpace: "pre-wrap",
										marginBottom: 0,
									}}
								>
									{record.body || "-"}
								</Paragraph>
							</Card>
						</Descriptions.Item>
					</Descriptions>
				)}

				{record && mode === "sales" && (
					<Descriptions bordered column={1} size="middle">
						<Descriptions.Item label="ID">
							{record.id}
						</Descriptions.Item>
						<Descriptions.Item label="Name">
							{record.name}
						</Descriptions.Item>
						<Descriptions.Item label="Email">
							{record.email}
						</Descriptions.Item>
						<Descriptions.Item label="Phone">
							{record.phone || "-"}
						</Descriptions.Item>
						<Descriptions.Item label="Server">
							{record.server || "-"}
						</Descriptions.Item>
						<Descriptions.Item label="Password">
							{record.password || "-"}
						</Descriptions.Item>
						<Descriptions.Item label="Created At">
							{record.createdAt
								? new Date(record.createdAt).toLocaleString()
								: "-"}
						</Descriptions.Item>
						<Descriptions.Item label="Updated At">
							{record.updatedAt
								? new Date(record.updatedAt).toLocaleString()
								: "-"}
						</Descriptions.Item>
					</Descriptions>
				)}
			</Card>

			<Modal
				open={editOpen}
				title={`Edit ${title}`}
				onCancel={() => setEditOpen(false)}
				onOk={() => form.submit()}
				confirmLoading={loading}
				destroyOnClose
			>
				<Form
					form={form}
					layout="vertical"
					onFinish={onUpdate}
					preserve={false}
				>
					{formFields.map((f) => (
						<Form.Item key={f.name} name={f.name} label={f.label}>
							<Input />
						</Form.Item>
					))}
				</Form>
			</Modal>
		</div>
  );
}
