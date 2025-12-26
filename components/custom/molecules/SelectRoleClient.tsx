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

export const SelectRoleClient = ({
  onChange,
}: {
  onChange: (value: "member" | "manager") => void;
}) => {
  return (
    <div className="gap-2 flex flex-col">
      <label>
        Role <span className="text-sm font-medium text-red-500/50">*</span>
      </label>
      <Select required onValueChange={onChange}>
        <SelectTrigger
          className="w-45 p-2 border border-myborder rounded-none
          justify-start"
        >
          <SelectValue
            placeholder="Select Role"
            className="mx-0 p-2 placeholder:px-0"
          />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>roles</SelectLabel>
            <SelectItem value="manager">Manager</SelectItem>
            <SelectItem value="member">Member</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>{" "}
    </div>
  );
};
