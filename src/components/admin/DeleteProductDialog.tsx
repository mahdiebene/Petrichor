import { useState } from "react";
import { Loader2, AlertTriangle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  image: string;
  images: string[] | null;
}

interface DeleteProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
  onSuccess: () => void;
}

export function DeleteProductDialog({
  open,
  onOpenChange,
  product,
  onSuccess,
}: DeleteProductDialogProps) {
  const [deleting, setDeleting] = useState(false);

  const extractStoragePath = (url: string): string | null => {
    // Extract the file path from a Supabase storage URL
    // URL format: https://xxx.supabase.co/storage/v1/object/public/product-images/products/filename.ext
    const match = url.match(/\/product-images\/(.+)$/);
    return match ? match[1] : null;
  };

  const deleteStorageImages = async (imageUrls: string[]) => {
    const paths = imageUrls
      .map(extractStoragePath)
      .filter((path): path is string => path !== null);

    if (paths.length === 0) return;

    const { error } = await supabase.storage
      .from("product-images")
      .remove(paths);

    if (error) {
      console.error("Error deleting images from storage:", error);
      // Don't throw - we still want to delete the product even if image cleanup fails
    }
  };

  const handleDelete = async () => {
    if (!product) return;

    setDeleting(true);
    try {
      // Collect all image URLs
      const allImages = [product.image, ...(product.images || [])];
      
      // Delete images from storage (best effort)
      await deleteStorageImages(allImages);

      // Delete product from database
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", product.id);

      if (error) throw error;

      toast.success("Product deleted successfully");
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error("Error deleting product:", error);
      toast.error(error.message || "Failed to delete product");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-destructive/10 rounded-full">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <AlertDialogTitle className="font-serif">Delete Product</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="pt-2">
            Are you sure you want to delete <strong>"{product?.name}"</strong>? 
            This action cannot be undone and will also remove all associated images.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={deleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete Product"
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
