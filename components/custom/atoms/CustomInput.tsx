import { HTMLInputTypeAttribute } from "react";
import { UseFormRegister } from "react-hook-form";

export function CustomInput({
  name,
  label,
  placeholder,
  register,
  isMandatory,
  type,
}: {
  name: string;
  label: string;
  placeholder: string;
  register: UseFormRegister<any>;
  isMandatory: boolean;
  type: HTMLInputTypeAttribute;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name}>
        {label}
        {isMandatory && (
          <span className="text-sm font-medium text-red-500/50">*</span>
        )}
      </label>

      <input
        id={name}
        type={type}
        placeholder={placeholder}
        {...register(name, {
          required: isMandatory,
          valueAsNumber: type === "number",
        })}
        className="rounded-none placeholder:text-xs text-sm w-full
          placeholder:pl-1 placeholder:italic focus:outline-none
          focus:bg-zinc-500/20 border border-myborder px-2 py-2"
      />
    </div>
  );
}
