export type RequestUser = {
  id: string;
  email: string;
  roles: string[];
  permissions: string[];
};

export type AuthenticatedUserResponse = {
  id: string;
  name: string;
  email: string;
  role: string;
  roles: string[];
  permissions: string[];
  department?: string;
  designation?: string;
  mobile?: string;
  status: string;
  landingPath: string;
};
