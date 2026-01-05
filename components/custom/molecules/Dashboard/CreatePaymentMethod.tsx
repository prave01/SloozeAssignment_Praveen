import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Spinner } from "@/components/ui/spinner";
import { CreatePaymentMethod, uploadImage } from "@/server/serverFn";
import { Plus } from "lucide-react";
import { FormEvent, useRef, useState } from "react";
import { toast } from "sonner";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

export function CreatePaymentDialog() {
  const [name, setName] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [isEnabled, setIsEnabled] = useState(false);
  const [loading, setLoading] = useState(false);

  const fileRef = useRef<HTMLInputElement | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (loading) return;

    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }

    if (image && image.size > MAX_IMAGE_SIZE) {
      toast.error("Image must be less than 5MB");
      return;
    }

    setLoading(true);

    try {
      let imageUrl = "";

      if (image) {
        const res = await uploadImage(image);
        imageUrl = res.url;
      }

      await CreatePaymentMethod({
        name,
        isEnabled,
        image: imageUrl,
      });

      toast.success("Payment method created");

      // reset state
      setName("");
      setImage(null);
      setIsEnabled(false);
      if (fileRef.current) fileRef.current.value = "";
    } catch (err: any) {
      toast.error(err?.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="rounded-full w-0 p-4 border-none h-0"
        >
          <Plus className="size-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Create Payment Method</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label>Name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="UPI / Cash / Card"
                disabled={loading}
              />
            </div>

            <div className="grid gap-2">
              <Label>Payment Image</Label>
              <Input
                ref={fileRef}
                type="file"
                accept="image/*"
                disabled={loading}
                onChange={(e) => setImage(e.target.files?.[0] ?? null)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label>Enable</Label>
              <Switch
                checked={isEnabled}
                disabled={loading}
                onCheckedChange={setIsEnabled}
              />
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={loading}>
                Cancel
              </Button>
            </DialogClose>

            <Button type="submit" disabled={loading} className="min-w-[130px]">
              {loading ? (
                <span className="flex items-center gap-2">
                  <Spinner className="size-4" />
                  Saving
                </span>
              ) : (
                "Save changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
