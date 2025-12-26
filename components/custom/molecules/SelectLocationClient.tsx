"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectGroup,
  SelectValue,
} from "@/components/ui/select";

export const SelectLocationClient = ({
  selectLocation,
}: {
  selectLocation: (data: "india" | "america") => void;
}) => {
  return (
    <div className="gap-2 flex flex-col">
      <label>
        Location <span className="text-sm font-medium text-red-500/50">*</span>
      </label>
      <Select required onValueChange={selectLocation}>
        <SelectTrigger
          className="w-45 p-2 border border-myborder rounded-none
          justify-start"
        >
          <SelectValue
            placeholder="Select Location"
            className="mx-0 p-2 placeholder:px-0"
          />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {" "}
            <SelectLabel>locations</SelectLabel>
            <SelectItem value="america">America</SelectItem>
            <SelectItem value="india">India</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>{" "}
    </div>
  );
};
