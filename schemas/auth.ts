import { Type, type Static } from "@sinclair/typebox";

const AuthSchema = Type.Object({
  username: Type.String({ minLength: 3, maxLength: 30 }),
  password: Type.String({ minLength: 6 }),
});

export const LoginSchema = AuthSchema;
export const RegisterSchema = AuthSchema;

export type LoginBody = Static<typeof LoginSchema>;
export type RegisterBody = Static<typeof RegisterSchema>;
