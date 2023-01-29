import { FieldValues } from "react-hook-form/dist/types";
import { PokeType } from "./pokemon";

export type User = {
  id: string;
  name: string;
  createdAt: number;
  comment?: string;
  pokemons?: FieldValues;
};

export type PrivateData = {
  email: string;
  createdAt: number;
};

export type UserInfo = {
  name: string;
  comment: string;
  pokemons: PokeType[];
};

export type UserContextType = User | null | undefined;
