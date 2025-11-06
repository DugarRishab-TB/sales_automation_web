import { Button, Card, Form, Input, Typography } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import toast from '../../components/Toast.js';
import './auth.css';

const { Title } = Typography;

export default function SignUp() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const { name, email, password } = values;
      await register({ name, email, password });
      toast.success('Account created');
      navigate('/');
    } catch (err) {
      const detail = err?.response?.data?.message || 'Signup failed';
      toast.error(detail);
    }
  };

  return (
    <div className="auth-container">
      <Card className="auth-card">
        <div className="auth-header">
          <Title level={3}>Create an Account</Title>
          <p>Join Sales Automation today</p>
        </div>
        
        <Form name="signup" onFinish={onFinish} autoComplete="off" className="auth-form">
          <Form.Item name="name" rules={[{ required: true, message: 'Please input your name!' }]}> 
            <Input prefix={<UserOutlined />} placeholder="Full Name" size="large" />
          </Form.Item>

          <Form.Item name="email" rules={[{ required: true, message: 'Please input your email!' }, { type: 'email', message: 'Please enter a valid email!' }]}> 
            <Input prefix={<MailOutlined />} placeholder="Email" size="large" />
          </Form.Item>

          <Form.Item name="password" rules={[{ required: true, message: 'Please input your password!' }, { min: 6, message: 'Password must be at least 6 characters!' }]} hasFeedback> 
            <Input.Password prefix={<LockOutlined />} placeholder="Password" size="large" />
          </Form.Item>

          <Form.Item name="confirm" dependencies={["password"]} hasFeedback rules={[({ getFieldValue }) => ({ validator(_, value) { if (!value || getFieldValue('password') === value) { return Promise.resolve(); } return Promise.reject(new Error('The two passwords do not match!')); } })]}> 
            <Input.Password prefix={<LockOutlined />} placeholder="Confirm Password" size="large" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large" className="auth-button">Sign Up</Button>
          </Form.Item>
        </Form>

        <div className="auth-footer">
          <span>Already have an account? </span>
          <Link to="/auth/login">Sign in</Link>
        </div>
      </Card>
    </div>
  );
}
