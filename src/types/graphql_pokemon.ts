export type RegionType = {
  name: string;
  jaName: string;
  id: number;
};

export type NameType = {
  language: { name: string; url: string };
  name: string;
};

export type Pokemon = {
  name: string;
  jaName: string;
  image: string;
  types: string[];
  genus: string; // 分類(たねぽけもんとか)
};

export type GraphPoke = {
  pokemon_v2_pokemonspecy: {
    name: string;
    id: number;
    pokemon_v2_pokemonspecies: [
      {
        pokemon_v2_pokemonspeciesnames: [
          {
            genus?: string;
            name?: string;
          }
        ];
      }
    ];
    pokemon_v2_pokemons: [
      {
        pokemon_v2_pokemontypes: Types[];
      }
    ];
  };
};

export type Types = {
  pokemon_v2_type: {
    pokemon_v2_typenames: [
      {
        name: string;
      }
    ];
  };
};
