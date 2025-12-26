"use client";

import { IconUserPlus, IconHome } from "@tabler/icons-react";
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
];
