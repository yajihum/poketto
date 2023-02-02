import { Dispatch, Fragment, SetStateAction, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useRouter } from "next/router";
import Image from "next/image";
import { useAuth } from "../../../context/auth";
import { SubmitHandler, useForm } from "react-hook-form";
import { updateUser } from "../../../lib/user";
import { Pokemon, PokeType } from "../../../types/pokemon";
import { arrayRemove, arrayUnion } from "firebase/firestore";
import PokeHiddenInput from "../../field/pokemon-hidden-input";
import {
  ConverToPokemonArray,
  GetPokeTypeArrayFromJson,
} from "../../../lib/pokemon";

type Props = {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  setSelectPoke?: Dispatch<SetStateAction<PokeType[]>> | undefined;
  setUserPoke?: Dispatch<SetStateAction<PokeType[]>> | undefined;
  isOpen: boolean;
  isDone?: boolean;
  isMyPage: boolean;
  isPokeEdit?: boolean;
  pokemon?: PokeType;
  isNewSelect?: boolean;
};

const DoneModal = ({
  setIsOpen,
  setSelectPoke,
  isOpen,
  isDone,
  isMyPage,
  isPokeEdit,
  pokemon,
  isNewSelect,
}: Props) => {
  const [isShow, setIsShow] = useState(isOpen);
  const [isSuccess, setIsSuccess] = useState(isDone);
  const [isNew, setIsNew] = useState(isNewSelect);
  const [poke, setPoke] = useState(pokemon);
  const [pokemons, setPokemons] = useState<PokeType[]>([]);
  const [isPokeMax, setIsPokeMax] = useState(false);

  const router = useRouter();

  function closeModal() {
    setIsShow(false); // このコンポーネントのstateをfalse
    setIsOpen(false); // 親のコンポーネントの関数を通して親のstateをfalseにする
  }

  function backToMyPage() {
    router.replace("/mypage");
    closeModal();
  }

  useEffect(() => {
    setIsShow(isOpen);
    setIsSuccess(isDone);
    setPoke(pokemon);
    setIsNew(isNewSelect);
  }, [isOpen, isDone, isNewSelect]);

  const user = useAuth();

  useEffect(() => {
    if (user) {
      setPokemons(ConverToPokemonArray(user.pokemons));
    } else {
      setPokemons(GetPokeTypeArrayFromJson());
    }
  }, []);

  const { register, setValue, handleSubmit } = useForm<PokeType>();

  const onSubmit: SubmitHandler<PokeType> = (data) => {
    // 7匹以上は登録できない
    if (!isMyPage && pokemons && pokemons.length >= 6) {
      setIsPokeMax(true);
      setIsNew(false);
      return;
    }

    const pokemon: PokeType = {
      name: data.name,
      image: data.image,
    };

    if (
      !isMyPage &&
      pokemons.some(
        (poke) => poke.name === pokemon.name && poke.image === pokemon.image
      )
    ) {
      setIsSuccess(false);
      setIsNew(false);
      return;
    }

    if (user?.id) {
      if (!isMyPage) {
        pokemons.push(pokemon);
        updateUser(user?.id, {
          pokemons: arrayUnion(pokemon),
        })
          .then(() => {
            // 更新完了
            if (pokemons.length === 6) {
              router.replace("/mypage");
            }
            closeModal();
          })
          .catch((error) => {
            // 更新失敗
          });
      } else if (isMyPage && isPokeEdit && pokemon) {
        updateUser(user?.id, {
          pokemons: arrayRemove(pokemon),
        })
          .then(() => {
            // 更新完了
            router.replace("/mypage");
          })
          .catch((error) => {
            // 更新失敗
          });
      }
    } else {
      if (
        (pokemons.length > 0 &&
          !isMyPage &&
          !pokemons.some(
            (poke) => poke.name === pokemon.name && poke.image === pokemon.image
          )) ||
        pokemons.length === 0
      ) {
        pokemons.push(pokemon);
        localStorage.setItem("userPoke", JSON.stringify(pokemons));
        closeModal();
      } else if (isMyPage && isPokeEdit && pokemon) {
        if (pokemons && pokemons.length > 0) {
          setPokemons(GetPokeTypeArrayFromJson());
          // 削除するポケモン以外の残されたポケモンを取得
          const leftPoke = pokemons.filter(
            (poke) =>
              !(poke.name === pokemon.name) && !(poke.image === pokemon.image)
          );
          if (leftPoke) {
            setPokemons(() => leftPoke);
            if (setSelectPoke) {
              setSelectPoke(() => {
                return leftPoke;
              });
            }
            localStorage.setItem("userPoke", JSON.stringify(leftPoke));
          }
        }
        closeModal();
      } else {
        setIsSuccess(false);
        setIsNew(false);
        // この後戻るでモーダル閉じるとなぜかもう１個前のモーダルが出て消える
      }
    }
  };

  return (
    <Transition appear show={isShow} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-xs transform overflow-hidden rounded-2xl bg-white p-6 text-center align-middle font-dot shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-semibold leading-6 text-gray-900"
                >
                  {isMyPage &&
                    !isPokeEdit &&
                    (isSuccess
                      ? "更新しました"
                      : "更新に失敗しました。再度お試しください")}
                  {isMyPage && isPokeEdit && "このポケモンを削除しますか？"}
                  {!isMyPage && isNew && "このポケモンでよろしいですか"}
                  {!isMyPage &&
                    !isNew &&
                    !isSuccess &&
                    !isPokeMax &&
                    "既に登録されています"}
                  {isPokeMax && !isNew && "既に6匹まで登録されています"}
                </Dialog.Title>
                <div className="mt-4">
                  {pokemon?.name && pokemon.image && (
                    <div className="flex flex-col">
                      <div className=" mb-2 flex justify-center">
                        <Image
                          src={pokemon.image}
                          alt="pokemon"
                          width={100}
                          height={100}
                        ></Image>
                      </div>
                      <p className="mb-4 font-bold">{pokemon.name}</p>
                    </div>
                  )}
                  {isMyPage && !isPokeEdit && (
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={backToMyPage}
                    >
                      マイページへ戻る
                    </button>
                  )}
                  {((!isMyPage && isNew) || (isMyPage && isPokeEdit)) && (
                    <form onSubmit={handleSubmit(onSubmit)}>
                      {poke && (
                        <PokeHiddenInput
                          register={register}
                          setValue={setValue}
                          poke={poke}
                        ></PokeHiddenInput>
                      )}
                      <button
                        type="button"
                        onClick={closeModal}
                        className="mx-3 inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      >
                        戻る
                      </button>
                      <button
                        type="submit"
                        className="mx-3 inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      >
                        はい
                      </button>
                    </form>
                  )}
                  {!isMyPage && !isNew && !isSuccess && (
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={closeModal}
                    >
                      戻る
                    </button>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default DoneModal;
