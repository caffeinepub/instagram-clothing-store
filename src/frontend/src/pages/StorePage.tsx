import { CategoryFilter } from "@/components/CategoryFilter";
import { ProductCard } from "@/components/ProductCard";
import { ProductModal } from "@/components/ProductModal";
import { ProductSkeleton } from "@/components/ProductSkeleton";
import { useCart } from "@/context/CartContext";
import { useProductsByCategory } from "@/hooks/useQueries";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { Product } from "../backend";

const SAMPLE_PRODUCTS: Product[] = [
  {
    id: BigInt(1),
    name: "Oversized Cotton Tee",
    description:
      "Ultra-soft 100% organic cotton. Relaxed fit, perfect for layering or wearing solo.",
    price: 34.99,
    category: "Tops",
    imageUrl: "/assets/generated/product-white-tee.dim_800x800.jpg",
    createdAt: BigInt(0),
  },
  {
    id: BigInt(2),
    name: "High-Waist Black Jeans",
    description:
      "Premium stretch denim with a flattering high-waist cut. Effortlessly chic.",
    price: 79.99,
    category: "Bottoms",
    imageUrl: "/assets/generated/product-black-jeans.dim_800x800.jpg",
    createdAt: BigInt(0),
  },
  {
    id: BigInt(3),
    name: "Floral Midi Dress",
    description:
      "Romantic floral print in soft chiffon. A dream for summer days and garden parties.",
    price: 89.99,
    category: "Dresses",
    imageUrl: "/assets/generated/product-floral-dress.dim_800x800.jpg",
    createdAt: BigInt(0),
  },
  {
    id: BigInt(4),
    name: "Gold Hoop & Chain Set",
    description:
      "Dainty 18k gold-plated hoops and matching chain necklace. Timeless classics.",
    price: 49.99,
    category: "Accessories",
    imageUrl: "/assets/generated/product-gold-jewelry.dim_800x800.jpg",
    createdAt: BigInt(0),
  },
  {
    id: BigInt(5),
    name: "Platform Leather Sneakers",
    description:
      "Chunky sole white leather sneakers. Street-ready style with all-day comfort.",
    price: 129.99,
    category: "Shoes",
    imageUrl: "/assets/generated/product-platform-sneakers.dim_800x800.jpg",
    createdAt: BigInt(0),
  },
  {
    id: BigInt(6),
    name: "Ribbed Knit Crop Sweater",
    description:
      "Cozy ribbed knit in warm beige. Cropped silhouette pairs perfectly with high-waist bottoms.",
    price: 59.99,
    category: "Tops",
    imageUrl: "/assets/generated/product-knit-sweater.dim_800x800.jpg",
    createdAt: BigInt(0),
  },
];

export function StorePage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { addToCart } = useCart();

  const { data: backendProducts, isLoading } =
    useProductsByCategory(selectedCategory);

  // Use backend products if available, else show sample products
  const allProducts =
    backendProducts && backendProducts.length > 0
      ? backendProducts
      : SAMPLE_PRODUCTS;
  const products =
    selectedCategory === "All"
      ? allProducts
      : allProducts.filter((p) => p.category === selectedCategory);

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <main
      className="max-w-6xl mx-auto px-4 py-6 space-y-6"
      data-ocid="store.page"
    >
      {/* Hero text */}
      <section className="text-center py-4" data-ocid="store.section">
        <h1 className="font-display text-3xl md:text-5xl font-extrabold tracking-tight">
          Dress Your <span className="ig-gradient-text">Story</span>
        </h1>
        <p className="mt-2 text-muted-foreground text-sm md:text-base max-w-md mx-auto">
          Curated fashion for the bold, the minimal, and everything in between.
        </p>
      </section>

      {/* Category Filter */}
      <CategoryFilter
        selected={selectedCategory}
        onChange={setSelectedCategory}
      />

      {/* Product Grid */}
      {isLoading ? (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          data-ocid="product.loading_state"
        >
          {Array.from({ length: 6 }).map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: skeleton placeholders
            <ProductSkeleton key={i} />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div
          className="text-center py-20 text-muted-foreground"
          data-ocid="product.empty_state"
        >
          <p className="font-display text-2xl font-bold text-foreground">
            No products found
          </p>
          <p className="mt-1 text-sm">
            Try a different category or check back soon.
          </p>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            data-ocid="product.list"
          >
            {products.map((product, i) => (
              <motion.div
                key={product.id.toString()}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.3 }}
              >
                <ProductCard
                  product={product}
                  onAddToCart={handleAddToCart}
                  onClick={setSelectedProduct}
                  index={i + 1}
                />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      )}

      {/* Product Modal */}
      <ProductModal
        product={selectedProduct}
        open={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </main>
  );
}
