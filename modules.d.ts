declare namespace NodeJS {
  export interface ProcessEnv {
    ACCESS_TOKEN_SECRET: string;
    REFRESH_TOKEN_SECRET: string;
    DB_URL: string;
    TEST_DB_URL: string;
    FILE_PATH: string;
  }
}
