import { ProductForm } from "@/components/ProductForm";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useAddProduct,
  useDeleteProduct,
  useIsAdmin,
  useProducts,
  useUpdateProduct,
} from "@/hooks/useQueries";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Loader2,
  Pencil,
  Plus,
  ShieldAlert,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Product } from "../backend";

export function AdminPage() {
  const { data: isAdmin, isLoading: isAdminLoading } = useIsAdmin();
  const { data: products = [], isLoading: productsLoading } = useProducts();
  const addProduct = useAddProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingId, setDeletingId] = useState<bigint | null>(null);

  if (isAdminLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        data-ocid="admin.loading_state"
      >
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-4 text-center p-8"
        data-ocid="admin.error_state"
      >
        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
          <ShieldAlert className="w-8 h-8 text-destructive" />
        </div>
        <h1 className="font-display text-2xl font-bold">Access Denied</h1>
        <p className="text-muted-foreground text-sm max-w-xs">
          You need admin privileges to access this panel.
        </p>
        <Link to="/">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Store
          </Button>
        </Link>
      </div>
    );
  }

  const handleAdd = async (data: {
    name: string;
    price: number;
    description: string;
    category: string;
    imageUrl: string;
  }) => {
    await addProduct.mutateAsync(data);
    toast.success("Product added!");
    setFormOpen(false);
  };

  const handleEdit = async (data: {
    name: string;
    price: number;
    description: string;
    category: string;
    imageUrl: string;
  }) => {
    if (!editingProduct) return;
    await updateProduct.mutateAsync({ id: editingProduct.id, ...data });
    toast.success("Product updated!");
    setEditingProduct(null);
    setFormOpen(false);
  };

  const handleDelete = async () => {
    if (deletingId === null) return;
    await deleteProduct.mutateAsync(deletingId);
    toast.success("Product deleted.");
    setDeletingId(null);
  };

  return (
    <main
      className="max-w-5xl mx-auto px-4 py-8 space-y-6"
      data-ocid="admin.page"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link to="/">
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground"
              data-ocid="admin.link"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="font-display text-2xl font-extrabold">
              Admin Panel
            </h1>
            <p className="text-sm text-muted-foreground">
              {products.length} product{products.length !== 1 ? "s" : ""} in
              store
            </p>
          </div>
        </div>
        <Button
          className="ig-gradient text-white border-0 hover:opacity-90 gap-2"
          onClick={() => {
            setEditingProduct(null);
            setFormOpen(true);
          }}
          data-ocid="admin.primary_button"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </Button>
      </div>

      {/* Table */}
      {productsLoading ? (
        <div className="text-center py-16" data-ocid="admin.loading_state">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground mx-auto" />
        </div>
      ) : products.length === 0 ? (
        <div
          className="text-center py-20 border-2 border-dashed border-border rounded-xl"
          data-ocid="admin.empty_state"
        >
          <p className="font-display text-lg font-bold text-foreground">
            No products yet
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Click "Add Product" to get started.
          </p>
        </div>
      ) : (
        <div
          className="border border-border rounded-xl overflow-hidden"
          data-ocid="admin.table"
        >
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary/60">
                <TableHead className="w-16">Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product, index) => (
                <TableRow
                  key={product.id.toString()}
                  data-ocid={`admin.row.${index + 1}`}
                >
                  <TableCell>
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-secondary">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="font-semibold text-sm">{product.name}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                      {product.description}
                    </p>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="capitalize">
                      {product.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="font-bold text-sm ig-gradient-text">
                      ${product.price.toFixed(2)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        onClick={() => {
                          setEditingProduct(product);
                          setFormOpen(true);
                        }}
                        data-ocid={`admin.edit_button.${index + 1}`}
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive/80"
                        onClick={() => setDeletingId(product.id)}
                        data-ocid={`admin.delete_button.${index + 1}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Add/Edit Form */}
      <ProductForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingProduct(null);
        }}
        onSubmit={editingProduct ? handleEdit : handleAdd}
        editProduct={editingProduct}
        isPending={addProduct.isPending || updateProduct.isPending}
      />

      {/* Delete Confirm */}
      <AlertDialog
        open={deletingId !== null}
        onOpenChange={(v) => !v && setDeletingId(null)}
      >
        <AlertDialogContent data-ocid="admin.dialog">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display">
              Delete Product?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The product will be permanently
              removed from the store.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="admin.cancel_button">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-white hover:bg-destructive/90"
              onClick={handleDelete}
              data-ocid="admin.confirm_button"
            >
              {deleteProduct.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}
