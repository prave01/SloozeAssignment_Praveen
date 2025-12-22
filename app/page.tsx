"use client";

import { ModeToggle } from "@/components/custom/molecules/ModeToggle";
import { authClient } from "@/lib/auth-client";
import { useEffect } from "react";

export default function Home() {
  const res = authClient.useSession();
  console.log(res);
  useEffect(() => { });
  return (
    <div className="p-4">
      <ModeToggle />
    </div>
  );
}
