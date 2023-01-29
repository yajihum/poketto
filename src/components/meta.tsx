import { GetServerSideProps, GetServerSidePropsContext } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
type Props = {
  title: string;
  baseUrl?: string;
};

const Meta = ({ title, baseUrl }: Props) => {
  const imageUrl = "https://poketto-mon.vercel.app/api/og";
  const siteName = "すきなポケモンをシェアするアプリ";

  const router = useRouter();

  return (
    <Head>
      <title>{title}</title>
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="description" content={siteName} />
      <meta property="og:title" content={title} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:type" content="web app" />
      <meta
        property="og:url"
        content={`https://poketto-mon.vercel.app${router.pathname}`}
      ></meta>
      <meta property="og:site_name" content="Poketto"></meta>
      <meta property="og:description" content={siteName} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@yajium_" />
      <link rel="icon" href="/images/gureishia.png" />
    </Head>
  );
};

export default Meta;
