import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import type { Product } from "../backend";

const CATEGORIES = ["Tops", "Bottoms", "Dresses", "Accessories", "Shoes"];

interface ProductFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    price: number;
    description: string;
    category: string;
    imageUrl: string;
  }) => Promise<void>;
  editProduct?: Product | null;
  isPending?: boolean;
}

export function ProductForm({
  open,
  onClose,
  onSubmit,
  editProduct,
  isPending,
}: ProductFormProps) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Tops");
  const [imageUrl, setImageUrl] = useState("");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentionally runs when dialog opens/closes
  useEffect(() => {
    if (editProduct) {
      setName(editProduct.name);
      setPrice(editProduct.price.toString());
      setDescription(editProduct.description);
      setCategory(editProduct.category);
      setImageUrl(editProduct.imageUrl);
    } else {
      setName("");
      setPrice("");
      setDescription("");
      setCategory("Tops");
      setImageUrl("");
    }
    setFormErrors({});
  }, [open, editProduct]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Name is required";
    if (!price || Number.isNaN(Number(price)) || Number(price) <= 0)
      e.price = "Enter a valid price";
    if (!description.trim()) e.description = "Description is required";
    if (!imageUrl.trim()) e.imageUrl = "Image URL is required";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setFormErrors(errs);
      return;
    }
    await onSubmit({
      name: name.trim(),
      price: Number(price),
      description: description.trim(),
      category,
      imageUrl: imageUrl.trim(),
    });
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg" data-ocid="admin.dialog">
        <DialogHeader>
          <DialogTitle className="font-display">
            {editProduct ? "Edit Product" : "Add New Product"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Oversized Cotton Tee"
              data-ocid="admin.input"
            />
            {formErrors.name && (
              <p
                className="text-xs text-destructive"
                data-ocid="admin.error_state"
              >
                {formErrors.name}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="29.99"
                data-ocid="admin.input"
              />
              {formErrors.price && (
                <p
                  className="text-xs text-destructive"
                  data-ocid="admin.error_state"
                >
                  {formErrors.price}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger data-ocid="admin.select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief product description..."
              rows={3}
              data-ocid="admin.textarea"
            />
            {formErrors.description && (
              <p
                className="text-xs text-destructive"
                data-ocid="admin.error_state"
              >
                {formErrors.description}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input
              id="imageUrl"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              data-ocid="admin.input"
            />
            {formErrors.imageUrl && (
              <p
                className="text-xs text-destructive"
                data-ocid="admin.error_state"
              >
                {formErrors.imageUrl}
              </p>
            )}
            {imageUrl && (
              <div className="mt-2 w-20 h-20 rounded-lg overflow-hidden border border-border">
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display =
                      "none";
                  }}
                />
              </div>
            )}
          </div>

          <DialogFooter className="gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              data-ocid="admin.cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="ig-gradient text-white border-0 hover:opacity-90"
              data-ocid="admin.submit_button"
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              {editProduct ? "Save Changes" : "Add Product"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
