import { z } from "zod";
import { PokeType } from "../types/pokemon";

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
