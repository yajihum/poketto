import { PokeType } from "../types/pokemon";
import Layout from "../components/layout/layout";
import Link from "next/link";
import { useAuth } from "../context/auth";
import { useEffect, useState } from "react";
import InputField from "../components/input-field";
import { SubmitHandler, useForm } from "react-hook-form";
import Button from "../components/ui/button";
import Pokemons from "../components/pokemons";
import router from "next/router";
import { GetPokeTypeArrayFromJson } from "../lib/pokemon";
import PokeShareModal from "../components/module/modal/pokemon-share-modal";
import Meta from "../components/meta";
import Image from "next/image";

const Share = () => {
  const user = useAuth();

  if (user) {
    router.replace("/mypage");
  }

  const [userName, setUserName] = useState("名無しポケモンさん");
  const [userPoke, setUserPoke] = useState<PokeType[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<{ userName: string }>();

  const onSubmit: SubmitHandler<{ userName: string }> = (data) => {
    if (!isShareModal) return;
    if (data.userName) {
      setUserName(data.userName);
      localStorage.setItem("userName", data.userName);
    }
    setUserPoke(GetPokeTypeArrayFromJson());
    setIsOpen(true);
  };

  let isShareModal = false;
  const changeFlag = () => {
    isShareModal = true;
  };

  useEffect(() => {
    const userNameJson = localStorage.getItem("userName");

    setUserPoke(GetPokeTypeArrayFromJson());
    setUserName(userNameJson ? userNameJson : "名無しポケモンさん");
  }, []);

  useEffect(() => {
    reset({ userName: userName });
  }, [reset, userName]);

  return (
    <>
      {!user && (
        <Layout>
          <Meta title="すきなポケモンをシェアするよ～ん" />
          <div className="mx-8 mt-10 mb-24 text-center font-dot text-white">
            {userPoke && userPoke.length > 0 && (
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-8 font-medium">
                  <InputField
                    label="名前"
                    register={register("userName", {
                      maxLength: {
                        value: 20,
                        message: "20文字以内にしてください",
                      },
                    })}
                    placeholder={userName ? userName : "名無しポケモンさん"}
                    error={errors.userName?.message}
                    className="form-input mb-3 mt-1 block w-full rounded-md border-gray-300 text-black shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  ></InputField>
                </div>
                <div className="mt-24 sm:mb-32">
                  <Pokemons
                    pokemons={userPoke}
                    isEdit={true}
                    setUserPoke={setUserPoke}
                  ></Pokemons>
                </div>
                <div className="mt-10 mb-20 flex justify-center">
                  <Button
                    type="submit"
                    onClick={() => changeFlag()}
                    className="mx-2 rounded-full px-3 py-2 text-center text-xl font-medium hover:text-teal-200 md:text-3xl"
                  >
                    ▽シェアする
                  </Button>
                </div>
              </form>
            )}
            {!userPoke ||
              (userPoke.length === 0 && (
                <>
                  <div className="mb-8 font-medium">
                    <div className="grid grid-rows-3 gap-5">
                      <p className="self-end text-lg underline underline-offset-8 md:text-xl">
                        名無しポケモンさん
                      </p>
                      <p className="mt-4 text-lg font-medium md:text-3xl">
                        すきなポケモンの登録はありません
                      </p>
                      <Image
                        src="/images/pochama.png"
                        height={80}
                        width={80}
                        alt="poke"
                        className="mt-2 justify-self-center brightness-110"
                      />
                    </div>
                  </div>
                  <div className="text-center md:mt-48">
                    <div className="mt-20 md:mt-24">
                      <Link
                        href="/regions"
                        className="text-2xl hover:text-teal-200 md:text-3xl"
                      >
                        ▽ポケモンを見てみよう
                      </Link>
                    </div>
                  </div>
                </>
              ))}
            <PokeShareModal
              userName={userName}
              pokemons={userPoke}
              isOpen={isOpen}
              setIsOpen={setIsOpen}
            ></PokeShareModal>
          </div>
        </Layout>
      )}
    </>
  );
};

export default Share;
