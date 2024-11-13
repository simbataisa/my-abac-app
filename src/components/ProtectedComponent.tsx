import React from 'react';
import { useAuth } from '../context/AuthContext';
import { ActionAttributes, ResourceAttributes } from '@/types/auth';

interface ProtectedComponentProps {
  action: ActionAttributes;
  resource: ResourceAttributes;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const ProtectedComponent: React.FC<ProtectedComponentProps> = ({
  action,
  resource,
  children,
  fallback = null,
}) => {
  const { can } = useAuth();

  return can(action, resource) ? <>{children}</> : <>{fallback}</>;
};
