"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { SelectGroup, SelectValue } from "@/components/ui/select";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
} from "@/components/ui/select";
import { X } from "lucide-react";
import { useState } from "react";

export const CreateUserClient = () => {
  const [role, selectRole] = useState<string>();
  const [image, setImage] = useState<File | null>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    setImage(file);
  };
  return (
    <Card
      className="bg-black p-0 rounded-none shadow-none border-none gap-2
        max-w-100 w-full"
    >
      <CardTitle className="border-myborder border py-2 px-3 text-lg">
        Create New User
      </CardTitle>
      <CardContent className="border border-myborder px-3 py-2 rounded-none">
        <form className="w-full h-auto flex flex-col gap-2">
          <label htmlFor="name">
            Name <span className="text-sm font-medium text-red-500/50">*</span>
          </label>
          <input
            required
            id="name"
            placeholder="eg. tony-start"
            className="rounded-none placeholder:text-xs text-sm w-full
              placeholder:pl-1 placeholder:italic focus:outline-none
              focus:bg-zinc-500/20 border border-myborder px-2 py-2"
          />
          <label htmlFor="email">
            Email <span className="text-sm font-medium text-red-500/50">*</span>
          </label>
          <input
            required
            id="email"
            type="email"
            placeholder="eg. example@email.com"
            className="rounded-none placeholder:text-xs text-sm placeholder:pl-1
              placeholder:italic focus:outline-none focus:bg-zinc-500/20 border
              border-myborder px-2 py-2"
          />
          <label htmlFor="role">
            Role <span className="text-sm font-medium text-red-500/50">*</span>
          </label>
          <Select required onValueChange={selectRole}>
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
                {" "}
                <SelectLabel>roles</SelectLabel>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="member">Member</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>{" "}
          <label className="mt-2">Profile Image </label>
          <div
            className="relative flex flex-col items-center justify-center border
              border-dashed border-myborder h-36 cursor-pointer text-sm
              hover:bg-zinc-500/10 transition"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const file = e.dataTransfer.files?.[0];
              if (file) handleFile(file);
            }}
          >
            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
              }}
            />

            {!image ? (
              <>
                <p className="font-medium">Drag & drop image here</p>
                <p className="text-xs text-muted-foreground">
                  or click to select
                </p>
              </>
            ) : (
              <div className="relative">
                {/* Image Preview */}
                <img
                  src={URL.createObjectURL(image)}
                  alt="preview"
                  className="h-32 w-32 object-cover border"
                />

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setImage(null);
                  }}
                  className="absolute -top-2 -right-2 bg-black/70 text-white
                    rounded-full p-1 hover:bg-red-600 transition"
                >
                  <X size={14} />
                </button>
              </div>
            )}
          </div>
          <Button type="submit" className="m-2 w-40 mx-auto">
            Submit
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
