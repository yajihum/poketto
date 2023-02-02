import Navigation from "../module/navigation";

const name = "yajium";
export const siteTitle = "Next.js Sample Website";

const Header = () => {
  return (
    <header className="justify-self-center text-center">
      <Navigation></Navigation>
    </header>
  );
};

export default Header;
