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

export interface FileDto {
  category: string;
}

export interface FileDeleteDto {
  category: string;
  name: string;
}
