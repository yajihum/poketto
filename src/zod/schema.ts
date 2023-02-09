import { z } from "zod";
import { customErrorMap } from "../lib/zErrorMap";

export const LoggedinUserSchema = z.object({
  comment: z.string().optional(),
  pokemons: z
    .array(
      z.object({
        name: z.string(),
        image: z.string(),
      })
    )
    .optional(),
  name: z.string(),
});

export type LoggedinUserInfo = z.infer<typeof LoggedinUserSchema>;

export const InputSchema = z.object({
  name: z.string({ errorMap: customErrorMap }).min(1),
  comment: z.string({ errorMap: customErrorMap }).max(50).optional(),
});

export type Inputs = z.infer<typeof InputSchema>;
