import React from 'react';
import { Form, Input, Button, Card, Select } from 'antd';
import { useAuth } from '../context/AuthContext';
import { RegisterData } from '../types/auth';

const { Option } = Select;

export const RegisterForm: React.FC = () => {
  const { register } = useAuth();
  const [form] = Form.useForm();

  const onFinish = async (values: RegisterData) => {
    try {
      await register(values);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Card title="Register" style={{ maxWidth: 400, margin: '40px auto' }}>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: 'Please input your name!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Please input your email!' },
            { type: 'email', message: 'Please enter a valid email!' },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            { required: true, message: 'Please input your password!' },
            { min: 6, message: 'Password must be at least 6 characters!' },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item label="Department" name="department">
          <Select placeholder="Select your department">
            <Option value="IT">IT</Option>
            <Option value="HR">HR</Option>
            <Option value="Finance">Finance</Option>
            <Option value="Marketing">Marketing</Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Register
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};
