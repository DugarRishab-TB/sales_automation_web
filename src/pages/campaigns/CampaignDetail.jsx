import { useState } from 'react';
import { Button, Card, Col, Progress, Row, Space, Statistic, Steps, Table, Tabs, Tag, Typography } from 'antd';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ArrowUpOutlined, MailOutlined, MessageOutlined, PhoneOutlined, RocketOutlined, ScheduleOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import NewSearchForm from '../../components/forms/NewSearchForm.jsx';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Step } = Steps;

const performanceData = [
  { name: 'Sent', value: 1245 },
  { name: 'Opened', value: 856 },
  { name: 'Replied', value: 124 },
  { name: 'Bounced', value: 12 },
  { name: 'Unsubscribed', value: 8 },
];

const campaignSteps = [
  { title: 'Initial Email', type: 'email', status: 'completed', content: 'Introduction to our services' },
  { title: 'Follow-up Call', type: 'call', status: 'in-progress', content: 'Schedule a demo call' },
  { title: 'Demo', type: 'meeting', status: 'pending', content: 'Product demonstration' },
  { title: 'Proposal', type: 'email', status: 'pending', content: 'Send proposal and pricing' },
];

const leadsColumns = [
  { title: 'Name', dataIndex: 'name', key: 'name', render: (text) => <a>{text}</a> },
  { title: 'Email', dataIndex: 'email', key: 'email' },
  { title: 'Status', dataIndex: 'status', key: 'status', render: (status) => <Tag color={status === 'Replied' ? 'green' : status === 'Opened' ? 'blue' : 'default'}>{status}</Tag> },
  { title: 'Last Activity', dataIndex: 'lastActivity', key: 'lastActivity' },
];

const leadsData = [
  { key: '1', name: 'John Doe', email: 'john@example.com', status: 'Replied', lastActivity: '2 hours ago' },
  { key: '2', name: 'Jane Smith', email: 'jane@example.com', status: 'Opened', lastActivity: '5 hours ago' },
  { key: '3', name: 'Bob Johnson', email: 'bob@example.com', status: 'Sent', lastActivity: '1 day ago' },
];

const searchColumns = [
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Keywords', dataIndex: 'keywords', key: 'keywords' },
  { title: 'Location', dataIndex: 'location', key: 'location' },
  { title: 'Industry', dataIndex: 'industry', key: 'industry', render: (arr) => (arr && arr.length ? arr.join(', ') : '-') },
  { title: 'Company Size', dataIndex: 'companySize', key: 'companySize', render: (arr) => (arr && arr.length ? arr.join(', ') : '-') },
  { title: 'Note', dataIndex: 'note', key: 'note' },
];

const initialSearches = [
  { key: 's1', name: 'US SaaS Sales Managers', keywords: 'sales AND manager AND (SaaS OR "software")', location: 'United States', industry: ['Technology', 'Software'], companySize: ['51-200', '201-500'], note: '' },
  { key: 's2', name: 'EU SDRs', keywords: 'SDR OR BDR', location: 'Europe', industry: ['IT Services'], companySize: ['11-50', '51-200'], note: 'Focus on UK/DE' },
];

export default function CampaignDetail() {
  const { id } = useParams();
  const [openSearch, setOpenSearch] = useState(false);
  const [searches, setSearches] = useState(initialSearches);
  
  const campaign = {
    id: 1,
    name: 'Q4 Sales Push',
    status: 'active',
    type: 'Email',
    description: 'Campaign targeting enterprise clients for Q4 sales push',
    startDate: '2023-10-15',
    endDate: '2023-12-31',
    totalLeads: 1245,
    opened: 856,
    replied: 124,
    bounced: 12,
    unsubscribed: 8,
  };

  const getStepIcon = (type) => {
    switch (type) {
      case 'email':
        return <MailOutlined />;
      case 'call':
        return <PhoneOutlined />;
      case 'meeting':
        return <ScheduleOutlined />;
      default:
        return <MessageOutlined />;
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <Title level={2} style={{ margin: 0 }}>
            {campaign.name}
            <Tag color="blue" style={{ marginLeft: 12 }}>{campaign.status}</Tag>
          </Title>
          <Text type="secondary">{campaign.description} • ID: {id}</Text>
        </div>
        <Space>
          <Button>Pause Campaign</Button>
          <Button type="primary">Add Leads</Button>
          <Button type="default" onClick={() => setOpenSearch(true)}>New Search</Button>
        </Space>
      </div>

      <Card className="page-content">
        <Tabs defaultActiveKey="1">
          <TabPane tab="Overview" key="1">
            <Row gutter={[16, 24]} style={{ marginBottom: 24 }}>
              <Col xs={24} md={6}>
                <Card>
                  <Statistic title="Total Leads" value={campaign.totalLeads} prefix={<RocketOutlined />} />
                </Card>
              </Col>
              <Col xs={24} md={6}>
                <Card>
                  <Statistic title="Opened" value={campaign.opened} valueStyle={{ color: '#1890ff' }} prefix={<ArrowUpOutlined />} suffix={`(${Math.round((campaign.opened / campaign.totalLeads) * 100)}%)`} />
                </Card>
              </Col>
              <Col xs={24} md={6}>
                <Card>
                  <Statistic title="Replied" value={campaign.replied} valueStyle={{ color: '#52c41a' }} prefix={<ArrowUpOutlined />} suffix={`(${Math.round((campaign.replied / campaign.totalLeads) * 100)}%)`} />
                </Card>
              </Col>
              <Col xs={24} md={6}>
                <Card>
                  <Statistic title="Bounced" value={campaign.bounced} valueStyle={{ color: '#f5222d' }} suffix={`(${Math.round((campaign.bounced / campaign.totalLeads) * 100)}%)`} />
                </Card>
              </Col>
            </Row>

            <Row gutter={[16, 24]}>
              <Col xs={24} lg={16}>
                <Card title="Performance" style={{ marginBottom: 16 }}>
                  <div style={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={performanceData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" fill="#1890ff" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </Col>
              <Col xs={24} lg={8}>
                <Card title="Campaign Steps" style={{ marginBottom: 16 }}>
                  <Steps direction="vertical" current={1}>
                    {campaignSteps.map((step, index) => (
                      <Step
                        key={index}
                        title={step.title}
                        icon={getStepIcon(step.type)}
                        status={step.status === 'completed' ? 'finish' : step.status === 'in-progress' ? 'process' : 'wait'}
                        description={step.content}
                      />
                    ))}
                  </Steps>
                </Card>
              </Col>
            </Row>
          </TabPane>
          <TabPane tab="Searches" key="searches">
            <div style={{ marginBottom: 16 }}>
              <Button type="primary" onClick={() => setOpenSearch(true)}>New Search</Button>
            </div>
            <Table
              columns={searchColumns}
              dataSource={searches}
              pagination={{ pageSize: 10 }}
              scroll={{ x: true }}
            />
          </TabPane>
          <TabPane tab="Leads" key="2">
            <Table columns={leadsColumns} dataSource={leadsData} pagination={{ pageSize: 10 }} scroll={{ x: true }} />
          </TabPane>
          <TabPane tab="Analytics" key="3">
            <Card title="Engagement Metrics">
              <Row gutter={[16, 24]}>
                <Col xs={24} md={12}>
                  <div>
                    <Text strong>Open Rate</Text>
                    <Progress percent={Math.round((campaign.opened / campaign.totalLeads) * 100)} status="active" />
                  </div>
                </Col>
                <Col xs={24} md={12}>
                  <div>
                    <Text strong>Reply Rate</Text>
                    <Progress percent={Math.round((campaign.replied / campaign.totalLeads) * 100)} status="active" strokeColor="#52c41a" />
                  </div>
                </Col>
                <Col xs={24} md={12}>
                  <div>
                    <Text strong>Bounce Rate</Text>
                    <Progress percent={Math.round((campaign.bounced / campaign.totalLeads) * 100)} status="exception" />
                  </div>
                </Col>
                <Col xs={24} md={12}>
                  <div>
                    <Text strong>Unsubscribe Rate</Text>
                    <Progress percent={Math.round((campaign.unsubscribed / campaign.totalLeads) * 100)} status="exception" strokeColor="#ff4d4f" />
                  </div>
                </Col>
              </Row>
            </Card>
          </TabPane>
          <TabPane tab="Settings" key="4">
            <Card title="Campaign Settings">
              <p>Campaign settings and configuration will go here</p>
            </Card>
          </TabPane>
        </Tabs>
      </Card>

      <NewSearchForm
        open={openSearch}
        campaignId={id}
        onCancel={() => setOpenSearch(false)}
        onCreate={(payload) => {
          const item = { key: String(Date.now()), ...payload };
          setSearches((prev) => [item, ...prev]);
          setOpenSearch(false);
        }}
      />
    </div>
  );
}
