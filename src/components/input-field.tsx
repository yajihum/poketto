import { InputHTMLAttributes, ReactNode } from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import { classNames } from "../lib/class-names";
import FieldGroup from "./field-group";

type Props = {
  label: string;
  error?: string;
  currentLength?: number;
  action?: ReactNode;
  register: UseFormRegisterReturn;
} & InputHTMLAttributes<HTMLInputElement>;

const InputField = ({
  error,
  label,
  currentLength,
  register,
  action,
  className,
  ...props
}: Props) => {
  return (
    <FieldGroup
      label={label}
      error={error}
      currentLength={currentLength}
      action={action}
      maxLength={props.maxLength}
      required={props.required}
      id={register.name}
    >
      <input
        id={register.name}
        className={classNames("w-full flex-1 px-2 py-2", className)}
        {...register}
        {...props}
      ></input>
    </FieldGroup>
  );
};

export default InputField;
