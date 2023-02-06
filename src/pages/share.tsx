import { PokeType } from "../types/pokemon";
import Layout from "../components/layout/layout";
import Link from "next/link";
import { useAuth } from "../context/auth";
import { useEffect, useState } from "react";
import InputField from "../components/field/input-field";
import { SubmitHandler, useForm } from "react-hook-form";
import Button from "../components/ui/button";
import Pokemons from "../components/module/pokemons";
import router from "next/router";
import { GetPokeTypeArrayFromJson } from "../lib/module/pokemon";
import PokeShareModal from "../components/module/modal/pokemon-share-modal";
import Meta from "../components/layout/meta";
import Image from "next/image";
import fixedNames from "../lib/fixed-name";
import { ArrowUpRightIcon } from "@heroicons/react/24/outline";

const Share = () => {
  const f = fixedNames;
  const user = useAuth();

  if (user) {
    router.replace("/user/mypage");
  }

  const [userName, setUserName] = useState(f.NON_NAME);
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
    setUserName(userNameJson ? userNameJson : f.NON_NAME);
  }, []);

  useEffect(() => {
    reset({ userName: userName });
  }, [reset, userName]);

  return (
    <>
      {!user && (
        <Layout>
          <Meta title={f.SHARE_POKE} />
          <div className="mx-8 mt-10 mb-24 rounded-3xl bg-white bg-opacity-20 px-8 py-4 text-center font-dot text-white">
            {userPoke && userPoke.length > 0 && (
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-8 font-medium">
                  <InputField
                    label={f.LABEL_NAME}
                    register={register("userName", {
                      maxLength: {
                        value: 20,
                        message: "20文字以内にしてください",
                      },
                    })}
                    placeholder={userName ? userName : f.NON_NAME}
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
                    <span>▽{f.BTN_SHARE}</span>
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
                        {f.NON_NAME}
                      </p>
                      <p className="mt-10 text-base font-medium md:text-2xl">
                        {f.NON_POKE}
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
                  <div className="mb-10 mt-16 text-center md:my-32">
                    <Link
                      href="/regions"
                      className="mx-2 mb-10 rounded-full border-2 border-teal-300 bg-white px-6 py-3 text-center text-lg font-medium text-teal-300 opacity-95 hover:text-teal-100 md:text-xl"
                    >
                      {f.BTN_LOOKUP_POKE}
                      <ArrowUpRightIcon className="inline h-6 w-6" />
                    </Link>
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
