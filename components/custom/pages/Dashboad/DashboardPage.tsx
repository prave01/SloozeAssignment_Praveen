"use client";

import { PaymentMethods } from "../../molecules/Dashboard/PaymentMethods";
import { OrdersTracking } from "../../molecules/Dashboard/OrdersTracking";
import { UserManagement } from "../../molecules/Dashboard/UserManagement";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDashboardLocation } from "@/client/store/Dashboard/store";
import { Globe } from "lucide-react";
import { useEffect, useState } from "react";
import { getUserProfile } from "@/server/serverFn";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";

export function DashboardPage() {
  const location = useDashboardLocation((s) => s.location);
  const setLocation = useDashboardLocation((s) => s.setLocation);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const user = await getUserProfile();
        const isUserAdmin = user.role === "admin";
        setIsAdmin(isUserAdmin);

        if (!isUserAdmin) {
          // If not admin, lock to their assigned location
          setLocation(user.location as "america" | "india");
        }
      } catch (error) {
        toast.error("Failed to load user profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [setLocation]);

  // Removed full-page loading guard to prevent "torch light" flickering.
  // Components now handle their own loading states internally.

  return (
    <div className="flex flex-col gap-5 animate-in fade-in duration-500">
      {/* Global Location Selector - Only visible to admins */}
      <div className="flex items-center justify-between px-5 pt-5">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        {loading ? (
          <div className="h-10 w-[180px] bg-accent/20 animate-pulse rounded-md border border-myborder" />
        ) : (
          isAdmin && (
            <div className="flex items-center gap-2">
              <Globe className="size-5 text-muted-foreground" />
              <Select
                value={location}
                onValueChange={(val: "america" | "india") => setLocation(val)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Restaurant Location</SelectLabel>
                    <SelectItem value="america">🇺🇸 America</SelectItem>
                    <SelectItem value="india">🇮🇳 India</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          )
        )}
      </div>

      <div className="flex flex-wrap gap-5">
        <PaymentMethods />
        <OrdersTracking />
        {isAdmin && <UserManagement />}
      </div>
    </div>
  );
}
