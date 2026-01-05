"use client";

import { Button } from "@/components/ui/button";
import { CreateUser, createRestaurant } from "@/server/serverFn";
import { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [restaurantLoading, setRestaurantLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    location: "america" as "america" | "india" | "both",
    role: "admin" as "admin" | "member",
  });
  const [restaurantData, setRestaurantData] = useState({
    name: "",
    location: "india" as "america" | "india",
  });

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await CreateUser(formData);
      toast.success("Admin User Created Successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  const handleRestaurantSubmit = async () => {
    try {
      if (!restaurantData.name.trim()) {
        toast.error("Restaurant name is required");
        return;
      }
      setRestaurantLoading(true);
      await createRestaurant(restaurantData);
      toast.success("Restaurant Created Successfully");
      setRestaurantData({ name: "", location: "india" });
    } catch (error: any) {
      toast.error(error.message || "Failed to create restaurant");
    } finally {
      setRestaurantLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <div className="flex gap-6 flex-wrap justify-center max-w-5xl">
        {/* Restaurant Creation Card */}
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Create Restaurant</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Input
                placeholder="Restaurant Name"
                value={restaurantData.name}
                onChange={(e) =>
                  setRestaurantData({ ...restaurantData, name: e.target.value })
                }
              />
              <Select
                value={restaurantData.location}
                onValueChange={(value: "america" | "india") =>
                  setRestaurantData({ ...restaurantData, location: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="america">America</SelectItem>
                  <SelectItem value="india">India</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              className="w-full"
              onClick={handleRestaurantSubmit}
              disabled={restaurantLoading}
            >
              {restaurantLoading ? "Creating..." : "Create Restaurant"}
            </Button>
          </CardContent>
        </Card>

        {/* Admin User Creation Card */}
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Create Admin User</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Input
                placeholder="Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
              <Input
                placeholder="Email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
              <Input
                placeholder="Password"
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
              <Select
                value={formData.location}
                onValueChange={(value: "america" | "india" | "both") =>
                  setFormData({ ...formData, location: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="america">America</SelectItem>
                  <SelectItem value="india">India</SelectItem>
                  <SelectItem value="both">Both (Admin Only)</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={formData.role}
                onValueChange={(value: "admin" | "member") =>
                  setFormData({ ...formData, role: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="member">Member</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full" onClick={handleSubmit} disabled={loading}>
              {loading ? "Creating..." : "Create User"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
