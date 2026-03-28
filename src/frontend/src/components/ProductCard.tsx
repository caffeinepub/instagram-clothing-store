import type { Product } from "../backend";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onClick: (product: Product) => void;
  index: number;
}

export function ProductCard({
  product,
  onAddToCart,
  onClick,
  index,
}: ProductCardProps) {
  return (
    <div
      className="group bg-white rounded-xl overflow-hidden shadow-card card-hover"
      data-ocid={`product.item.${index}`}
    >
      {/* Clickable image + name area */}
      <button
        type="button"
        className="w-full text-left focus:outline-none"
        onClick={() => onClick(product)}
        aria-label={`View details for ${product.name}`}
      >
        {/* Image */}
        <div className="aspect-square img-zoom relative overflow-hidden bg-secondary">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
        </div>

        {/* Info */}
        <div className="px-3 pt-3 space-y-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display font-semibold text-sm leading-tight line-clamp-2 text-foreground">
              {product.name}
            </h3>
            <span className="font-display font-bold text-sm whitespace-nowrap ig-gradient-text">
              ${product.price.toFixed(2)}
            </span>
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2">
            {product.description}
          </p>
        </div>
      </button>

      {/* Add to cart button */}
      <div className="px-3 pb-3 pt-2">
        <button
          type="button"
          className="w-full py-2 rounded-lg text-xs font-bold text-white ig-gradient hover:opacity-90 active:scale-95 transition-all duration-150"
          onClick={() => onAddToCart(product)}
          data-ocid={`product.button.${index}`}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
