import { ReactNode } from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import TextareaAutosize, {
  TextareaAutosizeProps,
} from "react-textarea-autosize";
import { classNames } from "../../lib/class-names";
import FieldGroup from "./field-group";

type Props = {
  label: string;
  error?: string;
  currentlength?: number;
  action?: ReactNode;
  register: UseFormRegisterReturn;
} & TextareaAutosizeProps;

const TextareaField = ({
  error,
  label,
  currentlength,
  register,
  action,
  className,
  ...props
}: Props) => {
  return (
    <FieldGroup
      label={label}
      error={error}
      currentLength={currentlength}
      action={action}
      maxLength={props.maxLength}
      required={props.required}
      id={register.name}
    >
      <TextareaAutosize
        id={register.name}
        className={classNames(
          "w-full flex-1 rounded border px-2 py-1 text-center",
          className
        )}
        {...register}
        {...props}
      />
    </FieldGroup>
  );
};

export default TextareaField;
