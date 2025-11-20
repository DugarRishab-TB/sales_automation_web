import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { Button, Card, Col, Input, Row, Space, Table, Tag, Typography, Modal, Form } from 'antd';
import { SearchOutlined, DownloadOutlined, UploadOutlined, FilterOutlined, PlusOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined, SyncOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import {
	listLeads,
	createLead,
	updateLead,
	deleteLead,
	exportLeadsCsv,
	importLeadsCsv,
} from "../../services/leads.js";
import { listEmails, createEmail, updateEmail, deleteEmail, exportEmailsCsv, importEmailsCsv } from '../../services/emails.js';
import toast from '../../components/Toast.js';

const { Title, Text } = Typography;

export default function DatabaseDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const [editOpen, setEditOpen] = useState(false);
  const [editForm] = Form.useForm();
  const [currentRecord, setCurrentRecord] = useState(null);
  const [refresh, setRefresh] = useState(0);
  const fileInputRef = useRef(null);
  const [filtersForm] = Form.useForm();
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const mode = useMemo(() => {
    const p = location.pathname || "";
    if (p.includes('/emails')) return 'emails';
    return 'leads';
  }, [location.pathname]);

  const onExport = async () => {
    try {
      setLoading(true);
      const res = mode === 'emails' ? await exportEmailsCsv() : await exportLeadsCsv();
      const blob = new Blob([res.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = mode === 'emails' ? 'emails-export.csv' : 'leads-export.csv';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      const detail = err?.response?.data?.message || 'Failed to export CSV';
      toast.error(detail);
    } finally {
      setLoading(false);
    }
  };
 
  const onSync = async () => {
    try {
      setLoading(true);
      const res = await fetcher(filters);
      const key = mode === "emails" ? "emails" : "leads";
      const list = res?.data?.[key] || [];
      const mapped = list.map((x) => ({ key: x.id || x.key || String(Math.random()), ...x }));
      setRows(mapped);
      toast.success(`Synced ${mapped.length} records`);
    } catch (err) {
      const detail = err?.response?.data?.message || 'Failed to sync';
      toast.error(detail);
    } finally {
      setLoading(false);
    }
  };

  const onImportCsvChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setLoading(true);
      if (mode === 'emails') {
        await importEmailsCsv(file);
      } else if (mode === 'leads') {
        await importLeadsCsv(file);
      } else {
        toast.info('Import not available for Sales Team');
        return;
      }
      toast.success('Import completed');
      setRefresh((x) => x + 1);
    } catch (err) {
      const detail = err?.response?.data?.message || 'Failed to import CSV';
      toast.error(detail);
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
      setLoading(false);
    }
  };

  const onEdit = useCallback((record) => {
    setCurrentRecord(record);
    const init = { ...record };
    editForm.setFieldsValue(init);
    setEditOpen(true);
  }, [editForm]);

  const onDelete = useCallback((record) => {
    toast.confirm({
      title: 'Delete this record?',
      icon: <ExclamationCircleOutlined />,
      okText: 'Delete',
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          setLoading(true);
          if (mode === "emails") await deleteEmail(record.id);
			else await deleteLead(record.id);
          toast.success('Record deleted');
          setRefresh((x) => x + 1);
        } catch (err) {
          const detail = err?.response?.data?.message || 'Failed to delete record';
          toast.error(detail);
        } finally {
          setLoading(false);
        }
      }
    });
  }, [mode]);

  const filterFields = useMemo(() => {
		if (mode === "emails")
			return [
				{ name: "toEmail", label: "To" },
				{ name: "fromEmail", label: "From" },
				{ name: "status", label: "Status" },
				{ name: "error_message", label: "Error Message" },
				{ name: "leadId", label: "Lead ID" },
			];
		return [
			{ name: "name", label: "Name" },
			{ name: "email", label: "Email" },
			{ name: "phone", label: "Phone" },
			{ name: "company", label: "Company" },
			{ name: "website", label: "Website" },
			{ name: "status", label: "Status" },
			{ name: "error_message", label: "Error Message" },
		];
  }, [mode]);

  const applyFilters = (vals) => {
		setFilters(vals || {});
		setPage(1);
  };

  const resetFilters = () => {
		filtersForm.resetFields();
		setFilters({});
		setPage(1);
  };

  const { title, fetcher, columns, modePath } = useMemo(() => {
		if (mode === "emails") {
			return {
				title: "Emails",
				fetcher: listEmails,
				columns: [
					{ title: "ID", dataIndex: "id", key: "id" },
					{ title: "Subject", dataIndex: "subject", key: "subject" },
					{ title: "To", dataIndex: "toEmail", key: "toEmail" },
					{ title: "From", dataIndex: "fromEmail", key: "fromEmail" },
					{
						title: "Status",
						dataIndex: "status",
						key: "status",
						render: (status) => {
							const s = (status || "").toUpperCase();
							const color =
								s === "SENT"
									? "blue"
									: s === "OPENED"
									? "green"
									: s === "REPLIED"
									? "cyan"
									: s === "ERROR" || s === "INVALID"
									? "red"
									: "default";
							return <Tag color={color}>{status}</Tag>;
						},
						filters: [
							{ text: "New", value: "NEW" },
							{ text: "Sent", value: "SENT" },
							{ text: "Opened", value: "OPENED" },
							{ text: "Replied", value: "REPLIED" },
							{ text: "Unreplied", value: "UNREPLIED" },
							{ text: "Error", value: "ERROR" },
							{ text: "Invalid", value: "INVALID" },
						],
						onFilter: (value, record) =>
							(record.status || "").toUpperCase() === value,
					},
					{
						title: "Error Message",
						dataIndex: "error_message",
						key: "error_message",
						render: (msg) =>
							msg ? (
								<span title={msg}>
									{msg.substring(0, 30)}...
								</span>
							) : (
								"-"
							),
					},
					{
						title: "Open Count",
						dataIndex: "openCount",
						key: "openCount",
					},
					{
						title: "Click Count",
						dataIndex: "clickCount",
						key: "clickCount",
					},
					{ title: "Lead ID", dataIndex: "leadId", key: "leadId" },
					{
						title: "Sent At",
						dataIndex: "sentAt",
						key: "sentAt",
						render: (v) => (v ? new Date(v).toLocaleString() : "-"),
					},
					{
						title: "Opened At",
						dataIndex: "openedAt",
						key: "openedAt",
						render: (v) => (v ? new Date(v).toLocaleString() : "-"),
					},
					{
						title: "Clicked At",
						dataIndex: "clickedAt",
						key: "clickedAt",
						render: (v) => (v ? new Date(v).toLocaleString() : "-"),
					},
					{
						title: "Created",
						dataIndex: "createdAt",
						key: "createdAt",
						render: (v) => (v ? new Date(v).toLocaleString() : "-"),
					},
					{
						title: "Updated",
						dataIndex: "updatedAt",
						key: "updatedAt",
						render: (v) => (v ? new Date(v).toLocaleString() : "-"),
					},
					{
						title: "Actions",
						key: "actions",
						render: (_, record) => (
							<Space size="middle">
								<Button
									size="small"
									icon={<EditOutlined />}
									onClick={(e) => {
										e.stopPropagation();
										onEdit(record);
									}}
								/>
								<Button
									size="small"
									danger
									icon={<DeleteOutlined />}
									onClick={(e) => {
										e.stopPropagation();
										onDelete(record);
									}}
								/>
							</Space>
						),
					},
				],
				modePath: "emails",
			};
		}
		return {
			title: "Leads",
			fetcher: listLeads,
			columns: [
				{
					title: "ID",
					dataIndex: "id",
					key: "id",
					sorter: (a, b) => a.id - b.id,
				},
				{
					title: "Name",
					dataIndex: "name",
					key: "name",
					sorter: (a, b) =>
						(a.name || "").localeCompare(b.name || ""),
				},
				{ title: "Email", dataIndex: "email", key: "email" },
				{ title: "Phone", dataIndex: "phone", key: "phone" },
				{
					title: "Status",
					dataIndex: "status",
					key: "status",
					render: (status) => {
						const s = (status || "").toUpperCase();
						const color =
							s === "RESPONDED"
								? "green"
								: s === "CONTACTED"
								? "blue"
								: s === "NEW"
								? "default"
								: s === "ERROR"
								? "red"
								: s === "INVALID"
								? "orange"
								: "red";
						return <Tag color={color}>{status}</Tag>;
					},
					filters: [
						{ text: "New", value: "NEW" },
						{ text: "Contacted", value: "CONTACTED" },
						{ text: "Responded", value: "RESPONDED" },
						{ text: "Invalid", value: "INVALID" },
						{ text: "Not Interested", value: "NOT_INTERESTED" },
						{ text: "Error", value: "ERROR" },
					],
					onFilter: (value, record) =>
						(record.status || "").toUpperCase() === value,
				},
				{
					title: "Error Message",
					dataIndex: "error_message",
					key: "error_message",
					render: (msg) =>
						msg ? (
							<span title={msg}>{msg.substring(0, 30)}...</span>
						) : (
							"-"
						),
				},
				{ title: "Company", dataIndex: "company", key: "company" },
				{ title: "Website", dataIndex: "website", key: "website" },
				{ title: "LinkedIn", dataIndex: "linkedin", key: "linkedin" },
				{ title: "Job Title", dataIndex: "jobTitle", key: "jobTitle" },
				{ title: "Notes", dataIndex: "notes", key: "notes" },
				{
					title: "Created",
					dataIndex: "createdAt",
					key: "createdAt",
					render: (v) => (v ? new Date(v).toLocaleString() : "-"),
				},
				{
					title: "Updated",
					dataIndex: "updatedAt",
					key: "updatedAt",
					render: (v) => (v ? new Date(v).toLocaleString() : "-"),
				},
				{
					title: "Actions",
					key: "actions",
					render: (_, record) => (
						<Space size="middle">
							<Button
								size="small"
								icon={<EditOutlined />}
								onClick={(e) => {
									e.stopPropagation();
									onEdit(record);
								}}
							/>
							<Button
								size="small"
								danger
								icon={<DeleteOutlined />}
								onClick={(e) => {
									e.stopPropagation();
									onDelete(record);
								}}
							/>
						</Space>
					),
				},
			],
			modePath: "leads",
		};
  }, [mode, onEdit, onDelete]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetcher(filters);
        const key = mode === "emails" ? "emails" : "leads";
        const list = res?.data?.[key] || [];
        const mapped = list.map((x) => ({ key: x.id || x.key || String(Math.random()), ...x }));
        setRows(mapped);
      } catch (err) {
        const detail = err?.response?.data?.message || 'Failed to load records';
        toast.error(detail);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [fetcher, mode, refresh, filters]);

  // removed unused createUrl

  const formFields = useMemo(() => {
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

  const onCreate = async (values) => {
    try {
      setLoading(true);
      if (mode === "emails") await createEmail(values);
		else {
			const payload = { ...values };
			if (payload.jobTitle !== undefined) {
				payload.job_title = payload.jobTitle;
				delete payload.jobTitle;
			}
			await createLead(payload);
		}
      toast.success('Record created');
      setOpen(false);
      form.resetFields();
      setRefresh((x) => x + 1);
    } catch (err) {
      const detail = err?.response?.data?.message || 'Failed to create record';
      toast.error(detail);
    } finally {
      setLoading(false);
    }
  };
  
  

  const onUpdate = async (values) => {
    if (!currentRecord) return;
    try {
      setLoading(true);
      if (mode === "emails") {
			await updateEmail(currentRecord.id, values);
		} else {
			const payload = { ...values };
			if (payload.status)
				payload.status = String(payload.status).toUpperCase();
			if (payload.jobTitle !== undefined) {
				payload.job_title = payload.jobTitle;
				delete payload.jobTitle;
			}
			await updateLead(currentRecord.id, payload);
		}
      toast.success('Record updated');
      setEditOpen(false);
      editForm.resetFields();
      setCurrentRecord(null);
      setRefresh((x) => x + 1);
    } catch (err) {
      const detail = err?.response?.data?.message || 'Failed to update record';
      toast.error(detail);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <Title level={2} style={{ margin: 0 }}>{title} Database</Title>
          <Text type="secondary">{rows.length} records</Text>
        </div>
        <Space>
          <Button icon={<DownloadOutlined />} onClick={onExport}>Export</Button>
          <input ref={fileInputRef} type="file" accept=".csv" style={{ display: 'none' }} onChange={onImportCsvChange} />
          <Button icon={<FilterOutlined />} onClick={() => setFiltersOpen(true)}>Filters</Button>
          <Button icon={<SyncOutlined />} onClick={onSync}>Sync</Button>
          <Button icon={<UploadOutlined />} onClick={() => fileInputRef.current?.click()}>Import</Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setOpen(true)}>Add Record</Button>
        </Space>
      </div>

      <Card className="page-content">
        <Table
          loading={loading}
          columns={columns}
          dataSource={rows}
          pagination={{ current: page, pageSize, showSizeChanger: true }}
          scroll={{ x: true }}
          onChange={(pagination) => {
            setPage(pagination.current || 1);
            setPageSize(pagination.pageSize || 10);
          }}
          onRow={(record) => ({
            onClick: () => navigate(`/${modePath}/${record.id}`),
          })}
        />
      </Card>

      <Modal
        open={filtersOpen}
        title="Filters"
        onCancel={() => setFiltersOpen(false)}
        onOk={() => filtersForm.submit()}
        okText="Apply"
        destroyOnClose
      >
        <Form form={filtersForm} layout="vertical" onFinish={(vals) => { applyFilters(vals); setFiltersOpen(false); }} preserve={false}>
          {filterFields.map((f) => (
            <Form.Item key={f.name} name={f.name} label={f.label}>
              <Input allowClear />
            </Form.Item>
          ))}
          <Button onClick={resetFilters}>Reset</Button>
        </Form>
      </Modal>

      <Modal
        open={open}
        title={`Add Record`}
        onCancel={() => setOpen(false)}
        onOk={() => form.submit()}
        confirmLoading={loading}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={onCreate} preserve={false}>
          {formFields.map((f) => (
            <Form.Item key={f.name} name={f.name} label={f.label}>
              <Input />
            </Form.Item>
          ))}
        </Form>
      </Modal>

      <Modal
        open={editOpen}
        title={`Edit Record`}
        onCancel={() => { setEditOpen(false); setCurrentRecord(null); }}
        onOk={() => editForm.submit()}
        confirmLoading={loading}
        destroyOnClose
      >
        <Form form={editForm} layout="vertical" onFinish={onUpdate} preserve={false}>
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
