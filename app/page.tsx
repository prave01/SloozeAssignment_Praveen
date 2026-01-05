"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/auth-client";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ChefHat,
  LayoutDashboard,
  Terminal
} from "lucide-react";
import Link from "next/link";
import { ModeToggle } from "@/components/custom/molecules/ModeToggle";

export default function Home() {
  const { data: session } = authClient.useSession();

  const asciiArt = `
   ______________________________
 / \\                             \\.
|   |                            |.
 \\_ |    ____________________    |.
    |   |                    |   |.
    |   |    >_ SLOOZE       |   |.
    |   |                    |   |.
    |   |    [ AUTH: OK ]    |   |.
    |   |____________________|   |.
    |                            |.
    |   o   o   o                |.
    |                            |.
    |____________________________|.
  `;

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden selection:bg-primary/30 flex flex-col">
      {/* Background Decorative Elements - Subtle Neutrals */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-foreground/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-foreground/5 rounded-full blur-[120px]" />
      </div>

      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-6 max-w-7xl mx-auto w-full border-b border-myborder/50 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="bg-primary p-2 rounded-lg group-hover:rotate-12 transition-transform duration-300">
            <ChefHat className="size-6 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold tracking-tight">Slooze<span className="text-primary">.</span></span>
        </div>

        <div className="flex items-center gap-4">
          <ModeToggle />
          {session ? (
            <Link href="/dashboard">
              <Button variant="outline" className="rounded-full border-myborder hover:bg-accent transition-all">
                <LayoutDashboard className="mr-2 size-4" />
                Dashboard
              </Button>
            </Link>
          ) : (
            <Link href="/login">
              <Button variant="ghost" className="rounded-full hover:bg-accent">
                Login
              </Button>
            </Link>
          )}
          <Link href={session ? "/dashboard" : "/login"}>
            <Button className="rounded-full px-6 shadow-lg shadow-primary/10 hover:shadow-primary/20 transition-all">
              Get Started
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section Only */}
      <main className="flex-1 flex items-center justify-center max-w-7xl mx-auto px-6 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-foreground/5 border border-foreground/10 text-muted-foreground text-xs font-medium">
              <Terminal className="size-3" />
              <span>v1.0.0-stable</span>
            </div>

            <h1 className="text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1]">
              Restaurant <br />
              <span className="text-primary">
                Management
              </span>
              <br />
              Simplified.
            </h1>

            <p className="text-xl text-muted-foreground max-w-[500px] leading-relaxed">
              A minimalist, high-performance operating system for modern restaurant logistics. Built for scale, designed for speed.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href={session ? "/dashboard" : "/login"}>
                <Button size="lg" className="rounded-full px-8 h-14 text-lg font-semibold group">
                  {session ? "Enter Dashboard" : "Get Started"}
                  <ArrowRight className="ml-2 size-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden lg:flex justify-end"
          >
            <pre className="font-mono text-[10px] leading-tight text-primary/60 select-none pointer-events-none animate-in fade-in slide-in-from-right-8 duration-1000">
              {asciiArt}
            </pre>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
