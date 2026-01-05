"use client";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GetOrders, CancelOrder, CompleteOrder, getUserProfile } from "@/server/serverFn";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { X, Package, Clock, CheckCircle2, XCircle, Filter, Check } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useDashboardLocation } from "@/client/store/Dashboard/store";

type OrderItem = {
  item: {
    id: string;
    name: string;
    image: string;
    cost: number;
  };
  quantity: number;
};

type Order = {
  id: number;
  customerName: string;
  location: "america" | "india";
  status: "pending" | "completed" | "cancelled";
  total: number;
  createdAt: Date;
  paymentMethod: {
    id: string;
    name: string;
    image?: string;
  } | null;
  orderItems: OrderItem[];
};

const statusConfig = {
  pending: {
    label: "Pending",
    icon: Clock,
    className: "text-yellow-600 dark:text-yellow-500",
    bgClassName: "bg-yellow-50 dark:bg-yellow-950/20",
  },
  completed: {
    label: "Completed",
    icon: CheckCircle2,
    className: "text-green-600 dark:text-green-500",
    bgClassName: "bg-green-50 dark:bg-green-950/20",
  },
  cancelled: {
    label: "Cancelled",
    icon: XCircle,
    className: "text-red-600 dark:text-red-500",
    bgClassName: "bg-red-50 dark:bg-red-950/20",
  },
};

export function OrdersTracking() {
  const location = useDashboardLocation((s) => s.location);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<number | null>(null);
  const [completingId, setCompletingId] = useState<number | null>(null);
  const [openDialogId, setOpenDialogId] = useState<number | null>(null);
  const [showCancelled, setShowCancelled] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const user = await getUserProfile();
        setIsAdmin(user.role === "admin" || user.role === "manager");
      } catch (e) {
        console.error(e);
      }
      fetchOrders();
    };
    init();
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [location]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      // Use global location for filtering
      const data = await GetOrders(location);
      setOrders(data as Order[]);
    } catch (error: any) {
      toast.error(error?.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (orderId: number) => {
    setCancellingId(orderId);
    try {
      await CancelOrder(orderId);
      toast.success("Order cancelled successfully");
      // Optimistic update
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, status: "cancelled" as const } : o
        )
      );
      setOpenDialogId(null); // Close dialog
    } catch (error: any) {
      toast.error(error?.message || "Failed to cancel order");
    } finally {
      setCancellingId(null);
    }
  };

  const handleComplete = async (orderId: number) => {
    setCompletingId(orderId);
    try {
      await CompleteOrder(orderId);
      toast.success("Order completed successfully");
      // Optimistic update
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, status: "completed" as const } : o
        )
      );
    } catch (error: any) {
      toast.error(error?.message || "Failed to complete order");
    } finally {
      setCompletingId(null);
    }
  };

  const filteredOrders = orders.filter((order) =>
    showCancelled ? true : order.status !== "cancelled"
  );

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const currencySymbol = (location: "america" | "india") =>
    location === "america" ? "$" : "₹";

  // Removed separate loading return to prevent layout flickering
  // Loading state is now handled inside the main CardContent

  return (
    <div className="p-5 w-full">
      <Card className="rounded-none border border-myborder bg-transparent backdrop-blur-md w-full p-0 gap-0">
        <CardTitle className="w-full flex items-center justify-between py-2 px-3 border-b border-myborder text-md">
          <span>Current Orders</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowCancelled(!showCancelled)}
            className={`h-8 gap-2 ${showCancelled ? "bg-accent" : ""}`}
          >
            <Filter className="size-3.5" />
            {showCancelled ? "Hide Cancelled" : "Show Cancelled"}
          </Button>
        </CardTitle>

        <CardContent className="flex flex-row flex-wrap gap-4 py-4 px-4 bg-accent/80 min-h-96 items-center justify-center">
          {loading ? (
            <div className="flex flex-col items-center gap-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="text-sm text-muted-foreground animate-pulse">
                Loading orders...
              </p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="flex w-full h-96 flex-col items-center justify-center gap-2 text-center">
              <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                <Package className="size-5" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">
                No orders found
              </p>
              <p className="text-xs text-muted-foreground">
                {showCancelled
                  ? "No orders match the current filter"
                  : "Orders will appear here when created"}
              </p>
            </div>
          ) : (
            <>
              {filteredOrders.map((order) => {
                const StatusIcon = statusConfig[order.status].icon;
                const statusInfo = statusConfig[order.status];

                return (
                  <div
                    key={order.id}
                    className="rounded-md border border-myborder bg-background/50 p-4 space-y-3 hover:bg-accent/40 transition min-w-80 w-80 flex-shrink-0"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-base font-semibold">
                            Order #{order.id}
                          </span>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full flex items-center gap-1 ${statusInfo.bgClassName} ${statusInfo.className}`}
                          >
                            <StatusIcon className="size-3" />
                            {statusInfo.label}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">
                          {order.customerName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(order.createdAt)}
                        </p>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-1">
                        {/* Complete button - only for pending orders and admins */}
                        {order.status === "pending" && isAdmin && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 text-muted-foreground hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-950/20"
                            disabled={completingId === order.id || cancellingId === order.id}
                            onClick={() => handleComplete(order.id)}
                            title="Mark as Completed"
                          >
                            <Check className="size-4" />
                          </Button>
                        )}

                        {/* Cancel button - only for pending orders and admins */}
                        {order.status === "pending" && isAdmin && (
                          <Dialog
                            open={openDialogId === order.id}
                            onOpenChange={(open) =>
                              setOpenDialogId(open ? order.id : null)
                            }
                          >
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                                disabled={cancellingId === order.id || completingId === order.id}
                                title="Cancel Order"
                              >
                                <X className="size-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Cancel Order?</DialogTitle>
                                <DialogDescription>
                                  Are you sure you want to cancel order #{order.id}? This action cannot be undone.
                                </DialogDescription>
                              </DialogHeader>
                              <DialogFooter>
                                <DialogClose asChild>
                                  <Button variant="outline">Keep Order</Button>
                                </DialogClose>
                                <Button
                                  onClick={() => handleCancel(order.id)}
                                  variant="destructive"
                                  disabled={cancellingId === order.id}
                                >
                                  {cancellingId === order.id
                                    ? "Cancelling..."
                                    : "Cancel Order"}
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        )}
                      </div>
                    </div>

                    {/* Items */}
                    <div className="space-y-2">
                      {order.orderItems.map((orderItem, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between text-sm"
                        >
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            {orderItem.item.image && (
                              <img
                                src={orderItem.item.image}
                                alt={orderItem.item.name}
                                className="h-8 w-8 rounded object-cover flex-shrink-0"
                              />
                            )}
                            <span className="truncate capitalize">
                              {orderItem.item.name}
                            </span>
                            <span className="text-muted-foreground">
                              ×{orderItem.quantity}
                            </span>
                          </div>
                          <span className="text-muted-foreground ml-2 font-medium">
                            {currencySymbol(order.location)}
                            {orderItem.item.cost * orderItem.quantity}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-3 border-t border-myborder">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="capitalize">{order.location}</span>
                        {order.paymentMethod && (
                          <>
                            <span>•</span>
                            <span>{order.paymentMethod.name}</span>
                          </>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-sm text-muted-foreground">
                          Total:
                        </span>
                        <span className="text-base font-semibold">
                          {currencySymbol(order.location)}
                          {order.total}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

