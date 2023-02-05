import { useEffect, useState } from "react";
import Pokemons from "../../components/module/pokemons";
import {
  LineIcon,
  LineShareButton,
  TwitterIcon,
  TwitterShareButton,
} from "react-share";
import { GetUserInfo } from "../../lib/user";
import { useRouter } from "next/router";
import Layout from "../../components/layout/layout";
import Meta from "../../components/layout/meta";
import Image from "next/image";
import fixedNames from "../../lib/fixed-name";

const AllUserInfo = () => {
  const f = fixedNames;
  const router = useRouter();
  const { id } = router.query;
  const [urlOrigin, setUrlOrigin] = useState("");

  const [userId, setId] = useState("");

  useEffect(() => {
    // idがqueryで利用可能になったら処理される
    if (router.asPath !== router.route) {
      setId(String(router.query.id));
    }
  }, [router]);

  const userInfo = GetUserInfo(userId);

  useEffect(() => {
    const uri = new URL(window.location.href);
    setUrlOrigin(uri.origin);
  }, []);

  if (!userInfo) return null;

  const mb =
    userInfo?.pokemons && userInfo.pokemons.length > 0 ? "mb-36" : "mb-42";

  return (
    <Layout>
      <Meta title={userInfo.name + f.USER_PAGE} />
      <div
        className={`mx-6 ${mb} rounded-3xl bg-white bg-opacity-20 px-8 py-4 text-center font-dot text-white`}
      >
        <div className="mb-16 font-medium">
          <p className="mt-6 text-3xl md:text-5xl">{userInfo.name}</p>
          <div className="mt-10">
            <TwitterShareButton
              title={userInfo.name + f.USER_LIKE_POKE}
              url={`${urlOrigin}/${id}`}
              className="mx-2 opacity-75"
            >
              <TwitterIcon size={50} round></TwitterIcon>
            </TwitterShareButton>
            <LineShareButton
              title={userInfo?.name + f.USER_LIKE_POKE}
              url={`${urlOrigin}/${id}`}
              className="mx-2 opacity-75"
            >
              <LineIcon size={50} round></LineIcon>
            </LineShareButton>
          </div>
          {userInfo && userInfo.comment && (
            <p className="my-10 whitespace-pre-line text-2xl italic md:text-3xl">
              {userInfo?.comment}
            </p>
          )}
        </div>
        <div className="mt-16 mb-20 sm:mt-20 sm:mb-52 md:mb-32">
          {userInfo.pokemons && userInfo.pokemons.length > 0 ? (
            <Pokemons pokemons={userInfo.pokemons} isEdit={false}></Pokemons>
          ) : (
            <div className="grid grid-rows-2 gap-5 pb-8">
              <Image
                src="/images/pochama.png"
                height={80}
                width={80}
                alt="poke"
                className="mt-2 justify-self-center brightness-110"
              />
              <p className="text-base font-medium md:text-lg">{f.NON_POKE}</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AllUserInfo;
