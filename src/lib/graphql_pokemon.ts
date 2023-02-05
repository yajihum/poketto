import { GraphQLClient, gql, ClientError } from "graphql-request";
import { string, z } from "zod";
import { RegionType } from "../types/graphql_pokemon";

const pokeSchema = z.object({
  name: z.string(),
  jaName: z.string(),
  image: z.string(),
  types: z.array(z.string()),
  genus: z.string(),
});

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

type Pokemon = z.infer<typeof pokeSchema>;
type Region = z.infer<typeof regionSchema>;
type RegionArray = z.infer<typeof regionArraySchema>;

export const getGraphQLData = async (): Promise<RegionArray | null> => {
  const endpoint = "https://beta.pokeapi.co/graphql/v1beta";

  const query = gql`
    query getResions {
      pokemon_v2_region {
        name
        pokemon_v2_regionnames(where: { language_id: { _eq: 1 } }) {
          name
        }
        pokemon_v2_pokedexes(limit: 1) {
          id
        }
      }
    }
  `;

  const res = await new GraphQLClient(endpoint).request(query);
  return res.pokemon_v2_region;
};

export const getResions = () => {
  const regions = getGraphQLData();
  const regionArray: RegionType[] = [];

  regions.then((r) => {
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

    passedRegions.map((d: Region) => {
      const jaName = GetRegionJaName(d);
      if (jaName) {
        regionArray.push({
          name: d.name,
          jaName: jaName,
          id: d.pokemon_v2_pokedexes[0].id,
        });
      }
    });
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
