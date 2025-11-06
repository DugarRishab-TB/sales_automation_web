import { Button, Card, Form, Input, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import toast from '../../components/Toast.js';
import './auth.css';

const { Title } = Typography;

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      await login({ email: values.email, password: values.password });
      toast.success('Logged in successfully');
      navigate('/');
    } catch (err) {
      const detail = err?.response?.data?.message || 'Login failed';
      toast.error(detail);
    }
  };

  return (
    <div className="auth-container">
      <Card className="auth-card">
        <div className="auth-header">
          <Title level={3}>Sales Automation</Title>
          <p>Sign in to your account</p>
        </div>
        
        <Form name="login" initialValues={{ remember: true }} onFinish={onFinish} autoComplete="off" className="auth-form">
          <Form.Item name="email" rules={[{ required: true, message: 'Please input your email!' }]}> 
            <Input prefix={<UserOutlined />} placeholder="Email" size="large" />
          </Form.Item>

          <Form.Item name="password" rules={[{ required: true, message: 'Please input your password!' }]}> 
            <Input.Password prefix={<LockOutlined />} placeholder="Password" size="large" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large" className="auth-button">Sign In</Button>
          </Form.Item>
        </Form>

        <div className="auth-footer">
          <span>Don't have an account? </span>
          <Link to="/auth/signup">Sign up</Link>
        </div>
      </Card>
    </div>
  );
}
