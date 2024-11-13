import { Button } from 'antd';
import { ProtectedComponent } from '../components/ProtectedComponent';

export const TestPage = () => {
  return (
    <div style={{ padding: 24 }}>
      <h1>ABAC Test Page</h1>

      <ProtectedComponent
        action={{ name: 'read' }}
        resource={{ type: 'document', department: 'IT' }}
        fallback={<div>Access Denied</div>}
      >
        <Button type="primary">Protected Button</Button>
      </ProtectedComponent>
    </div>
  );
};
