import { createContext } from 'react';
import type { AccountStatus, AuthUser, Permission, Role } from '../rbac/roles';

export type LoginProvider = 'email' | 'google' | 'microsoft' | 'outlook';

export type ManagedUser = AuthUser & {
  password?: string;
  activationCode?: string;
  resetCode?: string;
  policyAccepted?: boolean;
};

export type CreateUserInput = {
  name: string;
  email: string;
  mobile: string;
  departmentId?: string;
  designation: string;
  reportingManagerId?: string;
  role: Role;
  status?: AccountStatus;
};

export type AuthContextValue = {
  user: AuthUser | null;
  permissions: Permission[];
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  socialLogin: (provider: Exclude<LoginProvider, 'email'>) => Promise<void>;
  createUser: (input: CreateUserInput) => Promise<ManagedUser>;
  activateUser: (email: string, code: string, password: string, acceptedPolicy: boolean) => Promise<AuthUser>;
  requestPasswordReset: (email: string) => Promise<string>;
  resetPassword: (email: string, code: string, password: string) => Promise<void>;
  refreshSession: (accessToken: string) => Promise<string>;
  users: ManagedUser[];
  logout: () => void;
  can: (permissions: Permission[]) => boolean;
  is: (roles: Role[]) => boolean;
  landingPath: string;
};

export const AuthContext = createContext<AuthContextValue | null>(null);
