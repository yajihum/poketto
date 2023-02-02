import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { getJaRegions, getPokemons } from "../../lib/pokemon";
import { Pokemon, RegionType } from "../../types/pokemon";
import Image from "next/image";
import Layout from "../../components/layout/layout";
import { useState } from "react";
import { useAuth } from "../../context/auth";
import Button from "../../components/ui/button";
import DoneModal from "../../components/module/modal/done-modal";
import Meta from "../../components/layout/meta";

type Props = {
  pokemons: Pokemon[];
  regionName: string;
};

type Inputs = {
  jaName: string;
  image: string;
};

const Region = ({ pokemons, regionName }: Props) => {
  const user = useAuth();

  const [refJaName, setJaName] = useState("");
  const [refImage, setImage] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const getClickedPokemon = ({ jaName, image }: Inputs) => {
    setJaName(jaName);
    setImage(image);
    setIsOpen(true);
  };

  return (
    <>
      <Layout isRegion>
        <Meta title="すきなポケモンを選ぼう！" />
        <div className="text-center font-dot text-2xl font-medium text-white md:text-4xl">
          <p className="my-2">すきなポケモンを選ぼう！</p>
          <p className="mt-6 mb-8">{regionName}</p>
        </div>
        <div className="mx-9 sm:mx-7 mb-7 grid grid-cols-3 justify-items-center gap-3 sm:gap-2 rounded-3xl bg-white px-6 sm:px-3 py-7 font-dot shadow-2xl md:grid-cols-4 md:gap-4 md:py-10 lg:mx-10 lg:grid-cols-6 lg:gap-7 lg:py-10 lg:px-10">
          {pokemons.map(({ jaName, image, types, genus, name }) => (
            <div key={name}>
              {jaName && image && (
                <Button
                  type="button"
                  onClick={() =>
                    getClickedPokemon({ jaName: jaName, image: image })
                  }
                  key={name}
                  className="block text-left transition duration-200 ease-in-out md:hover:opacity-30"
                >
                  {image && (
                    <Image
                      src={image}
                      height={100}
                      width={100}
                      alt={`${jaName}の画像`}
                    ></Image>
                  )}
                  <p className="font-bold text-xs text-center md:text-xl">
                    {jaName}
                  </p>
                  {types && (
                    <p className="text-xs hidden sm:block md:text-sm">
                      {types.join(",")}
                    </p>
                  )}
                  {genus && (
                    <p className="text-xs hidden sm:block md:text-sm">
                      {genus}
                    </p>
                  )}
                </Button>
              )}
            </div>
          ))}
        </div>
        <DoneModal
          setIsOpen={setIsOpen}
          isOpen={isOpen}
          isMyPage={false}
          pokemon={{ name: refJaName, image: refImage }}
          isNewSelect={true}
        ></DoneModal>
      </Layout>
    </>
  );
};

export default Region;

export async function getStaticProps({ params }: Params) {
  let regionName: string = "";
  const region = (await getJaRegions()).find(
    (item: RegionType) => item.name == params.region
  );
  let pokemons: Pokemon[] = [];
  if (region && region.jaName && region.pokedexesUrl) {
    pokemons = await getPokemons(region.pokedexesUrl);
    regionName = region.jaName;
  }
  return {
    props: {
      pokemons,
      regionName,
    },
  };
}

export async function getStaticPaths() {
  return {
    paths: (await getJaRegions()).map((region) => {
      return {
        params: {
          region: region.name,
        },
      };
    }),
    fallback: false,
  };
}
