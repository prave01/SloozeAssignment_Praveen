"use client";

import { CardContent, CardTitle } from "@/components/ui/card";
import { CustomInput } from "@/components/custom/atoms/CustomInput";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { X } from "lucide-react";
import { type CreateItemType, ItemBaseSchema } from "@/server/zod-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateItem, uploadImage } from "@/server/serverFn";
import { Spinner } from "@/components/ui/spinner";
import { SelectLocationClient } from "../../SelectLocationClient";
import { SelectDuration } from "../../SelectDuration";
import { useItem } from "@/client/store";

export function CreateItemClient() {
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const items = useItem((s) => s.itemsState);
  const setItems = useItem((s) => s.setItems);

  const {
    handleSubmit,
    control,
    formState: { isValid, errors },
    watch,
    register,
  } = useForm({
    resolver: zodResolver(ItemBaseSchema),
  });

  useEffect(() => {
    console.log(errors);
  }, [errors]);

  const location = watch("location");

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

  const onSubmit: SubmitHandler<CreateItemType> = async (data) => {
    try {
      var res;

      setLoading(true);

      if (image) {
        res = await uploadImage(image);
      }

      const createdItem = await CreateItem({
        name: data.name,
        elapsedTime: data.elapsedTime,
        cost: data.cost,
        image: res?.url || "",
        location: data.location,
      });

      if (createdItem.id) {
        // refreshing the available items
        setItems([
          ...items,
          {
            name: data.name,
            elapsedTime: data.elapsedTime,
            cost: data.cost,
            location: data.location,
            image: data.image,
          },
        ]);
      }

      toast.success(`Item ${createdItem.name} Created Successfully`);
    } catch (err: any) {
      console.error(err);
      toast.error("Creating Item Failed", { description: err });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="group w-1/3 h-full flex flex-col gap-2 focus:outline-none">
      <CardTitle
        className="border border-myborder py-1 px-3 text-lg transition-all
          duration-200 group-focus-within:border-blue-500/40"
      >
        Create Item
      </CardTitle>

      <CardContent
        className="w-full h-full border flex items-center justify-center
          border-myborder transition-all px-5 py-8 duration-200
          group-focus-within:border-blue-500/40"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          {" "}
          <div className="flex gap-4 flex-col h-full w-[90%] mx-auto">
            <CustomInput
              label="Item name"
              name="name"
              placeholder="eg. Pizza :)"
              type="text"
              register={register}
              isMandatory={true}
            />

            <Controller
              name="location"
              control={control}
              render={({ field }) => (
                <div className="flex flex-row items-center justify-between">
                  {" "}
                  <SelectLocationClient onChange={field.onChange} />
                  <span className="italic text-neutral-500 text-xs text-right pt-5">
                    select appropriate location for right <br />
                    currency (America - $ / India - ₹)
                  </span>
                </div>
              )}
            />

            <div className="flex gap-2">
              {" "}
              <CustomInput
                name="cost"
                label="Cost"
                location={location}
                register={register}
                placeholder="eg. 10 ($/₹)"
                type="number"
                isMandatory={true}
              />
              <Controller
                name="elapsedTime"
                control={control}
                render={({ field }) => (
                  <div className="flex flex-row items-center justify-between">
                    {" "}
                    <SelectDuration onChange={field.onChange} />
                  </div>
                )}
              />
            </div>

            <div className="flex flex-col gap-2">
              {" "}
              <label>Item Image</label>
              <div
                className="relative flex flex-col items-center justify-center
                  border bg-zinc-500/10 border-dashed border-myborder h-36
                  cursor-pointer text-sm hover:bg-zinc-500/10 transition"
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
            </div>
            {/* <div */}
            {/*   className="border border-myborder relative w-full h-full px-1 py-2 */}
            {/*     rounded-sm" */}
            {/* > */}
            {/*   {" "} */}
            {/*   <Image */}
            {/*     src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80" */}
            {/*     alt="Photo by Drew Beamer" */}
            {/*     fill */}
            {/*     className="h-full w-full rounded-sm absolute -z-10 object-cover */}
            {/*       dark:brightness-[0.2] dark:grayscale" */}
            {/*   /> */}
            {/*   <HoverPreview /> */}
            {/* </div> */}
            <Button
              type="submit"
              disabled={!isValid || loading}
              className="my-4 w-[70%] mx-auto"
            >
              {loading ? <Spinner className="size-6" /> : "Create Item"}
            </Button>
          </div>
        </form>
      </CardContent>
    </div>
  );
}
