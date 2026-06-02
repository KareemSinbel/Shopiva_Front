export type UserRole = 'Admin' | 'Seller' | 'Customer';
export type UserStatus = 'Active' | 'Suspended';

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  isRestricted: boolean;
  emailConfirmed: boolean;
  roles: UserRole[];
  lockoutEnd?: string;
  avatarUrl?: string;
}

export interface UserApiResponse {
  items: User[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface UserInsights {
  totalUsers: number;
  activeNow: number;
  newToday: number;
}
