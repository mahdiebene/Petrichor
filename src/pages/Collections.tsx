import { useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/ui/ProductCard";
import { useProducts } from "@/hooks/useProducts";
import { Skeleton } from "@/components/ui/skeleton";

const categories = [
  "All",
  "Crystal",
  "Fossil",
  "Meteorite",
  "Volcanic Glass",
];

const Collections = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("featured");
  const { data: products, isLoading } = useProducts();

  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search");

  const categoryFilteredProducts = products
    ? selectedCategory === "All"
      ? products
      : products.filter((p) => p.category === selectedCategory)
    : [];

  const filteredProducts = searchQuery
    ? categoryFilteredProducts.filter((p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : categoryFilteredProducts;

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    if (sortBy === "featured") {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
    }
    return 0;
  });

  return (
    <>
      <Helmet>
        <title>Collections | Petrichor - Premium Geological Specimens</title>
        <meta
          name="description"
          content="Browse our curated collection of rare crystals, fossils, meteorites, and geological specimens. Each piece authenticated and certified."
        />
        <meta name="keywords" content="crystals collection, rare fossils, meteorites for sale, geological specimens, mineral collection" />
        <link rel="canonical" href="https://petrichor.com/collections" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <div className="noise-overlay" />
        <Header />

        {/* Hero */}
        <section className="pt-32 pb-16 bg-card border-b border-border">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <p className="text-primary text-sm tracking-[0.2em] uppercase mb-4">
                Our Collection
              </p>
              <h1 className="font-serif text-4xl md:text-5xl font-medium mb-4">
                Geological Treasures
              </h1>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Discover Earth's most extraordinary specimens, each carrying
                millions of years of history.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Filters */}
        <section className="sticky top-16 lg:top-20 z-40 bg-background/80 backdrop-blur-md border-b border-border py-4">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              {/* Category Filters */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className={
                      selectedCategory === category
                        ? "bg-primary text-primary-foreground"
                        : "btn-ghost-gold"
                    }
                  >
                    {category}
                  </Button>
                ))}
              </div>

              {/* Sort */}
              <div className="flex items-center gap-4">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-secondary border border-border rounded-sm px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="mb-6 text-muted-foreground text-sm">
              {isLoading ? "Loading..." : `${sortedProducts.length} specimens`}
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="space-y-4">
                    <Skeleton className="aspect-square w-full" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/4" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {sortedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    price={product.price}
                    image={product.image}
                    images={product.images}
                    origin={product.origin}
                    category={product.category}
                  />
                ))}
              </div>
            )}

            {!isLoading && sortedProducts.length === 0 && (
              <div className="text-center py-20">
                <p className="text-muted-foreground">
                  No specimens found in this category.
                </p>
              </div>
            )}
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default Collections;
