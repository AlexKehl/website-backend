import { omit } from 'remeda';

type OmitPrivate<T> = {
  [K in keyof T as K extends `_${infer _}` ? never : K]: T[K];
};

export const omitPrivateFields = <T extends Record<string, any>>(
  obj: T
): OmitPrivate<T> => {
  const privateKeys = Object.keys(obj).filter((key) => key.startsWith('_'));
  return omit(obj, privateKeys) as unknown as OmitPrivate<T>;
};
