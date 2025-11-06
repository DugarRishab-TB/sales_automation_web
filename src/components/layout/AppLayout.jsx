import { useState } from 'react';
import { Layout, Menu } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { PieChartOutlined, DatabaseOutlined, SearchOutlined } from '@ant-design/icons';

const { Header, Sider, Content } = Layout;

export default function AppLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const { pathname } = useLocation();

  const selectedKey = pathname.startsWith('/leads')
    ? '/leads'
    : pathname.startsWith('/emails')
    ? '/emails'
    : pathname.startsWith('/sales_team')
    ? '/sales_team'
    : pathname.startsWith('/searches') || pathname.startsWith('/search')
    ? '/searches'
    : '/';

  const items = [
    {
      key: '/',
      icon: <PieChartOutlined />,
      label: <Link to="/">Dashboard</Link>,
    },
    {
      key: '/leads',
      icon: <DatabaseOutlined />,
      label: <Link to="/leads">Leads</Link>,
    },
    {
      key: '/emails',
      icon: <DatabaseOutlined />,
      label: <Link to="/emails">Emails</Link>,
    },
    {
      key: '/sales_team',
      icon: <DatabaseOutlined />,
      label: <Link to="/sales_team">Sales Team</Link>,
    },
    {
      key: '/searches',
      icon: <SearchOutlined />,
      label: <Link to="/searches">Searches</Link>,
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh', minWidth: '100%' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={(v) => setCollapsed(v)}>
        <div style={{ height: 48, margin: 16, background: 'rgba(255,255,255,0.2)', borderRadius: 6 }} />
        <Menu theme="dark" mode="inline" selectedKeys={[selectedKey]} items={items} />
      </Sider>
      <Layout>
        {/* <Header style={{ background: '#fff', padding: '0 16px' }} /> */}
        <Content style={{ padding: '1rem', width: '100%' }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}

