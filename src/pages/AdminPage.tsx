import { useState, useRef, useMemo } from "react";
import { useStore } from "@/context/StoreContext";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { Link, Navigate } from "react-router-dom";
import {
  LayoutDashboard, Package, ShoppingCart, Users, Settings, LogOut,
  Plus, Edit, Trash2, ChevronDown, TrendingUp, DollarSign, Eye, Upload, X, Image,
  FileDown, BarChart3, Activity, Calendar, CheckCircle, Clock, XCircle, AlertTriangle,
  Sun, Moon, AlertCircle, PackageX, Boxes, Search, RefreshCw, ArrowUpRight,
  ArrowDownRight, Percent, Target, Zap, Bell, Truck, CreditCard, Star, Hash, ShoppingBag
} from "lucide-react";
import { Product, Order } from "@/data/store";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/logo.png";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart as RechartsPie, Pie, Cell, AreaChart, Area
} from "recharts";

type Tab = "dashboard" | "products" | "orders" | "customers" | "reports" | "settings";

const CHART_COLORS = ["#f97316", "#3b82f6", "#10b981", "#8b5cf6", "#ef4444", "#06b6d4", "#f59e0b", "#ec4899"];

const AdminPage = () => {
  const { products, orders: storeOrders, addProduct, updateProduct, deleteProduct, updateOrderStatus } = useStore();
  const [orders, setOrders] = useState<Order[]>([]);
  
  // Sync orders from store
  useState(() => { setOrders(storeOrders); });
  
  const deleteOrder = (orderId: string) => {
    setOrders(prev => prev.filter(o => o.id !== orderId));
  };
  const { user, isAdmin, isLoading, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (isLoading) return <div className="min-h-screen bg-background flex items-center justify-center"><p className="text-muted-foreground">Loading...</p></div>;
  if (!user) return <Navigate to="/auth" replace />;
  if (!isAdmin) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <AlertTriangle className="w-12 h-12 text-warning mx-auto mb-3" />
        <p className="text-lg font-semibold text-foreground mb-2">Access Denied</p>
        <p className="text-sm text-muted-foreground mb-4">You don't have admin privileges.</p>
        <Link to="/" className="bg-primary text-primary-foreground px-6 py-2 rounded text-sm font-semibold">Go Home</Link>
      </div>
    </div>
  );

  const lowStockProducts = products.filter(p => (p.stockQuantity ?? 100) <= 10 && p.inStock);
  const pendingOrders = orders.filter(o => o.status === "pending").length;

  const sidebarItems: { icon: typeof LayoutDashboard; label: string; tab: Tab; badge?: number }[] = [
    { icon: LayoutDashboard, label: "Dashboard", tab: "dashboard" },
    { icon: Package, label: "Products", tab: "products", badge: lowStockProducts.length || undefined },
    { icon: ShoppingCart, label: "Orders", tab: "orders", badge: pendingOrders || undefined },
    { icon: Users, label: "Customers", tab: "customers" },
    { icon: BarChart3, label: "Reports", tab: "reports" },
    { icon: Settings, label: "Settings", tab: "settings" },
  ];

  const handleSaveProduct = (formData: Partial<Product>) => {
    if (editingProduct) {
      updateProduct({ ...editingProduct, ...formData } as Product);
      toast.success("Product updated");
    } else {
      addProduct({ ...formData, id: Date.now().toString(), rating: 0, reviews: 0 } as Product);
      toast.success("Product added");
    }
    setShowProductForm(false);
    setEditingProduct(null);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar - Desktop */}
      <aside className={`bg-card border-r border-border ${sidebarOpen ? "w-56" : "w-14"} transition-all duration-200 flex flex-col min-h-screen hidden md:flex`}>
        <div className="p-3 border-b border-border">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="DMT" className="h-7" />
            {sidebarOpen && <span className="font-bold text-xs text-foreground">Admin Panel</span>}
          </Link>
        </div>
        <nav className="flex-1 py-2">
          {sidebarItems.map((item) => (
            <button key={item.tab} onClick={() => setActiveTab(item.tab)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs transition-colors relative ${activeTab === item.tab ? "bg-primary/10 text-primary font-semibold border-r-2 border-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"}`}>
              <item.icon className="w-4 h-4 flex-shrink-0" />
              {sidebarOpen && <span>{item.label}</span>}
              {item.badge && sidebarOpen && (
                <span className="ml-auto bg-destructive text-destructive-foreground text-[9px] font-bold px-1.5 py-0.5 rounded-full">{item.badge}</span>
              )}
            </button>
          ))}
        </nav>
        <div className="p-2 border-t border-border space-y-0.5">
          <button onClick={toggleTheme} className="flex items-center gap-2.5 text-xs text-muted-foreground hover:text-foreground w-full px-1 py-1.5 rounded hover:bg-muted/50">
            {theme === "light" ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
            {sidebarOpen && (theme === "light" ? "Dark Mode" : "Light Mode")}
          </button>
          <Link to="/" className="flex items-center gap-2.5 text-xs text-muted-foreground hover:text-foreground px-1 py-1.5 rounded hover:bg-muted/50">
            <Eye className="w-3.5 h-3.5" />
            {sidebarOpen && "View Store"}
          </Link>
          <button onClick={signOut} className="flex items-center gap-2.5 text-xs text-destructive hover:text-destructive/80 w-full px-1 py-1.5 rounded hover:bg-destructive/5">
            <LogOut className="w-3.5 h-3.5" />
            {sidebarOpen && "Sign Out"}
          </button>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 flex safe-area-pb">
        <Link to="/" className="flex-1 flex flex-col items-center py-2 text-[9px] text-muted-foreground">
          <Eye className="w-4 h-4 mb-0.5" />
          <span>Home</span>
        </Link>
        {sidebarItems.slice(0, 4).map((item) => (
          <button key={item.tab} onClick={() => setActiveTab(item.tab)}
            className={`flex-1 flex flex-col items-center py-2 text-[9px] relative ${activeTab === item.tab ? "text-primary" : "text-muted-foreground"}`}>
            <item.icon className="w-4 h-4 mb-0.5" />
            <span className="truncate">{item.label}</span>
            {item.badge && <span className="absolute top-1 right-1/4 bg-destructive text-destructive-foreground text-[7px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">{item.badge}</span>}
          </button>
        ))}
      </div>

      <main className="flex-1 overflow-auto pb-16 md:pb-0">
        <header className="bg-card border-b border-border px-3 md:px-6 py-2.5 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h1 className="text-base md:text-lg font-bold text-foreground capitalize">{activeTab}</h1>
            <p className="text-[10px] text-muted-foreground">Welcome back, Admin</p>
          </div>
          <div className="flex items-center gap-1.5">
            {lowStockProducts.length > 0 && (
              <button onClick={() => setActiveTab("products")} className="flex items-center gap-1 bg-warning/10 text-warning px-2 py-1 rounded-lg text-[10px] font-semibold">
                <AlertCircle className="w-3 h-3" /> {lowStockProducts.length} Low
              </button>
            )}
            {pendingOrders > 0 && (
              <button onClick={() => setActiveTab("orders")} className="flex items-center gap-1 bg-blue-500/10 text-blue-500 px-2 py-1 rounded-lg text-[10px] font-semibold">
                <Clock className="w-3 h-3" /> {pendingOrders}
              </button>
            )}
            <span className="text-[10px] text-muted-foreground hidden lg:inline">{user?.email}</span>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="hidden md:block p-1.5 border border-border rounded-lg hover:bg-muted">
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${sidebarOpen ? "rotate-90" : "-rotate-90"}`} />
            </button>
          </div>
        </header>

        <div className="p-3 md:p-5">
          {activeTab === "dashboard" && <DashboardTab orders={orders} products={products} lowStockProducts={lowStockProducts} setActiveTab={setActiveTab} />}
          {activeTab === "products" && (
            <ProductsTab products={products}
              onEdit={(p: Product) => { setEditingProduct(p); setShowProductForm(true); }}
              onDelete={(id: string) => { deleteProduct(id); toast.success("Product deleted"); }}
              onAdd={() => { setEditingProduct(null); setShowProductForm(true); }}
              showForm={showProductForm} editingProduct={editingProduct}
              onSave={handleSaveProduct}
              onCancel={() => { setShowProductForm(false); setEditingProduct(null); }}
              lowStockProducts={lowStockProducts}
            />
          )}
          {activeTab === "orders" && <OrdersTab orders={orders} onUpdateStatus={updateOrderStatus} />}
          {activeTab === "customers" && <CustomersTab orders={orders} />}
          {activeTab === "reports" && <ReportsTab orders={orders} products={products} />}
          {activeTab === "settings" && <SettingsTab onSignOut={signOut} />}
        </div>
      </main>
    </div>
  );
};

/* ============ STAT CARD ============ */
const StatCard = ({ title, value, icon: Icon, trend, trendDown, color, subtitle }: { title: string; value: string; icon: typeof TrendingUp; trend?: string; trendDown?: boolean; color?: string; subtitle?: string }) => (
  <div className="bg-card border border-border rounded-xl p-3 hover:shadow-md transition-all hover:border-primary/20 group">
    <div className="flex items-center justify-between mb-1.5">
      <span className="text-[10px] text-muted-foreground font-medium">{title}</span>
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color || "bg-primary/10"} group-hover:scale-110 transition-transform`}>
        <Icon className={`w-3.5 h-3.5 ${color ? "text-white" : "text-primary"}`} />
      </div>
    </div>
    <p className="text-lg md:text-xl font-bold text-foreground">{value}</p>
    {trend && <p className={`text-[9px] mt-0.5 flex items-center gap-0.5 ${trendDown ? "text-destructive" : "text-green-600"}`}>{trendDown ? <ArrowDownRight className="w-2.5 h-2.5" /> : <ArrowUpRight className="w-2.5 h-2.5" />} {trend}</p>}
    {subtitle && <p className="text-[9px] text-muted-foreground mt-0.5">{subtitle}</p>}
  </div>
);

/* ============ STATUS BADGE ============ */
const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    pending: "bg-warning/10 text-warning border-warning/20",
    processing: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    shipped: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
    delivered: "bg-green-500/10 text-green-500 border-green-500/20",
    cancelled: "bg-destructive/10 text-destructive border-destructive/20",
  };
  return <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full capitalize border ${styles[status] || ""}`}>{status}</span>;
};

/* ============ DASHBOARD ============ */
const DashboardTab = ({ orders, products, lowStockProducts, setActiveTab }: any) => {
  const totalRevenue = orders.reduce((s: number, o: Order) => s + o.total, 0);
  const totalOrders = orders.length;
  const totalProducts = products.length;
  const deliveredOrders = orders.filter((o: Order) => o.status === "delivered").length;
  const inStockProducts = products.filter((p: Product) => p.inStock).length;
  const outOfStockProducts = products.filter((p: Product) => !p.inStock);
  const avgOrderValue = totalOrders ? totalRevenue / totalOrders : 0;
  const fulfillmentRate = totalOrders ? Math.round((deliveredOrders / totalOrders) * 100) : 0;
  const stockHealthPercent = totalProducts ? Math.round((inStockProducts / totalProducts) * 100) : 0;

  const categoryData = useMemo(() => {
    const cats: Record<string, number> = {};
    products.forEach((p: Product) => { cats[p.category] = (cats[p.category] || 0) + 1; });
    return Object.entries(cats).map(([name, value]) => ({ name: name.length > 12 ? name.slice(0, 12) + "…" : name, value }));
  }, [products]);

  const weeklyData = useMemo(() => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    return days.map(day => ({ day, revenue: Math.round(totalRevenue / 7 * (0.6 + Math.random() * 0.8)) }));
  }, [totalRevenue]);

  return (
    <div className="space-y-4">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5">
        <StatCard title="Revenue" value={`KSH ${totalRevenue.toLocaleString()}`} icon={DollarSign} trend="12% up" color="bg-green-500" />
        <StatCard title="Orders" value={totalOrders.toString()} icon={ShoppingCart} trend="8% up" color="bg-blue-500" />
        <StatCard title="Products" value={totalProducts.toString()} icon={Package} subtitle={`${inStockProducts} in stock`} color="bg-purple-500" />
        <StatCard title="Avg. Order" value={`KSH ${avgOrderValue.toFixed(0)}`} icon={Target} color="bg-cyan-500" />
        <StatCard title="Fulfillment" value={`${fulfillmentRate}%`} icon={Truck} subtitle={`${deliveredOrders} delivered`} color="bg-emerald-500" />
        <StatCard title="Stock Health" value={`${stockHealthPercent}%`} icon={Activity} subtitle={`${outOfStockProducts.length} out`} color={stockHealthPercent > 80 ? "bg-green-500" : "bg-amber-500"} />
      </div>

      {/* Quick Actions */}
      <div className="bg-card border border-border rounded-xl p-3">
        <h3 className="font-semibold text-xs text-foreground mb-2 flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-primary" /> Quick Actions</h3>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
          {[
            { icon: Plus, label: "Add Product", onClick: () => setActiveTab("products"), color: "bg-primary" },
            { icon: ShoppingCart, label: "Orders", onClick: () => setActiveTab("orders"), color: "bg-blue-500" },
            { icon: FileDown, label: "Reports", onClick: () => setActiveTab("reports"), color: "bg-green-500" },
            { icon: Users, label: "Customers", onClick: () => setActiveTab("customers"), color: "bg-purple-500" },
            { icon: PackageX, label: "Low Stock", onClick: () => setActiveTab("products"), color: "bg-amber-500" },
            { icon: Settings, label: "Settings", onClick: () => setActiveTab("settings"), color: "bg-slate-500" },
          ].map(a => (
            <button key={a.label} onClick={a.onClick} className="flex flex-col items-center gap-1.5 p-2.5 bg-muted/30 border border-border rounded-xl hover:shadow-sm hover:border-primary/20 transition-all group">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${a.color} group-hover:scale-110 transition-transform`}>
                <a.icon className="w-4 h-4 text-white" />
              </div>
              <span className="text-[10px] font-medium text-foreground">{a.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <div className="bg-card border border-border rounded-xl p-3">
          <h3 className="font-semibold text-xs text-foreground mb-3 flex items-center gap-1.5"><TrendingUp className="w-3.5 h-3.5 text-primary" /> Weekly Revenue</h3>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={weeklyData}>
              <defs><linearGradient id="rg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#f97316" stopOpacity={0.3} /><stop offset="95%" stopColor="#f97316" stopOpacity={0} /></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="day" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 11 }} />
              <Area type="monotone" dataKey="revenue" stroke="#f97316" strokeWidth={2} fill="url(#rg)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-card border border-border rounded-xl p-3">
          <h3 className="font-semibold text-xs text-foreground mb-3">Category Distribution</h3>
          <ResponsiveContainer width="100%" height={180}>
            <RechartsPie>
              <Pie data={categoryData} cx="50%" cy="50%" outerRadius={65} innerRadius={35} dataKey="value" label={({ name, value }) => `${name} (${value})`} labelLine={false}>
                {categoryData.map((_: any, i: number) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 11 }} />
            </RechartsPie>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Stock Quantity Alerts */}
      {lowStockProducts.length > 0 && (
        <div className="bg-warning/5 border border-warning/20 rounded-xl p-3">
          <h3 className="font-semibold text-xs text-foreground mb-2 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-warning" /> Low Stock Alert — {lowStockProducts.length} Products (≤10 units)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {lowStockProducts.map((p: Product) => (
              <div key={p.id} className="bg-card border border-border rounded-lg p-2 flex items-center gap-2">
                <img src={p.images?.[0] || p.image} alt={p.name} className="w-9 h-9 rounded object-contain bg-muted p-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-medium text-foreground truncate">{p.name}</p>
                  <p className="text-[9px] text-muted-foreground">{p.category}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-warning">{p.stockQuantity ?? 0}</span>
                  <p className="text-[8px] text-muted-foreground">units</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Orders */}
      <div className="bg-card border border-border rounded-xl p-3 overflow-x-auto">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-xs text-foreground">Recent Orders</h3>
          <button onClick={() => setActiveTab("orders")} className="text-[10px] text-primary font-medium hover:underline flex items-center gap-0.5">View All <ArrowUpRight className="w-3 h-3" /></button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs min-w-[450px]">
            <thead><tr className="border-b border-border text-left text-[10px] text-muted-foreground">
              <th className="pb-2 font-medium">Order</th><th className="pb-2 font-medium">Customer</th><th className="pb-2 font-medium">Total</th><th className="pb-2 font-medium">Status</th><th className="pb-2 font-medium">Date</th>
            </tr></thead>
            <tbody>
              {orders.slice(0, 5).map((order: Order) => (
                <tr key={order.id} className="border-b border-border/50 hover:bg-muted/50">
                  <td className="py-2 font-medium text-foreground">{order.id}</td>
                  <td className="py-2 text-muted-foreground">{order.customer}</td>
                  <td className="py-2 font-medium text-foreground">KSH {order.total.toLocaleString()}</td>
                  <td className="py-2"><StatusBadge status={order.status} /></td>
                  <td className="py-2 text-muted-foreground text-[10px]">{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inventory Health */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="bg-card border border-border rounded-xl p-3">
          <h3 className="font-semibold text-xs text-foreground mb-2 flex items-center gap-1.5"><Boxes className="w-3.5 h-3.5 text-primary" /> Inventory Health</h3>
          <div className="text-center py-2">
            <div className="relative inline-flex items-center justify-center">
              <svg className="w-16 h-16 -rotate-90">
                <circle cx="32" cy="32" r="26" stroke="hsl(var(--muted))" strokeWidth="5" fill="none" />
                <circle cx="32" cy="32" r="26" stroke={stockHealthPercent > 80 ? "#10b981" : stockHealthPercent > 50 ? "#f59e0b" : "#ef4444"} strokeWidth="5" fill="none"
                  strokeDasharray={`${stockHealthPercent * 1.63} 163`} strokeLinecap="round" />
              </svg>
              <span className="absolute text-sm font-bold text-foreground">{stockHealthPercent}%</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-1.5 text-center">
            <div className="bg-green-500/5 border border-green-500/10 rounded-lg p-1.5">
              <p className="text-sm font-bold text-green-600">{inStockProducts}</p>
              <p className="text-[9px] text-muted-foreground">In Stock</p>
            </div>
            <div className="bg-destructive/5 border border-destructive/10 rounded-lg p-1.5">
              <p className="text-sm font-bold text-destructive">{outOfStockProducts.length}</p>
              <p className="text-[9px] text-muted-foreground">Out</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-3">
          <h3 className="font-semibold text-xs text-foreground mb-2 flex items-center gap-1.5"><Star className="w-3.5 h-3.5 text-yellow-500" /> Top Products</h3>
          <div className="space-y-2">
            {[...products].sort((a: Product, b: Product) => b.rating - a.rating).slice(0, 4).map((p: Product, i: number) => (
              <div key={p.id} className="flex items-center gap-2">
                <span className="text-[9px] font-bold text-muted-foreground w-3">#{i + 1}</span>
                <img src={p.images?.[0] || p.image} alt={p.name} className="w-7 h-7 rounded object-contain bg-muted p-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-medium text-foreground truncate">{p.name}</p>
                  <div className="flex items-center gap-0.5">
                    <span className="text-yellow-500 text-[9px]">{"★".repeat(Math.round(p.rating))}</span>
                    <span className="text-[9px] text-muted-foreground">Qty: {p.stockQuantity ?? 0}</span>
                  </div>
                </div>
                <span className="text-[10px] font-semibold text-foreground">KSH {p.price.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ============ PRODUCTS TAB ============ */
const ProductsTab = ({ products, onEdit, onDelete, onAdd, showForm, editingProduct, onSave, onCancel, lowStockProducts }: any) => {
  const [formData, setFormData] = useState<Partial<Product>>({
    name: "", price: 0, category: "", description: "", subcategory: "",
    featured: false, deal: false, discount: undefined, originalPrice: undefined, inStock: true, stockQuantity: 100,
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [filterLowStock, setFilterLowStock] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startEdit = (p: Product | null) => {
    if (p) {
      setFormData({
        name: p.name, price: p.price, category: p.category, description: p.description || "",
        subcategory: p.subcategory || "", featured: p.featured, deal: p.deal,
        discount: p.discount, originalPrice: p.originalPrice, inStock: p.inStock,
        stockQuantity: p.stockQuantity ?? 100,
      });
      setImagePreviews(p.images && p.images.length > 0 ? p.images : p.image ? [p.image] : []);
    } else {
      setFormData({ name: "", price: 0, category: "", description: "", subcategory: "", featured: false, deal: false, inStock: true, stockQuantity: 100 });
      setImagePreviews([]);
    }
    setImageFiles([]);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (imagePreviews.length + files.length > 5) { toast.error("Maximum 5 images"); return; }
    setImageFiles(prev => [...prev, ...files]);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreviews(prev => [...prev, reader.result as string]);
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    const existingCount = editingProduct?.images?.length || (editingProduct?.image ? 1 : 0);
    if (index >= existingCount) setImageFiles(prev => prev.filter((_, i) => i !== (index - existingCount)));
  };

  const handleSave = async () => {
    if (!formData.name) { toast.error("Product name is required"); return; }
    if (!formData.price || formData.price <= 0) { toast.error("Valid price is required"); return; }
    if (!formData.category) { toast.error("Category is required"); return; }

    setUploading(true);
    let uploadedUrls: string[] = imagePreviews.filter(p => p.startsWith("http"));
    for (const file of imageFiles) {
      const fileName = `${Date.now()}-${file.name}`;
      const { data, error } = await supabase.storage.from("product-images").upload(fileName, file);
      if (error) { toast.error(`Upload failed: ${file.name}`); continue; }
      const { data: { publicUrl } } = supabase.storage.from("product-images").getPublicUrl(data.path);
      uploadedUrls.push(publicUrl);
    }
    onSave({ ...formData, image: uploadedUrls[0] || formData.image || "", images: uploadedUrls });
    setUploading(false);
    setImageFiles([]);
    setImagePreviews([]);
  };

  const categoryOptions = ["Air & Fuel Delivery", "Exterior & Accessories", "Headlights & Lighting", "Brakes & Rotors", "Engines & Components", "Electrical", "Interior", "Suspension", "Oils & Fluids", "Filters"];

  const displayProducts = useMemo(() => {
    let filtered = filterLowStock ? lowStockProducts : products;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      filtered = filtered.filter((p: Product) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
    }
    if (filterCategory) filtered = filtered.filter((p: Product) => p.category === filterCategory);
    return filtered;
  }, [products, lowStockProducts, filterLowStock, searchTerm, filterCategory]);

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search className="w-3 h-3 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search..."
              className="pl-7 pr-2 py-1.5 text-xs border border-border rounded-lg bg-background text-foreground w-36 md:w-44" />
          </div>
          <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}
            className="text-xs border border-border rounded-lg px-2 py-1.5 bg-background text-foreground">
            <option value="">All</option>
            {categoryOptions.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          {lowStockProducts.length > 0 && (
            <button onClick={() => setFilterLowStock(!filterLowStock)}
              className={`flex items-center gap-1 px-2 py-1.5 rounded-lg text-[10px] font-semibold ${filterLowStock ? "bg-warning text-warning-foreground" : "bg-warning/10 text-warning"}`}>
              <AlertCircle className="w-3 h-3" />
              {filterLowStock ? "Show All" : `${lowStockProducts.length} Low`}
            </button>
          )}
          <span className="text-[10px] text-muted-foreground">{displayProducts.length} products</span>
        </div>
        <button onClick={() => { onAdd(); startEdit(null); }} className="bg-primary text-primary-foreground px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 hover:opacity-90 shadow-sm">
          <Plus className="w-3 h-3" /> Add Product
        </button>
      </div>

      {showForm && (
        <div className="bg-card border border-border rounded-xl p-4 space-y-3">
          <h3 className="font-semibold text-sm text-foreground">{editingProduct ? "Edit Product" : "Add New Product"}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-medium text-muted-foreground mb-1 block">Product Name *</label>
              <input value={formData.name || ""} onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full border border-border rounded-lg px-3 py-2 text-xs bg-background text-foreground" placeholder="e.g. LED Headlight H7" />
            </div>
            <div>
              <label className="text-[10px] font-medium text-muted-foreground mb-1 block">Category *</label>
              <select value={formData.category || ""} onChange={e => setFormData({ ...formData, category: e.target.value })}
                className="w-full border border-border rounded-lg px-3 py-2 text-xs bg-background text-foreground">
                <option value="">Select</option>
                {categoryOptions.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-medium text-muted-foreground mb-1 block">Subcategory</label>
              <input value={formData.subcategory || ""} onChange={e => setFormData({ ...formData, subcategory: e.target.value })}
                className="w-full border border-border rounded-lg px-3 py-2 text-xs bg-background text-foreground" placeholder="e.g. Bulbs" />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-[10px] font-medium text-muted-foreground mb-1 block">Price (KSH) *</label>
                <input type="number" value={formData.price || ""} onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                  className="w-full border border-border rounded-lg px-2 py-2 text-xs bg-background text-foreground" />
              </div>
              <div>
                <label className="text-[10px] font-medium text-muted-foreground mb-1 block">Original Price</label>
                <input type="number" value={formData.originalPrice || ""} onChange={e => setFormData({ ...formData, originalPrice: Number(e.target.value) || undefined })}
                  className="w-full border border-border rounded-lg px-2 py-2 text-xs bg-background text-foreground" />
              </div>
              <div>
                <label className="text-[10px] font-medium text-muted-foreground mb-1 block">Stock Qty</label>
                <input type="number" value={formData.stockQuantity ?? ""} onChange={e => setFormData({ ...formData, stockQuantity: Number(e.target.value) })}
                  className="w-full border border-border rounded-lg px-2 py-2 text-xs bg-background text-foreground" />
              </div>
            </div>
          </div>
          <div>
            <label className="text-[10px] font-medium text-muted-foreground mb-1 block">Description</label>
            <textarea value={formData.description || ""} onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="w-full border border-border rounded-lg px-3 py-2 text-xs bg-background text-foreground" rows={2} placeholder="Product description..." />
          </div>
          <div className="flex flex-wrap gap-3 items-center">
            <div>
              <label className="text-[10px] font-medium text-muted-foreground mb-1 block">Discount %</label>
              <input type="number" value={formData.discount || ""} onChange={e => setFormData({ ...formData, discount: Number(e.target.value) || undefined })}
                className="w-20 border border-border rounded-lg px-2 py-2 text-xs bg-background text-foreground" />
            </div>
            <label className="flex items-center gap-1.5 text-xs cursor-pointer text-foreground mt-4">
              <input type="checkbox" checked={formData.featured || false} onChange={e => setFormData({ ...formData, featured: e.target.checked })} className="rounded border-border" /> Featured
            </label>
            <label className="flex items-center gap-1.5 text-xs cursor-pointer text-foreground mt-4">
              <input type="checkbox" checked={formData.deal || false} onChange={e => setFormData({ ...formData, deal: e.target.checked })} className="rounded border-border" /> Deal
            </label>
            <label className="flex items-center gap-1.5 text-xs cursor-pointer text-foreground mt-4">
              <input type="checkbox" checked={formData.inStock !== false} onChange={e => setFormData({ ...formData, inStock: e.target.checked })} className="rounded border-border" /> In Stock
            </label>
          </div>
          <div>
            <label className="text-[10px] font-medium text-muted-foreground mb-1 flex items-center gap-1"><Image className="w-3 h-3" /> Images (up to 5)</label>
            <div className="flex flex-wrap gap-2">
              {imagePreviews.map((preview, i) => (
                <div key={i} className="relative w-16 h-16 border border-border rounded-lg overflow-hidden bg-muted">
                  <img src={preview} alt="" className="w-full h-full object-contain p-0.5" />
                  <button onClick={() => removeImage(i)} className="absolute top-0 right-0 bg-destructive text-destructive-foreground rounded-full p-0.5"><X className="w-2.5 h-2.5" /></button>
                </div>
              ))}
              {imagePreviews.length < 5 && (
                <button onClick={() => fileInputRef.current?.click()} className="w-16 h-16 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center text-muted-foreground hover:border-primary hover:text-primary">
                  <Upload className="w-3.5 h-3.5" /><span className="text-[8px]">Upload</span>
                </button>
              )}
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleImageSelect} className="hidden" />
          </div>
          <div className="flex gap-2">
            <button onClick={handleSave} disabled={uploading} className="bg-primary text-primary-foreground px-5 py-2 rounded-lg text-xs font-semibold disabled:opacity-50">
              {uploading ? "Uploading..." : editingProduct ? "Update" : "Add Product"}
            </button>
            <button onClick={onCancel} className="border border-border px-5 py-2 rounded-lg text-xs hover:bg-muted text-foreground">Cancel</button>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-card border border-border rounded-xl overflow-x-auto">
        <table className="w-full text-xs min-w-[650px]">
          <thead><tr className="border-b border-border bg-muted/50 text-left text-[10px] text-muted-foreground">
            <th className="p-2.5 font-medium">Product</th><th className="p-2.5 font-medium">Category</th><th className="p-2.5 font-medium">Price</th><th className="p-2.5 font-medium">Stock</th><th className="p-2.5 font-medium">Qty</th><th className="p-2.5 font-medium">Tags</th><th className="p-2.5 font-medium">Actions</th>
          </tr></thead>
          <tbody>
            {displayProducts.map((p: Product) => {
              const qty = p.stockQuantity ?? 0;
              const isLow = qty <= 10 && p.inStock;
              return (
                <tr key={p.id} onClick={() => { onEdit(p); startEdit(p); }} className={`border-b border-border/50 hover:bg-muted/50 cursor-pointer ${isLow ? "bg-warning/5" : ""}`}>
                  <td className="p-2.5 flex items-center gap-2">
                    <img src={p.images?.[0] || p.image} alt={p.name} className="w-8 h-8 object-contain rounded bg-muted p-0.5" />
                    <div className="min-w-0">
                      <span className="font-medium text-foreground text-[10px] line-clamp-1">{p.name}</span>
                      <span className="text-[9px] text-muted-foreground block">{p.subcategory || "—"}</span>
                    </div>
                  </td>
                  <td className="p-2.5 text-[10px] text-muted-foreground">{p.category}</td>
                  <td className="p-2.5">
                    <span className="text-[10px] font-semibold text-foreground">KSH {p.price.toLocaleString()}</span>
                    {p.originalPrice && <span className="text-[9px] text-muted-foreground line-through block">KSH {p.originalPrice.toLocaleString()}</span>}
                  </td>
                  <td className="p-2.5">
                    <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${p.inStock ? "bg-green-500/10 text-green-500" : "bg-destructive/10 text-destructive"}`}>{p.inStock ? "In Stock" : "Out"}</span>
                  </td>
                  <td className="p-2.5">
                    <span className={`text-[10px] font-bold ${isLow ? "text-warning" : qty === 0 ? "text-destructive" : "text-foreground"}`}>{qty}</span>
                  </td>
                  <td className="p-2.5">
                    <div className="flex gap-0.5 flex-wrap">
                      {p.featured && <span className="text-[8px] font-semibold px-1 py-0.5 rounded bg-primary/10 text-primary">Featured</span>}
                      {p.deal && <span className="text-[8px] font-semibold px-1 py-0.5 rounded bg-warning/10 text-warning">Deal</span>}
                      {p.discount && <span className="text-[8px] font-semibold px-1 py-0.5 rounded bg-green-500/10 text-green-500">-{p.discount}%</span>}
                    </div>
                  </td>
                  <td className="p-2.5 flex gap-1">
                    <button onClick={() => { onEdit(p); startEdit(p); }} className="p-1 border border-border rounded hover:bg-muted" title="Edit"><Edit className="w-3 h-3" /></button>
                    <button onClick={() => onDelete(p.id)} className="p-1 border border-border rounded hover:bg-destructive/10 text-destructive" title="Delete"><Trash2 className="w-3 h-3" /></button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {displayProducts.length === 0 && <div className="p-6 text-center text-muted-foreground text-xs">No products match your filters</div>}
      </div>
    </div>
  );
};

/* ============ ORDERS TAB ============ */
const OrdersTab = ({ orders, onUpdateStatus }: any) => {
  const [filterStatus, setFilterStatus] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingOrder, setEditingOrder] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let result = orders;
    if (filterStatus) result = result.filter((o: Order) => o.status === filterStatus);
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      result = result.filter((o: Order) => o.id.toLowerCase().includes(q) || o.customer.toLowerCase().includes(q) || o.email.toLowerCase().includes(q));
    }
    return result;
  }, [orders, filterStatus, searchTerm]);

  const totalRevenue = filtered.reduce((s: number, o: Order) => s + o.total, 0);

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 flex-wrap">
        <div className="relative">
          <Search className="w-3 h-3 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search orders..."
            className="pl-7 pr-2 py-1.5 text-xs border border-border rounded-lg bg-background text-foreground w-40" />
        </div>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          className="text-xs border border-border rounded-lg px-2 py-1.5 bg-background text-foreground">
          <option value="">All Status</option>
          <option value="pending">Pending</option><option value="processing">Processing</option>
          <option value="shipped">Shipped</option><option value="delivered">Delivered</option><option value="cancelled">Cancelled</option>
        </select>
        <span className="text-[10px] text-muted-foreground">{filtered.length} orders • KSH {totalRevenue.toLocaleString()}</span>
      </div>

      {/* Status summary */}
      <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
        {[
          { label: "All", count: orders.length, color: "bg-muted", status: "" },
          { label: "Pending", count: orders.filter((o: Order) => o.status === "pending").length, color: "bg-warning/10", status: "pending" },
          { label: "Processing", count: orders.filter((o: Order) => o.status === "processing").length, color: "bg-blue-500/10", status: "processing" },
          { label: "Delivered", count: orders.filter((o: Order) => o.status === "delivered").length, color: "bg-green-500/10", status: "delivered" },
          { label: "Cancelled", count: orders.filter((o: Order) => o.status === "cancelled").length, color: "bg-destructive/10", status: "cancelled" },
        ].map(s => (
          <button key={s.label} onClick={() => setFilterStatus(s.status)}
            className={`${s.color} rounded-lg p-2 text-center border border-border hover:shadow-sm ${filterStatus === s.status ? "ring-2 ring-primary/30" : ""}`}>
            <p className="text-base font-bold text-foreground">{s.count}</p>
            <p className="text-[9px] text-muted-foreground">{s.label}</p>
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-card border border-border rounded-xl overflow-x-auto">
        <table className="w-full text-xs min-w-[550px]">
          <thead><tr className="border-b border-border bg-muted/50 text-left text-[10px] text-muted-foreground">
            <th className="p-2.5 font-medium">Order</th><th className="p-2.5 font-medium">Customer</th><th className="p-2.5 font-medium">Items</th><th className="p-2.5 font-medium">Total</th><th className="p-2.5 font-medium">Status</th><th className="p-2.5 font-medium">Date</th><th className="p-2.5 font-medium">Actions</th>
          </tr></thead>
          <tbody>
            {filtered.map((order: Order) => (
              <tr key={order.id} className="border-b border-border/50 hover:bg-muted/50">
                <td className="p-2.5 font-medium text-foreground">{order.id}</td>
                <td className="p-2.5">
                  <p className="text-foreground font-medium">{order.customer}</p>
                  <p className="text-[9px] text-muted-foreground">{order.email}</p>
                </td>
                <td className="p-2.5">
                  {order.items.slice(0, 2).map((item: any, i: number) => (
                    <p key={i} className="text-[9px] text-muted-foreground truncate max-w-[150px]">{item.product.name} × {item.quantity}</p>
                  ))}
                  {order.items.length > 2 && <p className="text-[9px] text-primary">+{order.items.length - 2} more</p>}
                </td>
                <td className="p-2.5 font-medium text-foreground">KSH {order.total.toLocaleString()}</td>
                <td className="p-2.5"><StatusBadge status={order.status} /></td>
                <td className="p-2.5 text-muted-foreground text-[10px]">{order.date}</td>
                <td className="p-2.5 flex items-center gap-1">
                  <select value={order.status}
                    onChange={e => { onUpdateStatus(order.id, e.target.value); toast.success(`Order ${order.id} → ${e.target.value}`); }}
                    className="border border-border rounded px-1.5 py-1 text-[10px] bg-background text-foreground">
                    <option value="pending">Pending</option><option value="processing">Processing</option>
                    <option value="shipped">Shipped</option><option value="delivered">Delivered</option><option value="cancelled">Cancelled</option>
                  </select>
                  <button onClick={() => { if (confirm(`Delete order ${order.id}?`)) { onDeleteOrder(order.id); toast.success("Order deleted"); } }}
                    className="p-1 border border-border rounded hover:bg-destructive/10 text-destructive" title="Delete">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="p-6 text-center text-muted-foreground text-xs">No orders found</div>}
      </div>
    </div>
  );
};

/* ============ CUSTOMERS TAB ============ */
const CustomersTab = ({ orders }: any) => {
  const [searchTerm, setSearchTerm] = useState("");

  const customers = useMemo(() => {
    const map: Record<string, { name: string; email: string; orders: number; total: number; lastOrder: string; items: number }> = {};
    orders.forEach((o: Order) => {
      if (!map[o.email]) map[o.email] = { name: o.customer, email: o.email, orders: 0, total: 0, lastOrder: o.date, items: 0 };
      map[o.email].orders++;
      map[o.email].total += o.total;
      map[o.email].items += o.items.reduce((s: number, i: any) => s + i.quantity, 0);
      if (o.date > map[o.email].lastOrder) map[o.email].lastOrder = o.date;
    });
    return Object.values(map).sort((a, b) => b.total - a.total);
  }, [orders]);

  const filtered = useMemo(() => {
    if (!searchTerm) return customers;
    const q = searchTerm.toLowerCase();
    return customers.filter(c => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q));
  }, [customers, searchTerm]);

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
        <StatCard title="Total Customers" value={customers.length.toString()} icon={Users} color="bg-purple-500" />
        <StatCard title="Avg. LTV" value={`KSH ${customers.length ? Math.round(customers.reduce((s, c) => s + c.total, 0) / customers.length).toLocaleString() : 0}`} icon={DollarSign} color="bg-green-500" />
        <StatCard title="Repeat Customers" value={customers.filter(c => c.orders > 1).length.toString()} icon={RefreshCw} color="bg-blue-500" />
      </div>

      <div className="relative w-fit">
        <Search className="w-3 h-3 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search customers..."
          className="pl-7 pr-2 py-1.5 text-xs border border-border rounded-lg bg-background text-foreground w-44" />
      </div>

      <div className="bg-card border border-border rounded-xl overflow-x-auto">
        <table className="w-full text-xs min-w-[450px]">
          <thead><tr className="border-b border-border bg-muted/50 text-left text-[10px] text-muted-foreground">
            <th className="p-2.5 font-medium">Customer</th><th className="p-2.5 font-medium">Orders</th><th className="p-2.5 font-medium">Items</th><th className="p-2.5 font-medium">Total Spent</th><th className="p-2.5 font-medium">Last Order</th>
          </tr></thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.email} className="border-b border-border/50 hover:bg-muted/50">
                <td className="p-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-[10px]">{c.name.charAt(0)}</div>
                    <div>
                      <p className="font-medium text-foreground">{c.name}</p>
                      <p className="text-[9px] text-muted-foreground">{c.email}</p>
                    </div>
                  </div>
                </td>
                <td className="p-2.5 font-medium text-foreground">{c.orders}</td>
                <td className="p-2.5 text-muted-foreground">{c.items}</td>
                <td className="p-2.5 font-medium text-foreground">KSH {c.total.toLocaleString()}</td>
                <td className="p-2.5 text-muted-foreground text-[10px]">{c.lastOrder}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="p-6 text-center text-muted-foreground text-xs">No customers found</div>}
      </div>
    </div>
  );
};

/* ============ REPORTS TAB ============ */
const ReportsTab = ({ orders, products }: { orders: Order[]; products: Product[] }) => {
  const [reportDate, setReportDate] = useState(new Date().toISOString().split("T")[0]);
  const [reportNotes, setReportNotes] = useState("");
  const [reportType, setReportType] = useState<"full" | "sales" | "inventory" | "customers">("full");

  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
  const avgOrderValue = orders.length ? totalRevenue / orders.length : 0;
  const totalInventoryValue = products.reduce((s, p) => s + p.price * (p.stockQuantity ?? 0), 0);
  const lowStockProducts = products.filter(p => (p.stockQuantity ?? 100) <= 10 && p.inStock);
  const outOfStockProducts = products.filter(p => !p.inStock);
  const estimatedCost = totalRevenue * 0.6;
  const grossProfit = totalRevenue - estimatedCost;
  const profitMargin = totalRevenue ? Math.round((grossProfit / totalRevenue) * 100) : 0;

  const generatePDF = () => {
    const doc = new jsPDF();
    const titles: Record<string, string> = {
      full: "Complete Business Report",
      sales: "Sales Report",
      inventory: "Inventory Report",
      customers: "Customer Report",
    };

    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("DMT Auto Parts", 14, 20);
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(`${titles[reportType]} — ${reportDate}`, 14, 28);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 34);

    let y = 44;

    if (reportType === "full" || reportType === "sales") {
      doc.setFontSize(13);
      doc.setFont("helvetica", "bold");
      doc.text("Financial Summary", 14, y);
      y += 8;
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      const financials = [
        `Total Revenue: KSH ${totalRevenue.toLocaleString()}`,
        `Cost of Goods (est): KSH ${estimatedCost.toLocaleString()}`,
        `Gross Profit: KSH ${grossProfit.toLocaleString()}`,
        `Profit Margin: ${profitMargin}%`,
        `Total Orders: ${orders.length}`,
        `Avg Order Value: KSH ${avgOrderValue.toFixed(0)}`,
      ];
      financials.forEach(line => { doc.text(line, 14, y); y += 5; });
      y += 5;

      doc.setFontSize(13);
      doc.setFont("helvetica", "bold");
      doc.text("Order Details", 14, y);
      y += 4;

      autoTable(doc, {
        startY: y,
        head: [["Order ID", "Customer", "Email", "Items", "Total (KSH)", "Status", "Date"]],
        body: orders.map(o => [
          o.id, o.customer, o.email,
          o.items.map(i => `${i.product.name} x${i.quantity}`).join("; "),
          o.total.toLocaleString(), o.status, o.date
        ]),
        styles: { fontSize: 7 },
        headStyles: { fillColor: [41, 128, 185] },
      });
    }

    if (reportType === "full" || reportType === "inventory") {
      doc.addPage();
      doc.setFontSize(13);
      doc.setFont("helvetica", "bold");
      doc.text("Product Inventory", 14, 20);

      autoTable(doc, {
        startY: 26,
        head: [["Product", "Category", "Price (KSH)", "Stock Qty", "Status", "Rating"]],
        body: products.map(p => [p.name, p.category, p.price.toLocaleString(), (p.stockQuantity ?? 0).toString(), p.inStock ? "In Stock" : "Out", `${p.rating}/5`]),
        styles: { fontSize: 7 },
        headStyles: { fillColor: [41, 128, 185] },
      });

      if (lowStockProducts.length > 0) {
        const finalY = (doc as any).lastAutoTable?.finalY || 100;
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.text("⚠ Low Stock Alert", 14, finalY + 10);
        autoTable(doc, {
          startY: finalY + 14,
          head: [["Product", "Category", "Price", "Qty Remaining"]],
          body: lowStockProducts.map(p => [p.name, p.category, `KSH ${p.price.toLocaleString()}`, (p.stockQuantity ?? 0).toString()]),
          styles: { fontSize: 8 },
          headStyles: { fillColor: [230, 126, 34] },
        });
      }
    }

    if (reportType === "full" || reportType === "customers") {
      doc.addPage();
      doc.setFontSize(13);
      doc.setFont("helvetica", "bold");
      doc.text("Customer Summary", 14, 20);

      const custMap: Record<string, { name: string; email: string; orders: number; total: number }> = {};
      orders.forEach(o => {
        if (!custMap[o.email]) custMap[o.email] = { name: o.customer, email: o.email, orders: 0, total: 0 };
        custMap[o.email].orders++;
        custMap[o.email].total += o.total;
      });

      autoTable(doc, {
        startY: 26,
        head: [["Customer", "Email", "Orders", "Total Spent (KSH)"]],
        body: Object.values(custMap).map(c => [c.name, c.email, c.orders.toString(), c.total.toLocaleString()]),
        styles: { fontSize: 8 },
        headStyles: { fillColor: [142, 68, 173] },
      });
    }

    if (reportNotes) {
      doc.addPage();
      doc.setFontSize(13);
      doc.setFont("helvetica", "bold");
      doc.text("Admin Notes", 14, 20);
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      const lines = doc.splitTextToSize(reportNotes, 180);
      doc.text(lines, 14, 28);
    }

    const suffix = reportType === "full" ? "Complete" : reportType.charAt(0).toUpperCase() + reportType.slice(1);
    doc.save(`DMT-${suffix}-Report-${reportDate}.pdf`);
    toast.success(`${suffix} report downloaded!`);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5">
        <StatCard title="Revenue" value={`KSH ${totalRevenue.toLocaleString()}`} icon={DollarSign} color="bg-green-500" />
        <StatCard title="Gross Profit" value={`KSH ${grossProfit.toLocaleString()}`} icon={TrendingUp} color="bg-emerald-500" />
        <StatCard title="Margin" value={`${profitMargin}%`} icon={Percent} color="bg-cyan-500" />
        <StatCard title="Avg. Order" value={`KSH ${avgOrderValue.toFixed(0)}`} icon={Target} color="bg-blue-500" />
        <StatCard title="Inventory Value" value={`KSH ${totalInventoryValue.toLocaleString()}`} icon={Boxes} color="bg-purple-500" />
        <StatCard title="Low Stock" value={lowStockProducts.length.toString()} icon={AlertCircle} color="bg-amber-500" />
      </div>

      {/* Products Sold */}
      <div className="bg-card border border-border rounded-xl p-3">
        <h3 className="font-semibold text-xs text-foreground mb-2 flex items-center gap-1.5">
          <ShoppingBag className="w-3.5 h-3.5 text-primary" /> Items Sold
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs min-w-[400px]">
            <thead><tr className="border-b border-border text-left text-[10px] text-muted-foreground">
              <th className="pb-2 font-medium">Product</th><th className="pb-2 font-medium">Qty</th><th className="pb-2 font-medium">Revenue</th><th className="pb-2 font-medium">Order</th><th className="pb-2 font-medium">Customer</th><th className="pb-2 font-medium">Date</th>
            </tr></thead>
            <tbody>
              {orders.flatMap((o: Order) => o.items.map((item: any, i: number) => (
                <tr key={`${o.id}-${i}`} className="border-b border-border/50 hover:bg-muted/50">
                  <td className="py-1.5 flex items-center gap-1.5">
                    <img src={item.product.images?.[0] || item.product.image} alt="" className="w-6 h-6 rounded bg-muted object-contain p-0.5" />
                    <span className="text-[10px] text-foreground truncate max-w-[150px]">{item.product.name}</span>
                  </td>
                  <td className="py-1.5 font-medium text-foreground">{item.quantity}</td>
                  <td className="py-1.5 font-medium text-foreground">KSH {(item.product.price * item.quantity).toLocaleString()}</td>
                  <td className="py-1.5 text-muted-foreground">{o.id}</td>
                  <td className="py-1.5 text-muted-foreground">{o.customer}</td>
                  <td className="py-1.5 text-muted-foreground text-[9px]">{o.date}</td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Generate PDF */}
      <div className="bg-card border border-border rounded-xl p-4 space-y-3">
        <h3 className="font-semibold text-sm text-foreground flex items-center gap-1.5"><FileDown className="w-4 h-4 text-primary" /> Generate Report</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          <div>
            <label className="text-[10px] font-medium text-muted-foreground mb-1 block">Report Date</label>
            <input type="date" value={reportDate} onChange={e => setReportDate(e.target.value)}
              className="w-full border border-border rounded-lg px-3 py-2 text-xs bg-background text-foreground" />
          </div>
          <div>
            <label className="text-[10px] font-medium text-muted-foreground mb-1 block">Report Type</label>
            <select value={reportType} onChange={e => setReportType(e.target.value as any)}
              className="w-full border border-border rounded-lg px-3 py-2 text-xs bg-background text-foreground">
              <option value="full">Full Report</option>
              <option value="sales">Sales Only</option>
              <option value="inventory">Inventory Only</option>
              <option value="customers">Customers Only</option>
            </select>
          </div>
        </div>
        <div>
          <label className="text-[10px] font-medium text-muted-foreground mb-1 block">Notes</label>
          <textarea value={reportNotes} onChange={e => setReportNotes(e.target.value)} placeholder="Admin notes..."
            className="w-full border border-border rounded-lg px-3 py-2 text-xs bg-background text-foreground" rows={2} />
        </div>
        <button onClick={generatePDF} className="bg-primary text-primary-foreground px-5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 hover:opacity-90 shadow-sm">
          <FileDown className="w-3.5 h-3.5" /> Download {reportType === "full" ? "Complete" : reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report
        </button>
      </div>

      {/* Business Progress */}
      <div className="bg-card border border-border rounded-xl p-3">
        <h3 className="font-semibold text-xs text-foreground mb-3 flex items-center gap-1.5"><Activity className="w-3.5 h-3.5 text-primary" /> Business Health</h3>
        <div className="space-y-2.5">
          {[
            { label: "Product Catalog", value: products.length, max: 100, desc: `${products.length}/100`, color: "bg-primary" },
            { label: "Order Fulfillment", value: orders.filter((o: Order) => o.status === "delivered").length, max: orders.length || 1, desc: `${orders.filter((o: Order) => o.status === "delivered").length}/${orders.length}`, color: "bg-green-500" },
            { label: "Stock Health", value: products.filter(p => p.inStock).length, max: products.length || 1, desc: `${products.filter(p => p.inStock).length}/${products.length}`, color: "bg-blue-500" },
            { label: "Profit Margin", value: profitMargin, max: 100, desc: `${profitMargin}%`, color: "bg-emerald-500" },
          ].map(item => (
            <div key={item.label}>
              <div className="flex justify-between text-[10px] mb-0.5">
                <span className="font-medium text-foreground">{item.label}</span>
                <span className="text-muted-foreground">{item.desc}</span>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div className={`h-full ${item.color} rounded-full transition-all duration-700`} style={{ width: `${Math.min((item.value / item.max) * 100, 100)}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ============ SETTINGS TAB ============ */
const SettingsTab = ({ onSignOut }: { onSignOut: () => void }) => {
  const { theme, toggleTheme } = useTheme();
  return (
    <div className="space-y-3">
      <div className="bg-card border border-border rounded-xl p-4 space-y-3">
        <h3 className="font-semibold text-sm text-foreground">Store Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div><label className="text-[10px] text-muted-foreground block mb-1">Store Name</label><input defaultValue="DMT Auto Parts" className="w-full border border-border rounded-lg px-3 py-2 text-xs bg-background text-foreground" /></div>
          <div><label className="text-[10px] text-muted-foreground block mb-1">Contact Email</label><input defaultValue="support@dmtautoparts.com" className="w-full border border-border rounded-lg px-3 py-2 text-xs bg-background text-foreground" /></div>
          <div><label className="text-[10px] text-muted-foreground block mb-1">Phone</label><input defaultValue="+254 700 000 000" className="w-full border border-border rounded-lg px-3 py-2 text-xs bg-background text-foreground" /></div>
          <div><label className="text-[10px] text-muted-foreground block mb-1">Currency</label><input defaultValue="KSH" className="w-full border border-border rounded-lg px-3 py-2 text-xs bg-background text-foreground" disabled /></div>
        </div>
        <button className="bg-primary text-primary-foreground px-5 py-2 rounded-lg text-xs font-semibold hover:opacity-90">Save Settings</button>
      </div>
      <div className="bg-card border border-border rounded-xl p-4">
        <h3 className="font-semibold text-sm text-foreground mb-3">Appearance</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-foreground">Dark Mode</p>
            <p className="text-[10px] text-muted-foreground">Switch themes</p>
          </div>
          <button onClick={toggleTheme} className={`relative w-10 h-5 rounded-full transition-colors ${theme === "dark" ? "bg-primary" : "bg-muted"}`}>
            <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${theme === "dark" ? "translate-x-5" : "translate-x-0.5"}`} />
          </button>
        </div>
      </div>
      <div className="bg-card border border-border rounded-xl p-4">
        <h3 className="font-semibold text-sm text-foreground mb-3">Account</h3>
        <button onClick={onSignOut} className="bg-destructive text-destructive-foreground px-5 py-2 rounded-lg text-xs font-semibold hover:opacity-90">Sign Out</button>
      </div>
    </div>
  );
};

export default AdminPage;
