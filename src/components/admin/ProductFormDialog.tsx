import { useState, useRef, useEffect } from "react";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useImageUpload } from "@/hooks/useImageUpload";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  origin: string;
  age: string | null;
  weight: string | null;
  dimensions: string | null;
  description: string;
  story: string;
  stock: number | null;
  featured: boolean | null;
  image: string;
  images: string[] | null;
}

interface ProductFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  product?: Product | null;
}

const categories = [
  "Volcanic",
  "Crystal",
  "Fossil",
  "Meteorite",
  "Mineral",
  "Gemstone",
];

const initialFormData = {
  name: "",
  price: "",
  category: "",
  origin: "",
  age: "",
  weight: "",
  dimensions: "",
  description: "",
  story: "",
  stock: "1",
  featured: false,
};

export function ProductFormDialog({
  open,
  onOpenChange,
  onSuccess,
  product,
}: ProductFormDialogProps) {
  const [saving, setSaving] = useState(false);
  const [mainImage, setMainImage] = useState<string>("");
  const [additionalImages, setAdditionalImages] = useState<string[]>([]);
  const mainImageRef = useRef<HTMLInputElement>(null);
  const additionalImagesRef = useRef<HTMLInputElement>(null);
  const { uploadImage, uploadMultipleImages, uploading } = useImageUpload();
  const [formData, setFormData] = useState(initialFormData);

  const isEditMode = !!product;

  // Populate form when editing
  useEffect(() => {
    if (product && open) {
      setFormData({
        name: product.name,
        price: product.price.toString(),
        category: product.category,
        origin: product.origin,
        age: product.age || "",
        weight: product.weight || "",
        dimensions: product.dimensions || "",
        description: product.description,
        story: product.story,
        stock: (product.stock ?? 1).toString(),
        featured: product.featured ?? false,
      });
      setMainImage(product.image);
      setAdditionalImages(product.images || []);
    } else if (!product && open) {
      // Reset form when opening for new product
      setFormData(initialFormData);
      setMainImage("");
      setAdditionalImages([]);
    }
  }, [product, open]);

  const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadImage(file);
    if (url) setMainImage(url);
  };

  const handleAdditionalImagesUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    const urls = await uploadMultipleImages(files);
    setAdditionalImages((prev) => [...prev, ...urls]);
  };

  const removeAdditionalImage = (index: number) => {
    setAdditionalImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!mainImage) {
      toast.error("Please upload a main product image");
      return;
    }

    if (!formData.name || !formData.price || !formData.category || !formData.origin) {
      toast.error("Please fill in all required fields");
      return;
    }

    setSaving(true);
    try {
      const productData = {
        name: formData.name,
        price: parseFloat(formData.price),
        category: formData.category,
        origin: formData.origin,
        age: formData.age || null,
        weight: formData.weight || null,
        dimensions: formData.dimensions || null,
        description: formData.description,
        story: formData.story,
        stock: parseInt(formData.stock) || 1,
        featured: formData.featured,
        image: mainImage,
        images: additionalImages.length > 0 ? additionalImages : null,
      };

      if (isEditMode && product) {
        const { error } = await supabase
          .from("products")
          .update(productData)
          .eq("id", product.id);

        if (error) throw error;
        toast.success("Product updated successfully");
      } else {
        const { error } = await supabase.from("products").insert(productData);
        if (error) throw error;
        toast.success("Product created successfully");
      }

      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error("Error saving product:", error);
      toast.error(error.message || "Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  const handleClose = (isOpen: boolean) => {
    if (!isOpen) {
      // Reset form when closing
      setFormData(initialFormData);
      setMainImage("");
      setAdditionalImages([]);
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl">
            {isEditMode ? "Edit Product" : "Add New Product"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload Section */}
          <div className="space-y-4">
            <Label>Product Images</Label>
            
            {/* Main Image */}
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Main Image *</p>
              {mainImage ? (
                <div className="relative w-40 h-40 rounded-sm overflow-hidden border border-border">
                  <img
                    src={mainImage}
                    alt="Main product"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setMainImage("")}
                    className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => mainImageRef.current?.click()}
                  disabled={uploading}
                  className="w-40 h-40 border-2 border-dashed border-border rounded-sm flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                >
                  {uploading ? (
                    <Loader2 className="h-8 w-8 animate-spin" />
                  ) : (
                    <>
                      <Upload className="h-8 w-8" />
                      <span className="text-xs">Upload Image</span>
                    </>
                  )}
                </button>
              )}
              <input
                ref={mainImageRef}
                type="file"
                accept="image/*"
                onChange={handleMainImageUpload}
                className="hidden"
              />
            </div>

            {/* Additional Images */}
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Additional Images</p>
              <div className="flex flex-wrap gap-3">
                {additionalImages.map((url, index) => (
                  <div
                    key={index}
                    className="relative w-24 h-24 rounded-sm overflow-hidden border border-border"
                  >
                    <img
                      src={url}
                      alt={`Product ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeAdditionalImage(index)}
                      className="absolute top-1 right-1 p-1 bg-destructive text-destructive-foreground rounded-full"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => additionalImagesRef.current?.click()}
                  disabled={uploading}
                  className="w-24 h-24 border-2 border-dashed border-border rounded-sm flex flex-col items-center justify-center gap-1 text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                >
                  {uploading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      <ImageIcon className="h-5 w-5" />
                      <span className="text-xs">Add More</span>
                    </>
                  )}
                </button>
              </div>
              <input
                ref={additionalImagesRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleAdditionalImagesUpload}
                className="hidden"
              />
            </div>
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Product name"
                className="bg-secondary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price *</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, price: e.target.value }))
                }
                placeholder="0.00"
                className="bg-secondary"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, category: value }))
                }
              >
                <SelectTrigger className="bg-secondary">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="origin">Origin *</Label>
              <Input
                id="origin"
                value={formData.origin}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, origin: e.target.value }))
                }
                placeholder="Country or region"
                className="bg-secondary"
              />
            </div>
          </div>

          {/* Specifications */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                value={formData.age}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, age: e.target.value }))
                }
                placeholder="e.g., 200 million years"
                className="bg-secondary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight">Weight</Label>
              <Input
                id="weight"
                value={formData.weight}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, weight: e.target.value }))
                }
                placeholder="e.g., 2.5 kg"
                className="bg-secondary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dimensions">Dimensions</Label>
              <Input
                id="dimensions"
                value={formData.dimensions}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, dimensions: e.target.value }))
                }
                placeholder="e.g., 15 × 10 × 8 cm"
                className="bg-secondary"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stock">Stock</Label>
              <Input
                id="stock"
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, stock: e.target.value }))
                }
                className="bg-secondary"
              />
            </div>
            <div className="space-y-2 flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, featured: e.target.checked }))
                  }
                  className="rounded border-border"
                />
                <span className="text-sm">Featured Product</span>
              </label>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, description: e.target.value }))
              }
              placeholder="Brief product description"
              className="bg-secondary min-h-[80px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="story">Story *</Label>
            <Textarea
              id="story"
              value={formData.story}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, story: e.target.value }))
              }
              placeholder="The story behind this specimen..."
              className="bg-secondary min-h-[120px]"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleClose(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="btn-premium" disabled={saving || uploading}>
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : isEditMode ? (
                "Update Product"
              ) : (
                "Create Product"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
