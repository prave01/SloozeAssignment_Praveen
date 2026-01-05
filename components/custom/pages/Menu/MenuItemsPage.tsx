import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { CreateItemClient } from "../../molecules/Menu/CreateItem/CreateItemClient";
import { ShowAvailableItems } from "../../molecules/Menu/ShowAvailableItems/ShowAvailableItems";
import {
  SelectTrigger,
  SelectValue,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { getMenuId, getUserProfile } from "@/server/serverFn";
import { MenuItems } from "../../molecules/Menu/MenuItems/MenuItems";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";

export function MenuItemsPage() {
  const [location, setLocation] = useState<"america" | "india">("america");
  const [menuId, setMenuId] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const user = await getUserProfile();
        if (user.role === "admin") {
          setIsAdmin(true);
          // Admin defaults to america or keeps current selection
        } else {
          setIsAdmin(false);
          setLocation(user.location as "america" | "india");
        }
      } catch (error) {
        toast.error("Failed to load user profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    (async () => {
      if (!loading) {
        const id = await getMenuId(location);
        setMenuId(id as string);
      }
    })();
  }, [location, loading]);

  const handleValueChange = async (value: any) => {
    setLocation(value as "india" | "america");
  };

  // Removed full-page loading guard to prevent flickering.

  return (
    <div className="w-full h-full p-20 animate-in fade-in duration-500">
      <Card
        className="p-0 max-h-full h-full rounded-none w-full shadow-none flex
          flex-col bg-transparent border-none backdrop-blur-md gap-2"
      >
        <CardTitle
          className="border-myborder flex items-center justify-between border
            py-2 px-3 text-xl"
        >
          Add Menu Items
          {loading ? (
            <div className="h-10 w-45 bg-accent/20 animate-pulse rounded-none border border-myborder" />
          ) : (
            isAdmin && (
              <Select
                required
                value={location}
                onValueChange={handleValueChange}
              >
                <SelectTrigger
                  className="w-45 p-2 border border-myborder rounded-none
                    justify-start disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <SelectValue placeholder="Select restaurant" />
                </SelectTrigger>

                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Restaurant</SelectLabel>
                    <SelectItem value="india">India</SelectItem>
                    <SelectItem value="america">America</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            )
          )}
        </CardTitle>
        <CardContent
          className="border-myborder flex gap-4 p-4 h-full w-full
          border backdrop-blur-md"
        >
          <CreateItemClient restaurant={location} />
          <ShowAvailableItems menuId={menuId} restaurant={location} />
          <MenuItems menuId={menuId} />
        </CardContent>
      </Card>
    </div>
  );
}
