import { gql } from "graphql-request";

export const endpoint = "https://beta.pokeapi.co/graphql/v1beta";

export const regionQuery = gql`
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

export const pokeQuery = (regionId: number) => {
  return gql`
query getPoke {
  pokemon_v2_pokedex(where: {id: {_eq: ${regionId}}}) {
    pokemon_v2_pokemondexnumbers {
      pokemon_v2_pokemonspecy {
        name
        id
        pokemon_v2_pokemonspecies {
          pokemon_v2_pokemonspeciesnames(where: {pokemon_v2_language: {id: {_eq: 1}}}) {
            genus
            name
          }
        }
        pokemon_v2_pokemons(limit: 1) {
          pokemon_v2_pokemontypes {
            pokemon_v2_type {
              pokemon_v2_typenames(where: {language_id: {_eq: 1}}) {
                name
              }
            }
          }
        }
      }
    }
  }
}
`;
};
