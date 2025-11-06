import { useEffect, useState } from 'react';
import { Button, Card, Col, Row, Statistic } from 'antd';
import toast from '../../components/Toast.js';
import { ArrowUpOutlined } from '@ant-design/icons';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { listLeads } from '../../services/leads.js';
import { listEmails } from '../../services/emails.js';

const data = [
  { name: 'Jan', leads: 4000, responses: 2400, deals: 2400 },
  { name: 'Feb', leads: 3000, responses: 1398, deals: 2210 },
  { name: 'Mar', leads: 2000, responses: 9800, deals: 2290 },
  { name: 'Apr', leads: 2780, responses: 3908, deals: 2000 },
  { name: 'May', leads: 1890, responses: 4800, deals: 2181 },
  { name: 'Jun', leads: 2390, responses: 3800, deals: 2500 },
];

export default function Dashboard() {
  const [metrics, setMetrics] = useState({
    totalLeads: 0,
    processedLeads: 0,
    leadsError: 0,
    emailsTotal: 0,
    emailsSent: 0,
    emailsOpened: 0,
    emailsReplied: 0,
    emailsUnreplied: 0,
    emailOpens: 0,
    emailClicks: 0,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [leadsRes, emailsRes] = await Promise.all([
          listLeads(),
          listEmails(),
        ]);
        const leads = leadsRes?.data?.leads || [];
        const emails = emailsRes?.data?.emails || [];
        const processed = leads.filter(l => (l.status || '').toUpperCase() !== 'NEW').length;
        const leadsError = leads.filter(l => ((l.status || '').toUpperCase() === 'ERROR' || (l.status || '').toUpperCase() === 'INVALID')).length;
        const emailsTotal = emails.length;
        const emailsSent = emails.filter(e => (e.status || '').toUpperCase() === 'SENT').length;
        const emailsOpened = emails.filter(e => ['OPENED','REPLIED'].includes((e.status || '').toUpperCase())).length;
        const emailsReplied = emails.filter(e => (e.status || '').toUpperCase() === 'REPLIED').length;
        const emailsUnreplied = emails.filter(e => (e.status || '').toUpperCase() === 'UNREPLIED').length;
        const emailOpens = emails.reduce((acc, e) => acc + (e.openCount || 0), 0);
        const emailClicks = emails.reduce((acc, e) => acc + (e.clickCount || 0), 0);
        setMetrics({
          totalLeads: leads.length,
          processedLeads: processed,
          leadsError,
          emailsTotal,
          emailsSent,
          emailsOpened,
          emailsReplied,
          emailsUnreplied,
          emailOpens,
          emailClicks,
        });
      } catch (err) {
        const detail = err?.response?.data?.message || 'Failed to load metrics';
        toast.error(detail);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>
      <br></br>
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading}>
            <Statistic
              title="Total Leads"
              value={metrics.totalLeads}
              valueStyle={{ color: '#3f8600' }}
              prefix={<ArrowUpOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading}>
            <Statistic
              title="Leads Processed"
              value={metrics.processedLeads}
              valueStyle={{ color: '#3f8600' }}
              prefix={<ArrowUpOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading}>
            <Statistic
              title="Leads with Error"
              value={metrics.leadsError}
              valueStyle={{ color: '#3f8600' }}
              prefix={<ArrowUpOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading}>
            <Statistic
              title="Emails Total"
              value={metrics.emailsTotal}
              valueStyle={{ color: '#3f8600' }}
              prefix={<ArrowUpOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading}>
            <Statistic title="Emails Sent" value={metrics.emailsSent} valueStyle={{ color: '#3f8600' }} prefix={<ArrowUpOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading}>
            <Statistic title="Emails Opened" value={metrics.emailsOpened} valueStyle={{ color: '#3f8600' }} prefix={<ArrowUpOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading}>
            <Statistic title="Emails Replied" value={metrics.emailsReplied} valueStyle={{ color: '#3f8600' }} prefix={<ArrowUpOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading}>
            <Statistic title="Emails Unreplied" value={metrics.emailsUnreplied} valueStyle={{ color: '#3f8600' }} prefix={<ArrowUpOutlined />} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading}>
            <Statistic title="Total Opens" value={metrics.emailOpens} valueStyle={{ color: '#3f8600' }} prefix={<ArrowUpOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading}>
            <Statistic title="Total Clicks" value={metrics.emailClicks} valueStyle={{ color: '#3f8600' }} prefix={<ArrowUpOutlined />} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {/* <Col xs={24} lg={16}>
          <Card title="Monthly Performance" style={{ marginBottom: 16 }}>
            <div style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="leads" fill="#8884d8" />
                  <Bar dataKey="responses" fill="#82ca9d" />
                  <Bar dataKey="deals" fill="#ffc658" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>  */}
        
        {/* <Col xs={24} lg={8}>
          <Card title="Quick Actions" style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Button type="primary" style={{ width: '100%' }}>Add New Lead</Button>
              <Button style={{ width: '100%' }}>Start New Campaign</Button>
              <Button style={{ width: '100%' }}>View Reports</Button>
              <Button style={{ width: '100%' }}>Export Data</Button>
            </div>
          </Card>
        </Col> */}
      </Row>
    </div>
  );
}
