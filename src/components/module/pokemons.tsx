import { PokeType } from "../types/pokemon";
import Image from "next/image";
import Button from "./ui/button";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import DoneModal from "./module/modal/done-modal";
import { GetGridNumByPokemonLength } from "../lib/pokemon";

type Props = {
  pokemons: PokeType[];
  isEdit: boolean;
  isShare?: boolean;
  setUserPoke?: Dispatch<SetStateAction<PokeType[]>> | undefined;
};

const Pokemons = ({ pokemons, isEdit, isShare, setUserPoke }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [removePoke, setRemovePoke] = useState<PokeType>();
  const [selectPoke, setSelectPoke] = useState<PokeType[]>(pokemons);

  const removePokemon = ({ name, image }: PokeType) => {
    setIsOpen(true);
    setRemovePoke({ name, image });
  };

  useMemo(() => {
    setSelectPoke(pokemons);
  }, [pokemons]);

  const gridNum: number = GetGridNumByPokemonLength(pokemons);

  return (
    <>
      {!isShare && (
        <p className="py-3 text-lg font-medium sm:text-xl">
          {isEdit ? "すきなポケモン(6匹まで選べます)" : "すきなポケモン"}
        </p>
      )}
      <div
        className={`grid grid-cols-${gridNum} items-center justify-items-center gap-2 rounded-xl bg-white px-2 py-2 text-black sm:gap-6 sm:rounded-3xl sm:px-10 sm:pt-3 sm:pb-5`}
      >
        {selectPoke.map(({ name, image }) => (
          <div key={name}>
            {isEdit ? (
              <Button
                key={name}
                type="button"
                onClick={() => removePokemon({ name, image })}
                className="transition duration-200 ease-in-out md:hover:opacity-50"
              >
                <Image
                  src={image}
                  alt="ポケモン"
                  width={80}
                  height={80}
                  className="md:h-28 md:w-28"
                ></Image>
                <p className="text-xs font-semibold sm:text-lg">{name}</p>
              </Button>
            ) : (
              <div key={name}>
                <Image
                  src={image}
                  alt="ポケモン"
                  width={80}
                  height={80}
                  className="md:h-28 md:w-28"
                ></Image>
                <p className="text-xs font-semibold sm:text-lg">{name}</p>
              </div>
            )}
          </div>
        ))}
      </div>
      <DoneModal
        setIsOpen={setIsOpen}
        setSelectPoke={setSelectPoke}
        setUserPoke={setUserPoke}
        isOpen={isOpen}
        isMyPage={true}
        pokemon={removePoke}
        isPokeEdit={isEdit}
      ></DoneModal>
    </>
  );
};

export default Pokemons;
