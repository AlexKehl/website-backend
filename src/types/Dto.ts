export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
}

export interface RefreshTokenDto {
  email: string;
  refreshToken: string;
}
