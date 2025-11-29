// Express Request Extension for custom properties
declare global {
  namespace Express {
    interface Request {
      user?: {
        _id: string;
        email: string;
        userRole: string;
      };
    }
  }
}

// Environment Variables Interface
export interface EnvVariables {
  PORT?: string;
  DB_USER_NAME: string;
  DB_PASS: string;
  SECRET_KEY: string;
  NODE_ENV?: string;
  CLOUDINARY_CLOUD_NAME?: string;
  CLOUDINARY_API_KEY?: string;
  CLOUDINARY_API_SECRET?: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  message?: string;
  data?: T;
  error?: string;
  token?: string;
  user?: T;
}

// User Types
export type UserRole = "seller" | "customer";

export interface UserPayload {
  _id: string;
  email: string;
  userRole: UserRole;
}

// Make this file a module
export {};
