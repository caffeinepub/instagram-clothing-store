import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useIsAdmin } from "@/hooks/useQueries";
import { Link } from "@tanstack/react-router";
import { Settings, ShoppingBag } from "lucide-react";

interface NavbarProps {
  onCartOpen: () => void;
}

export function Navbar({ onCartOpen }: NavbarProps) {
  const { totalItems } = useCart();
  const { data: isAdmin } = useIsAdmin();

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span
            className="font-display text-2xl font-bold tracking-tight ig-gradient-text"
            data-ocid="nav.link"
          >
            THREAD
          </span>
        </Link>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {isAdmin && (
            <Link to="/admin">
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5 text-muted-foreground hover:text-foreground"
                data-ocid="admin.link"
              >
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline text-sm font-medium">
                  Admin
                </span>
              </Button>
            </Link>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={onCartOpen}
            data-ocid="cart.open_modal_button"
          >
            <ShoppingBag className="w-5 h-5" />
            {totalItems > 0 && (
              <Badge
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs ig-gradient border-0 text-white"
                data-ocid="cart.badge"
              >
                {totalItems > 99 ? "99+" : totalItems}
              </Badge>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}
