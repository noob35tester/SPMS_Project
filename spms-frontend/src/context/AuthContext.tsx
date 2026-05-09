import { type ReactNode, useCallback, useMemo, useState } from 'react';
import { http } from '../api/http';
import { getLandingPath, getRolePermissions, hasRole } from '../rbac/access';
import { demoAccounts } from '../rbac/demoAccounts';
import type { AuthUser, Permission, Role } from '../rbac/roles';
import { AuthContext, type CreateUserInput, type ManagedUser } from './authState';

type ApiUser = Partial<AuthUser> & {
  id: string;
  name: string;
  email: string;
  roleName?: string;
  roles?: Role[];
  permissions?: Permission[];
  landingPath?: string;
};

const TOKEN_KEY = 'accessToken';
const USER_KEY = 'user';
const USERS_KEY = 'spmsUsers';

function activationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function normalizeRole(role?: string): Role {
  if (role === 'TEAM_LEAD' || role === 'MANAGER') {
    return 'MANAGER_TEAM_LEAD';
  }

  if (
    role === 'SUPER_ADMIN' ||
    role === 'ADMIN' ||
    role === 'HR' ||
    role === 'MANAGER_TEAM_LEAD' ||
    role === 'EMPLOYEE' ||
    role === 'SALES_CRM'
  ) {
    return role;
  }

  return 'EMPLOYEE';
}

function normalizeApiUser(user: ApiUser): AuthUser {
  const role = normalizeRole(user.role ?? user.roleName ?? user.roles?.[0]);

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role,
    roles: user.roles?.map(normalizeRole) ?? [role],
    permissions: user.permissions ?? getRolePermissions(role),
    landingPath: user.landingPath ?? getLandingPath(role),
    mobile: user.mobile,
    department: user.department,
    departmentId: user.departmentId,
    designation: user.designation,
    reportingManager: user.reportingManager,
    reportingManagerId: user.reportingManagerId,
    status: user.status ?? 'ACTIVE',
  };
}

function seedUsers(): ManagedUser[] {
  const raw = localStorage.getItem(USERS_KEY);

  if (raw) {
    return JSON.parse(raw);
  }

  const seeded = demoAccounts.map((account) => ({
    ...account,
    password: account.password,
    status: account.status ?? 'ACTIVE',
    policyAccepted: true,
  }));
  localStorage.setItem(USERS_KEY, JSON.stringify(seeded));
  return seeded;
}

function isAllowedToLogin(user: ManagedUser) {
  if (!user.role) {
    throw new Error('Role is not assigned');
  }

  if (getRolePermissions(user.role).length === 0) {
    throw new Error('Permissions are not available');
  }

  if (user.status !== 'ACTIVE') {
    throw new Error(`Account status is ${user.status ?? 'not active'}`);
  }
}

function hasUserPermission(user: AuthUser | null, requiredPermissions: Permission[]) {
  if (!user) {
    return false;
  }

  const availablePermissions = user.permissions ?? getRolePermissions(user.role);
  return requiredPermissions.every((permission) => availablePermissions.includes(permission));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? normalizeApiUser(JSON.parse(raw)) : null;
  });
  const [users, setUsers] = useState<ManagedUser[]>(seedUsers);

  const permissions = useMemo(() => (user ? user.permissions ?? getRolePermissions(user.role) : []), [user]);
  const landingPath = user ? user.landingPath ?? getLandingPath(user.role) : '/login';
  const isAuthenticated = Boolean(user && localStorage.getItem(TOKEN_KEY));

  const persistUsers = useCallback((nextUsers: ManagedUser[]) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(nextUsers));
    setUsers(nextUsers);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await http.post('/auth/login', { email, password });
      const apiUser = normalizeApiUser(response.data.user);
      if (apiUser.status && apiUser.status !== 'ACTIVE') {
        throw new Error('Account is not active');
      }
      localStorage.setItem(TOKEN_KEY, response.data.accessToken);
      localStorage.setItem(USER_KEY, JSON.stringify(apiUser));
      setUser(apiUser);
      return apiUser;
    } catch (error) {
      const localUser = users.find((account) => account.email.toLowerCase() === email.toLowerCase());

      if (!localUser) {
        throw error;
      }

      if (localUser.password !== password) {
        throw new Error('Invalid password');
      }

      isAllowedToLogin(localUser);

      const demoUser = normalizeApiUser(localUser);
      localStorage.setItem(TOKEN_KEY, 'demo-token');
      localStorage.setItem(USER_KEY, JSON.stringify(demoUser));
      setUser(demoUser);
      return demoUser;
    }
  }, [users]);

  const refreshSession = useCallback(async (accessToken: string) => {
    localStorage.setItem(TOKEN_KEY, accessToken);
    const response = await http.get('/auth/me');
    const apiUser = normalizeApiUser(response.data);
    localStorage.setItem(USER_KEY, JSON.stringify(apiUser));
    setUser(apiUser);
    return apiUser.landingPath ?? getLandingPath(apiUser.role);
  }, []);

  const socialLogin = useCallback(async (provider: 'google' | 'microsoft' | 'outlook') => {
    const baseUrl = http.defaults.baseURL ?? 'http://localhost:3000/api';
    const returnTo = `${window.location.origin}/auth/callback`;
    window.location.assign(`${baseUrl}/auth/social/${provider}/start?returnTo=${encodeURIComponent(returnTo)}`);
  }, []);

  const createUser = useCallback(async (input: CreateUserInput) => {
    if (!hasUserPermission(user, ['users:create'])) {
      throw new Error('Only Super Admin, Admin, or HR can create users');
    }

    try {
      const response = await http.post('/users', input);
      const created = normalizeApiUser(response.data) as ManagedUser;
      created.activationCode = response.data.activationCode;
      persistUsers([created, ...users.filter((account) => account.id !== created.id)]);
      return created;
    } catch (error) {
      if (users.some((account) => account.email.toLowerCase() === input.email.toLowerCase())) {
        throw new Error('A user with this email already exists');
      }

      const newUser: ManagedUser = {
        id: `user-${Date.now()}`,
        ...input,
        email: input.email.toLowerCase(),
        role: input.role,
        status: 'PENDING_ACTIVATION',
        activationCode: activationCode(),
        policyAccepted: false,
      };
      persistUsers([...users, newUser]);
      return newUser;
    }
  }, [persistUsers, user, users]);

  const activateUser = useCallback(async (email: string, code: string, password: string, acceptedPolicy: boolean) => {
    try {
      const response = await http.post('/auth/activate', {
        email,
        code,
        password,
        acceptedPolicy,
      });
      const apiUser = normalizeApiUser(response.data.user);
      localStorage.setItem(TOKEN_KEY, response.data.accessToken);
      localStorage.setItem(USER_KEY, JSON.stringify(apiUser));
      setUser(apiUser);
      return apiUser;
    } catch (error) {
      const localUser = users.find((account) => account.email.toLowerCase() === email.toLowerCase());

      if (!localUser || localUser.activationCode !== code) {
        throw error instanceof Error ? error : new Error('Invalid activation link or OTP');
      }

      if (!acceptedPolicy) {
        throw new Error('Company policy acceptance is required');
      }

      const activatedUser: ManagedUser = {
        ...localUser,
        password,
        status: 'ACTIVE',
        activationCode: undefined,
        policyAccepted: true,
      };
      const nextUsers = users.map((account) => (account.id === activatedUser.id ? activatedUser : account));
      persistUsers(nextUsers);

      localStorage.setItem(TOKEN_KEY, 'demo-token');
      localStorage.setItem(USER_KEY, JSON.stringify(activatedUser));
      setUser(activatedUser);
      return activatedUser;
    }
  }, [persistUsers, users]);

  const requestPasswordReset = useCallback(async (email: string) => {
    try {
      const response = await http.post('/auth/forgot-password', { email });
      return response.data.resetCode;
    } catch (error) {
      const localUser = users.find((account) => account.email.toLowerCase() === email.toLowerCase());

      if (!localUser) {
        throw error instanceof Error ? error : new Error('Account not found');
      }

      if (localUser.status !== 'ACTIVE') {
        throw new Error('Only active accounts can reset passwords');
      }

      const resetCode = activationCode();
      persistUsers(users.map((account) => (account.id === localUser.id ? { ...account, resetCode } : account)));
      return resetCode;
    }
  }, [persistUsers, users]);

  const resetPassword = useCallback(async (email: string, code: string, password: string) => {
    try {
      await http.post('/auth/reset-password', { email, code, password });
    } catch (error) {
      const localUser = users.find((account) => account.email.toLowerCase() === email.toLowerCase());

      if (!localUser || localUser.resetCode !== code) {
        throw error instanceof Error ? error : new Error('Invalid reset code');
      }

      persistUsers(users.map((account) => (
        account.id === localUser.id ? { ...account, password, resetCode: undefined } : account
      )));
    }
  }, [persistUsers, users]);

  const logout = useCallback(() => {
    if (localStorage.getItem(TOKEN_KEY) !== 'demo-token') {
      void http.post('/auth/logout').catch(() => undefined);
    }
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
  }, []);

  const can = useCallback(
    (requiredPermissions: Permission[]) => hasUserPermission(user, requiredPermissions),
    [user],
  );

  const is = useCallback(
    (allowedRoles: Role[]) => (user ? hasRole(user.role, allowedRoles) : false),
    [user],
  );

  const value = useMemo(
    () => ({
      user,
      users,
      permissions,
      isAuthenticated,
      login,
      socialLogin,
      createUser,
      activateUser,
      requestPasswordReset,
      resetPassword,
      refreshSession,
      logout,
      can,
      is,
      landingPath,
    }),
    [
      activateUser,
      can,
      createUser,
      is,
      isAuthenticated,
      landingPath,
      login,
      logout,
      permissions,
      refreshSession,
      requestPasswordReset,
      resetPassword,
      socialLogin,
      user,
      users,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
