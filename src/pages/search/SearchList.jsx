import { useState } from 'react';
import { Button, Card, Input, Space, Table, Typography } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/apiClient.js';
import toast from '../../components/Toast.js';

const { Title, Text } = Typography;

export default function SearchList() {
  const navigate = useNavigate();
  const [campaignId, setCampaignId] = useState('');
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);

  const columns = [
    { title: 'Search ID', dataIndex: 'id', key: 'id' },
    { title: 'Name', dataIndex: 'name', key: 'name', render: (t) => t || '-' },
    { title: 'Leads', dataIndex: 'count', key: 'count', render: (v) => v ?? '-' },
    { title: 'Created', dataIndex: 'createdAt', key: 'createdAt', render: (v) => (v ? new Date(v).toLocaleString() : '-') },
    { title: 'Location', dataIndex: 'location', key: 'location', render: (t) => t || '-' },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (t) => t || '-' },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => <Link to={`/search/${record.id}`}>View</Link>,
    },
  ];

  const handleFetch = async () => {
    if (!campaignId) {
      toast.warning('Enter a campaign ID');
      return;
    }
    try {
      setLoading(true);
      const res = await api.get(`/leadswift/searches/${encodeURIComponent(campaignId)}`);
      const data = res?.data;
      const list = Array.isArray(data) ? data : (data?.searches || data?.items || data?.data || []);
      const mapped = list.map((x) => {
        const id = x.id || x.searchId || x.search_id || x._id || x.uuid || String(Math.random());
        const name = x.name || x.title || x.query || '';
        const location = x.location || x.city || x.state || x.country || x.html_search;
        const createdAt = x.createdAt || x.created_at || x.created || null;
        const count = x.count || x.total_results || x.leadCount || x.numLeads || x.leadsCount || null;
        const status = x.status || 'NEW';
        return { key: id, id, name, createdAt, count, raw: x, location, status };
      });
      setRows(mapped);
    } catch (err) {
      const detail = err?.response?.data?.message || 'Failed to fetch searches';
      toast.error(detail);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <Title level={2} style={{ margin: 0 }}>Searches</Title>
          <Text type="secondary">Find searches by Campaign ID</Text>
        </div>
        <Space>
          <Input
            placeholder="Enter Campaign ID"
            prefix={<SearchOutlined />}
            style={{ width: 280 }}
            value={campaignId}
            onChange={(e) => setCampaignId(e.target.value)}
            onPressEnter={handleFetch}
          />
          <Button type="primary" onClick={handleFetch}>Find Searches</Button>
        </Space>
      </div>

      <Card className="page-content">
        <Table
          loading={loading}
          columns={columns}
          dataSource={rows}
          onRow={(record) => ({ onClick: () => navigate(`/search/${record.id}`) })}
          pagination={{ pageSize: 10 }}
          scroll={{ x: true }}
        />
      </Card>
    </div>
  );
}
