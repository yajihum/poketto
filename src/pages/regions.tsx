import { RegionType } from "../types/graphql_pokemon";
import Layout from "../components/layout/layout";
import Link from "next/link";
import Meta from "../components/layout/meta";
import fixedNames from "../lib/fixed-name";
import { getJaRegions } from "../lib/module/pokemon";

type Props = {
  regions: RegionType[];
};

const Regions = ({ regions }: Props) => {
  const f = fixedNames;
  return (
    <>
      <Layout>
        <Meta title={f.SELECT_REGION} />
        <div className="text-center font-dot font-medium">
          <p className="text-2xl text-white md:text-4xl">{f.SELECT_REGION}</p>
        </div>
        <div className="mx-10 mt-6 justify-items-center rounded-3xl bg-white px-4 py-4 font-dot text-rose-400 shadow-2xl md:mx-14 md:my-20 md:px-12">
          {regions.map(({ jaName, name }) => (
            <Link
              href={`/category/${name}`}
              key={name}
              className="my-6 block text-center"
            >
              <p className="text-2xl font-bold transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:text-teal-300 md:text-3xl">
                {jaName}
              </p>
            </Link>
          ))}
        </div>
      </Layout>
    </>
  );
};

export default Regions;

export const getStaticProps = async () => {
  const regions = await getJaRegions();
  return {
    props: { regions },
  };
};
