"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function CustomButton({
  children,
  isExpand,
  href,
  label,
}: {
  children: React.ReactNode;
  isExpand: boolean;
  href: string;
  label: string;
}) {
  const pathName = usePathname();

  return (
    <Link href={href} className="flex group gap-4 items-center w-full">
      {" "}
      <Button
        className={cn(
          `bg-transparent hover:bg-transparent cursor-pointer p-0 w-full
          max-w-10 flex transition-shadow duration-300 ease-out
          dark:shadow-[0px_1px_4px_var(--color-zinc-800)_inset,0px_1px_2px_var(--color-zinc-800)]
          shadow-[0px_2px_4px_var(--color-neutral-500)_inset]
          group-hover:dark:shadow-[0px_1px_4px_var(--color-orange-800)]
          group-hover:shadow-[0px_1px_4px_var(--color-orange-800)]`,
          pathName === href &&
          `dark:shadow-[0px_1px_4px_var(--color-orange-800)]
            shadow-[0px_1px_4px_var(--color-orange-800)]`,
        )}
      >
        {children}
      </Button>
      <motion.span
        animate={isExpand ? { opacity: [0, 1] } : { opacity: [1, 0] }}
        transition={{ duration: 0.4 }}
        className={cn(
          `text-sm max-w-40 group-hover:dark:text-zinc-200 text-zinc-500
          font-semibold whitespace-nowrap`,
          isExpand ? "flex" : "hidden",
          pathName === href && "dark:text-zinc-200 text-zinc-800",
        )}
      >
        {label}
      </motion.span>
    </Link>
  );
}
