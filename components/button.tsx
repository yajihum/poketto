import { ButtonHTMLAttributes, FC, ReactNode } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
};

const Button = ({ children, ...props }: Props) => {
  return (
    <button className="disabled:cursor-default disabled:opacity-50" {...props}>
      {children}
    </button>
  );
};

export default Button;
