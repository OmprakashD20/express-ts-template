import { TObject } from "@sinclair/typebox";

export interface AppConfig {
  env: {
    PORT: number;
    NODE_ENV: string;
    DB_URL: string;
  };
}

export interface ValidatorFactoryReturn<T> {
  schema: TObject;
  validate: (data: T) => T;
}
