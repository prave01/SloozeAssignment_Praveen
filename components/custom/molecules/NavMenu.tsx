"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ClassNameValue } from "tailwind-merge";
import { motion } from "motion/react";
import { useState } from "react";
import { IconUserPlus } from "@tabler/icons-react";
import CustomButton from "../atoms/CustomButton";
import { ModeToggle } from "./ModeToggle";

export default function NavMenu() {
  const [isExpand, setExpand] = useState(false);

  return (
    <motion.div
      layout
      animate={isExpand ? { width: 200 } : { width: 65 }}
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
        <div className="flex mt-5 flex-col px-3 items-start">
          <CustomButton href="/dashboard/add-user" isExpand={isExpand}>
            <IconUserPlus className="stroke-neutral-800 dark:stroke-neutral-200" />
          </CustomButton>
        </div>
      </div>
      <div className="flex w-full items- justify-start bg- m-3">
        <ModeToggle />
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
