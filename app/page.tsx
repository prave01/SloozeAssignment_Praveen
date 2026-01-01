"use client";

import { ModeToggle } from "@/components/custom/molecules/ModeToggle";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/auth-client";
import { createRestaurant } from "@/server/serverFn";
import { useEffect } from "react";
import { toast } from "sonner";

export default function Home() {
  useEffect(() => {
    const result = createRestaurant({ location: "america", name: "English" });
    console.log(result);
  }, []);

  return (
    <div className="p-4">
      <Button
        onClick={() => {
          authClient.signUp.email(
            {
              name: "praveen",
              password: "praveen10",
              email: "praveen@gmail.com",
            },
            {
              onError: (ctx) => console.log(ctx),
              onSuccess: () => {
                toast.success("User Created");
              },
            },
          );
        }}
      >
        SignUp
      </Button>
      <ModeToggle />
    </div>
  );
}
