"use client";

import { useEffect, useState } from "react";
import { CreateUserClient } from "../../molecules/CreateUser/CreateUserClient";
import { getUserProfile } from "@/server/serverFn";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";

export const CreateUserPage = () => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const user = await getUserProfile();
        if (user.role !== "admin") {
          router.replace("/dashboard");
        } else {
          setLoading(false);
        }
      } catch (error) {
        router.replace("/login");
      }
    })();
  }, [router]);

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Spinner className="size-8" />
      </div>
    );
  }

  return (
    <div className="w-full h-full overflow-hidden relative bg-transparent">
      <div
        className="p-2 px-4 absolute top-0 left-0 border text-xl
          tracking-tighter border-t-0 border-l-0 w-fit text-primary
          dark:border-neutral-800 border-neutral-400"
      >
        Add New User
      </div>
      <div className="w-full h-full flex relative z-20 items-center justify-center">
        <CreateUserClient />
      </div>
    </div>
  );
};
