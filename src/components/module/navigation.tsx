import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/auth";
import { login, logout } from "../../lib/auth";
import Button from "../ui/button";
import UserMenu from "./user-menu";

const Navigation = () => {
  const user = useAuth();
  const [waiting, setWaiting] = useState<boolean>(false);

  const singIn = () => {
    setWaiting(true);

    login()
      .catch((error) => {
        console.error(error?.code);
      })
      .finally(() => {
        setWaiting(false);
      });
  };

  const [urlPath, setUrlPath] = useState("");
  useEffect(() => {
    const uri = new URL(window.location.href);
    setUrlPath(uri.pathname);
  }, []);

  return (
    <nav className="bg-gradient-to-r from-rose-400 to-orange-300 pt-8 pb-3 md:py-10">
      <div className="justify-center md:mx-10 lg:mx-32 xl:mx-44">
        <ul className="ml-10 flex flex-row font-dot font-medium text-white md:text-lg xl:text-2xl 2xl:text-3xl">
          <li className="hidden basis-1/3  md:flex md:basis-1/4 lg:basis-1/6">
            <Link href="/" className=" hover:text-teal-200">
              ▽ホームにいく
            </Link>
          </li>
          <li className="hidden basis-1/3 md:flex md:basis-1/4 lg:basis-1/6">
            <Link href="/regions" className="hover:text-teal-200">
              ▽地方をみる
            </Link>
          </li>
          {!user && (
            <li className="hidden basis-1/3 md:flex md:basis-1/4 lg:basis-1/6">
              <Link href="/share" className=" hover:text-teal-200">
                ▽シェアする
              </Link>
            </li>
          )}
          <span className="flex-1"></span>
          {user === null && !waiting && (
            <li className="hidden basis-1/3 justify-end md:mr-6 md:flex md:basis-auto">
              <Button
                type="button"
                onClick={singIn}
                className=" hover:text-teal-200"
              >
                ▽ログイン
              </Button>
            </li>
          )}
          {user && urlPath !== "/mypage" && (
            // マイページ以外にいるとき
            <li className="hidden basis-1/3 md:flex md:basis-1/4 lg:basis-1/6">
              <Link href="/user/mypage" className=" hover:text-teal-200">
                ▽マイページ
              </Link>
            </li>
          )}
          {user && urlPath === "/mypage" && (
            // マイページにいるとき
            <li className="hidden basis-1/3 md:flex md:basis-1/4 lg:basis-1/6">
              <Button
                type="button"
                onClick={logout}
                className=" hover:text-teal-200"
              >
                ▽ログアウト
              </Button>
            </li>
          )}
          <div className="md:hidden">
            <UserMenu />
          </div>
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;
