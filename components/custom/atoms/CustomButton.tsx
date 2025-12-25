"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";

export default function CustomButton({
  children,
  isExpand,
}: {
  children: React.ReactNode;
  isExpand: boolean;
}) {
  return (
    <div className="flex group gap-2 items-center w-full">
      {" "}
      <Button
        className="bg-transparent hover:bg-transparent cursor-pointer p-0 w-full
          max-w-10 flex transition-shadow duration-300 ease-out
          dark:shadow-[0px_1px_4px_var(--color-zinc-800)_inset,0px_1px_2px_var(--color-zinc-800)]
          shadow-[0px_2px_4px_var(--color-neutral-500)_inset]
          group-hover:dark:shadow-[0px_1px_4px_var(--color-orange-800)]
          group-hover:shadow-[0px_1px_4px_var(--color-orange-800)]"
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
        )}
      >
        Add Users
      </motion.span>
    </div>
  );
}
