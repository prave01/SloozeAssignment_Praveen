"use client";

import { CreateItemType } from "@/server/zod-schema";
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
    href: "/dashboard/menu",
    label: "Add Menu Items",
    icon: IconSquarePlus,
  },
];

export const americanItems: CreateItemType[] = [
  {
    name: "Classic Cheeseburger",
    cost: 350,
    elapsedTime: "12 min",
    image: "https://cdn.example.com/items/cheeseburger.jpg",
    location: "america",
  },
  {
    name: "Bacon Burger",
    cost: 420,
    elapsedTime: "14 min",
    location: "america",
  },
  {
    name: "Double Patty Burger",
    cost: 480,
    elapsedTime: "16 min",
    location: "america",
  },
  {
    name: "Grilled Chicken Sandwich",
    cost: 360,
    elapsedTime: "13 min",
    location: "america",
  },
  {
    name: "Fried Chicken Sandwich",
    cost: 390,
    elapsedTime: "15 min",
    location: "america",
  },
  {
    name: "BBQ Pulled Pork Sandwich",
    cost: 410,
    elapsedTime: "18 min",
    location: "america",
  },
  {
    name: "Pepperoni Pizza",
    cost: 520,
    elapsedTime: "15 min",
    image: "https://cdn.example.com/items/pepperoni-pizza.jpg",
    location: "america",
  },
  {
    name: "Margherita Pizza",
    cost: 480,
    elapsedTime: "14 min",
    location: "america",
  },
  {
    name: "BBQ Chicken Pizza",
    cost: 560,
    elapsedTime: "16 min",
    location: "america",
  },
  {
    name: "French Fries",
    cost: 150,
    elapsedTime: "7 min",
    location: "america",
  },
  {
    name: "Cheese Fries",
    cost: 190,
    elapsedTime: "8 min",
    location: "america",
  },
  {
    name: "Onion Rings",
    cost: 180,
    elapsedTime: "8 min",
    location: "america",
  },
  {
    name: "Chicken Nuggets",
    cost: 260,
    elapsedTime: "10 min",
    location: "america",
  },
  {
    name: "Buffalo Chicken Wings",
    cost: 430,
    elapsedTime: "15 min",
    location: "america",
  },
  {
    name: "Caesar Salad",
    cost: 300,
    elapsedTime: "9 min",
    location: "america",
  },
  {
    name: "Grilled Chicken Salad",
    cost: 340,
    elapsedTime: "11 min",
    location: "america",
  },
  {
    name: "Mac and Cheese",
    cost: 280,
    elapsedTime: "12 min",
    location: "america",
  },
  {
    name: "Spaghetti with Meatballs",
    cost: 460,
    elapsedTime: "18 min",
    location: "america",
  },
  {
    name: "Chocolate Brownie",
    cost: 220,
    elapsedTime: "6 min",
    location: "america",
  },
  {
    name: "Vanilla Milkshake",
    cost: 200,
    elapsedTime: "5 min",
    location: "america",
  },
];
