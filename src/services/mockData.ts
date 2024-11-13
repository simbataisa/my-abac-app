interface MockUser {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
  department: string;
  clearanceLevel: number;
  region: string;
}

export const mockUsers: MockUser[] = [
  {
    id: 1,
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin',
    department: 'IT',
    clearanceLevel: 3,
    region: 'Global',
  },
  {
    id: 2,
    name: 'Manager User',
    email: 'manager@example.com',
    password: 'manager123',
    role: 'manager',
    department: 'HR',
    clearanceLevel: 2,
    region: 'NA',
  },
  {
    id: 3,
    name: 'Regular User',
    email: 'user@example.com',
    password: 'user123',
    role: 'user',
    department: 'Marketing',
    clearanceLevel: 1,
    region: 'EU',
  },
  {
    id: 4,
    name: 'Dennis Dao',
    email: 'dennis@gmail.com',
    password: 'password',
    role: 'admin',
    department: 'IT',
    clearanceLevel: 3,
    region: 'Global',
  },
];
