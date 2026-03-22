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
  ArrowDownRight, Percent, Target, Zap, Bell, Filter, Download, TrendingDown,
  PieChart, ShoppingBag, Truck, CreditCard, Star, Hash
} from "lucide-react";
import { Product, Order } from "@/data/store";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/logo.png";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart as RechartsPie, Pie, Cell, LineChart, Line, Legend, AreaChart, Area
} from "recharts";

type Tab = "dashboard" | "products" | "orders" | "customers" | "reports" | "settings";

const CHART_COLORS = ["#f97316", "#3b82f6", "#10b981", "#8b5cf6", "#ef4444", "#06b6d4", "#f59e0b", "#ec4899"];

const AdminPage = () => {
  const { products, orders, addProduct, updateProduct, deleteProduct, updateOrderStatus } = useStore();
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

  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
  const totalOrders = orders.length;
  const totalProducts = products.length;
  const pendingOrders = orders.filter(o => o.status === "pending").length;
  const deliveredOrders = orders.filter(o => o.status === "delivered").length;
  const inStockProducts = products.filter(p => p.inStock).length;
  const lowStockProducts = products.filter(p => p.inStock && p.reviews <= 5);
  const outOfStockProducts = products.filter(p => !p.inStock);

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
      addProduct({ ...formData, id: Date.now().toString(), rating: 0, reviews: 0, inStock: true } as Product);
      toast.success("Product added");
    }
    setShowProductForm(false);
    setEditingProduct(null);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className={`bg-card border-r border-border ${sidebarOpen ? "w-60" : "w-16"} transition-all duration-200 flex flex-col min-h-screen hidden md:flex`}>
        <div className="p-4 border-b border-border">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="DMT" className="h-8" />
            {sidebarOpen && <span className="font-bold text-sm text-foreground">Admin Panel</span>}
          </Link>
        </div>
        <nav className="flex-1 py-2">
          {sidebarItems.map((item) => (
            <button key={item.tab} onClick={() => setActiveTab(item.tab)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors relative ${activeTab === item.tab ? "bg-primary/10 text-primary font-semibold border-r-2 border-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"}`}>
              <item.icon className="w-4 h-4 flex-shrink-0" />
              {sidebarOpen && <span>{item.label}</span>}
              {item.badge && sidebarOpen && (
                <span className="ml-auto bg-destructive text-destructive-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">{item.badge}</span>
              )}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-border space-y-1">
          <button onClick={toggleTheme} className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors w-full px-1 py-1.5 rounded hover:bg-muted/50">
            {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            {sidebarOpen && (theme === "light" ? "Dark Mode" : "Light Mode")}
          </button>
          <Link to="/" className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors px-1 py-1.5 rounded hover:bg-muted/50">
            <Eye className="w-4 h-4" />
            {sidebarOpen && "View Store"}
          </Link>
          <button onClick={signOut} className="flex items-center gap-3 text-sm text-destructive hover:text-destructive/80 transition-colors w-full px-1 py-1.5 rounded hover:bg-destructive/5">
            <LogOut className="w-4 h-4" />
            {sidebarOpen && "Sign Out"}
          </button>
        </div>
      </aside>

      {/* Mobile tab bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 flex">
        {sidebarItems.map((item) => (
          <button key={item.tab} onClick={() => setActiveTab(item.tab)}
            className={`flex-1 flex flex-col items-center py-2 text-[10px] relative ${activeTab === item.tab ? "text-primary" : "text-muted-foreground"}`}>
            <item.icon className="w-4 h-4 mb-0.5" />
            {item.label}
            {item.badge && <span className="absolute top-1 right-1/4 bg-destructive text-destructive-foreground text-[8px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">{item.badge}</span>}
          </button>
        ))}
      </div>

      <main className="flex-1 overflow-auto pb-16 md:pb-0">
        <header className="bg-card border-b border-border px-4 md:px-6 py-3 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h1 className="text-lg font-bold text-foreground capitalize">{activeTab}</h1>
            <p className="text-xs text-muted-foreground">Welcome back, Admin</p>
          </div>
          <div className="flex items-center gap-2">
            {(lowStockProducts.length > 0 || pendingOrders > 0) && (
              <div className="flex items-center gap-1.5">
                {lowStockProducts.length > 0 && (
                  <button onClick={() => setActiveTab("products")} className="flex items-center gap-1 bg-warning/10 text-warning px-2.5 py-1.5 rounded-lg text-[10px] font-semibold">
                    <PackageX className="w-3 h-3" /> {lowStockProducts.length} Low Stock
                  </button>
                )}
                {pendingOrders > 0 && (
                  <button onClick={() => setActiveTab("orders")} className="flex items-center gap-1 bg-blue-500/10 text-blue-500 px-2.5 py-1.5 rounded-lg text-[10px] font-semibold">
                    <Clock className="w-3 h-3" /> {pendingOrders} Pending
                  </button>
                )}
              </div>
            )}
            <span className="text-xs text-muted-foreground hidden md:inline">{user?.email}</span>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="hidden md:block p-2 border border-border rounded-lg hover:bg-muted transition-colors">
              <ChevronDown className={`w-4 h-4 transition-transform ${sidebarOpen ? "rotate-90" : "-rotate-90"}`} />
            </button>
          </div>
        </header>

        <div className="p-4 md:p-6">
          {activeTab === "dashboard" && <DashboardTab totalRevenue={totalRevenue} totalOrders={totalOrders} totalProducts={totalProducts} pendingOrders={pendingOrders} deliveredOrders={deliveredOrders} inStockProducts={inStockProducts} orders={orders} products={products} lowStockProducts={lowStockProducts} outOfStockProducts={outOfStockProducts} setActiveTab={setActiveTab} />}
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
  <div className="bg-card border border-border rounded-xl p-4 hover:shadow-md transition-all hover:border-primary/20 group">
    <div className="flex items-center justify-between mb-2">
      <span className="text-xs text-muted-foreground font-medium">{title}</span>
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${color || "bg-primary/10"} group-hover:scale-110 transition-transform`}>
        <Icon className={`w-4 h-4 ${color ? "text-white" : "text-primary"}`} />
      </div>
    </div>
    <p className="text-xl md:text-2xl font-bold text-foreground">{value}</p>
    {trend && (
      <p className={`text-[10px] mt-1 flex items-center gap-1 ${trendDown ? "text-destructive" : "text-green-600"}`}>
        {trendDown ? <ArrowDownRight className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />} {trend}
      </p>
    )}
    {subtitle && <p className="text-[10px] text-muted-foreground mt-0.5">{subtitle}</p>}
  </div>
);

/* ============ QUICK ACTION ============ */
const QuickAction = ({ icon: Icon, label, onClick, color }: { icon: typeof Plus; label: string; onClick: () => void; color: string }) => (
  <button onClick={onClick} className="flex flex-col items-center gap-2 p-4 bg-card border border-border rounded-xl hover:shadow-md hover:border-primary/20 transition-all group">
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color} group-hover:scale-110 transition-transform`}>
      <Icon className="w-5 h-5 text-white" />
    </div>
    <span className="text-[11px] font-medium text-foreground">{label}</span>
  </button>
);

/* ============ DASHBOARD ============ */
const DashboardTab = ({ totalRevenue, totalOrders, totalProducts, pendingOrders, deliveredOrders, inStockProducts, orders, products, lowStockProducts, outOfStockProducts, setActiveTab }: any) => {
  const avgOrderValue = totalOrders ? totalRevenue / totalOrders : 0;
  const fulfillmentRate = totalOrders ? Math.round((deliveredOrders / totalOrders) * 100) : 0;
  const stockHealthPercent = totalProducts ? Math.round((inStockProducts / totalProducts) * 100) : 0;

  // Category data for pie chart
  const categoryData = useMemo(() => {
    const cats: Record<string, number> = {};
    products.forEach((p: Product) => { cats[p.category] = (cats[p.category] || 0) + 1; });
    return Object.entries(cats).map(([name, value]) => ({ name: name.length > 15 ? name.slice(0, 15) + "…" : name, value, fullName: name }));
  }, [products]);

  // Revenue by category
  const revenueByCat = useMemo(() => {
    const cats: Record<string, number> = {};
    orders.forEach((o: Order) => {
      o.items.forEach(item => {
        const cat = item.product.category;
        cats[cat] = (cats[cat] || 0) + item.product.price * item.quantity;
      });
    });
    return Object.entries(cats).map(([name, revenue]) => ({ name: name.length > 12 ? name.slice(0, 12) + "…" : name, revenue: Math.round(revenue) }));
  }, [orders]);

  // Simulated weekly revenue data
  const weeklyData = useMemo(() => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    return days.map(day => ({ day, revenue: Math.round(totalRevenue / 7 * (0.6 + Math.random() * 0.8)), orders: Math.max(1, Math.round(totalOrders / 7 * (0.5 + Math.random()))) }));
  }, [totalRevenue, totalOrders]);

  // Price range distribution
  const priceRanges = useMemo(() => {
    const ranges = [
      { range: "0-500", min: 0, max: 500, count: 0 },
      { range: "500-2K", min: 500, max: 2000, count: 0 },
      { range: "2K-5K", min: 2000, max: 5000, count: 0 },
      { range: "5K-10K", min: 5000, max: 10000, count: 0 },
      { range: "10K+", min: 10000, max: Infinity, count: 0 },
    ];
    products.forEach((p: Product) => {
      const r = ranges.find(r => p.price >= r.min && p.price < r.max);
      if (r) r.count++;
    });
    return ranges;
  }, [products]);

  return (
    <div className="space-y-5">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-3">
        <StatCard title="Total Revenue" value={`KSH ${totalRevenue.toLocaleString()}`} icon={DollarSign} trend="12% from last month" color="bg-green-500" />
        <StatCard title="Total Orders" value={totalOrders.toString()} icon={ShoppingCart} trend="8% from last month" color="bg-blue-500" />
        <StatCard title="Products" value={totalProducts.toString()} icon={Package} subtitle={`${inStockProducts} in stock`} color="bg-purple-500" />
        <StatCard title="Avg. Order" value={`KSH ${avgOrderValue.toFixed(0)}`} icon={Target} color="bg-cyan-500" />
        <StatCard title="Fulfillment" value={`${fulfillmentRate}%`} icon={Truck} subtitle={`${deliveredOrders} delivered`} color="bg-emerald-500" />
        <StatCard title="Stock Health" value={`${stockHealthPercent}%`} icon={Activity} subtitle={`${outOfStockProducts.length} out of stock`} color={stockHealthPercent > 80 ? "bg-green-500" : "bg-amber-500"} />
      </div>

      {/* Quick Actions */}
      <div className="bg-card border border-border rounded-xl p-4">
        <h3 className="font-semibold text-sm text-foreground mb-3 flex items-center gap-2"><Zap className="w-4 h-4 text-primary" /> Quick Actions</h3>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          <QuickAction icon={Plus} label="Add Product" onClick={() => setActiveTab("products")} color="bg-primary" />
          <QuickAction icon={ShoppingCart} label="View Orders" onClick={() => setActiveTab("orders")} color="bg-blue-500" />
          <QuickAction icon={FileDown} label="Sales Report" onClick={() => setActiveTab("reports")} color="bg-green-500" />
          <QuickAction icon={Users} label="Customers" onClick={() => setActiveTab("customers")} color="bg-purple-500" />
          <QuickAction icon={PackageX} label="Low Stock" onClick={() => setActiveTab("products")} color="bg-amber-500" />
          <QuickAction icon={Settings} label="Settings" onClick={() => setActiveTab("settings")} color="bg-slate-500" />
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Weekly Revenue Chart */}
        <div className="bg-card border border-border rounded-xl p-4">
          <h3 className="font-semibold text-sm text-foreground mb-4 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-primary" /> Weekly Revenue</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={weeklyData}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
              <Area type="monotone" dataKey="revenue" stroke="#f97316" strokeWidth={2} fill="url(#revenueGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution Pie */}
        <div className="bg-card border border-border rounded-xl p-4">
          <h3 className="font-semibold text-sm text-foreground mb-4 flex items-center gap-2"><PieChart className="w-4 h-4 text-primary" /> Category Distribution</h3>
          <ResponsiveContainer width="100%" height={220}>
            <RechartsPie>
              <Pie data={categoryData} cx="50%" cy="50%" outerRadius={80} innerRadius={40} dataKey="value" label={({ name, value }) => `${name} (${value})`} labelLine={false}>
                {categoryData.map((_: any, i: number) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
            </RechartsPie>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Price Range & Revenue by Category */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-xl p-4">
          <h3 className="font-semibold text-sm text-foreground mb-4 flex items-center gap-2"><Hash className="w-4 h-4 text-primary" /> Price Range Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={priceRanges}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="range" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {revenueByCat.length > 0 && (
          <div className="bg-card border border-border rounded-xl p-4">
            <h3 className="font-semibold text-sm text-foreground mb-4 flex items-center gap-2"><CreditCard className="w-4 h-4 text-primary" /> Revenue by Category</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={revenueByCat} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" width={100} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="revenue" fill="#10b981" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Low Stock + Order Status + Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Order Status */}
        <div className="bg-card border border-border rounded-xl p-4">
          <h3 className="font-semibold text-sm text-foreground mb-3">Order Pipeline</h3>
          <div className="space-y-3">
            {[
              { label: "Pending", count: pendingOrders, icon: Clock, color: "text-warning", bg: "bg-warning/10" },
              { label: "Processing", count: orders.filter((o: Order) => o.status === "processing").length, icon: RefreshCw, color: "text-blue-500", bg: "bg-blue-500/10" },
              { label: "Shipped", count: orders.filter((o: Order) => o.status === "shipped").length, icon: Truck, color: "text-indigo-500", bg: "bg-indigo-500/10" },
              { label: "Delivered", count: deliveredOrders, icon: CheckCircle, color: "text-green-600", bg: "bg-green-500/10" },
              { label: "Cancelled", count: orders.filter((o: Order) => o.status === "cancelled").length, icon: XCircle, color: "text-destructive", bg: "bg-destructive/10" },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${item.bg}`}>
                    <item.icon className={`w-3.5 h-3.5 ${item.color}`} />
                  </div>
                  <span className="text-xs text-muted-foreground">{item.label}</span>
                </div>
                <span className="text-sm font-bold text-foreground">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Rated Products */}
        <div className="bg-card border border-border rounded-xl p-4">
          <h3 className="font-semibold text-sm text-foreground mb-3 flex items-center gap-2"><Star className="w-4 h-4 text-yellow-500" /> Top Rated Products</h3>
          <div className="space-y-2.5">
            {[...products].sort((a: Product, b: Product) => b.rating - a.rating).slice(0, 5).map((p: Product, i: number) => (
              <div key={p.id} className="flex items-center gap-2.5">
                <span className="text-[10px] font-bold text-muted-foreground w-4">#{i + 1}</span>
                <img src={p.images?.[0] || p.image} alt={p.name} className="w-9 h-9 rounded-lg object-contain bg-muted p-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-medium text-foreground truncate">{p.name}</p>
                  <div className="flex items-center gap-1">
                    <div className="flex text-yellow-500 text-[10px]">{"★".repeat(Math.round(p.rating))}</div>
                    <span className="text-[10px] text-muted-foreground">({p.reviews})</span>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-foreground">KSH {p.price.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Inventory Health */}
        <div className="bg-card border border-border rounded-xl p-4">
          <h3 className="font-semibold text-sm text-foreground mb-3 flex items-center gap-2"><Boxes className="w-4 h-4 text-primary" /> Inventory Health</h3>
          <div className="space-y-3">
            <div className="text-center py-3">
              <div className="relative inline-flex items-center justify-center">
                <svg className="w-20 h-20 -rotate-90">
                  <circle cx="40" cy="40" r="34" stroke="hsl(var(--muted))" strokeWidth="6" fill="none" />
                  <circle cx="40" cy="40" r="34" stroke={stockHealthPercent > 80 ? "#10b981" : stockHealthPercent > 50 ? "#f59e0b" : "#ef4444"} strokeWidth="6" fill="none"
                    strokeDasharray={`${stockHealthPercent * 2.14} 214`} strokeLinecap="round" />
                </svg>
                <span className="absolute text-lg font-bold text-foreground">{stockHealthPercent}%</span>
              </div>
              <p className="text-[10px] text-muted-foreground mt-1">Stock Health Score</p>
            </div>
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="bg-green-500/5 border border-green-500/10 rounded-lg p-2">
                <p className="text-lg font-bold text-green-600">{inStockProducts}</p>
                <p className="text-[10px] text-muted-foreground">In Stock</p>
              </div>
              <div className="bg-destructive/5 border border-destructive/10 rounded-lg p-2">
                <p className="text-lg font-bold text-destructive">{outOfStockProducts.length}</p>
                <p className="text-[10px] text-muted-foreground">Out of Stock</p>
              </div>
              <div className="bg-warning/5 border border-warning/10 rounded-lg p-2">
                <p className="text-lg font-bold text-warning">{lowStockProducts.length}</p>
                <p className="text-[10px] text-muted-foreground">Low Stock</p>
              </div>
              <div className="bg-primary/5 border border-primary/10 rounded-lg p-2">
                <p className="text-lg font-bold text-primary">{products.filter((p: Product) => p.deal).length}</p>
                <p className="text-[10px] text-muted-foreground">On Deal</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Low Stock Alert */}
      {lowStockProducts.length > 0 && (
        <div className="bg-warning/5 border border-warning/20 rounded-xl p-4">
          <h3 className="font-semibold text-sm text-foreground mb-3 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-warning" /> Low Stock Alert — {lowStockProducts.length} Products Need Restocking
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {lowStockProducts.map((p: Product) => (
              <div key={p.id} className="bg-card border border-border rounded-lg p-2.5 flex items-center gap-2.5">
                <img src={p.images?.[0] || p.image} alt={p.name} className="w-10 h-10 rounded-lg object-contain bg-muted p-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-medium text-foreground truncate">{p.name}</p>
                  <p className="text-[10px] text-muted-foreground">{p.category}</p>
                </div>
                <span className="text-[10px] font-semibold text-warning bg-warning/10 px-2 py-0.5 rounded">Reorder</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Orders */}
      <div className="bg-card border border-border rounded-xl p-4 overflow-x-auto">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-sm text-foreground">Recent Orders</h3>
          <button onClick={() => setActiveTab("orders")} className="text-[11px] text-primary font-medium hover:underline flex items-center gap-1">View All <ArrowUpRight className="w-3 h-3" /></button>
        </div>
        <table className="w-full text-sm min-w-[500px]">
          <thead><tr className="border-b border-border text-left text-[11px] text-muted-foreground">
            <th className="pb-2 font-medium">Order</th><th className="pb-2 font-medium">Customer</th><th className="pb-2 font-medium">Total</th><th className="pb-2 font-medium">Status</th><th className="pb-2 font-medium">Date</th>
          </tr></thead>
          <tbody>
            {orders.slice(0, 5).map((order: Order) => (
              <tr key={order.id} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                <td className="py-2.5 font-medium text-foreground text-xs">{order.id}</td>
                <td className="py-2.5 text-muted-foreground text-xs">{order.customer}</td>
                <td className="py-2.5 text-foreground font-medium text-xs">KSH {order.total.toLocaleString()}</td>
                <td className="py-2.5"><StatusBadge status={order.status} /></td>
                <td className="py-2.5 text-muted-foreground text-[11px]">{order.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* ============ STATUS BADGE ============ */
const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    pending: "bg-warning/10 text-warning border-warning/20",
    processing: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    shipped: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
    delivered: "bg-green-500/10 text-green-500 border-green-500/20",
    cancelled: "bg-destructive/10 text-destructive border-destructive/20",
  };
  return (
    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize border ${styles[status] || ""}`}>
      {status}
    </span>
  );
};

/* ============ PRODUCTS TAB ============ */
const ProductsTab = ({ products, onEdit, onDelete, onAdd, showForm, editingProduct, onSave, onCancel, lowStockProducts }: any) => {
  const [formData, setFormData] = useState<Partial<Product>>({
    name: "", price: 0, category: "", description: "", subcategory: "",
    featured: false, deal: false, discount: undefined, originalPrice: undefined, inStock: true,
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
      });
      setImagePreviews(p.images && p.images.length > 0 ? p.images : p.image ? [p.image] : []);
    } else {
      setFormData({ name: "", price: 0, category: "", description: "", subcategory: "", featured: false, deal: false, inStock: true });
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
      if (error) { toast.error(`Failed to upload ${file.name}`); continue; }
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
    if (filterCategory) {
      filtered = filtered.filter((p: Product) => p.category === filterCategory);
    }
    return filtered;
  }, [products, lowStockProducts, filterLowStock, searchTerm, filterCategory]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search products..."
              className="pl-8 pr-3 py-2 text-xs border border-border rounded-lg bg-background text-foreground w-48" />
          </div>
          <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}
            className="text-xs border border-border rounded-lg px-2.5 py-2 bg-background text-foreground">
            <option value="">All Categories</option>
            {categoryOptions.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          {lowStockProducts.length > 0 && (
            <button onClick={() => setFilterLowStock(!filterLowStock)}
              className={`flex items-center gap-1 px-2.5 py-2 rounded-lg text-xs font-semibold transition-colors ${filterLowStock ? "bg-warning text-warning-foreground" : "bg-warning/10 text-warning hover:bg-warning/20"}`}>
              <AlertCircle className="w-3 h-3" />
              {filterLowStock ? "Show All" : `${lowStockProducts.length} Low Stock`}
            </button>
          )}
          <span className="text-xs text-muted-foreground">{displayProducts.length} of {products.length} products</span>
        </div>
        <button onClick={() => { onAdd(); startEdit(null); }} className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 hover:opacity-90 transition-opacity shadow-sm">
          <Plus className="w-3.5 h-3.5" /> Add Product
        </button>
      </div>

      {showForm && (
        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <h3 className="font-semibold text-foreground">{editingProduct ? "Edit Product" : "Add New Product"}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Product Name *</label>
              <input placeholder="e.g. LED Headlight Bulb H7" value={formData.name || ""} onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Category *</label>
              <select value={formData.category || ""} onChange={e => setFormData({ ...formData, category: e.target.value })}
                className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none">
                <option value="">Select Category</option>
                {categoryOptions.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Subcategory</label>
              <input placeholder="e.g. Bulbs, Brake Pads" value={formData.subcategory || ""} onChange={e => setFormData({ ...formData, subcategory: e.target.value })}
                className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Price (KSH) *</label>
                <input type="number" placeholder="0" value={formData.price || ""} onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                  className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Original Price</label>
                <input type="number" placeholder="0" value={formData.originalPrice || ""} onChange={e => setFormData({ ...formData, originalPrice: Number(e.target.value) || undefined })}
                  className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground" />
              </div>
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Description</label>
            <textarea placeholder="Product description..." value={formData.description || ""} onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground" rows={3} />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Discount %</label>
              <input type="number" placeholder="0" value={formData.discount || ""} onChange={e => setFormData({ ...formData, discount: Number(e.target.value) || undefined })}
                className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground" />
            </div>
            <label className="flex items-center gap-2 text-sm cursor-pointer mt-5 text-foreground">
              <input type="checkbox" checked={formData.featured || false} onChange={e => setFormData({ ...formData, featured: e.target.checked })} className="rounded border-border" /> Featured
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer mt-5 text-foreground">
              <input type="checkbox" checked={formData.deal || false} onChange={e => setFormData({ ...formData, deal: e.target.checked })} className="rounded border-border" /> Deal
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer mt-5 text-foreground">
              <input type="checkbox" checked={formData.inStock !== false} onChange={e => setFormData({ ...formData, inStock: e.target.checked })} className="rounded border-border" /> In Stock
            </label>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1"><Image className="w-3 h-3" /> Product Images (up to 5)</label>
            <div className="flex flex-wrap gap-3">
              {imagePreviews.map((preview, i) => (
                <div key={i} className="relative w-20 h-20 border border-border rounded-xl overflow-hidden bg-muted">
                  <img src={preview} alt="" className="w-full h-full object-contain p-1" />
                  <button onClick={() => removeImage(i)} className="absolute top-0.5 right-0.5 bg-destructive text-destructive-foreground rounded-full p-0.5 shadow">
                    <X className="w-2.5 h-2.5" />
                  </button>
                </div>
              ))}
              {imagePreviews.length < 5 && (
                <button onClick={() => fileInputRef.current?.click()}
                  className="w-20 h-20 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-colors">
                  <Upload className="w-4 h-4" />
                  <span className="text-[9px] mt-0.5">Upload</span>
                </button>
              )}
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleImageSelect} className="hidden" />
          </div>
          <div className="flex gap-2 pt-2">
            <button onClick={handleSave} disabled={uploading} className="bg-primary text-primary-foreground px-6 py-2.5 rounded-lg text-sm font-semibold disabled:opacity-50 shadow-sm">
              {uploading ? "Uploading..." : editingProduct ? "Update Product" : "Add Product"}
            </button>
            <button onClick={onCancel} className="border border-border px-6 py-2.5 rounded-lg text-sm hover:bg-muted transition-colors text-foreground">Cancel</button>
          </div>
        </div>
      )}

      <div className="bg-card border border-border rounded-xl overflow-x-auto">
        <table className="w-full text-sm min-w-[700px]">
          <thead><tr className="border-b border-border bg-muted/50 text-left text-[11px] text-muted-foreground">
            <th className="p-3 font-medium">Product</th><th className="p-3 font-medium">Category</th><th className="p-3 font-medium">Price</th><th className="p-3 font-medium">Imgs</th><th className="p-3 font-medium">Stock</th><th className="p-3 font-medium">Tags</th><th className="p-3 font-medium">Rating</th><th className="p-3 font-medium">Actions</th>
          </tr></thead>
          <tbody>
            {displayProducts.map((p: Product) => (
              <tr key={p.id} className={`border-b border-border/50 hover:bg-muted/50 transition-colors ${lowStockProducts.some((lp: Product) => lp.id === p.id) ? "bg-warning/5" : ""}`}>
                <td className="p-3 flex items-center gap-2.5">
                  <img src={p.images?.[0] || p.image} alt={p.name} className="w-10 h-10 object-contain rounded-lg bg-muted p-0.5" />
                  <div>
                    <span className="font-medium text-foreground text-[11px] line-clamp-1">{p.name}</span>
                    <span className="text-[10px] text-muted-foreground block">{p.subcategory || "—"}</span>
                  </div>
                </td>
                <td className="p-3 text-[11px] text-muted-foreground">{p.category}</td>
                <td className="p-3">
                  <span className="text-[11px] font-semibold text-foreground">KSH {p.price.toLocaleString()}</span>
                  {p.originalPrice && <span className="text-[10px] text-muted-foreground line-through block">KSH {p.originalPrice.toLocaleString()}</span>}
                </td>
                <td className="p-3 text-[11px] text-muted-foreground">{p.images?.length || 1}</td>
                <td className="p-3">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${p.inStock ? "bg-green-500/10 text-green-500" : "bg-destructive/10 text-destructive"}`}>{p.inStock ? "In Stock" : "Out"}</span>
                </td>
                <td className="p-3">
                  <div className="flex gap-1 flex-wrap">
                    {p.featured && <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-primary/10 text-primary">Featured</span>}
                    {p.deal && <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-warning/10 text-warning">Deal</span>}
                    {p.discount && <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-green-500/10 text-green-500">-{p.discount}%</span>}
                  </div>
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500 text-[11px]">★</span>
                    <span className="text-[11px] text-foreground font-medium">{p.rating}</span>
                    <span className="text-[10px] text-muted-foreground">({p.reviews})</span>
                  </div>
                </td>
                <td className="p-3 flex gap-1">
                  <button onClick={() => { onEdit(p); startEdit(p); }} className="p-1.5 border border-border rounded-lg hover:bg-muted transition-colors" title="Edit"><Edit className="w-3.5 h-3.5" /></button>
                  <button onClick={() => onDelete(p.id)} className="p-1.5 border border-border rounded-lg hover:bg-destructive/10 text-destructive transition-colors" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {displayProducts.length === 0 && (
          <div className="p-8 text-center text-muted-foreground text-sm">No products match your filters</div>
        )}
      </div>
    </div>
  );
};

/* ============ ORDERS TAB ============ */
const OrdersTab = ({ orders, onUpdateStatus }: any) => {
  const [filterStatus, setFilterStatus] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = useMemo(() => {
    let result = orders;
    if (filterStatus) result = result.filter((o: Order) => o.status === filterStatus);
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      result = result.filter((o: Order) => o.id.toLowerCase().includes(q) || o.customer.toLowerCase().includes(q) || o.email.toLowerCase().includes(q));
    }
    return result;
  }, [orders, filterStatus, searchTerm]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search orders..."
            className="pl-8 pr-3 py-2 text-xs border border-border rounded-lg bg-background text-foreground w-48" />
        </div>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          className="text-xs border border-border rounded-lg px-2.5 py-2 bg-background text-foreground">
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <span className="text-xs text-muted-foreground">{filtered.length} orders</span>
      </div>

      {/* Order summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {[
          { label: "All", count: orders.length, color: "bg-muted" },
          { label: "Pending", count: orders.filter((o: Order) => o.status === "pending").length, color: "bg-warning/10" },
          { label: "Processing", count: orders.filter((o: Order) => o.status === "processing").length, color: "bg-blue-500/10" },
          { label: "Delivered", count: orders.filter((o: Order) => o.status === "delivered").length, color: "bg-green-500/10" },
          { label: "Cancelled", count: orders.filter((o: Order) => o.status === "cancelled").length, color: "bg-destructive/10" },
        ].map(s => (
          <button key={s.label} onClick={() => setFilterStatus(s.label === "All" ? "" : s.label.toLowerCase())}
            className={`${s.color} rounded-xl p-3 text-center border border-border hover:shadow-sm transition-shadow ${filterStatus === s.label.toLowerCase() || (s.label === "All" && !filterStatus) ? "ring-2 ring-primary/30" : ""}`}>
            <p className="text-lg font-bold text-foreground">{s.count}</p>
            <p className="text-[10px] text-muted-foreground">{s.label}</p>
          </button>
        ))}
      </div>

      <div className="bg-card border border-border rounded-xl overflow-x-auto">
        <table className="w-full text-sm min-w-[600px]">
          <thead><tr className="border-b border-border bg-muted/50 text-left text-[11px] text-muted-foreground">
            <th className="p-3 font-medium">Order ID</th><th className="p-3 font-medium">Customer</th><th className="p-3 font-medium">Items</th><th className="p-3 font-medium">Total</th><th className="p-3 font-medium">Status</th><th className="p-3 font-medium">Date</th><th className="p-3 font-medium">Actions</th>
          </tr></thead>
          <tbody>
            {filtered.map((order: Order) => (
              <tr key={order.id} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                <td className="p-3 font-medium text-foreground text-xs">{order.id}</td>
                <td className="p-3">
                  <p className="text-foreground text-xs font-medium">{order.customer}</p>
                  <p className="text-[10px] text-muted-foreground">{order.email}</p>
                </td>
                <td className="p-3">
                  {order.items.map((item: any, i: number) => (
                    <p key={i} className="text-[10px] text-muted-foreground">{item.product.name} × {item.quantity}</p>
                  ))}
                </td>
                <td className="p-3 font-medium text-foreground text-xs">KSH {order.total.toLocaleString()}</td>
                <td className="p-3"><StatusBadge status={order.status} /></td>
                <td className="p-3 text-muted-foreground text-[11px]">{order.date}</td>
                <td className="p-3">
                  <select value={order.status}
                    onChange={e => { onUpdateStatus(order.id, e.target.value); toast.success(`Order ${order.id} updated`); }}
                    className="border border-border rounded-lg px-2 py-1 text-[11px] bg-background text-foreground">
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="p-8 text-center text-muted-foreground text-sm">No orders found</div>}
      </div>
    </div>
  );
};

/* ============ CUSTOMERS TAB ============ */
const CustomersTab = ({ orders }: any) => {
  const customers = useMemo(() => {
    const map: Record<string, { name: string; email: string; orders: number; total: number; lastOrder: string }> = {};
    orders.forEach((o: Order) => {
      if (!map[o.email]) map[o.email] = { name: o.customer, email: o.email, orders: 0, total: 0, lastOrder: o.date };
      map[o.email].orders++;
      map[o.email].total += o.total;
      if (o.date > map[o.email].lastOrder) map[o.email].lastOrder = o.date;
    });
    return Object.values(map).sort((a, b) => b.total - a.total);
  }, [orders]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        <StatCard title="Total Customers" value={customers.length.toString()} icon={Users} color="bg-purple-500" />
        <StatCard title="Avg. Lifetime Value" value={`KSH ${customers.length ? Math.round(customers.reduce((s, c) => s + c.total, 0) / customers.length).toLocaleString() : 0}`} icon={DollarSign} color="bg-green-500" />
        <StatCard title="Repeat Customers" value={customers.filter(c => c.orders > 1).length.toString()} icon={RefreshCw} color="bg-blue-500" />
      </div>

      <div className="bg-card border border-border rounded-xl overflow-x-auto">
        <table className="w-full text-sm min-w-[500px]">
          <thead><tr className="border-b border-border bg-muted/50 text-left text-[11px] text-muted-foreground">
            <th className="p-3 font-medium">Customer</th><th className="p-3 font-medium">Email</th><th className="p-3 font-medium">Orders</th><th className="p-3 font-medium">Total Spent</th><th className="p-3 font-medium">Last Order</th>
          </tr></thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.email} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                <td className="p-3 font-medium text-foreground text-xs flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                    {c.name.charAt(0)}
                  </div>
                  {c.name}
                </td>
                <td className="p-3 text-muted-foreground text-xs">{c.email}</td>
                <td className="p-3 text-foreground text-xs">{c.orders}</td>
                <td className="p-3 font-medium text-foreground text-xs">KSH {c.total.toLocaleString()}</td>
                <td className="p-3 text-muted-foreground text-[11px]">{c.lastOrder}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {customers.length === 0 && <div className="p-8 text-center text-muted-foreground text-sm">No customers yet</div>}
      </div>
    </div>
  );
};

/* ============ REPORTS TAB ============ */
const ReportsTab = ({ orders, products }: { orders: Order[]; products: Product[] }) => {
  const [reportDate, setReportDate] = useState(new Date().toISOString().split("T")[0]);
  const [reportNotes, setReportNotes] = useState("");

  const totalRevenue = orders.reduce((s: number, o: Order) => s + o.total, 0);
  const avgOrderValue = orders.length ? totalRevenue / orders.length : 0;
  const outOfStockProducts = products.filter(p => !p.inStock);
  const lowStockProducts = products.filter(p => p.inStock && p.reviews <= 5);
  const totalInventoryValue = products.reduce((s, p) => s + p.price, 0);

  // Profit margin estimation
  const estimatedCost = totalRevenue * 0.6;
  const grossProfit = totalRevenue - estimatedCost;
  const profitMargin = totalRevenue ? Math.round((grossProfit / totalRevenue) * 100) : 0;

  const generatePDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("DMT Auto Parts", 14, 22);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Sales Report — ${reportDate}`, 14, 30);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 36);

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Financial Summary", 14, 50);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Total Revenue: KSH ${totalRevenue.toLocaleString()}`, 14, 58);
    doc.text(`Estimated Cost of Goods: KSH ${estimatedCost.toLocaleString()}`, 14, 64);
    doc.text(`Gross Profit: KSH ${grossProfit.toLocaleString()}`, 14, 70);
    doc.text(`Profit Margin: ${profitMargin}%`, 14, 76);
    doc.text(`Total Orders: ${orders.length}`, 14, 82);
    doc.text(`Average Order Value: KSH ${avgOrderValue.toFixed(0)}`, 14, 88);
    doc.text(`Total Products: ${products.length}`, 14, 94);
    doc.text(`In Stock: ${products.filter(p => p.inStock).length} | Out of Stock: ${outOfStockProducts.length} | Low Stock: ${lowStockProducts.length}`, 14, 100);
    doc.text(`Inventory Value: KSH ${totalInventoryValue.toLocaleString()}`, 14, 106);

    if (reportNotes) {
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Admin Notes", 14, 120);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      const lines = doc.splitTextToSize(reportNotes, 180);
      doc.text(lines, 14, 128);
    }

    const startY = reportNotes ? 128 + doc.splitTextToSize(reportNotes, 180).length * 6 + 10 : 120;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Orders Details", 14, startY);

    autoTable(doc, {
      startY: startY + 6,
      head: [["Order ID", "Customer", "Email", "Items", "Total (KSH)", "Status", "Date"]],
      body: orders.map((o: Order) => [
        o.id, o.customer, o.email,
        o.items.map((i) => `${i.product.name} x${i.quantity}`).join(", "),
        o.total.toLocaleString(), o.status, o.date
      ]),
      styles: { fontSize: 7 },
      headStyles: { fillColor: [41, 128, 185] },
    });

    doc.addPage();
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Product Inventory", 14, 22);

    autoTable(doc, {
      startY: 28,
      head: [["Product", "Category", "Price (KSH)", "Stock", "Rating", "Reviews"]],
      body: products.map(p => [p.name, p.category, p.price.toLocaleString(), p.inStock ? "In Stock" : "Out of Stock", `${p.rating}/5`, p.reviews.toString()]),
      styles: { fontSize: 7 },
      headStyles: { fillColor: [41, 128, 185] },
    });

    if (lowStockProducts.length > 0) {
      doc.addPage();
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Low Stock Alert", 14, 22);
      autoTable(doc, {
        startY: 30,
        head: [["Product", "Category", "Price (KSH)", "Reviews"]],
        body: lowStockProducts.map(p => [p.name, p.category, p.price.toLocaleString(), p.reviews.toString()]),
        styles: { fontSize: 8 },
        headStyles: { fillColor: [230, 126, 34] },
      });
    }

    doc.save(`DMT-Sales-Report-${reportDate}.pdf`);
    toast.success("PDF report downloaded!");
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-3">
        <StatCard title="Total Revenue" value={`KSH ${totalRevenue.toLocaleString()}`} icon={DollarSign} color="bg-green-500" />
        <StatCard title="Gross Profit" value={`KSH ${grossProfit.toLocaleString()}`} icon={TrendingUp} color="bg-emerald-500" />
        <StatCard title="Profit Margin" value={`${profitMargin}%`} icon={Percent} color="bg-cyan-500" />
        <StatCard title="Avg. Order" value={`KSH ${avgOrderValue.toFixed(0)}`} icon={Target} color="bg-blue-500" />
        <StatCard title="Inventory Value" value={`KSH ${totalInventoryValue.toLocaleString()}`} icon={Boxes} color="bg-purple-500" />
        <StatCard title="Low Stock" value={lowStockProducts.length.toString()} icon={AlertCircle} color="bg-amber-500" />
      </div>

      {/* Products Sold */}
      <div className="bg-card border border-border rounded-xl p-4">
        <h3 className="font-semibold text-sm text-foreground mb-3 flex items-center gap-2">
          <ShoppingBag className="w-4 h-4 text-primary" /> Products Sold — Details
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[500px]">
            <thead><tr className="border-b border-border text-left text-[11px] text-muted-foreground">
              <th className="pb-2 font-medium">Product</th><th className="pb-2 font-medium">Qty</th><th className="pb-2 font-medium">Revenue</th><th className="pb-2 font-medium">Order</th>
            </tr></thead>
            <tbody>
              {orders.flatMap((o: Order) => o.items.map((item, i: number) => (
                <tr key={`${o.id}-${i}`} className="border-b border-border/50 hover:bg-muted/50">
                  <td className="py-2 flex items-center gap-2">
                    <img src={item.product.images?.[0] || item.product.image} alt="" className="w-7 h-7 rounded bg-muted object-contain p-0.5" />
                    <span className="text-[11px] text-foreground truncate max-w-[200px]">{item.product.name}</span>
                  </td>
                  <td className="py-2 text-[11px] text-foreground font-medium">{item.quantity}</td>
                  <td className="py-2 text-[11px] text-foreground font-medium">KSH {(item.product.price * item.quantity).toLocaleString()}</td>
                  <td className="py-2 text-[11px] text-muted-foreground">{o.id}</td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Generate PDF */}
      <div className="bg-card border border-border rounded-xl p-4 space-y-4">
        <h3 className="font-semibold text-foreground text-sm flex items-center gap-2"><FileDown className="w-4 h-4 text-primary" /> Generate Sales Report</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Report Date</label>
            <input type="date" value={reportDate} onChange={e => setReportDate(e.target.value)}
              className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground" />
          </div>
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Notes / Comments</label>
          <textarea value={reportNotes} onChange={e => setReportNotes(e.target.value)}
            placeholder="Add notes about today's sales, highlights, issues..."
            className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground" rows={3} />
        </div>
        <button onClick={generatePDF} className="bg-primary text-primary-foreground px-6 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity shadow-sm">
          <FileDown className="w-4 h-4" /> Download PDF Report
        </button>
      </div>

      {/* Store Progress */}
      <div className="bg-card border border-border rounded-xl p-4">
        <h3 className="font-semibold text-sm text-foreground mb-4 flex items-center gap-2"><Activity className="w-4 h-4 text-primary" /> Business Health</h3>
        <div className="space-y-3">
          {[
            { label: "Product Catalog", value: products.length, max: 100, desc: `${products.length} of 100 target`, color: "bg-primary" },
            { label: "Order Fulfillment", value: orders.filter((o: Order) => o.status === "delivered").length, max: orders.length || 1, desc: `${orders.filter((o: Order) => o.status === "delivered").length}/${orders.length} delivered`, color: "bg-green-500" },
            { label: "Stock Health", value: products.filter(p => p.inStock).length, max: products.length || 1, desc: `${products.filter(p => p.inStock).length}/${products.length} in stock`, color: "bg-blue-500" },
            { label: "Profit Margin", value: profitMargin, max: 100, desc: `${profitMargin}% gross margin`, color: "bg-emerald-500" },
          ].map(item => (
            <div key={item.label}>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-foreground">{item.label}</span>
                <span className="text-muted-foreground">{item.desc}</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
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
    <div className="space-y-4">
      <div className="bg-card border border-border rounded-xl p-5 space-y-4">
        <h3 className="font-semibold text-foreground">Store Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="text-xs text-muted-foreground block mb-1">Store Name</label><input defaultValue="DMT Auto Parts" className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground" /></div>
          <div><label className="text-xs text-muted-foreground block mb-1">Contact Email</label><input defaultValue="support@dmtautoparts.com" className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground" /></div>
          <div><label className="text-xs text-muted-foreground block mb-1">Phone</label><input defaultValue="+254 700 000 000" className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground" /></div>
          <div><label className="text-xs text-muted-foreground block mb-1">Currency</label><input defaultValue="KSH" className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground" disabled /></div>
        </div>
        <button className="bg-primary text-primary-foreground px-6 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity shadow-sm">Save Settings</button>
      </div>
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="font-semibold text-foreground mb-4">Appearance</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">Dark Mode</p>
            <p className="text-xs text-muted-foreground">Switch between light and dark themes</p>
          </div>
          <button onClick={toggleTheme} className={`relative w-12 h-6 rounded-full transition-colors ${theme === "dark" ? "bg-primary" : "bg-muted"}`}>
            <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${theme === "dark" ? "translate-x-6" : "translate-x-0.5"}`} />
          </button>
        </div>
      </div>
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="font-semibold text-foreground mb-4">Account</h3>
        <button onClick={onSignOut} className="bg-destructive text-destructive-foreground px-6 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity">Sign Out</button>
      </div>
    </div>
  );
};

export default AdminPage;
