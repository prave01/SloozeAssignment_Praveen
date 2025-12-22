"use client";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

interface LoginInputs {
  email: string;
  password: string;
}

export default function LoginCard() {
  const { register, handleSubmit } = useForm<LoginInputs>();
  const [loading, setLoading] = useState(false);

  const onSubmit: SubmitHandler<LoginInputs> = async (data) => {
    try {
      await authClient.signIn.email(
        {
          email: data.email,
          password: data.password,
          callbackURL: "/",
        },
        {
          onRequest: () => setLoading(true),
          onSuccess: () => console.log("success"),
          onError: (ctx) =>
            console.log("Error", ctx.error, ctx.request, ctx.response),
        },
      );
    } catch (err) {
      setLoading(false);
      console.log("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-0 bg-transparent z-10 overflow-hidden gap-0 relative">
      <div
        className="absolute dark:flex hidden brightness-75 -z-10 inset-0"
        style={{
          background:
            "radial-gradient(125% 125% at 50% 90%, rgba(0,0,0,0) 40%, #0d1a36 100%)",
        }}
      ></div>
      <CardTitle className="lg:text-lg relative w-100 text-md p-2">
        Login with credentials
      </CardTitle>
      <hr className="" />
      <CardContent>
        <form
          className="px-2 py-2 flex flex-col gap-3"
          onSubmit={handleSubmit(onSubmit)}
        >
          {" "}
          <div className="w-full h-auto flex flex-col gap-2">
            {" "}
            <label htmlFor="email" className="text-sm">
              Email
            </label>
            <input
              required
              id="email"
              type="email"
              className="placeholder:italic bg-zinc-200 text-sm
                placeholder:text-sm max-w-100 focus:outline-none py-2 px-3
                rounded-md w-full dark:bg-accent/50"
              placeholder="eg. Nick"
              {...register("email", { required: true })}
            />
          </div>
          <div className="w-full h-auto flex flex-col gap-2">
            {" "}
            <label htmlFor="password" className="text-sm">
              Password
            </label>
            <input
              required
              id="password"
              type="password"
              className="placeholder:italic text-sm placeholder:text-sm
                max-w-100 focus:outline-none bg-zinc-200 py-2 px-3 rounded-md
                w-full dark:bg-accent/50"
              placeholder="*****"
              {...register("password", { required: true })}
            />
          </div>
          <Button
            disabled={loading}
            type="submit"
            className="w-fit mx-auto cursor-pointer"
          >
            {loading ? "loading.." : "Login"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
