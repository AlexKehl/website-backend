import { Cookie } from './RequestObject';

export interface HttpResponse {
  headers: Record<string, string>;
  statusCode: number;
  cookies: Cookie[];
  isHttpError: false;
  data: {
    success: boolean;
    [x: string]: any;
  };
}
