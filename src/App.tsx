import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Layout, Menu, theme } from 'antd';
import {
  UserOutlined,
  LaptopOutlined,
  DashboardOutlined,
  LoginOutlined,
  LogoutOutlined,
  UserAddOutlined,
} from '@ant-design/icons';
import { useAuth } from './context/AuthContext';
import { LoginForm } from './components/LoginForm';
import { RegisterForm } from './components/RegisterForm';
import { Dashboard } from './pages/Dashboard';
import { Profile } from './pages/Profile';
import { Settings } from './pages/Settings';
import { ProtectedRoute } from './components/ProtectedRoute';

const { Header, Content, Sider } = Layout;

const App: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  // If on auth page and already authenticated, redirect to dashboard
  if (isAuthenticated && ['/login', '/register'].includes(location.pathname)) {
    return <Navigate to="/dashboard" replace />;
  }

  // Public routes layout
  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  const menuItems = [
    {
      key: '1',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
      path: '/dashboard',
    },
    {
      key: '2',
      icon: <UserOutlined />,
      label: 'Profile',
      path: '/profile',
    },
    {
      key: '3',
      icon: <LaptopOutlined />,
      label: 'Settings',
      path: '/settings',
    },
  ];

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          padding: '0 24px',
        }}
      >
        <div style={{ color: 'white', marginRight: 'auto' }}>ABAC Demo</div>
        {user ? (
          <Menu
            theme="dark"
            mode="horizontal"
            selectedKeys={[]}
            items={[
              {
                key: 'user',
                icon: <UserOutlined />,
                label: `Welcome, ${user.name || 'User'}`,
              },
              {
                key: 'logout',
                icon: <LogoutOutlined />,
                label: 'Logout',
                onClick: logout,
              },
            ]}
          />
        ) : (
          <Menu
            theme="dark"
            mode="horizontal"
            selectedKeys={[location.pathname]}
            items={[
              {
                key: '/login',
                icon: <LoginOutlined />,
                label: 'Login',
              },
              {
                key: '/register',
                icon: <UserAddOutlined />,
                label: 'Register',
              },
            ]}
          />
        )}
      </Header>
      <Layout>
        <Sider width={200} style={{ background: colorBgContainer }}>
          <Menu
            mode="inline"
            selectedKeys={[location.pathname]}
            style={{ height: '100%', borderRight: 0 }}
            items={menuItems.map(item => ({
              key: item.path,
              icon: item.icon,
              label: item.label,
            }))}
          />
        </Sider>
        <Layout style={{ padding: '24px' }}>
          <Content
            style={{ padding: 24, margin: 0, background: colorBgContainer }}
          >
            <Routes>
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                }
              />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default App;
