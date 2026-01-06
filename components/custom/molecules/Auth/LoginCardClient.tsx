"use client";

import { authClient } from "@/lib/auth/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { ErrorContext } from "better-auth/react";
import { toast } from "sonner";
import { LoginResolver, type LoginType } from "@/client/zod-schema";
import { zodResolver } from "@hookform/resolvers/zod";

export default function LoginCardClient() {
  const {
    register,
    handleSubmit,
    formState: { isValid },
  } = useForm<LoginType>({
    resolver: zodResolver(LoginResolver),
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorContext | null>(null);

  const onSubmit: SubmitHandler<LoginType> = async (data) => {
    try {
      const result = await authClient.signIn.email(
        {
          email: data.email,
          password: data.password,
          callbackURL: "/",
        },
        {
          onRequest: () => setLoading(true),
          onSuccess: () => {
            toast.success("Your are logged in successfully");
          },
          onError: (ctx) => {
            setError(ctx);
          },
        },
      );

      if (result.error) {
        toast.error("Error While SignIn", {
          description: result.error.message,
        });
      }

      toast.success("LoggedIn Successfully");
    } catch (err) {
      setLoading(false);
      console.log("Error:", err);
      toast.error("Error While Logging In");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      className="p-0 rounded-none border-myborder border bg-transparent z-10
        overflow-hidden gap-0 relative"
    >
      <div
        className="absolute dark:flex hidden brightness-75 -z-10 inset-0"
        style={{
          background:
            "radial-gradient(125% 125% at 50% 90%, rgba(0,0,0,0) 40%, #0d1a36 100%)",
        }}
      ></div>
      <CardTitle
        className="lg:text-lg border-b border-myborder relative w-full text-md
          p-2"
      >
        Login with credentials
      </CardTitle>
      <CardContent>
        <form
          className="px-2 py-3 flex flex-col gap-3"
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
              className="placeholder:italic text-sm placeholder:text-xs
                max-w-100 focus:outline-none py-2 px-3 w-full dark:bg-black
                bg-zinc-200 border-myborder border"
              placeholder="eg. tony@avengers.com"
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
              className="placeholder:italic text-sm placeholder:text-xs
                max-w-100 focus:outline-none py-2 px-3 w-full dark:bg-black
                bg-zinc-200 border-myborder border"
              placeholder="*****"
              {...register("password", { required: true })}
            />
          </div>
          {error && (
            <div className="w-full text-center text-destructive text-sm">
              {error?.error.message}
            </div>
          )}
          <Button
            disabled={loading || !isValid}
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
