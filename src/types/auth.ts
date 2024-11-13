// src/types/auth.ts
type AttributeValue = string | number | boolean;

export interface LoginCredentials {
  email: string;
  password: string;
  remember?: boolean;
}

export interface UserAttributes {
  id?: number | string; // Added for user identification
  name?: string; // Added to match with RegisterData
  email: string; // Added as it's required for authentication
  role: string;
  department?: string;
  clearanceLevel?: number;
  region?: string;
  features?: string[]; // Added for feature-based access control
  [key: string]: AttributeValue | undefined | string[]; // Updated to allow string[] for features
}

export interface ResourceAttributes {
  type: string;
  sensitivity?: 'low' | 'medium' | 'high'; // Made more specific
  department?: string;
  region?: string;
  requiredClearance?: number; // Added for clearance level checks
  featureName?: string; // Added for feature-based access
  [key: string]: AttributeValue | undefined;
}

export interface ActionAttributes {
  name: string;
  requires2FA?: boolean;
  level?: 'read' | 'write' | 'admin'; // Added for action-level permissions
  [key: string]: AttributeValue | undefined;
}

export interface EnvironmentAttributes {
  time?: number;
  date?: string;
  ipAddress?: string;
  timezone?: string; // Added for timezone-specific rules
  userAgent?: string; // Added for device-specific rules
  [key: string]: AttributeValue | undefined;
}

export interface PolicyRule {
  effect: 'allow' | 'deny';
  description?: string; // Added for better rule documentation
  priority?: number; // Added for rule ordering
  condition: (
    user: UserAttributes,
    resource: ResourceAttributes,
    action: ActionAttributes,
    environment: EnvironmentAttributes
  ) => boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
  remember?: boolean; // Added for "remember me" functionality
}

export interface RegisterData extends LoginCredentials {
  name: string;
  department?: string;
  role?: string;
  region?: string; // Added to match UserAttributes
  clearanceLevel?: number; // Added to match UserAttributes
}

export interface AuthResponse {
  token: string;
  refreshToken?: string; // Added for refresh token support
  user: UserAttributes;
  expiresIn?: number; // Added for token expiration
}

export interface AuthError {
  message: string;
  code?: string;
  field?: string; // Added for field-specific errors
  details?: Record<string, unknown>; // Added for detailed error information
}

// Added new interfaces for better type safety
export interface TokenPayload {
  sub: string | number; // subject (user id)
  email: string;
  role: string;
  exp: number; // expiration timestamp
  iat: number; // issued at timestamp
}

export type PermissionLevel = 'none' | 'read' | 'write' | 'admin';

export interface Permission {
  resource: string;
  level: PermissionLevel;
}
