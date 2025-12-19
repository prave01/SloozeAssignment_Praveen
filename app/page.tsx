"use client";
import { authClient } from "@/auth-client";
import { ModeToggle } from "@/components/custom/molecules/ModeToggle";
import { Button } from "@/components/ui/button";

export default function Home() {
  const handleSignin = async () => {
    await authClient.signUp.email({
      email: "example@gmail.com",
      name: "Praveen",
      password: "praveen10",
    });
  };

  return (
    <div className="p-4">
      <Button onClick={handleSignin}>Login</Button>
      <ModeToggle />
    </div>
  );
}
