export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  userName: string;
  email: string;
  password: string;
  role: string;
}

export interface LoginResponse {
  token: string;
  expiresAt: string;
  userName: string;
  email: string;
  role: string;
}
