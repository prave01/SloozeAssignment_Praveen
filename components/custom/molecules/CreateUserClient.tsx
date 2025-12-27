"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { X } from "lucide-react";
import { useState } from "react";
import { SelectRoleClient } from "./SelectRoleClient";
import { SelectLocationClient } from "./SelectLocationClient";
import {
  RegisterOptions,
  SubmitHandler,
  useForm,
  UseFormRegisterReturn,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateUserResolver, CreateUserType } from "@/client/zod-schema";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { Controller } from "react-hook-form";
import { CreateUser, uploadImage } from "@/server/serverFn";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Spinner } from "@/components/ui/spinner";
import { CustomInput } from "../atoms/CustomInput";

export const CreateUserClient = () => {
  const [image, setImage] = useState<File | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { isValid },
  } = useForm({
    resolver: zodResolver(CreateUserResolver),
    mode: "onChange",
  });

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are allowed");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    setImage(file);
  };

  const onSubmit: SubmitHandler<CreateUserType> = async (data) => {
    try {
      let imageUrl = "";

      setLoading(true);

      if (image) {
        const result = await uploadImage(image);
        imageUrl = result.url;
      }

      await CreateUser({
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
        location: data.location,
        image: imageUrl,
      });

      toast.success(`User "${data.name}" created successfully`);
    } catch (err: any) {
      console.error(err);
      toast.error("Signup failed", { description: String(err?.message) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      className="bg-transparent backdrop-blur-sm p-0 rounded-none shadow-none
        border-none gap-2 max-w-100 w-full"
    >
      <CardTitle className="border-myborder border py-2 px-3 text-xl">
        Create New User
      </CardTitle>
      <CardContent className="border border-myborder px-3 py-2 rounded-none">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full h-auto flex flex-col gap-2"
        >
          <CustomInput
            name={"Name"}
            label={"name"}
            placeholder={"eg. Tony-Stark"}
            register={register}
            isMandatory={true}
            type="text"
          />
          <CustomInput
            name="Email"
            type="email"
            isMandatory={true}
            label="email"
            placeholder="eg. example@email.com"
            register={register}
          />

          <div className="relative flex gap-2 flex-col">
            <CustomInput
              name="Create Password"
              isMandatory={true}
              label="password"
              type={showPassword ? "text" : "password"}
              register={register}
              placeholder="*****"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-1 cursor-pointer pr-2 top-12.5
                -translate-y-1/2 text-muted-foreground hover:text-foreground
                transition"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <div className="flex justify-between">
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <SelectRoleClient onChange={field.onChange} />
              )}
            />
            <Controller
              name="location"
              control={control}
              render={({ field }) => (
                <SelectLocationClient onChange={field.onChange} />
              )}
            />
          </div>
          <label>Profile Image</label>
          <div
            className="relative flex flex-col items-center justify-center border
              bg-zinc-500/10 border-dashed border-myborder h-36 cursor-pointer
              text-sm hover:bg-zinc-500/10 transition"
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
                <p className="text-xs text-orange-500">max_size - 5mb</p>
              </>
            ) : (
              <div className="relative">
                <Avatar className="size-20">
                  <AvatarImage
                    className="object-cover"
                    alt="preview"
                    src={URL.createObjectURL(image)}
                  />
                  <AvatarFallback>AN</AvatarFallback>
                </Avatar>

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
          <Button
            type="submit"
            disabled={!isValid || loading}
            className="m-2 w-40 mx-auto"
          >
            {loading ? <Spinner className="size-6" /> : "Create"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
