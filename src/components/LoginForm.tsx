// src/components/LoginForm.tsx
import React, { useState, useEffect } from 'react';
import {
  Form,
  Input,
  Button,
  Card,
  Alert,
  Layout,
  Checkbox,
  Row,
  Col,
  App,
} from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LoginCredentials } from '../types/auth';

const { Content } = Layout;

export const LoginForm: React.FC = () => {
  const { login, isAuthenticated } = useAuth();
  const { message } = App.useApp();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const autoLogin = async () => {
      const token = localStorage.getItem('auth_token');
      const userStr = localStorage.getItem('auth_user');
      const remembered = localStorage.getItem('auth_remember') === 'true';

      if (token && userStr && remembered && !isAuthenticated) {
        try {
          setLoading(true);
          const user = JSON.parse(userStr);
          // Attempt to login with stored credentials
          await login({
            email: user.email,
            password: '', // Password will be validated by token on the server
            remember: true,
          });
          message.success('Automatically logged in');
          navigate('/dashboard');
        } catch (err) {
          console.error('Auto login failed:', err);
          // Clear invalid storage data
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth_user');
          localStorage.removeItem('auth_remember');
        } finally {
          setLoading(false);
        }
      }
    };

    autoLogin();
  }, [login, navigate, message, isAuthenticated]);

  const onFinish = async (values: LoginCredentials) => {
    setLoading(true);
    setError(null);
    try {
      await login(values);
      message.success('Successfully logged in');
    } catch (err: any) {
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Content
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          background: '#f0f2f5',
        }}
      >
        <Card
          title={
            <div
              style={{
                textAlign: 'center',
                fontSize: '24px',
                margin: '12px 0',
              }}
            >
              Login
            </div>
          }
          bordered={false}
          style={{
            width: '100%',
            maxWidth: '420px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
          }}
          data-testid="login-form"
        >
          {error && (
            <Alert
              message={error}
              type="error"
              showIcon
              style={{ marginBottom: '24px' }}
              data-testid="login-error"
            />
          )}
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
            size="large"
            style={{ width: '100%' }}
            initialValues={{ remember: true }}
          >
            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Please input your email!' },
                { type: 'email', message: 'Please enter a valid email!' },
              ]}
            >
              <Input
                prefix={<UserOutlined style={{ color: '#bfbfbf' }} />}
                placeholder="Email"
                data-testid="email-input"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: 'Please input your password!' },
                { min: 6, message: 'Password must be at least 6 characters!' },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
                placeholder="Password"
                data-testid="password-input"
              />
            </Form.Item>

            <Form.Item>
              <Row justify="space-between" align="middle">
                <Col>
                  <Form.Item name="remember" valuePropName="checked" noStyle>
                    <Checkbox>Remember me</Checkbox>
                  </Form.Item>
                </Col>
                <Col>
                  <Link
                    to="/forgot-password"
                    style={{
                      color: '#1890ff',
                      textDecoration: 'none',
                    }}
                  >
                    Forgot password?
                  </Link>
                </Col>
              </Row>
            </Form.Item>

            <Form.Item style={{ marginBottom: '12px' }}>
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={loading}
                data-testid="login-button"
                style={{ height: '40px' }}
              >
                Log in
              </Button>
            </Form.Item>

            <div style={{ textAlign: 'center' }}>
              <Link
                to="/register"
                style={{
                  color: '#1890ff',
                  textDecoration: 'none',
                }}
              >
                Don't have an account? Register now
              </Link>
            </div>
          </Form>
        </Card>
      </Content>
    </Layout>
  );
};
