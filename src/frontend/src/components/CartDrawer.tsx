import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useCart } from "@/context/CartContext";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const {
    items,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    totalItems,
  } = useCart();

  const handleCheckout = () => {
    toast.success("Order placed! Thank you for shopping with THREAD 🎉");
    clearCart();
    onClose();
  };

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md flex flex-col p-0"
        data-ocid="cart.sheet"
      >
        <SheetHeader className="px-6 py-4 border-b border-border">
          <SheetTitle className="font-display flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            Your Cart
            {totalItems > 0 && (
              <span className="ml-auto font-bold text-sm ig-gradient-text">
                {totalItems} {totalItems === 1 ? "item" : "items"}
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div
            className="flex-1 flex flex-col items-center justify-center gap-4 text-center p-8"
            data-ocid="cart.empty_state"
          >
            <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center">
              <ShoppingBag className="w-9 h-9 text-muted-foreground" />
            </div>
            <div>
              <p className="font-display font-semibold text-lg">
                Your cart is empty
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Add some pieces to get started
              </p>
            </div>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 px-6">
              <div className="py-4 space-y-4">
                {items.map((item, index) => (
                  <div
                    key={item.product.id.toString()}
                    className="flex gap-3"
                    data-ocid={`cart.item.${index + 1}`}
                  >
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">
                        {item.product.name}
                      </p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {item.product.category}
                      </p>
                      <p className="font-bold text-sm ig-gradient-text mt-1">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center gap-1 border border-border rounded-full px-1.5 py-0.5">
                          <button
                            type="button"
                            aria-label="Decrease quantity"
                            className="w-5 h-5 flex items-center justify-center rounded-full hover:bg-secondary transition-colors"
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity - 1)
                            }
                            data-ocid="cart.toggle"
                          >
                            <Minus className="w-2.5 h-2.5" />
                          </button>
                          <span className="w-6 text-center text-xs font-bold">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            aria-label="Increase quantity"
                            className="w-5 h-5 flex items-center justify-center rounded-full hover:bg-secondary transition-colors"
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity + 1)
                            }
                            data-ocid="cart.toggle"
                          >
                            <Plus className="w-2.5 h-2.5" />
                          </button>
                        </div>
                        <button
                          type="button"
                          aria-label="Remove item"
                          className="text-destructive hover:text-destructive/80 transition-colors"
                          onClick={() => removeFromCart(item.product.id)}
                          data-ocid={`cart.delete_button.${index + 1}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="border-t border-border px-6 py-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-muted-foreground">
                  Subtotal
                </span>
                <span className="font-display text-xl font-bold">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
              <Separator />
              <button
                type="button"
                className="w-full py-3.5 rounded-xl text-sm font-bold text-white ig-gradient hover:opacity-90 active:scale-[0.98] transition-all duration-150"
                onClick={handleCheckout}
                data-ocid="cart.primary_button"
              >
                Checkout — ${subtotal.toFixed(2)}
              </button>
              <p className="text-center text-xs text-muted-foreground">
                Free shipping on orders over $50
              </p>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
