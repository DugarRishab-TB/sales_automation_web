import { useEffect, useMemo, useState } from 'react';
import { Button, Card, Input, Row, Space, Table, Tag, Typography } from 'antd';
import { SearchOutlined, SyncOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import api from '../../services/apiClient.js';
import toast from '../../components/Toast.js';

const { Title, Text } = Typography;

export default function SearchDetail() {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [query, setQuery] = useState('');

  const columns = useMemo(() => ([
    { title: 'Name', dataIndex: 'name', key: 'name', sorter: (a, b) => (a.name || '').localeCompare(b.name || '') },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    // { title: 'Status', dataIndex: 'status', key: 'status', render: (status) => {
    //   const s = (status || '').toUpperCase();
    //   const color = s === 'RESPONDED' ? 'green' : s === 'CONTACTED' ? 'blue' : s === 'NEW' ? 'default' : 'red';
    //   return <Tag color={color}>{status || 'NEW'}</Tag>;
    // }, filters: [
    //   { text: 'New', value: 'NEW' },
    //   { text: 'Contacted', value: 'CONTACTED' },
    //   { text: 'Responded', value: 'RESPONDED' },
    //   { text: 'Invalid', value: 'INVALID' },
    // ], onFilter: (value, record) => (record.status || '').toUpperCase() === value },
    { title: 'Company', dataIndex: 'company', key: 'company' },
    { title: 'Website', dataIndex: 'website', key: 'website' },
    { title: 'Created', dataIndex: 'createdAt', key: 'createdAt', render: (v) => v ? new Date(v).toLocaleString() : '-' },
  ]), []);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await api.get('/leadswift/leads', { params: { search_id: id } });
        const data = res?.data;
        const list = Array.isArray(data) ? data : (data?.leads || data?.items || data?.data || []);
        const mapped = list.map((x) => {
          const key = x.id || x.leadId || x._id || x.uuid || String(Math.random());
          const name = x.name || [x.firstName, x.lastName].filter(Boolean).join(' ') || '';
          const email = x.email || x.emailAddress || '';
          const status = (x.status || x.leadStatus || 'NEW');
          const website = x.website || x.websiteUrl || '';
          const company = x.company || x.companyName || '';
          const createdAt = x.createdAt || x.created_at || null;
          return { key, id: key, name, email, status, website, company, createdAt, raw: x };
        });
        setRows(mapped);
      } catch (err) {
        const detail = err?.response?.data?.message || err?.message || 'Failed to load leads for this search';
        toast.error(detail);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const filteredRows = useMemo(() => {
    if (!query) return rows;
    const q = query.toLowerCase();
    return rows.filter((r) =>
      [r.name, r.email, r.company, r.status].some((f) => (f || '').toLowerCase().includes(q))
    );
  }, [rows, query]);

  const handleSync = async () => {
    if (!rows.length) {
      toast.info('No leads to sync');
      return;
    }
    try {
      setLoading(true);
      const res = await api.post('/leadswift/leads', null, { params: { search_id: id } });
      const count = res?.data?.inserted || res?.data?.count || res?.data?.synced || rows.length;
      toast.success(`Synced ${count} leads to database`);
    } catch (err) {
      const detail = err?.response?.data?.message || err?.message || 'Failed to sync leads';
      toast.error(detail);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <Title level={2} style={{ margin: 0 }}>Search Details</Title>
          <Text type="secondary">Search ID: {id} • {rows.length} leads</Text>
        </div>
      </div>

      <Card className="page-content">
        <div style={{ marginBottom: 16 }}>
          <Space>
            <Input
              placeholder="Search within leads..."
              prefix={<SearchOutlined />}
              style={{ width: 320 }}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Button type="primary" icon={<SyncOutlined />} onClick={handleSync} disabled={!rows.length}>
              Sync with Database
            </Button>
          </Space>
        </div>
        <Table loading={loading} columns={columns} dataSource={filteredRows} pagination={{ pageSize: 10 }} scroll={{ x: true }} />
      </Card>
    </div>
  );
}
