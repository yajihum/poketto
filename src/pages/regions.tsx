import { RegionType } from "../types/pokemon";
import Layout from "../components/layout/layout";
import Link from "next/link";
import { getJaRegions } from "../lib/pokemon";
import Meta from "../components/layout/meta";
import fixedNames from "../lib/fixed-name";

type Props = {
  regions: RegionType[];
};

const Regions = ({ regions }: Props) => {
  const f = fixedNames;
  return (
    <>
      <Layout>
        <Meta title={f.SELECT_REGION} />
        <div className="mb-8 text-center font-dot font-medium">
          <p className="text-2xl text-white md:text-4xl">{f.SELECT_REGION}</p>
        </div>
        <div className="mx-7 mt-10 justify-items-center rounded-3xl bg-white px-7 py-7 font-dot text-rose-400 shadow-2xl md:my-20 md:px-16">
          {regions.map(({ jaName, name }) => (
            <Link
              href={`/category/${name}`}
              key={name}
              className="my-6 block text-center"
            >
              <p className="text-2xl font-bold transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:text-teal-300 md:text-4xl">
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
