import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCart } from "@/context/CartContext";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Product } from "../backend";

interface ProductModalProps {
  product: Product | null;
  open: boolean;
  onClose: () => void;
}

export function ProductModal({ product, open, onClose }: ProductModalProps) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  if (!product) return null;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success(`${product.name} added to cart!`);
    setQuantity(1);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="max-w-2xl p-0 overflow-hidden"
        data-ocid="product.dialog"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2">
          {/* Image */}
          <div className="aspect-square sm:aspect-auto relative bg-secondary">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Details */}
          <div className="p-6 flex flex-col justify-between">
            <div className="space-y-4">
              <DialogHeader>
                <DialogTitle className="font-display text-xl font-bold leading-tight">
                  {product.name}
                </DialogTitle>
              </DialogHeader>

              <div className="flex items-center gap-3">
                <span className="font-display text-2xl font-bold ig-gradient-text">
                  ${product.price.toFixed(2)}
                </span>
                <Badge variant="secondary" className="capitalize text-xs">
                  {product.category}
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="mt-6 space-y-4">
              {/* Quantity */}
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-foreground">
                  Quantity
                </span>
                <div className="flex items-center gap-2 border border-border rounded-full px-2 py-1">
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-secondary transition-colors"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    data-ocid="product.toggle"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-8 text-center text-sm font-bold">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    aria-label="Increase quantity"
                    className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-secondary transition-colors"
                    onClick={() => setQuantity((q) => q + 1)}
                    data-ocid="product.toggle"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <button
                type="button"
                className="w-full py-3 rounded-xl text-sm font-bold text-white ig-gradient hover:opacity-90 active:scale-[0.98] transition-all duration-150"
                onClick={handleAddToCart}
                data-ocid="product.primary_button"
              >
                Add to Cart — ${(product.price * quantity).toFixed(2)}
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
