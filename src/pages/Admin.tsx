import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Package,
  Users,
  ShoppingCart,
  DollarSign,
  Plus,
  Edit,
  Trash2,
  Eye,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useProducts } from "@/hooks/useProducts";
import { toast } from "sonner";
import { ProductFormDialog } from "@/components/admin/ProductFormDialog";
import { DeleteProductDialog } from "@/components/admin/DeleteProductDialog";
import { useQueryClient } from "@tanstack/react-query";

type Tab = "dashboard" | "products" | "orders" | "customers" | "settings";

interface Order {
  id: string;
  shipping_name: string | null;
  total: number;
  status: string;
  created_at: string;
}

const Admin = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [showProductDialog, setShowProductDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [deletingProduct, setDeletingProduct] = useState<any>(null);
  const { data: products, isLoading: loadingProducts } = useProducts();

  useEffect(() => {
    const checkAdminAccess = async (userId: string) => {
      const { data, error } = await supabase.rpc('has_role', {
        _user_id: userId,
        _role: 'admin'
      });
      
      if (error) {
        console.error("Error checking admin role:", error);
        setIsAdmin(false);
        return;
      }
      
      setIsAdmin(data === true);
      if (!data) {
        toast.error("Access denied. Admin privileges required.");
        navigate("/");
      }
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
        return;
      }
      setUser(session.user);
      checkAdminAccess(session.user.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      if (!session) {
        navigate("/auth");
        return;
      }
      setUser(session.user);
      checkAdminAccess(session.user.id);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    const fetchOrders = async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) {
        console.error("Error fetching orders:", error);
      } else {
        setOrders(data || []);
      }
      setLoadingOrders(false);
    };

    if (user) {
      fetchOrders();
    }
  }, [user]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out");
    navigate("/");
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", orderId);

    if (error) {
      toast.error("Failed to update order status");
      console.error(error);
    } else {
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
      toast.success(`Order status updated to ${newStatus}`);
    }
  };

  const orderStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"];

  const filteredProducts = products?.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total), 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "text-green-500 bg-green-500/10";
      case "shipped":
        return "text-blue-500 bg-blue-500/10";
      case "processing":
        return "text-yellow-500 bg-yellow-500/10";
      default:
        return "text-muted-foreground bg-muted";
    }
  };

  const stats = [
    { label: "Total Revenue", value: `$${totalRevenue.toLocaleString()}`, icon: DollarSign, change: "+12.5%" },
    { label: "Orders", value: orders.length.toString(), icon: ShoppingCart, change: "+8.2%" },
    { label: "Products", value: (products?.length || 0).toString(), icon: Package, change: "0%" },
  ];

  if (!user || isAdmin === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>Admin Panel | Petrichor</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-background flex">
        {/* Sidebar */}
        <aside className="w-64 bg-card border-r border-border p-6 flex flex-col">
          <div className="mb-8">
            <span className="font-serif text-xl font-semibold text-gradient-gold">
              Petrichor
            </span>
            <p className="text-muted-foreground text-xs mt-1">Admin Panel</p>
          </div>

          <nav className="flex-1 space-y-1">
            {[
              { id: "dashboard", label: "Dashboard", icon: BarChart3 },
              { id: "products", label: "Products", icon: Package },
              { id: "orders", label: "Orders", icon: ShoppingCart },
              { id: "settings", label: "Settings", icon: Settings },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as Tab)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm text-sm font-medium transition-colors ${
                  activeTab === item.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </button>
            ))}
          </nav>

          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-4 py-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 overflow-auto">
          {/* Dashboard */}
          {activeTab === "dashboard" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              <h1 className="font-serif text-2xl font-medium">Dashboard</h1>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-6 bg-card rounded-sm border border-border"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2 bg-primary/10 rounded-sm">
                        <stat.icon className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                    <p className="font-serif text-2xl font-medium">{stat.value}</p>
                    <p className="text-muted-foreground text-sm">{stat.label}</p>
                  </motion.div>
                ))}
              </div>

              {/* Recent Orders */}
              <div className="bg-card rounded-sm border border-border">
                <div className="p-6 border-b border-border">
                  <h2 className="font-serif text-lg font-medium">Recent Orders</h2>
                </div>
                <div className="overflow-x-auto">
                  {loadingOrders ? (
                    <div className="p-8 text-center text-muted-foreground">Loading orders...</div>
                  ) : orders.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">No orders yet</div>
                  ) : (
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left p-4 text-muted-foreground text-xs uppercase tracking-wider font-medium">
                            Order ID
                          </th>
                          <th className="text-left p-4 text-muted-foreground text-xs uppercase tracking-wider font-medium">
                            Customer
                          </th>
                          <th className="text-left p-4 text-muted-foreground text-xs uppercase tracking-wider font-medium">
                            Total
                          </th>
                          <th className="text-left p-4 text-muted-foreground text-xs uppercase tracking-wider font-medium">
                            Status
                          </th>
                          <th className="text-left p-4 text-muted-foreground text-xs uppercase tracking-wider font-medium">
                            Date
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order) => (
                          <tr
                            key={order.id}
                            className="border-b border-border/50 last:border-0"
                          >
                            <td className="p-4 font-medium font-mono text-xs">
                              {order.id.slice(0, 8)}...
                            </td>
                            <td className="p-4">{order.shipping_name || "N/A"}</td>
                            <td className="p-4 text-primary">
                              ${Number(order.total).toLocaleString()}
                            </td>
                            <td className="p-4">
                              <span
                                className={`px-2 py-1 rounded-sm text-xs font-medium capitalize ${getStatusColor(
                                  order.status
                                )}`}
                              >
                                {order.status}
                              </span>
                            </td>
                            <td className="p-4 text-muted-foreground">
                              {new Date(order.created_at).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Products */}
          {activeTab === "products" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h1 className="font-serif text-2xl font-medium">Products</h1>
                <Button className="btn-premium" onClick={() => setShowProductDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </div>
              
              <ProductFormDialog
                open={showProductDialog}
                onOpenChange={(open) => {
                  setShowProductDialog(open);
                  if (!open) setEditingProduct(null);
                }}
                onSuccess={() => queryClient.invalidateQueries({ queryKey: ["products"] })}
                product={editingProduct}
              />
              
              <DeleteProductDialog
                open={showDeleteDialog}
                onOpenChange={setShowDeleteDialog}
                product={deletingProduct}
                onSuccess={() => queryClient.invalidateQueries({ queryKey: ["products"] })}
              />

              <div className="flex gap-4">
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="max-w-sm bg-secondary border-border"
                />
              </div>

              <div className="bg-card rounded-sm border border-border overflow-hidden">
                {loadingProducts ? (
                  <div className="p-8 text-center text-muted-foreground">Loading products...</div>
                ) : (
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left p-4 text-muted-foreground text-xs uppercase tracking-wider font-medium">
                          Product
                        </th>
                        <th className="text-left p-4 text-muted-foreground text-xs uppercase tracking-wider font-medium">
                          Category
                        </th>
                        <th className="text-left p-4 text-muted-foreground text-xs uppercase tracking-wider font-medium">
                          Price
                        </th>
                        <th className="text-left p-4 text-muted-foreground text-xs uppercase tracking-wider font-medium">
                          Origin
                        </th>
                        <th className="text-right p-4 text-muted-foreground text-xs uppercase tracking-wider font-medium">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map((product) => (
                        <tr
                          key={product.id}
                          className="border-b border-border/50 last:border-0"
                        >
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-sm overflow-hidden bg-secondary">
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <span className="font-medium">{product.name}</span>
                            </div>
                          </td>
                          <td className="p-4 text-muted-foreground">
                            {product.category}
                          </td>
                          <td className="p-4 text-primary">
                            ${product.price.toLocaleString()}
                          </td>
                          <td className="p-4 text-muted-foreground">
                            {product.origin}
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => {
                                  setEditingProduct(product);
                                  setShowProductDialog(true);
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive"
                                onClick={() => {
                                  setDeletingProduct(product);
                                  setShowDeleteDialog(true);
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </motion.div>
          )}

          {/* Orders */}
          {activeTab === "orders" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <h1 className="font-serif text-2xl font-medium">Orders</h1>
              <div className="bg-card rounded-sm border border-border">
                {loadingOrders ? (
                  <div className="p-8 text-center text-muted-foreground">Loading orders...</div>
                ) : orders.length === 0 ? (
                  <div className="p-8 text-center">
                    <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No orders yet</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left p-4 text-muted-foreground text-xs uppercase tracking-wider font-medium">
                            Order ID
                          </th>
                          <th className="text-left p-4 text-muted-foreground text-xs uppercase tracking-wider font-medium">
                            Customer
                          </th>
                          <th className="text-left p-4 text-muted-foreground text-xs uppercase tracking-wider font-medium">
                            Total
                          </th>
                          <th className="text-left p-4 text-muted-foreground text-xs uppercase tracking-wider font-medium">
                            Status
                          </th>
                          <th className="text-left p-4 text-muted-foreground text-xs uppercase tracking-wider font-medium">
                            Date
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order) => (
                          <tr
                            key={order.id}
                            className="border-b border-border/50 last:border-0"
                          >
                            <td className="p-4 font-medium font-mono text-xs">
                              {order.id.slice(0, 8)}...
                            </td>
                            <td className="p-4">{order.shipping_name || "N/A"}</td>
                            <td className="p-4 text-primary">
                              ${Number(order.total).toLocaleString()}
                            </td>
                            <td className="p-4">
                              <Select
                                value={order.status}
                                onValueChange={(value) => handleUpdateOrderStatus(order.id, value)}
                              >
                                <SelectTrigger className={`w-32 h-8 text-xs ${getStatusColor(order.status)}`}>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {orderStatuses.map((status) => (
                                    <SelectItem key={status} value={status} className="capitalize">
                                      {status}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </td>
                            <td className="p-4 text-muted-foreground">
                              {new Date(order.created_at).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Settings */}
          {activeTab === "settings" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <h1 className="font-serif text-2xl font-medium">Settings</h1>
              <div className="bg-card rounded-sm border border-border p-8">
                <h2 className="font-serif text-lg mb-4">Store Settings</h2>
                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      Store Name
                    </label>
                    <Input
                      defaultValue="Petrichor"
                      className="bg-secondary border-border"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      Contact Email
                    </label>
                    <Input
                      defaultValue="hello@petrichor.com"
                      className="bg-secondary border-border"
                    />
                  </div>
                  <Button className="btn-premium">Save Changes</Button>
                </div>
              </div>
            </motion.div>
          )}
        </main>
      </div>
    </>
  );
};

export default Admin;
