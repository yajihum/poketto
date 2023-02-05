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

export type PokeType = {
  name: string;
  image: string;
};
