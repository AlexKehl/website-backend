export interface BaseData {
  success: true;
}

export interface HttpResponse {
  headers: Record<string, string>;
  statusCode: number;
  data: {
    success: boolean;
    [x: string]: any;
  };
}

export interface LoginResponseData extends BaseData {
  refreshToken: string;
  accessToken: string;
  user: {
    email: string;
  };
}
