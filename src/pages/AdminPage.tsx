import { useState, useRef } from "react";
import { useStore } from "@/context/StoreContext";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { Link, Navigate } from "react-router-dom";
import {
  LayoutDashboard, Package, ShoppingCart, Users, Settings, LogOut,
  Plus, Edit, Trash2, ChevronDown, TrendingUp, DollarSign, Eye, Upload, X, Image,
  FileDown, BarChart3, Activity, Calendar, CheckCircle, Clock, XCircle, AlertTriangle,
  Sun, Moon, AlertCircle, PackageX, Boxes
} from "lucide-react";
import { Product } from "@/data/store";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/logo.png";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type Tab = "dashboard" | "products" | "orders" | "customers" | "reports" | "settings";

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

  const sidebarItems: { icon: typeof LayoutDashboard; label: string; tab: Tab }[] = [
    { icon: LayoutDashboard, label: "Dashboard", tab: "dashboard" },
    { icon: Package, label: "Products", tab: "products" },
    { icon: ShoppingCart, label: "Orders", tab: "orders" },
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
      <aside className={`bg-secondary text-secondary-foreground ${sidebarOpen ? "w-60" : "w-16"} transition-all duration-200 flex flex-col min-h-screen hidden md:flex`}>
        <div className="p-4 border-b border-secondary-foreground/10">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="DMT" className="h-8" />
            {sidebarOpen && <span className="font-bold text-sm">Admin Panel</span>}
          </Link>
        </div>
        <nav className="flex-1 py-4">
          {sidebarItems.map((item) => (
            <button key={item.tab} onClick={() => setActiveTab(item.tab)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${activeTab === item.tab ? "bg-sidebar-accent text-primary font-semibold" : "text-secondary-foreground/70 hover:text-secondary-foreground hover:bg-sidebar-accent/50"}`}>
              <item.icon className="w-4 h-4 flex-shrink-0" />
              {sidebarOpen && item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-secondary-foreground/10 space-y-2">
          <button onClick={toggleTheme} className="flex items-center gap-3 text-sm text-secondary-foreground/70 hover:text-secondary-foreground transition-colors w-full">
            {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            {sidebarOpen && (theme === "light" ? "Dark Mode" : "Light Mode")}
          </button>
          <button onClick={signOut} className="flex items-center gap-3 text-sm text-secondary-foreground/70 hover:text-secondary-foreground transition-colors w-full">
            <LogOut className="w-4 h-4" />
            {sidebarOpen && "Sign Out"}
          </button>
          <Link to="/" className="flex items-center gap-3 text-sm text-secondary-foreground/70 hover:text-secondary-foreground transition-colors">
            <Eye className="w-4 h-4" />
            {sidebarOpen && "View Store"}
          </Link>
        </div>
      </aside>

      {/* Mobile tab bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-secondary z-50 flex">
        {sidebarItems.map((item) => (
          <button key={item.tab} onClick={() => setActiveTab(item.tab)}
            className={`flex-1 flex flex-col items-center py-2 text-[10px] ${activeTab === item.tab ? "text-primary" : "text-secondary-foreground/70"}`}>
            <item.icon className="w-4 h-4 mb-0.5" />
            {item.label}
          </button>
        ))}
      </div>

      <main className="flex-1 overflow-auto pb-16 md:pb-0">
        <header className="bg-card border-b border-border px-4 md:px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-foreground capitalize">{activeTab}</h1>
            <p className="text-xs text-muted-foreground">Manage your store</p>
          </div>
          <div className="flex items-center gap-2">
            {lowStockProducts.length > 0 && (
              <button onClick={() => setActiveTab("products")} className="flex items-center gap-1.5 bg-warning/10 text-warning px-3 py-1.5 rounded-lg text-xs font-semibold animate-pulse">
                <AlertCircle className="w-3.5 h-3.5" />
                {lowStockProducts.length} Low Stock
              </button>
            )}
            <span className="text-xs text-muted-foreground hidden md:inline">{user?.email}</span>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="hidden md:block p-2 border border-border rounded hover:bg-muted transition-colors">
              <ChevronDown className={`w-4 h-4 transition-transform ${sidebarOpen ? "rotate-90" : "-rotate-90"}`} />
            </button>
          </div>
        </header>

        <div className="p-4 md:p-6">
          {activeTab === "dashboard" && <DashboardTab totalRevenue={totalRevenue} totalOrders={totalOrders} totalProducts={totalProducts} pendingOrders={pendingOrders} deliveredOrders={deliveredOrders} inStockProducts={inStockProducts} orders={orders} products={products} lowStockProducts={lowStockProducts} />}
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
const StatCard = ({ title, value, icon: Icon, trend, color }: { title: string; value: string; icon: typeof TrendingUp; trend?: string; color?: string }) => (
  <div className="bg-card border border-border rounded-xl p-5 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between mb-3">
      <span className="text-xs text-muted-foreground font-medium">{title}</span>
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color || "bg-primary/10"}`}>
        <Icon className={`w-5 h-5 ${color ? "text-white" : "text-primary"}`} />
      </div>
    </div>
    <p className="text-2xl md:text-3xl font-bold text-foreground">{value}</p>
    {trend && <p className="text-xs text-green-600 mt-1 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> {trend}</p>}
  </div>
);

/* ============ DASHBOARD ============ */
const DashboardTab = ({ totalRevenue, totalOrders, totalProducts, pendingOrders, deliveredOrders, inStockProducts, orders, products, lowStockProducts }: any) => (
  <div className="space-y-6">
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard title="Total Revenue" value={`KSH ${totalRevenue.toLocaleString()}`} icon={DollarSign} trend="12% from last month" color="bg-green-500" />
      <StatCard title="Total Orders" value={totalOrders.toString()} icon={ShoppingCart} trend="8% from last month" color="bg-blue-500" />
      <StatCard title="Total Products" value={totalProducts.toString()} icon={Package} color="bg-purple-500" />
      <StatCard title="In Stock" value={`${inStockProducts}/${totalProducts}`} icon={CheckCircle} color="bg-amber-500" />
    </div>

    {/* Low Stock Alert */}
    {lowStockProducts.length > 0 && (
      <div className="bg-warning/5 border border-warning/20 rounded-xl p-5">
        <h3 className="font-semibold text-sm text-foreground mb-3 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-warning" /> Low Stock Alert — {lowStockProducts.length} Products Running Low
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {lowStockProducts.map((p: Product) => (
            <div key={p.id} className="bg-card border border-border rounded-lg p-3 flex items-center gap-3">
              <img src={p.images?.[0] || p.image} alt={p.name} className="w-12 h-12 rounded-lg object-contain bg-muted p-1" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-foreground truncate">{p.name}</p>
                <p className="text-[10px] text-muted-foreground">{p.category}</p>
                <div className="flex items-center gap-1 mt-1">
                  <PackageX className="w-3 h-3 text-warning" />
                  <span className="text-[10px] font-semibold text-warning">Low stock — reorder soon</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )}

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Order Status Summary */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="font-semibold text-sm text-foreground mb-4">Order Status</h3>
        <div className="space-y-3">
          {[
            { label: "Pending", count: pendingOrders, icon: Clock, color: "text-warning" },
            { label: "Delivered", count: deliveredOrders, icon: CheckCircle, color: "text-green-600" },
            { label: "Processing", count: orders.filter((o: any) => o.status === "processing").length, icon: Activity, color: "text-blue-500" },
            { label: "Cancelled", count: orders.filter((o: any) => o.status === "cancelled").length, icon: XCircle, color: "text-destructive" },
          ].map(item => (
            <div key={item.label} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <item.icon className={`w-4 h-4 ${item.color}`} />
                <span className="text-sm text-muted-foreground">{item.label}</span>
              </div>
              <span className="text-sm font-semibold text-foreground">{item.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="font-semibold text-sm text-foreground mb-4">Top Products</h3>
        <div className="space-y-3">
          {products.slice(0, 5).map((p: Product) => (
            <div key={p.id} className="flex items-center gap-3">
              <img src={p.images?.[0] || p.image} alt={p.name} className="w-10 h-10 rounded-lg object-contain bg-muted p-1" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-foreground truncate">{p.name}</p>
                <p className="text-[10px] text-muted-foreground">KSH {p.price.toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-0.5 text-yellow-500 text-xs">{"★".repeat(Math.round(p.rating))}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Inventory Overview */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="font-semibold text-sm text-foreground mb-4 flex items-center gap-2"><Boxes className="w-4 h-4" /> Inventory Overview</h3>
        <div className="space-y-3">
          {(() => {
            const cats = products.reduce((acc: Record<string, number>, p: Product) => {
              acc[p.category] = (acc[p.category] || 0) + 1;
              return acc;
            }, {});
            return Object.entries(cats).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([cat, count]) => (
              <div key={cat} className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground truncate flex-1">{cat}</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${(count as number / products.length) * 100}%` }} />
                  </div>
                  <span className="text-xs font-semibold text-foreground w-6 text-right">{count as number}</span>
                </div>
              </div>
            ));
          })()}
        </div>
      </div>
    </div>

    {/* Daily Sales Summary */}
    <div className="bg-card border border-border rounded-xl p-5">
      <h3 className="font-semibold text-sm text-foreground mb-4 flex items-center gap-2">
        <Calendar className="w-4 h-4" /> Today's Sales Summary
      </h3>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div className="bg-muted rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-foreground">{orders.filter((o: any) => o.date === new Date().toISOString().split("T")[0]).length || orders.length}</p>
          <p className="text-[10px] text-muted-foreground">Orders Today</p>
        </div>
        <div className="bg-muted rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-foreground">KSH {totalRevenue.toLocaleString()}</p>
          <p className="text-[10px] text-muted-foreground">Revenue Today</p>
        </div>
        <div className="bg-muted rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-foreground">{products.filter((p: Product) => !p.inStock).length}</p>
          <p className="text-[10px] text-muted-foreground">Out of Stock</p>
        </div>
        <div className="bg-muted rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-foreground">{lowStockProducts.length}</p>
          <p className="text-[10px] text-muted-foreground">Low Stock Items</p>
        </div>
      </div>
    </div>

    {/* Recent Orders Table */}
    <div className="bg-card border border-border rounded-xl p-5 overflow-x-auto">
      <h3 className="font-semibold text-sm text-foreground mb-4">Recent Orders</h3>
      <table className="w-full text-sm min-w-[500px]">
        <thead><tr className="border-b border-border text-left text-xs text-muted-foreground">
          <th className="pb-3 font-medium">Order ID</th><th className="pb-3 font-medium">Customer</th><th className="pb-3 font-medium">Total</th><th className="pb-3 font-medium">Status</th><th className="pb-3 font-medium">Date</th>
        </tr></thead>
        <tbody>
          {orders.slice(0, 5).map((order: any) => (
            <tr key={order.id} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
              <td className="py-3 font-medium text-foreground">{order.id}</td>
              <td className="py-3 text-muted-foreground">{order.customer}</td>
              <td className="py-3 text-foreground font-medium">KSH {order.total.toLocaleString()}</td>
              <td className="py-3"><StatusBadge status={order.status} /></td>
              <td className="py-3 text-muted-foreground text-xs">{order.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
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
  return (
    <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full capitalize border ${styles[status] || ""}`}>
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

  const categoryOptions = ["Air & Fuel Delivery", "Exterior & Accessories", "Headlights & Lighting", "Brakes & Rotors", "Engines & Components", "Electrical", "Interior", "Suspension"];
  const displayProducts = filterLowStock ? lowStockProducts : products;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <p className="text-sm text-muted-foreground">{products.length} products</p>
          {lowStockProducts.length > 0 && (
            <button onClick={() => setFilterLowStock(!filterLowStock)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${filterLowStock ? "bg-warning text-warning-foreground" : "bg-warning/10 text-warning hover:bg-warning/20"}`}>
              <AlertCircle className="w-3 h-3" />
              {filterLowStock ? "Show All" : `${lowStockProducts.length} Low Stock`}
            </button>
          )}
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
              <input type="checkbox" checked={formData.featured || false} onChange={e => setFormData({ ...formData, featured: e.target.checked })}
                className="rounded border-border" /> Featured
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer mt-5 text-foreground">
              <input type="checkbox" checked={formData.deal || false} onChange={e => setFormData({ ...formData, deal: e.target.checked })}
                className="rounded border-border" /> Deal
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer mt-5 text-foreground">
              <input type="checkbox" checked={formData.inStock !== false} onChange={e => setFormData({ ...formData, inStock: e.target.checked })}
                className="rounded border-border" /> In Stock
            </label>
          </div>
          {/* Image Upload */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1"><Image className="w-3 h-3" /> Product Images (up to 5)</label>
            <div className="flex flex-wrap gap-3">
              {imagePreviews.map((preview, i) => (
                <div key={i} className="relative w-24 h-24 border border-border rounded-xl overflow-hidden bg-muted">
                  <img src={preview} alt="" className="w-full h-full object-contain p-1" />
                  <button onClick={() => removeImage(i)} className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-0.5 shadow">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              {imagePreviews.length < 5 && (
                <button onClick={() => fileInputRef.current?.click()}
                  className="w-24 h-24 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-colors">
                  <Upload className="w-5 h-5" />
                  <span className="text-[10px] mt-1">Upload</span>
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
          <thead><tr className="border-b border-border bg-muted/50 text-left text-xs text-muted-foreground">
            <th className="p-3 font-medium">Product</th><th className="p-3 font-medium">Category</th><th className="p-3 font-medium">Price</th><th className="p-3 font-medium">Images</th><th className="p-3 font-medium">Stock</th><th className="p-3 font-medium">Featured</th><th className="p-3 font-medium">Actions</th>
          </tr></thead>
          <tbody>
            {displayProducts.map((p: Product) => (
              <tr key={p.id} className={`border-b border-border/50 hover:bg-muted/50 transition-colors ${lowStockProducts.some((lp: Product) => lp.id === p.id) ? "bg-warning/5" : ""}`}>
                <td className="p-3 flex items-center gap-3">
                  <img src={p.images?.[0] || p.image} alt={p.name} className="w-12 h-12 object-contain rounded-lg bg-muted p-1" />
                  <div>
                    <span className="font-medium text-foreground text-xs line-clamp-1">{p.name}</span>
                    <span className="text-[10px] text-muted-foreground block">{p.subcategory || "—"}</span>
                  </div>
                </td>
                <td className="p-3 text-xs text-muted-foreground">{p.category}</td>
                <td className="p-3">
                  <span className="text-xs font-semibold text-foreground">KSH {p.price.toLocaleString()}</span>
                  {p.originalPrice && <span className="text-[10px] text-muted-foreground line-through ml-1">KSH {p.originalPrice.toLocaleString()}</span>}
                </td>
                <td className="p-3 text-xs text-muted-foreground">{p.images?.length || 1}</td>
                <td className="p-3">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${p.inStock ? "bg-green-500/10 text-green-500" : "bg-destructive/10 text-destructive"}`}>{p.inStock ? "In Stock" : "Out"}</span>
                </td>
                <td className="p-3">
                  {p.featured && <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">Featured</span>}
                  {p.deal && <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-warning/10 text-warning ml-1">Deal</span>}
                </td>
                <td className="p-3 flex gap-1">
                  <button onClick={() => { onEdit(p); startEdit(p); }} className="p-2 border border-border rounded-lg hover:bg-muted transition-colors"><Edit className="w-3.5 h-3.5" /></button>
                  <button onClick={() => onDelete(p.id)} className="p-2 border border-border rounded-lg hover:bg-destructive/10 text-destructive transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* ============ ORDERS TAB ============ */
const OrdersTab = ({ orders, onUpdateStatus }: any) => (
  <div className="bg-card border border-border rounded-xl overflow-x-auto">
    <table className="w-full text-sm min-w-[600px]">
      <thead><tr className="border-b border-border bg-muted/50 text-left text-xs text-muted-foreground">
        <th className="p-3 font-medium">Order ID</th><th className="p-3 font-medium">Customer</th><th className="p-3 font-medium">Items</th><th className="p-3 font-medium">Total</th><th className="p-3 font-medium">Status</th><th className="p-3 font-medium">Date</th><th className="p-3 font-medium">Actions</th>
      </tr></thead>
      <tbody>
        {orders.map((order: any) => (
          <tr key={order.id} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
            <td className="p-3 font-medium text-foreground">{order.id}</td>
            <td className="p-3">
              <p className="text-foreground text-xs font-medium">{order.customer}</p>
              <p className="text-[10px] text-muted-foreground">{order.email}</p>
            </td>
            <td className="p-3">
              {order.items.map((item: any, i: number) => (
                <p key={i} className="text-[10px] text-muted-foreground">{item.product.name} × {item.quantity}</p>
              ))}
            </td>
            <td className="p-3 font-medium text-foreground">KSH {order.total.toLocaleString()}</td>
            <td className="p-3"><StatusBadge status={order.status} /></td>
            <td className="p-3 text-muted-foreground text-xs">{order.date}</td>
            <td className="p-3">
              <select value={order.status}
                onChange={e => { onUpdateStatus(order.id, e.target.value); toast.success(`Order ${order.id} updated`); }}
                className="border border-border rounded-lg px-2 py-1 text-xs bg-background text-foreground">
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
  </div>
);

/* ============ CUSTOMERS TAB ============ */
const CustomersTab = ({ orders }: any) => {
  const customers = orders.reduce((acc: any[], order: any) => {
    if (!acc.find((c: any) => c.email === order.email)) {
      acc.push({ name: order.customer, email: order.email, orders: orders.filter((o: any) => o.email === order.email).length, total: orders.filter((o: any) => o.email === order.email).reduce((s: number, o: any) => s + o.total, 0) });
    }
    return acc;
  }, []);
  return (
    <div className="bg-card border border-border rounded-xl overflow-x-auto">
      <table className="w-full text-sm min-w-[400px]">
        <thead><tr className="border-b border-border bg-muted/50 text-left text-xs text-muted-foreground">
          <th className="p-3 font-medium">Name</th><th className="p-3 font-medium">Email</th><th className="p-3 font-medium">Orders</th><th className="p-3 font-medium">Total Spent</th>
        </tr></thead>
        <tbody>
          {customers.map((c: any) => (
            <tr key={c.email} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
              <td className="p-3 font-medium text-foreground">{c.name}</td>
              <td className="p-3 text-muted-foreground text-xs">{c.email}</td>
              <td className="p-3 text-foreground">{c.orders}</td>
              <td className="p-3 font-medium text-foreground">KSH {c.total.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

/* ============ REPORTS TAB ============ */
const ReportsTab = ({ orders, products }: { orders: any[]; products: Product[] }) => {
  const [reportDate, setReportDate] = useState(new Date().toISOString().split("T")[0]);
  const [reportNotes, setReportNotes] = useState("");

  const totalRevenue = orders.reduce((s: number, o: any) => s + o.total, 0);
  const avgOrderValue = orders.length ? totalRevenue / orders.length : 0;
  const outOfStockProducts = products.filter(p => !p.inStock);
  const lowStockProducts = products.filter(p => p.inStock && p.reviews <= 5);

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
    doc.text("Summary", 14, 50);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Total Revenue: KSH ${totalRevenue.toLocaleString()}`, 14, 58);
    doc.text(`Total Orders: ${orders.length}`, 14, 64);
    doc.text(`Average Order Value: KSH ${avgOrderValue.toFixed(0)}`, 14, 70);
    doc.text(`Total Products: ${products.length}`, 14, 76);
    doc.text(`In Stock: ${products.filter(p => p.inStock).length}`, 14, 82);
    doc.text(`Out of Stock: ${outOfStockProducts.length}`, 14, 88);
    doc.text(`Low Stock Items: ${lowStockProducts.length}`, 14, 94);

    if (reportNotes) {
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Notes", 14, 108);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      const lines = doc.splitTextToSize(reportNotes, 180);
      doc.text(lines, 14, 116);
    }

    const startY = reportNotes ? 116 + doc.splitTextToSize(reportNotes, 180).length * 6 + 10 : 108;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Orders Details", 14, startY);

    autoTable(doc, {
      startY: startY + 6,
      head: [["Order ID", "Customer", "Email", "Items", "Total (KSH)", "Status", "Date"]],
      body: orders.map((o: any) => [
        o.id, o.customer, o.email,
        o.items.map((i: any) => `${i.product.name} x${i.quantity}`).join(", "),
        o.total.toLocaleString(), o.status, o.date
      ]),
      styles: { fontSize: 7 },
      headStyles: { fillColor: [41, 128, 185] },
    });

    // Products inventory page
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

    // Low stock alert page
    if (lowStockProducts.length > 0) {
      doc.addPage();
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Low Stock Alert", 14, 22);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`${lowStockProducts.length} products need restocking`, 14, 30);

      autoTable(doc, {
        startY: 36,
        head: [["Product", "Category", "Price (KSH)", "Reviews (Stock Indicator)"]],
        body: lowStockProducts.map(p => [p.name, p.category, p.price.toLocaleString(), p.reviews.toString()]),
        styles: { fontSize: 8 },
        headStyles: { fillColor: [230, 126, 34] },
      });
    }

    doc.save(`DMT-Sales-Report-${reportDate}.pdf`);
    toast.success("PDF report downloaded!");
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Revenue" value={`KSH ${totalRevenue.toLocaleString()}`} icon={DollarSign} color="bg-green-500" />
        <StatCard title="Total Orders" value={orders.length.toString()} icon={ShoppingCart} color="bg-blue-500" />
        <StatCard title="Avg. Order Value" value={`KSH ${avgOrderValue.toFixed(0)}`} icon={TrendingUp} color="bg-purple-500" />
        <StatCard title="Low Stock" value={lowStockProducts.length.toString()} icon={AlertCircle} color="bg-amber-500" />
      </div>

      {/* Products Sold Today */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <Calendar className="w-4 h-4" /> Products Sold — Details
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[500px]">
            <thead><tr className="border-b border-border text-left text-xs text-muted-foreground">
              <th className="pb-3 font-medium">Product</th><th className="pb-3 font-medium">Qty Sold</th><th className="pb-3 font-medium">Revenue</th><th className="pb-3 font-medium">Order</th>
            </tr></thead>
            <tbody>
              {orders.flatMap((o: any) => o.items.map((item: any, i: number) => (
                <tr key={`${o.id}-${i}`} className="border-b border-border/50 hover:bg-muted/50">
                  <td className="py-2.5 flex items-center gap-2">
                    <img src={item.product.images?.[0] || item.product.image} alt="" className="w-8 h-8 rounded bg-muted object-contain p-0.5" />
                    <span className="text-xs text-foreground truncate max-w-[200px]">{item.product.name}</span>
                  </td>
                  <td className="py-2.5 text-xs text-foreground font-medium">{item.quantity}</td>
                  <td className="py-2.5 text-xs text-foreground font-medium">KSH {(item.product.price * item.quantity).toLocaleString()}</td>
                  <td className="py-2.5 text-xs text-muted-foreground">{o.id}</td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-5 space-y-4">
        <h3 className="font-semibold text-foreground flex items-center gap-2"><FileDown className="w-4 h-4" /> Generate Sales Report</h3>
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
            className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground" rows={4} />
        </div>
        <button onClick={generatePDF} className="bg-primary text-primary-foreground px-6 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity shadow-sm">
          <FileDown className="w-4 h-4" /> Download PDF Report
        </button>
      </div>

      {/* Store Progress */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2"><Activity className="w-4 h-4" /> Store Progress & Analytics</h3>
        <div className="space-y-4">
          {[
            { label: "Product Catalog", value: products.length, max: 100, desc: `${products.length} of 100 products listed` },
            { label: "Order Fulfillment", value: orders.filter((o: any) => o.status === "delivered").length, max: orders.length || 1, desc: `${orders.filter((o: any) => o.status === "delivered").length} of ${orders.length} delivered` },
            { label: "Stock Health", value: products.filter(p => p.inStock).length, max: products.length || 1, desc: `${products.filter(p => p.inStock).length} of ${products.length} in stock` },
            { label: "Customer Satisfaction", value: 85, max: 100, desc: "85% positive reviews" },
          ].map(item => (
            <div key={item.label}>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-foreground">{item.label}</span>
                <span className="text-muted-foreground text-xs">{item.desc}</span>
              </div>
              <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${Math.min((item.value / item.max) * 100, 100)}%` }} />
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
      <div className="bg-card border border-border rounded-xl p-6 space-y-4">
        <h3 className="font-semibold text-foreground">Store Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="text-xs text-muted-foreground block mb-1">Store Name</label><input defaultValue="DMT Auto Parts" className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground" /></div>
          <div><label className="text-xs text-muted-foreground block mb-1">Contact Email</label><input defaultValue="support@dmtautoparts.com" className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground" /></div>
          <div><label className="text-xs text-muted-foreground block mb-1">Phone</label><input defaultValue="+254 700 000 000" className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground" /></div>
          <div><label className="text-xs text-muted-foreground block mb-1">Currency</label><input defaultValue="KSH" className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground" disabled /></div>
        </div>
        <button className="bg-primary text-primary-foreground px-6 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity shadow-sm">Save Settings</button>
      </div>
      <div className="bg-card border border-border rounded-xl p-6">
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
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="font-semibold text-foreground mb-4">Account</h3>
        <button onClick={onSignOut} className="bg-destructive text-destructive-foreground px-6 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity">Sign Out</button>
      </div>
    </div>
  );
};

export default AdminPage;
