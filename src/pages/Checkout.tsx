import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { ArrowLeft, CreditCard, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useCart } from "@/contexts/CartContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Checkout = () => {
  const navigate = useNavigate();
  const { items, total, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [user, setUser] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    zip: "",
    country: "",
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user?.email) {
        setFormData(prev => ({ ...prev, email: session.user.email || "" }));
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
      if (session?.user?.email) {
        setFormData(prev => ({ ...prev, email: session.user.email || "" }));
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("Please sign in to complete your purchase");
      navigate("/auth");
      return;
    }

    setIsProcessing(true);

    try {
      // Create order
      const orderTotal = total + 75; // Including shipping
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          subtotal: total,
          shipping: 75,
          total: orderTotal,
          status: "pending",
          shipping_name: `${formData.firstName} ${formData.lastName}`,
          shipping_email: formData.email,
          shipping_address: formData.address,
          shipping_city: formData.city,
          shipping_zip: formData.zip,
          shipping_country: formData.country,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.id,
        product_name: item.name,
        product_image: item.image,
        quantity: item.quantity,
        price: item.price,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Update order status to processing
      await supabase
        .from("orders")
        .update({ status: "processing" })
        .eq("id", order.id);

      clearCart();
      toast.success("Order placed successfully!");
      navigate("/");
    } catch (error: any) {
      console.error("Checkout error:", error);
      toast.error(error.message || "Failed to place order. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    navigate("/cart");
    return null;
  }

  return (
    <>
      <Helmet>
        <title>Checkout | Petrichor</title>
        <meta name="description" content="Complete your purchase of premium geological specimens." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <div className="noise-overlay" />
        <Header />

        <main className="pt-24 pb-20">
          <div className="container mx-auto px-4">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center text-muted-foreground hover:text-foreground text-sm mb-8 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </button>

            {!user && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 p-4 bg-primary/10 border border-primary/20 rounded-sm"
              >
                <p className="text-sm text-center">
                  Please{" "}
                  <button
                    onClick={() => navigate("/auth")}
                    className="text-primary font-medium hover:underline"
                  >
                    sign in
                  </button>{" "}
                  to complete your purchase.
                </p>
              </motion.div>
            )}

            <div className="grid lg:grid-cols-2 gap-12">
              {/* Checkout Form */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <h1 className="font-serif text-3xl font-medium mb-8">
                  Checkout
                </h1>

                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Contact */}
                  <div>
                    <h2 className="font-serif text-xl mb-4">Contact</h2>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="mt-1 bg-secondary border-border"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Shipping */}
                  <div>
                    <h2 className="font-serif text-xl mb-4">Shipping Address</h2>
                    <div className="grid gap-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName">First Name</Label>
                          <Input
                            id="firstName"
                            required
                            value={formData.firstName}
                            onChange={handleChange}
                            className="mt-1 bg-secondary border-border"
                          />
                        </div>
                        <div>
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input
                            id="lastName"
                            required
                            value={formData.lastName}
                            onChange={handleChange}
                            className="mt-1 bg-secondary border-border"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="address">Address</Label>
                        <Input
                          id="address"
                          required
                          value={formData.address}
                          onChange={handleChange}
                          className="mt-1 bg-secondary border-border"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="city">City</Label>
                          <Input
                            id="city"
                            required
                            value={formData.city}
                            onChange={handleChange}
                            className="mt-1 bg-secondary border-border"
                          />
                        </div>
                        <div>
                          <Label htmlFor="zip">ZIP Code</Label>
                          <Input
                            id="zip"
                            required
                            value={formData.zip}
                            onChange={handleChange}
                            className="mt-1 bg-secondary border-border"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="country">Country</Label>
                        <Input
                          id="country"
                          required
                          value={formData.country}
                          onChange={handleChange}
                          className="mt-1 bg-secondary border-border"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Payment */}
                  <div>
                    <h2 className="font-serif text-xl mb-4">Payment</h2>
                    <div className="p-4 md:p-6 bg-card rounded-sm border border-border">
                      <div className="flex items-center gap-3 mb-4">
                        <CreditCard className="h-5 w-5 text-primary" />
                        <span className="font-medium">Credit Card</span>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="cardNumber">Card Number</Label>
                          <Input
                            id="cardNumber"
                            placeholder="1234 5678 9012 3456"
                            required
                            className="mt-1 bg-secondary border-border"
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="expiry">Expiry Date</Label>
                            <Input
                              id="expiry"
                              placeholder="MM/YY"
                              required
                              className="mt-1 bg-secondary border-border"
                            />
                          </div>
                          <div>
                            <Label htmlFor="cvv">CVV</Label>
                            <Input
                              id="cvv"
                              placeholder="123"
                              required
                              className="mt-1 bg-secondary border-border"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full btn-premium py-7 text-lg"
                    disabled={isProcessing || !user}
                  >
                    {isProcessing ? (
                      "Processing..."
                    ) : (
                      <>
                        <Lock className="h-5 w-5 mr-2" />
                        Complete Order - ${(total + 75).toLocaleString()}
                      </>
                    )}
                  </Button>
                </form>
              </motion.div>

              {/* Order Summary */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                className="lg:sticky lg:top-24 h-fit"
              >
                <div className="p-4 md:p-8 bg-card rounded-sm border border-border">
                  <h2 className="font-serif text-xl font-medium mb-6">
                    Order Summary
                  </h2>

                  <div className="space-y-4 mb-6">
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-4">
                        <div className="w-16 h-16 rounded-sm overflow-hidden bg-secondary shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{item.name}</p>
                          <p className="text-muted-foreground text-xs">
                            Qty: {item.quantity}
                          </p>
                        </div>
                        <p className="text-primary font-medium">
                          ${(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="divider-gold mb-6" />

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Subtotal</span>
                      <span>${total.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Insured Shipping</span>
                      <span>$75</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Tax</span>
                      <span>Calculated at checkout</span>
                    </div>
                  </div>

                  <div className="divider-gold my-6" />

                  <div className="flex justify-between font-serif text-xl">
                    <span>Total</span>
                    <span className="text-primary">
                      ${(total + 75).toLocaleString()}
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Checkout;
