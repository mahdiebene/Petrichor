import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useCart } from "@/contexts/CartContext";

const Cart = () => {
  const { items, removeItem, updateQuantity, total } = useCart();

  return (
    <>
      <Helmet>
        <title>Your Collection | Petrichor</title>
        <meta name="description" content="Review your selected geological specimens." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <div className="noise-overlay" />
        <Header />

        <main className="pt-24 pb-20">
          <div className="container mx-auto px-4">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-serif text-3xl md:text-4xl font-medium mb-8"
            >
              Your Collection
            </motion.h1>

            {items.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
                <h2 className="font-serif text-2xl mb-4">Your collection is empty</h2>
                <p className="text-muted-foreground mb-8">
                  Discover Earth's treasures and add them to your collection.
                </p>
                <Link to="/collections">
                  <Button className="btn-premium">
                    Explore Collection
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </motion.div>
            ) : (
              <div className="grid lg:grid-cols-3 gap-6 lg:gap-12">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-4 md:space-y-6">
                  {items.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex flex-col sm:flex-row gap-4 sm:gap-6 p-4 sm:p-6 bg-card rounded-sm border border-border"
                    >
                      <Link to={`/product/${item.id}`} className="shrink-0">
                        <div className="w-full sm:w-32 h-48 sm:h-32 rounded-sm overflow-hidden bg-secondary">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </Link>

                      <div className="flex-1 flex flex-col justify-between gap-4 sm:gap-0">
                        <div className="flex justify-between items-start">
                          <div>
                            <Link to={`/product/${item.id}`}>
                              <h3 className="font-serif text-lg font-medium hover:text-primary transition-colors">
                                {item.name}
                              </h3>
                            </Link>
                            <p className="text-muted-foreground text-sm">
                              {item.origin}
                            </p>
                          </div>
                          <div className="text-right sm:hidden">
                            <p className="font-serif text-lg text-primary">
                              ${(item.price * item.quantity).toLocaleString()}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-8 text-center font-medium">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>

                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-muted-foreground hover:text-destructive"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="text-right hidden sm:block">
                        <p className="font-serif text-lg text-primary">
                          ${(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Order Summary */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="lg:sticky lg:top-24"
                >
                  <div className="p-4 md:p-8 bg-card rounded-sm border border-border">
                    <h2 className="font-serif text-xl font-medium mb-6">
                      Order Summary
                    </h2>

                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between text-muted-foreground">
                        <span>Subtotal</span>
                        <span>${total.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                        <span>Shipping</span>
                        <span>Calculated at checkout</span>
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                        <span>Insurance</span>
                        <span>Included</span>
                      </div>
                    </div>

                    <div className="divider-gold mb-6" />

                    <div className="flex justify-between font-serif text-xl mb-8">
                      <span>Total</span>
                      <span className="text-primary">
                        ${total.toLocaleString()}
                      </span>
                    </div>

                    <Link to="/checkout">
                      <Button className="w-full btn-premium py-6">
                        Proceed to Checkout
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>

                    <p className="text-center text-muted-foreground text-xs mt-6">
                      All items include certificate of authenticity
                    </p>
                  </div>
                </motion.div>
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Cart;
