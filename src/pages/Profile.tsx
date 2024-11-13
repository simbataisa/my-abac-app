import React from 'react';
import { Card, Descriptions } from 'antd';
import { useAuth } from '../context/AuthContext';

export const Profile: React.FC = () => {
  const { user } = useAuth();

  return (
    <Card title="User Profile">
      <Descriptions bordered>
        <Descriptions.Item label="Name">
          {user?.name || 'N/A'}
        </Descriptions.Item>
        <Descriptions.Item label="Role">
          {user?.role || 'N/A'}
        </Descriptions.Item>
        <Descriptions.Item label="Department">
          {user?.department || 'N/A'}
        </Descriptions.Item>
        <Descriptions.Item label="Region">
          {user?.region || 'N/A'}
        </Descriptions.Item>
        <Descriptions.Item label="Clearance Level">
          {user?.clearanceLevel || 'N/A'}
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
};
