export interface User {
  id: number;
  name: string;
  email: string;
  username: string;
  password: string;
  role: [string];
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest { 
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
    token: string;
    refreshToken?: string; // ✅ Tambah ini jika pakai dual token
    user: User;
}

export interface RegisterResponse {
  token: string;
  refreshToken?: string; // ✅ Tambah ini jika pakai dual token
  user: User;
  message: string;
}