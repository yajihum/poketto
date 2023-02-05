import { GraphQLClient, gql } from "graphql-request";
import { z } from "zod";
import { GraphPoke, RegionType, Types } from "../types/graphql_pokemon";
import { endpoint, pokeQuery, regionQuery } from "./constants";

const regionSchema = z.object({
  name: z.string(),
  pokemon_v2_regionnames: z
    .array(
      z.object({
        name: z.string(),
      })
    )
    .optional(),
  pokemon_v2_pokedexes: z.array(
    z.object({
      id: z.number(),
    })
  ),
});
const regionArraySchema = z.array(regionSchema);

type Region = z.infer<typeof regionSchema>;
type RegionArray = z.infer<typeof regionArraySchema>;

export const getGraphQLRegionData = async (): Promise<RegionArray | null> => {
  const query = regionQuery;
  const res = await new GraphQLClient(endpoint).request(query);
  return res.pokemon_v2_region;
};

export const getResions = () => {
  const regions = getGraphQLRegionData();

  const regionArray = regions.then((r) => {
    if (!r) return;

    let passedRegions: RegionArray = r;
    try {
      passedRegions = regionArraySchema.parse(r);
    } catch (e) {
      if (e instanceof z.ZodError) {
        console.log(e.issues);
        throw new Error("ZodのError");
      }
    }

    if (passedRegions.length === 0) return null;

    const regionArray: RegionType[] = [];

    passedRegions.forEach((r: Region) => {
      const jaName = GetRegionJaName(r);
      if (jaName) {
        regionArray.push({
          name: r.name,
          jaName: jaName,
          id: r.pokemon_v2_pokedexes[0].id,
        });
      }
    });
    return regionArray;
  });
  return regionArray;
};

const GetRegionJaName = (r: Region): string | null | undefined => {
  if (!r.pokemon_v2_regionnames) return null;

  // アローラ以降は英語名しかないため英語名から日本語に変換
  if (r && r.pokemon_v2_regionnames.length === 0) {
    switch (r.name) {
      case "alola":
        return "アローラ地方";
      case "galar":
        return "ガラル地方";
      case "hisui":
        return "ヒスイ地方";
      case "paldea":
        return "パルデア地方";
    }
  } else {
    return r.pokemon_v2_regionnames[0]?.name;
  }
  return null;
};

const pokeSchema = z.object({
  name: z.string(),
  id: z.number(),
  jaName: z.string().optional(),
  image: z.string(),
  types: z.string(),
  genus: z.string().optional(),
});

type Pokemon = z.infer<typeof pokeSchema>;

export const getGraphQLPokeData = async (
  regionId: number
): Promise<GraphPoke[] | null> => {
  const query = pokeQuery(regionId);
  const res = await new GraphQLClient(endpoint).request(query);

  try {
    return res.pokemon_v2_pokedex[0].pokemon_v2_pokemondexnumbers;
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const getPokemons = (regionId: number) => {
  if (!regionId) return null;

  const pokemons = getGraphQLPokeData(regionId);
  if (!pokemons) return null;

  return pokemons.then((p) => {
    if (!p) return;

    const pokeArray: Pokemon[] = [];

    p.forEach((poke) => {
      if (!poke.pokemon_v2_pokemonspecy) {
        return;
      }
      const ja =
        poke.pokemon_v2_pokemonspecy.pokemon_v2_pokemonspecies[0]
          ?.pokemon_v2_pokemonspeciesnames[0]?.name;
      if (!ja) return;

      const type =
        poke.pokemon_v2_pokemonspecy.pokemon_v2_pokemons[0]
          ?.pokemon_v2_pokemontypes;

      pokeArray.push({
        id: poke.pokemon_v2_pokemonspecy.id,
        jaName: ja,
        name: poke.pokemon_v2_pokemonspecy.name,
        image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${poke.pokemon_v2_pokemonspecy.id}.png`,
        types: getTypes(type),
      });
    });
    return pokeArray;
  });
};

const getTypes = (types: Types[]) => {
  const typeArray = types.map((t) => {
    return t.pokemon_v2_type.pokemon_v2_typenames[0].name;
  });
  return typeArray.join(",");
};
