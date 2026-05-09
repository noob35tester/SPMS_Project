import { type ReactNode, useCallback, useMemo, useState } from 'react';
import { http } from '../api/http';
import { getLandingPath, getRolePermissions, hasPermission, hasRole } from '../rbac/access';
import { demoAccounts } from '../rbac/demoAccounts';
import type { AuthUser, Permission, Role } from '../rbac/roles';
import { AuthContext, type CreateUserInput, type ManagedUser } from './authState';

type ApiUser = Partial<AuthUser> & {
  id: string;
  name: string;
  email: string;
  roleName?: string;
  roles?: Role[];
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
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: normalizeRole(user.role ?? user.roleName ?? user.roles?.[0]),
    mobile: user.mobile,
    department: user.department,
    designation: user.designation,
    reportingManager: user.reportingManager,
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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? normalizeApiUser(JSON.parse(raw)) : null;
  });
  const [users, setUsers] = useState<ManagedUser[]>(seedUsers);

  const permissions = useMemo(() => (user ? getRolePermissions(user.role) : []), [user]);
  const landingPath = user ? getLandingPath(user.role) : '/login';
  const isAuthenticated = Boolean(user && localStorage.getItem(TOKEN_KEY));

  const login = useCallback(async (email: string, password: string) => {
    const localUser = users.find((account) => account.email.toLowerCase() === email.toLowerCase());

    if (localUser) {
      if (localUser.password !== password) {
        throw new Error('Invalid password');
      }

      isAllowedToLogin(localUser);

      const demoUser: AuthUser = { ...localUser };
      localStorage.setItem(TOKEN_KEY, 'demo-token');
      localStorage.setItem(USER_KEY, JSON.stringify(demoUser));
      setUser(demoUser);
      return demoUser;
    }

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
      throw error;
    }
  }, [users]);

  const socialLogin = useCallback(async (_provider: 'google' | 'microsoft' | 'outlook', email: string) => {
    const localUser = users.find((account) => account.email.toLowerCase() === email.toLowerCase());

    if (!localUser) {
      throw new Error('Account not found');
    }

    isAllowedToLogin(localUser);

    const sessionUser: AuthUser = { ...localUser };
    localStorage.setItem(TOKEN_KEY, 'demo-token');
    localStorage.setItem(USER_KEY, JSON.stringify(sessionUser));
    setUser(sessionUser);
    return sessionUser;
  }, [users]);

  const persistUsers = useCallback((nextUsers: ManagedUser[]) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(nextUsers));
    setUsers(nextUsers);
  }, []);

  const createUser = useCallback(async (input: CreateUserInput) => {
    if (!user || !hasPermission(user.role, ['users:create'])) {
      throw new Error('Only Super Admin, Admin, or HR can create users');
    }

    if (users.some((account) => account.email.toLowerCase() === input.email.toLowerCase())) {
      throw new Error('A user with this email already exists');
    }

    const newUser: ManagedUser = {
      id: `user-${Date.now()}`,
      ...input,
      email: input.email.toLowerCase(),
      status: 'PENDING_ACTIVATION',
      activationCode: activationCode(),
      policyAccepted: false,
    };
    persistUsers([...users, newUser]);
    return newUser;
  }, [persistUsers, user, users]);

  const activateUser = useCallback(async (email: string, code: string, password: string, acceptedPolicy: boolean) => {
    const localUser = users.find((account) => account.email.toLowerCase() === email.toLowerCase());

    if (!localUser || localUser.activationCode !== code) {
      throw new Error('Invalid activation link or OTP');
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
  }, [persistUsers, users]);

  const requestPasswordReset = useCallback(async (email: string) => {
    const localUser = users.find((account) => account.email.toLowerCase() === email.toLowerCase());

    if (!localUser) {
      throw new Error('Account not found');
    }

    if (localUser.status !== 'ACTIVE') {
      throw new Error('Only active accounts can reset passwords');
    }

    const resetCode = activationCode();
    persistUsers(users.map((account) => (account.id === localUser.id ? { ...account, resetCode } : account)));
    return resetCode;
  }, [persistUsers, users]);

  const resetPassword = useCallback(async (email: string, code: string, password: string) => {
    const localUser = users.find((account) => account.email.toLowerCase() === email.toLowerCase());

    if (!localUser || localUser.resetCode !== code) {
      throw new Error('Invalid reset code');
    }

    persistUsers(users.map((account) => (
      account.id === localUser.id ? { ...account, password, resetCode: undefined } : account
    )));
  }, [persistUsers, users]);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
  }, []);

  const can = useCallback(
    (requiredPermissions: Permission[]) => (user ? hasPermission(user.role, requiredPermissions) : false),
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
      requestPasswordReset,
      resetPassword,
      socialLogin,
      user,
      users,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
