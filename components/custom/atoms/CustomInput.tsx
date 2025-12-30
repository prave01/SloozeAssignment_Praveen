import { cn } from "@/lib/utils";
import { HTMLInputTypeAttribute } from "react";
import { UseFormRegister } from "react-hook-form";

export function CustomInput({
  name,
  placeholder,
  isMandatory,
  location,
  register,
  type,
  label,
}: {
  name: any;
  label: string;
  placeholder: string;
  register: UseFormRegister<any>;
  isMandatory: boolean;
  location?: "america" | "india";
  type: HTMLInputTypeAttribute;
}) {
  const currencyType = location === "america" ? "$" : "₹";

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name}>
        {label}
        {isMandatory && (
          <span className="text-sm font-medium text-red-500/50">*</span>
        )}
      </label>

      <div className="flex flex-row gap-2">
        {" "}
        {name === "cost" && (
          <p
            className="border border-myborder flex items-center justify-center
              w-10 text-center align-middle rounded-none"
          >
            {currencyType}
          </p>
        )}
        <input
          id={name}
          type={type}
          disabled={name === "cost" && location === undefined && true}
          required={isMandatory}
          placeholder={placeholder}
          {...register(name, { required: isMandatory })}
          className={cn(`rounded-none placeholder:text-xs text-sm w-full
            placeholder:pl-1 placeholder:italic focus:outline-none
            focus:bg-zinc-500/20 border border-myborder px-2 py-2`)}
        />
      </div>
    </div>
  );
}
