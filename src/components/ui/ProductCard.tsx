import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  images?: string[];
  origin: string;
  category: string;
}

const ProductCard = ({ id, name, price, image, images, origin, category }: ProductCardProps) => {
  const { addItem } = useCart();
  
  // Use the image directly, or fallback to first image in array
  const displayImage = image || (images && images.length > 0 ? images[0] : '');

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({ id, name, price, image, origin });
    toast.success(`${name} added to your collection`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <Link to={`/product/${id}`} className="group block">
        <div className="card-premium bg-card rounded-xl overflow-hidden">
          <div className="relative aspect-square overflow-hidden bg-secondary/30">
            <img
              src={displayImage}
              alt={name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Quick Add Button */}
            <div className="absolute bottom-4 left-4 right-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
              <Button
                onClick={handleAddToCart}
                className="w-full btn-premium flex items-center justify-center gap-2"
              >
                <ShoppingBag className="h-4 w-4" />
                Add to Collection
              </Button>
            </div>

            {/* Category Badge */}
            <div className="absolute top-4 left-4">
              <span className="badge-premium">
                {category}
              </span>
            </div>
          </div>

          <div className="p-5">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
              {origin}
            </p>
            <h3 className="font-serif text-lg font-medium text-foreground mb-2 group-hover:text-primary transition-colors">
              {name}
            </h3>
            <p className="text-primary font-medium">
              ${price.toLocaleString()}
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
