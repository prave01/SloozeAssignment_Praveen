import { CreateItemType } from "@/server/zod-schema";
import { HTMLInputTypeAttribute, useEffect } from "react";
import { type Control, Controller, useFormState } from "react-hook-form";

export function CustomInput({
  name,
  placeholder,
  isMandatory,
  location,
  control,
  type,
}: {
  name: any;
  label: string;
  control: Control<CreateItemType>;
  placeholder: string;
  isMandatory: boolean;
  location?: "america" | "india";
  type: HTMLInputTypeAttribute;
}) {
  const { dirtyFields } = useFormState({ control });

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name}>
        {name}
        {isMandatory && (
          <span className="text-sm font-medium text-red-500/50">*</span>
        )}
      </label>

      <Controller
        name={name}
        control={control}
        rules={{ required: isMandatory }}
        render={({ field }) => (
          <input
            {...field}
            type={type}
            placeholder={placeholder}
            onChange={(e) => {
              let value = e.target.value;

              if (name === "Cost") {
                value = value.replace(/\$/g, "") + "$";
              }

              console.log(location);
              field.onChange(value); // ✅ RHF now owns "$"
            }}
            className="rounded-none placeholder:text-xs text-sm w-full
              placeholder:pl-1 placeholder:italic focus:outline-none
              focus:bg-zinc-500/20 border border-myborder px-2 py-2"
          />
        )}
      />
    </div>
  );
}
