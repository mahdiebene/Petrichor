import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { User, Package, MapPin, Mail, Phone, Edit2, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  zip_code: string | null;
  country: string | null;
}

interface Order {
  id: string;
  total: number;
  status: string;
  created_at: string;
  shipping_name: string | null;
  order_items: {
    id: string;
    product_name: string;
    product_image: string | null;
    quantity: number;
    price: number;
  }[];
}

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    address: "",
    city: "",
    zip_code: "",
    country: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
      } else if (data) {
        setProfile(data);
        setFormData({
          full_name: data.full_name || "",
          phone: data.phone || "",
          address: data.address || "",
          city: data.city || "",
          zip_code: data.zip_code || "",
          country: data.country || "",
        });
      }
      setLoading(false);
    };

    const fetchOrders = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) return;

      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          order_items (
            id,
            product_name,
            product_image,
            quantity,
            price
          )
        `)
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching orders:", error);
      } else {
        setOrders(data || []);
      }
      setLoadingOrders(false);
    };

    fetchProfile();
    fetchOrders();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      if (!session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSave = async () => {
    if (!profile) return;
    
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update(formData)
      .eq("id", profile.id);

    if (error) {
      toast.error("Failed to update profile");
      console.error(error);
    } else {
      setProfile({ ...profile, ...formData });
      setEditing(false);
      toast.success("Profile updated successfully");
    }
    setSaving(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "text-green-500 bg-green-500/10";
      case "shipped":
        return "text-blue-500 bg-blue-500/10";
      case "processing":
        return "text-yellow-500 bg-yellow-500/10";
      case "cancelled":
        return "text-red-500 bg-red-500/10";
      default:
        return "text-muted-foreground bg-muted";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-20">
          <div className="container mx-auto px-4">
            <Skeleton className="h-10 w-48 mb-8" />
            <div className="grid lg:grid-cols-3 gap-8">
              <Skeleton className="h-64" />
              <Skeleton className="h-64 lg:col-span-2" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>My Account | Petrichor</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <div className="noise-overlay" />
        <Header />

        <main className="pt-24 pb-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h1 className="font-serif text-3xl font-medium">My Account</h1>
              <p className="text-muted-foreground mt-2">
                Manage your profile and view your order history
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Profile Card */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-card rounded-xl border border-border p-6 shadow-card h-fit"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-serif text-xl font-medium flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    Profile
                  </h2>
                  {!editing ? (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditing(true)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditing(false)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleSave}
                        disabled={saving}
                      >
                        <Save className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{profile?.email}</span>
                  </div>

                  {editing ? (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="full_name">Full Name</Label>
                        <Input
                          id="full_name"
                          value={formData.full_name}
                          onChange={(e) =>
                            setFormData({ ...formData, full_name: e.target.value })
                          }
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="address">Address</Label>
                        <Input
                          id="address"
                          value={formData.address}
                          onChange={(e) =>
                            setFormData({ ...formData, address: e.target.value })
                          }
                          className="mt-1"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="city">City</Label>
                          <Input
                            id="city"
                            value={formData.city}
                            onChange={(e) =>
                              setFormData({ ...formData, city: e.target.value })
                            }
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="zip_code">ZIP Code</Label>
                          <Input
                            id="zip_code"
                            value={formData.zip_code}
                            onChange={(e) =>
                              setFormData({ ...formData, zip_code: e.target.value })
                            }
                            className="mt-1"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="country">Country</Label>
                        <Input
                          id="country"
                          value={formData.country}
                          onChange={(e) =>
                            setFormData({ ...formData, country: e.target.value })
                          }
                          className="mt-1"
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      {profile?.full_name && (
                        <div className="flex items-center gap-3 text-sm">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span>{profile.full_name}</span>
                        </div>
                      )}
                      {profile?.phone && (
                        <div className="flex items-center gap-3 text-sm">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>{profile.phone}</span>
                        </div>
                      )}
                      {(profile?.address || profile?.city) && (
                        <div className="flex items-start gap-3 text-sm">
                          <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                          <div>
                            {profile.address && <p>{profile.address}</p>}
                            {profile.city && (
                              <p>
                                {profile.city}
                                {profile.zip_code && `, ${profile.zip_code}`}
                              </p>
                            )}
                            {profile.country && <p>{profile.country}</p>}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </motion.div>

              {/* Order History */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="lg:col-span-2"
              >
                <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
                  <div className="p-6 border-b border-border">
                    <h2 className="font-serif text-xl font-medium flex items-center gap-2">
                      <Package className="h-5 w-5 text-primary" />
                      Order History
                    </h2>
                  </div>

                  {loadingOrders ? (
                    <div className="p-8 space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <Skeleton key={i} className="h-24 w-full" />
                      ))}
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="p-12 text-center">
                      <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No orders yet</p>
                      <Button
                        className="btn-premium mt-4"
                        onClick={() => navigate("/collections")}
                      >
                        Start Shopping
                      </Button>
                    </div>
                  ) : (
                    <div className="divide-y divide-border">
                      {orders.map((order) => (
                        <div key={order.id} className="p-6">
                          <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                            <div>
                              <p className="font-mono text-xs text-muted-foreground mb-1">
                                Order #{order.id.slice(0, 8)}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(order.created_at).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })}
                              </p>
                            </div>
                            <div className="text-right">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(
                                  order.status
                                )}`}
                              >
                                {order.status}
                              </span>
                              <p className="text-primary font-medium mt-2">
                                ${Number(order.total).toLocaleString()}
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-4">
                            {order.order_items.map((item) => (
                              <div
                                key={item.id}
                                className="flex items-center gap-3 bg-secondary/30 rounded-lg p-3"
                              >
                                {item.product_image && (
                                  <div className="w-12 h-12 rounded overflow-hidden bg-secondary">
                                    <img
                                      src={item.product_image}
                                      alt={item.product_name}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                )}
                                <div>
                                  <p className="text-sm font-medium">
                                    {item.product_name}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    Qty: {item.quantity} × ${Number(item.price).toLocaleString()}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
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

export default Profile;
