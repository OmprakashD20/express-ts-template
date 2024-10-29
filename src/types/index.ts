import { TObject } from "@sinclair/typebox";

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

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

export interface AsyncHandlerReturn<T> {
  statusCode: number;
  data?: T;
}
