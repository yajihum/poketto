import { ReactNode } from "react";
import Footer from "./footer";
import Header from "./header";

export const siteTitle = "Next.js Sample Website";

type Props = {
  children?: ReactNode;
  isRegion?: boolean;
};

const Layout = ({ children, isRegion }: Props) => {
  let maxWidth: string = "max-w-xl";
  if (isRegion) {
    maxWidth = "max-w-fit";
  }

  return (
    <>
      <Header />
      <div className="bg-gradient-to-r from-rose-400 to-orange-300 pb-20 pt-4 md:pb-32">
        <main className={`container mx-auto ${maxWidth} py-3 md:py-10`}>
          {children}
        </main>
      </div>
      <Footer />
    </>
  );
};

export default Layout;
