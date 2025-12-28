import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { ArrowLeft, ShoppingBag, Shield, Truck, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useProduct } from "@/hooks/useProducts";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { addItem } = useCart();
  const { data: product, isLoading, error } = useProduct(id);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-20">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12">
              <Skeleton className="aspect-square w-full" />
              <div className="space-y-4">
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-10 w-3/4" />
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-8 w-1/3" />
                <Skeleton className="h-24 w-full" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Header />
        <div className="text-center">
          <h1 className="font-serif text-2xl mb-4">Specimen Not Found</h1>
          <Link to="/collections" className="text-primary hover:underline">
            Return to Collection
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      origin: product.origin,
    });
    toast.success(`${product.name} added to your collection`);
  };

  return (
    <>
      <Helmet>
        <title>{product.name} | Petrichor</title>
        <meta name="description" content={product.description} />
        <meta property="og:title" content={product.name} />
        <meta property="og:description" content={product.description} />
        <meta property="og:image" content={product.image} />
        <meta property="og:type" content="product" />
        <link rel="canonical" href={`https://petrichor.com/product/${product.id}`} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org/",
            "@type": "Product",
            name: product.name,
            description: product.description,
            image: product.image,
            offers: {
              "@type": "Offer",
              priceCurrency: "USD",
              price: product.price,
              availability: "https://schema.org/InStock",
            },
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-background">
        <div className="noise-overlay" />
        <Header />

        <main className="pt-24 pb-20">
          <div className="container mx-auto px-4">
            {/* Breadcrumb */}
            <Link
              to="/collections"
              className="inline-flex items-center text-muted-foreground hover:text-foreground text-sm mb-8 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Collection
            </Link>

            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
              {/* Images */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="aspect-square rounded-sm overflow-hidden bg-secondary mb-4">
                  <img
                    src={product.image || (product.images && product.images.length > 0 ? product.images[0] : '')}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {product.images && product.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-4">
                    {product.images.map((img, index) => (
                      <div
                        key={index}
                        className="aspect-square rounded-sm overflow-hidden bg-secondary cursor-pointer border border-border hover:border-primary transition-colors"
                      >
                        <img
                          src={img}
                          alt={`${product.name} view ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>

              {/* Details */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <p className="text-primary text-sm tracking-[0.2em] uppercase mb-2">
                  {product.category}
                </p>
                <h1 className="font-serif text-3xl md:text-4xl font-medium mb-2">
                  {product.name}
                </h1>
                <p className="text-muted-foreground mb-6">{product.origin}</p>

                <p className="font-serif text-3xl text-primary mb-8">
                  ${product.price.toLocaleString()}
                </p>

                <p className="text-foreground/80 leading-relaxed mb-8">
                  {product.description}
                </p>

                {/* Specs */}
                <div className="grid grid-cols-2 gap-4 mb-8 p-6 bg-card rounded-sm border border-border">
                  {product.age && (
                    <div>
                      <p className="text-muted-foreground text-xs uppercase tracking-wider mb-1">
                        Age
                      </p>
                      <p className="font-medium">{product.age}</p>
                    </div>
                  )}
                  {product.weight && (
                    <div>
                      <p className="text-muted-foreground text-xs uppercase tracking-wider mb-1">
                        Weight
                      </p>
                      <p className="font-medium">{product.weight}</p>
                    </div>
                  )}
                  {product.dimensions && (
                    <div>
                      <p className="text-muted-foreground text-xs uppercase tracking-wider mb-1">
                        Dimensions
                      </p>
                      <p className="font-medium">{product.dimensions}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-muted-foreground text-xs uppercase tracking-wider mb-1">
                      Origin
                    </p>
                    <p className="font-medium">{product.origin}</p>
                  </div>
                </div>

                <Button
                  onClick={handleAddToCart}
                  className="w-full btn-premium py-7 text-lg mb-6"
                >
                  <ShoppingBag className="h-5 w-5 mr-2" />
                  Add to Collection
                </Button>

                {/* Trust badges */}
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-4">
                    <Shield className="h-5 w-5 text-primary mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground">Authenticated</p>
                  </div>
                  <div className="p-4">
                    <Truck className="h-5 w-5 text-primary mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground">Insured Shipping</p>
                  </div>
                  <div className="p-4">
                    <Award className="h-5 w-5 text-primary mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground">Certificate</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Story Section */}
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-20 pt-20 border-t border-border"
            >
              <div className="max-w-3xl mx-auto">
                <h2 className="font-serif text-2xl md:text-3xl font-medium text-center mb-8">
                  The Story
                </h2>
                <p className="text-foreground/80 leading-relaxed text-lg text-center">
                  {product.story}
                </p>
              </div>
            </motion.section>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default ProductDetail;
