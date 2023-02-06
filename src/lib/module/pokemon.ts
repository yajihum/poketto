import { FieldValues } from "react-hook-form/dist/types";
import { Pokemon, NameType, RegionType, PokeType } from "../../types/pokemon";

/**
 * 地方の情報を取得
 * @returns 地方の配列を返す
 */
export const getRegions = async () => {
  const res = await fetch("https://pokeapi.co/api/v2/region");
  const data = await res.json();
  const results = data.results;

  const regionDatas: RegionType[] = [];

  results.map((item: RegionType) => {
    if (item.name && item.url) {
      regionDatas.push({ name: item.name, url: item.url });
    }
  });

  return regionDatas;
};

/**
 * 日本語名の地方を取得
 * @returns 地方の配列を返す
 */
export const getJaRegions = async () => {
  let regions = await getRegions();

  for (const region of regions) {
    if (region.url) {
      const regionRes = await fetch(region.url);
      const regionData = await regionRes.json();
      const nameResults =
        regionData.names && regionData.names.length > 0
          ? regionData.names
          : null;
      const pokedexes = regionData.pokedexes ? regionData.pokedexes[0] : null;

      if (nameResults) {
        nameResults.some((names: NameType) => {
          if (names.language.name == "ja-Hrkt") {
            region.jaName = names.name;
            return true;
          }
          // アローラ以降はenしかないらしい
          else {
            switch (names.name) {
              case "Alola":
                region.jaName = "アローラ地方";
                break;
              case "Galar":
                region.jaName = "ガラル地方";
                break;
              case "Hisui":
                region.jaName = "ヒスイ地方";
            }
          }
        });
      }

      if (pokedexes) {
        region.pokedexesUrl = pokedexes.url;
      }
    }
  }
  regions = regions.filter((region) => region.jaName);
  return regions;
};

/**
 * ポケモンの情報を取得
 * @param pokedexesUrl pokedexesのURL
 * @returns ポケモンたちの配列を返す
 */
export const getPokemons = async (pokedexesUrl: string) => {
  const pokemons: Pokemon[] = [];
  if (pokedexesUrl) {
    const pokedexesRes = await fetch(pokedexesUrl);
    const pokedexesData = await pokedexesRes.json();
    const pokemonEntries = pokedexesData.pokemon_entries;

    for (const pokemonEntry of pokemonEntries) {
      pokemons.push({
        name: pokemonEntry.pokemon_species.name,
        speciesUrl: pokemonEntry.pokemon_species.url,
      });
    }

    for (const pokemon of pokemons) {
      if (pokemon.speciesUrl) {
        await getSpeicesPokemonDetails(pokemon, pokemon.speciesUrl);
      }
    }
  }

  return pokemons;
};

/**
 * タイプを日本語にする
 * @param type タイプ
 * @returns
 */
const getJaTypes = (type: string): string => {
  switch (type) {
    case "normal":
      return "ノーマル";
    case "fire":
      return "ほのお";
    case "water":
      return "みず";
    case "grass":
      return "くさ";
    case "electric":
      return "でんき";
    case "ice":
      return "こおり";
    case "fighting":
      return "かくとう";
    case "poison":
      return "どく";
    case "ground":
      return "じめん";
    case "flying":
      return "ひこう";
    case "psychic":
      return "エスパー";
    case "bug":
      return "むし";
    case "rock":
      return "いわ";
    case "ghost":
      return "ゴースト";
    case "dragon":
      return "ドラゴン";
    case "dark":
      return "あく";
    case "steel":
      return "はがね";
    case "fairy":
      return "フェアリー";
    default:
      return "なし";
  }
};

/**
 * pokemon-species/nameから日本語名と分類を取得
 * @param pokemon 1匹のポケモン
 * @param pokemonSpeisesUrl 1匹のポケモン情報があるspiesesのURL
 */
const getSpeicesPokemonDetails = async (
  pokemon: Pokemon,
  pokemonSpeicesUrl: string
) => {
  const pokeRes = await fetch(pokemonSpeicesUrl);
  const pokeData = await pokeRes.json();

  pokemon.jaName = await pokeData.names.find(
    (data: NameType) => data.language.name === "ja-Hrkt"
  ).name;
  pokemon.genus = await pokeData.genera.find(
    (data: NameType) => data.language.name === "ja-Hrkt"
  ).genus;

  const url = pokeData.varieties[0].pokemon.url;
  if (url) {
    await getPokemonDetails(pokemon, url);
  }
};

/**
 * /pokemon/nameからimageとtypesを取得
 * @param pokemon 1匹のポケモン
 * @param pokemonUrl 1匹のポケモン情報があるURL
 */
const getPokemonDetails = async (pokemon: Pokemon, url: string) => {
  const pokeRes = await fetch(url);
  const pokeData = await pokeRes.json();
  pokemon.url = url;
  pokemon.image = pokeData.sprites["front_default"];
  const typeArray: string[] = [];
  for (const types of pokeData.types) {
    const typeName = getJaTypes(types.type.name);
    typeArray.push(typeName);
  }
  pokemon.types = typeArray;
};

/**
 * Firebaseから取得したポケモンたちの配列をPokeType型の配列に変換する
 * @param pokemons 選択したポケモンたち
 * @returns ポケモンたちの配列
 */
export const ConverToPokemonArray = (pokemons: FieldValues | undefined) => {
  const pokemonArray: PokeType[] = [];
  for (const index in pokemons) {
    pokemonArray.push({
      name: pokemons[index].name,
      image: pokemons[index].image,
    });
  }
  return pokemonArray;
};

/**
 * 選択したポケモンの数によるグリッド数を取得する
 * @param pokemons 選択したポケモンたち
 * @returns グリッド数
 */
export const GetGridNumByPokemonLength = (pokemons: PokeType[]): number => {
  let gridNum: number = pokemons.length;

  if (pokemons.length >= 4) {
    gridNum = 3;
  }
  return gridNum;
};

/**
 * localStorageにあるポケモンたちをPokeType型にして取得
 * @param json ポケモンたちのjson文字列
 * @returns PokeType型のポケモンたち
 */
export const GetPokeTypeArrayFromJson = (): PokeType[] => {
  const userPokeJson = localStorage.getItem("userPoke");

  const pokeArray: PokeType[] = [];
  if (userPokeJson) {
    const pokemons = JSON.parse(userPokeJson);

    for (const index in pokemons) {
      pokeArray.push({
        name: pokemons[index].name,
        image: pokemons[index].image,
      });
    }
  }

  return pokeArray;
};
