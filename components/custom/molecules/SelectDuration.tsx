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

const durations = Array.from({ length: 12 }, (_, i) => (i + 1) * 5);

export const SelectDuration = ({
  onChange,
}: {
  onChange: (data: string) => void;
}) => {
  return (
    <div className="gap-2 flex flex-col">
      <label>
        Duration <span className="text-sm font-medium text-red-500/50">*</span>
      </label>

      <Select required onValueChange={onChange}>
        <SelectTrigger className="w-45 p-2 border border-myborder rounded-none justify-start">
          <SelectValue placeholder="Select duration" />
        </SelectTrigger>

        <SelectContent>
          <SelectGroup>
            <SelectLabel>Duration</SelectLabel>

            {durations.map((min) => (
              <SelectItem key={min} value={String(min)}>
                {min === 60 ? "1 hr" : `${min} min`}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};
