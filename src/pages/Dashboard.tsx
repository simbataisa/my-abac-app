import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { useAuth } from '../context/AuthContext';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div>
      <h1>Dashboard</h1>
      <Row gutter={16}>
        <Col span={8}>
          <Card>
            <Statistic title="Role" value={user?.role || 'N/A'} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="Department" value={user?.department || 'N/A'} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Clearance Level"
              value={user?.clearanceLevel || 'N/A'}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};
