"use client";

import { IconUserPlus, IconHome, IconSquarePlus } from "@tabler/icons-react";
import { ComponentType } from "react";

interface NavLinks {
  href: string;
  label: string;
  icon: ComponentType<{ size?: number; className?: string }>;
}

export const Links: NavLinks[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: IconHome,
  },
  {
    href: "/dashboard/add-user",
    label: "Add Users",
    icon: IconUserPlus,
  },
  {
    href: "/dashboard/add-menu-items",
    label: "Add Menu Items",
    icon: IconSquarePlus,
  },
];
