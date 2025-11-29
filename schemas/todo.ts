import { Type, type Static } from "@sinclair/typebox";

const TitleSchema = Type.String({
  minLength: 1,
  maxLength: 100,
});

export const CreateTodoSchema = Type.Object({
  title: TitleSchema,
});
export type CreateTodoBody = Static<typeof CreateTodoSchema>;

export const UpdateTodoSchema = Type.Object({
  title: Type.Optional(TitleSchema),
  isCompleted: Type.Optional(Type.Boolean()),
});
export type UpdateTodoBody = Static<typeof UpdateTodoSchema>;
