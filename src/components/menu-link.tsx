import Link from "next/link";
import { ReactNode } from "react";

const MenuLink = ({
  href,
  children,
  ...rest
}: {
  href: string;
  children: ReactNode;
}) => {
  return (
    <Link href={href} {...rest}>
      {children}
    </Link>
  );
};

export default MenuLink;
