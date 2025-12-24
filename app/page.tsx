"use client";

import { ModeToggle } from "@/components/custom/molecules/ModeToggle";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/auth-client";
import { feedMenuItems } from "@/server-actions/serverFn";
import { useEffect } from "react";
import { toast } from "sonner";

export default function Home() {
  useEffect(() => {
    const res = feedMenuItems([
      {
        name: "Sambar",
        restaurantName: "Sivan",
        elapsedTime: "10min",
        imageUrl:
          "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a",
        menuId: "019b4f4c-7f26-70ce-8a39-b150ca206cf2",
        cost: 100,
      },
    ]);
    console.log(res);
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
