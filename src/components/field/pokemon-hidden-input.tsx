import { useEffect, useState } from "react";
import { UseFormRegister, UseFormSetValue } from "react-hook-form";

type Inputs = {
  name: string;
  image: string;
};

type Props = {
  register: UseFormRegister<Inputs>;
  setValue: UseFormSetValue<Inputs>;
  poke: Inputs;
};

const PokeHiddenInput = ({ register, setValue, poke }: Props) => {
  const [pokemon, setPokemon] = useState(poke);

  useEffect(() => {
    setPokemon(poke);
    setValue("name", pokemon.name);
    setValue("image", pokemon.image);
  }, [poke]);

  return (
    <>
      <input {...register("name")} type="hidden"></input>
      <input {...register("image")} type="hidden"></input>
    </>
  );
};

export default PokeHiddenInput;
