export type RegionType = {
  name: string;
  jaName?: string;
  url: string;
  pokedexesUrl?: string;
  pokemons?: Pokemon[];
};

export type NameType = {
  language: { name: string; url: string };
  name: string;
};

export type Pokemon = {
  name: string;
  jaName?: string;
  url?: string;
  speciesUrl: string;
  image?: string;
  types?: string[];
  genus?: string; // 分類(たねぽけもんとか)
};

export type PokeType = {
  name: string;
  image: string;
};
