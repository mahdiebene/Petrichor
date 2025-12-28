import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Shield, Gem, Globe, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/ui/ProductCard";
import { useFeaturedProducts } from "@/hooks/useProducts";
import { Skeleton } from "@/components/ui/skeleton";
import heroImage from "@/assets/hero-rocks.jpg";
import philosophyCrystal from "@/assets/philosophy-crystal.jpg";

const Index = () => {
  const { data: featuredProducts, isLoading } = useFeaturedProducts();

  return (
    <>
      <Helmet>
        <title>Petrichor | Premium Geological Treasures & Rare Stones</title>
        <meta
          name="description"
          content="Discover Earth's most extraordinary geological treasures. Each stone carries millions of years of history, authenticated and curated for collectors who appreciate the profound beauty of our planet."
        />
        <meta name="keywords" content="rare stones, crystals, minerals, fossils, meteorites, gemstones, geological specimens, premium rocks" />
        <meta property="og:title" content="Petrichor | Premium Geological Treasures" />
        <meta property="og:description" content="Curating Earth's most extraordinary geological treasures since ancient times." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://petrichor.com" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <div className="noise-overlay" />
        <Header />

        {/* Hero Section */}
        <section className="relative min-h-[70vh] md:min-h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={heroImage}
              alt="Premium geological specimens"
              className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/50 to-card" />
          </div>

          <div className="relative z-10 container mx-auto px-4 text-center pt-20">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-primary text-sm tracking-[0.3em] uppercase mb-6"
            >
              Curated Since Time Immemorial
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="font-serif text-4xl md:text-6xl lg:text-7xl font-medium leading-tight mb-6"
            >
              <span className="text-gradient-gold">Earth's</span> Timeless
              <br />
              Treasures
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-10"
            >
              Each stone carries millions of years of history, waiting to become
              part of yours. Discover geological specimens that connect you to
              Earth's profound story.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link to="/collections">
                <Button className="btn-premium text-base px-10 py-6">
                  Explore Collection
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/about">
                <Button
                  variant="outline"
                  className="btn-ghost-gold text-base px-10 py-6"
                >
                  Our Story
                </Button>
              </Link>
            </motion.div>
          </div>


        </section>

        {/* Values Section */}
        <section className="py-12 md:py-24 bg-card">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
              {[
                {
                  icon: Shield,
                  title: "Authenticated",
                  description: "Every piece verified by certified geologists",
                },
                {
                  icon: Gem,
                  title: "Museum Quality",
                  description: "Specimens worthy of the finest collections",
                },
                {
                  icon: Globe,
                  title: "Ethically Sourced",
                  description: "Responsibly acquired from around the world",
                },
                {
                  icon: Award,
                  title: "Certified Origin",
                  description: "Complete provenance documentation included",
                },
              ].map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center p-4 md:p-8 rounded-xl bg-background/60 backdrop-blur-sm border border-border/40 shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="inline-flex items-center justify-center w-10 h-10 md:w-14 md:h-14 rounded-full bg-primary/10 mb-2 md:mb-4 shadow-gold">
                    <item.icon className="h-4 w-4 md:h-6 md:w-6 text-primary" />
                  </div>
                  <h3 className="font-serif text-sm md:text-lg font-medium mb-1 md:mb-2">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground text-xs md:text-sm">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <p className="text-primary text-sm tracking-[0.2em] uppercase mb-4">
                The Collection
              </p>
              <h2 className="font-serif text-3xl md:text-4xl font-medium mb-4">
                Featured Specimens
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Handpicked geological treasures, each with a story millions of
                years in the making.
              </p>
            </motion.div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="space-y-4">
                    <Skeleton className="aspect-square w-full" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/4" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredProducts?.map((product) => (
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

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mt-12"
            >
              <Link to="/collections">
                <Button
                  variant="outline"
                  className="btn-ghost-gold px-8 py-6"
                >
                  View All Collection
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-24 section-elevated">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <p className="text-primary text-sm tracking-[0.2em] uppercase mb-4">
                  Our Philosophy
                </p>
                <h2 className="font-serif text-3xl md:text-4xl font-medium mb-6">
                  Every Stone Tells a Story
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  We believe that geological specimens are more than mere
                  objects—they are tangible connections to Earth's ancient past.
                  Each crystal, fossil, and mineral in our collection carries
                  within it millions, sometimes billions, of years of history.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-8">
                  When you acquire a piece from Petrichor, you're not just
                  buying a stone. You're becoming the custodian of a fragment
                  of Earth's memory, a physical link to the forces that shaped
                  our planet.
                </p>
                <Link to="/about">
                  <Button className="btn-premium">
                    Discover Our Story
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative"
              >
                <div className="aspect-[4/5] rounded-xl overflow-hidden shadow-elevated">
                  <img
                    src={philosophyCrystal}
                    alt="Deep red garnet crystal formation"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -left-6 p-6 bg-card border border-border/60 rounded-xl shadow-elevated max-w-xs">
                  <p className="font-serif text-2xl text-primary mb-2">130M+</p>
                  <p className="text-muted-foreground text-sm">
                    Years of history in our oldest specimens
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center max-w-3xl mx-auto"
            >
              <h2 className="font-serif text-3xl md:text-5xl font-medium mb-6">
                Begin Your Collection
              </h2>
              <p className="text-muted-foreground text-lg mb-10">
                Join a community of collectors who appreciate the profound
                beauty and history of Earth's geological treasures.
              </p>
              <Link to="/collections">
                <Button className="btn-premium text-lg px-12 py-7">
                  Explore the Collection
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default Index;
