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

export interface LogoutDto {
  email: string;
}

export interface FileDto {
  category: string;
}

export interface FileWithCategoryDto {
  category: string;
  name: string;
}
