export type Role = 'ADMIN' | 'BASIC' | 'NOAUTH';

export type JwtPayload = {
    id: string;
    role: Role;
  };
  