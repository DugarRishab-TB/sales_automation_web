import { useState } from 'react';
import { Button, Card, Input, List, Space, Tag, Typography } from 'antd';
import { SearchOutlined, PlusOutlined, RocketOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import NewCampaignForm from '../../components/forms/NewCampaignForm.jsx';

const { Title, Text } = Typography;

const initialCampaigns = [
  { id: 1, name: 'Q4 Sales Push', status: 'active', type: 'Email', sent: 1245, opened: 856, replied: 124, startDate: '2023-10-15', endDate: '2023-12-31' },
  { id: 2, name: 'New Product Launch', status: 'draft', type: 'LinkedIn', sent: 0, opened: 0, replied: 0, startDate: '2023-11-01', endDate: '2023-11-30' },
  { id: 3, name: 'Follow-up Campaign', status: 'completed', type: 'Email', sent: 856, opened: 623, replied: 89, startDate: '2023-10-01', endDate: '2023-10-14' },
];

const getStatusTag = (status) => {
  const statusMap = {
    active: { color: 'blue', text: 'Active' },
    draft: { color: 'orange', text: 'Draft' },
    completed: { color: 'green', text: 'Completed' },
    paused: { color: 'red', text: 'Paused' },
  };
  const statusInfo = statusMap[status] || { color: 'default', text: status };
  return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
};

export default function CampaignList() {
  const [campaigns, setCampaigns] = useState(initialCampaigns);
  const [openNew, setOpenNew] = useState(false);

  const handleCreate = (payload) => {
    const newItem = {
      id: Date.now(),
      name: payload.name,
      type: payload.type,
      status: 'draft',
      sent: 0,
      opened: 0,
      replied: 0,
      startDate: payload.startDate,
      endDate: payload.endDate,
    };
    setCampaigns((prev) => [newItem, ...prev]);
    setOpenNew(false);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <Title level={2} style={{ margin: 0 }}>Campaigns</Title>
        <Space>
          <Input placeholder="Search campaigns..." prefix={<SearchOutlined />} style={{ width: 250 }} />
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setOpenNew(true)}>New Campaign</Button>
        </Space>
      </div>

      <Card className="page-content">
        <List
          itemLayout="vertical"
          dataSource={campaigns}
          renderItem={(campaign) => (
            <List.Item
              key={campaign.id}
              actions={[
                <Space key="stats" size="large">
                  <div><Text strong>{campaign.sent}</Text> Sent</div>
                  <div><Text strong>{campaign.opened}</Text> Opened</div>
                  <div><Text strong>{campaign.replied}</Text> Replied</div>
                </Space>,
                <Space key="actions" size="middle">
                  <Text type="secondary">
                    {new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}
                  </Text>
                  <Link to={`/campaigns/${campaign.id}`}>View</Link>
                  <a>Edit</a>
                  {campaign.status === 'draft' && <a>Delete</a>}
                  {campaign.status === 'active' && <a>Pause</a>}
                  {campaign.status === 'paused' && <a>Resume</a>}
                </Space>
              ]}
            >
              <List.Item.Meta
                avatar={<RocketOutlined style={{ fontSize: 24 }} />}
                title={
                  <Space>
                    <Link to={`/campaigns/${campaign.id}`}>{campaign.name}</Link>
                    {getStatusTag(campaign.status)}
                    <Tag>{campaign.type}</Tag>
                  </Space>
                }
                description={<Text type="secondary">Campaign ID: {campaign.id} • Created on {new Date().toLocaleDateString()}</Text>}
              />
            </List.Item>
          )}
        />
      </Card>

      <NewCampaignForm
        open={openNew}
        onCancel={() => setOpenNew(false)}
        onCreate={handleCreate}
      />
    </div>
  );
}
