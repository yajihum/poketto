import Layout from "../components/layout";
import UserGuard from "../guards/user-guard";
import Link from "next/link";
import { useAuth } from "../context/auth";
import React, { useEffect, useState } from "react";
import Pokemons from "../components/pokemons";
import { GetUserInfo } from "../lib/user";
import { UserInfo } from "../types/user";
import { useRouter } from "next/router";
import Image from "next/image";
import Meta from "../components/meta";
import WithdrawModal from "../components/withdraw-modal";
import Button from "../components/button";
import { HandRaisedIcon } from "@heroicons/react/24/outline";

const Mypage = () => {
  const user = useAuth();
  const router = useRouter();
  const actions = [
    {
      label: "シェアする",
      link: `/${user?.id}`,
    },
    {
      label: "編集する",
      link: "/mypage/edit",
    },
  ];

  const [isOpen, setIsOpen] = useState(false);

  let userInfo: UserInfo | null = null;

  const userId: string | undefined = user?.id;
  userInfo = GetUserInfo(userId);

  if (!userInfo) return null;

  if (!user) {
    router.replace("/");
  }

  const mb =
    userInfo?.pokemons && userInfo.pokemons.length > 0 ? "mb-36" : "mb-42";

  return (
    <UserGuard>
      {(user) => (
        <Layout>
          <Meta title={`${userInfo?.name}さんのページ`} />
          <div className={`mx-6 ${mb} text-center font-dot text-white md:mt-8`}>
            <div className="mb-16 font-medium">
              <p className="mt-6 text-3xl md:text-5xl">{userInfo?.name}</p>
              <div className="my-8 flex items-center justify-center">
                {actions.map((action) => (
                  <Link
                    href={action.link}
                    key={action.label}
                    className="mx-2 flex items-center rounded-full px-3 py-2 text-xl font-medium hover:text-teal-200 md:text-2xl"
                  >
                    <span>▽</span>
                    <span>{action.label}</span>
                  </Link>
                ))}
              </div>
            </div>
            {userInfo?.comment && (
              <div className="">
                <p className="whitespace-pre-line text-2xl italic md:text-3xl">
                  {userInfo?.comment}
                </p>
              </div>
            )}
            <div className="mt-20 mb-20 sm:mt-20 sm:mb-32">
              {userInfo?.pokemons && userInfo.pokemons.length > 0 ? (
                <Pokemons
                  pokemons={userInfo.pokemons}
                  isEdit={false}
                ></Pokemons>
              ) : (
                <div className="grid grid-rows-2 gap-5 pb-16">
                  <Image
                    src="/images/pochama.png"
                    height={80}
                    width={80}
                    alt="poke"
                    className="mt-2 justify-self-center brightness-110"
                  />
                  <p className="text-lg font-medium">
                    すきなポケモンの登録はありません
                  </p>
                </div>
              )}
            </div>
            <div className="flex justify-center hover:text-teal-200">
              <Button onClick={() => setIsOpen(true)}>お別れする</Button>
              <HandRaisedIcon className="h-5 w-5 self-end" />
            </div>
          </div>
          <WithdrawModal isOpen={isOpen} setIsOpen={setIsOpen} />
        </Layout>
      )}
    </UserGuard>
  );
};

export default Mypage;
