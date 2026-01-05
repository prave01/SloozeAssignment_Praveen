"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ClassNameValue } from "tailwind-merge";
import { motion } from "motion/react";
import CustomButton from "../atoms/CustomButton";
import { ModeToggle } from "./ModeToggle";
import { Links } from "@/client/constants";
import { useEffect, useState } from "react";
import { getUserProfile } from "@/server/serverFn";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, User, MapPin, Shield } from "lucide-react";
import { authClient } from "@/lib/auth/auth-client";
import { useRouter } from "next/navigation";

export default function NavMenu() {
  const [isExpand, setExpand] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const session = authClient.useSession();
  const authUser = session.data?.user;

  useEffect(() => {
    (async () => {
      try {
        const profile = await getUserProfile();
        setUser(profile);
        setIsAdmin(profile.role === "admin");
      } catch (error) {
        console.error("Failed to fetch user profile for NavMenu", error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/login");
  };

  return (
    <motion.div
      layout
      animate={isExpand ? { width: 250 } : { width: 65 }}
      className="h-screen border-r border-neutral-400 dark:border-neutral-800
        w-auto bg-neutral-300 dark:bg-accent/30 flex justify-between flex-col
        gap-y-2"
    >
      {" "}
      <div>
        {" "}
        <div className="flex flex-col mt-3 px-3 items-end">
          {" "}
          <Button
            onClick={() => setExpand(!isExpand)}
            className={cn(
              "max-w-10 w-full dark:bg-neutral-900 bg-neutral-200 rounded-sm",
              isExpand ? "cursor-w-resize" : "cursor-e-resize",
            )}
          >
            {isExpand ? (
              <Collapse className="stroke-neutral-500 size-6 stroke-2" />
            ) : (
              <Expand className="stroke-neutral-500 size-6 stroke-2" />
            )}
          </Button>
        </div>
        <div className="flex gap-4 mt-5 flex-col px-3 items-start">
          {!loading &&
            Links.filter((item) => {
              if (item.href === "/dashboard/add-user") {
                return isAdmin;
              }
              return true;
            }).map((item) => (
              <CustomButton
                key={item.label}
                label={item.label}
                href={item.href}
                isExpand={isExpand}
              >
                <item.icon className="stroke-neutral-800 dark:stroke-neutral-200" />
              </CustomButton>
            ))}
        </div>
      </div>
      <div
        className={cn(
          "flex w-full items-center p-3 border-t border-neutral-400 dark:border-neutral-800 gap-2",
          isExpand ? "flex-row justify-between" : "flex-col justify-center",
        )}
      >
        <ModeToggle />
        {!loading && authUser && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-10 w-10 rounded-full p-0"
              >
                <Avatar className="h-10 w-10 border border-myborder">
                  <AvatarImage src={authUser.image || ""} alt={authUser.name} />
                  <AvatarFallback className="bg-primary/10 text-primary font-bold">
                    {authUser.name ? authUser.name.charAt(0).toUpperCase() : "?"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" side="right">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {authUser.name}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {authUser.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex items-center gap-2">
                <Shield className="size-4 text-muted-foreground" />
                <span className="text-xs capitalize">Role: {user?.role}</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2">
                <MapPin className="size-4 text-muted-foreground" />
                <span className="text-xs capitalize">
                  Location: {user?.location}
                </span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="flex items-center gap-2 text-red-600 focus:text-red-600 cursor-pointer"
                onClick={handleLogout}
              >
                <LogOut className="size-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </motion.div>
  );
}

function Expand({ className }: { className?: ClassNameValue }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn(
        `icon icon-tabler icons-tabler-outline
        icon-tabler-layout-sidebar-left-expand`,
        className,
      )}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z" />
      <path d="M9 4v16" />
      <path d="M14 10l2 2l-2 2" />
    </svg>
  );
}

function Collapse({ className }: { className: ClassNameValue }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn(
        `icon icon-tabler icons-tabler-outline
        icon-tabler-layout-sidebar-right-expand`,
        className,
      )}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z" />
      <path d="M15 4v16" />
      <path d="M10 10l-2 2l2 2" />
    </svg>
  );
}
