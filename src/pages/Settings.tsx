import React from 'react';
import { Card, Form, Switch, Select, Button } from 'antd';
import { useAuth } from '../context/AuthContext';

export const Settings: React.FC = () => {
  const { can } = useAuth();

  return (
    <Card title="Settings">
      <Form layout="vertical">
        <Form.Item label="Dark Mode">
          <Switch />
        </Form.Item>
        <Form.Item label="Language">
          <Select defaultValue="en">
            <Select.Option value="en">English</Select.Option>
            <Select.Option value="es">Spanish</Select.Option>
            <Select.Option value="fr">French</Select.Option>
          </Select>
        </Form.Item>
        {can({ name: 'manage' }, { type: 'settings' }) && (
          <Form.Item>
            <Button type="primary">Save Settings</Button>
          </Form.Item>
        )}
      </Form>
    </Card>
  );
};
