import Layout from "../components/layout/layout";
import Image from "next/image";
import Meta from "../components/layout/meta";
import fixedNames from "../lib/fixed-name";

const Home = () => {
  const f = fixedNames;
  return (
    <>
      <Layout>
        <Meta title={f.TITLE} />
        <div className="mx-6 mt-10 mb-28 text-center font-dot text-white md:mt-20 md:mb-28">
          <div className="grid grid-rows-3 items-stretch gap-0 pb-11 font-bungee font-extrabold tracking-wide text-teal-200 md:tracking-widest">
            <p className="self-end text-4xl md:text-6xl">{f.SHARE}</p>
            <p className="self-center text-4xl md:text-6xl">{f.YOUR}</p>
            <p className="text-6xl md:text-8xl">{f.POKETTO}</p>
            <Image
              src="/images/gureishia.png"
              height={80}
              width={80}
              alt="poke"
              className="mt-2 justify-self-center brightness-110"
            />
          </div>
          <div className="mt-4">
            <p className="font-nico text-xl font-medium md:text-2xl">
              {f.SHARE_POKE}
            </p>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Home;
