import { useState, useRef } from "react";
import { useStore } from "@/context/StoreContext";
import { useAuth } from "@/context/AuthContext";
import { Link, Navigate } from "react-router-dom";
import {
  LayoutDashboard, Package, ShoppingCart, Users, Settings, LogOut,
  Plus, Edit, Trash2, ChevronDown, TrendingUp, DollarSign, Eye, Upload, X, Image
} from "lucide-react";
import { Product } from "@/data/store";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/logo.png";

type Tab = "dashboard" | "products" | "orders" | "customers" | "settings";

const AdminPage = () => {
  const { products, orders, addProduct, updateProduct, deleteProduct, updateOrderStatus } = useStore();
  const { user, isAdmin, isLoading, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (isLoading) return <div className="min-h-screen bg-background flex items-center justify-center"><p className="text-muted-foreground">Loading...</p></div>;
  if (!user) return <Navigate to="/auth" replace />;
  if (!isAdmin) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <p className="text-lg font-semibold text-foreground mb-2">Access Denied</p>
        <p className="text-sm text-muted-foreground mb-4">You don't have admin privileges.</p>
        <Link to="/" className="bg-primary text-primary-foreground px-6 py-2 rounded text-sm font-semibold">Go Home</Link>
      </div>
    </div>
  );

  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
  const totalOrders = orders.length;
  const totalProducts = products.length;

  const sidebarItems: { icon: typeof LayoutDashboard; label: string; tab: Tab }[] = [
    { icon: LayoutDashboard, label: "Dashboard", tab: "dashboard" },
    { icon: Package, label: "Products", tab: "products" },
    { icon: ShoppingCart, label: "Orders", tab: "orders" },
    { icon: Users, label: "Customers", tab: "customers" },
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
      <aside className={`bg-secondary text-secondary-foreground ${sidebarOpen ? "w-60" : "w-16"} transition-all duration-200 flex flex-col min-h-screen hidden md:flex`}>
        <div className="p-4 border-b border-secondary-foreground/10">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="AutozPro" className="h-8" />
            {sidebarOpen && <span className="font-bold text-sm">Admin</span>}
          </Link>
        </div>
        <nav className="flex-1 py-4">
          {sidebarItems.map((item) => (
            <button
              key={item.tab}
              onClick={() => setActiveTab(item.tab)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${activeTab === item.tab ? "bg-sidebar-accent text-primary font-semibold" : "text-secondary-foreground/70 hover:text-secondary-foreground hover:bg-sidebar-accent/50"}`}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              {sidebarOpen && item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-secondary-foreground/10 space-y-2">
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
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="hidden md:block p-2 border border-border rounded hover:bg-muted transition-colors">
            <ChevronDown className={`w-4 h-4 transition-transform ${sidebarOpen ? "rotate-90" : "-rotate-90"}`} />
          </button>
        </header>

        <div className="p-4 md:p-6">
          {activeTab === "dashboard" && <DashboardTab totalRevenue={totalRevenue} totalOrders={totalOrders} totalProducts={totalProducts} orders={orders} />}
          {activeTab === "products" && (
            <ProductsTab
              products={products}
              onEdit={(p: Product) => { setEditingProduct(p); setShowProductForm(true); }}
              onDelete={(id: string) => { deleteProduct(id); toast.success("Product deleted"); }}
              onAdd={() => { setEditingProduct(null); setShowProductForm(true); }}
              showForm={showProductForm}
              editingProduct={editingProduct}
              onSave={handleSaveProduct}
              onCancel={() => { setShowProductForm(false); setEditingProduct(null); }}
            />
          )}
          {activeTab === "orders" && <OrdersTab orders={orders} onUpdateStatus={updateOrderStatus} />}
          {activeTab === "customers" && <CustomersTab orders={orders} />}
          {activeTab === "settings" && <SettingsTab onSignOut={signOut} />}
        </div>
      </main>
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, trend }: { title: string; value: string; icon: typeof TrendingUp; trend?: string }) => (
  <div className="bg-card border border-border rounded-lg p-4">
    <div className="flex items-center justify-between mb-2">
      <span className="text-xs text-muted-foreground">{title}</span>
      <Icon className="w-4 h-4 text-muted-foreground" />
    </div>
    <p className="text-xl md:text-2xl font-bold text-foreground">{value}</p>
    {trend && <p className="text-xs text-success mt-1">↑ {trend}</p>}
  </div>
);

const DashboardTab = ({ totalRevenue, totalOrders, totalProducts, orders }: any) => (
  <div className="space-y-6">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
      <StatCard title="Total Revenue" value={`KSH ${totalRevenue.toLocaleString()}`} icon={DollarSign} trend="12% from last month" />
      <StatCard title="Total Orders" value={totalOrders} icon={ShoppingCart} trend="8% from last month" />
      <StatCard title="Total Products" value={totalProducts} icon={Package} />
      <StatCard title="Page Views" value="1,234" icon={Eye} trend="5% from last month" />
    </div>
    <div className="bg-card border border-border rounded-lg p-4 overflow-x-auto">
      <h3 className="font-semibold text-sm text-foreground mb-3">Recent Orders</h3>
      <table className="w-full text-sm min-w-[500px]">
        <thead><tr className="border-b border-border text-left text-xs text-muted-foreground">
          <th className="pb-2 font-medium">Order ID</th><th className="pb-2 font-medium">Customer</th><th className="pb-2 font-medium">Total</th><th className="pb-2 font-medium">Status</th><th className="pb-2 font-medium">Date</th>
        </tr></thead>
        <tbody>
          {orders.slice(0, 5).map((order: any) => (
            <tr key={order.id} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
              <td className="py-2.5 font-medium text-foreground">{order.id}</td>
              <td className="py-2.5 text-muted-foreground">{order.customer}</td>
              <td className="py-2.5 text-foreground">KSH {order.total.toLocaleString()}</td>
              <td className="py-2.5"><StatusBadge status={order.status} /></td>
              <td className="py-2.5 text-muted-foreground">{order.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const StatusBadge = ({ status }: { status: string }) => {
  const colors: Record<string, string> = {
    pending: "bg-warning/10 text-warning",
    processing: "bg-primary/10 text-primary",
    shipped: "bg-blue-100 text-blue-700",
    delivered: "bg-success/10 text-success",
    cancelled: "bg-destructive/10 text-destructive",
  };
  return (
    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${colors[status] || ""}`}>
      {status}
    </span>
  );
};

const ProductsTab = ({ products, onEdit, onDelete, onAdd, showForm, editingProduct, onSave, onCancel }: any) => {
  const [formData, setFormData] = useState<Partial<Product>>({ name: "", price: 0, category: "", description: "" });
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startEdit = (p: Product | null) => {
    if (p) {
      setFormData({ name: p.name, price: p.price, category: p.category, description: p.description || "", image: p.image });
      setImagePreviews(p.images && p.images.length > 0 ? p.images : p.image ? [p.image] : []);
    } else {
      setFormData({ name: "", price: 0, category: "", description: "" });
      setImagePreviews([]);
    }
    setImageFiles([]);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const totalImages = imagePreviews.length + files.length;
    if (totalImages > 5) {
      toast.error("Maximum 5 images per product");
      return;
    }
    setImageFiles((prev) => [...prev, ...files]);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreviews((prev) => [...prev, reader.result as string]);
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    // If it's a new file (not an existing URL), remove from files too
    const existingCount = editingProduct?.images?.length || (editingProduct?.image ? 1 : 0);
    if (index >= existingCount) {
      setImageFiles((prev) => prev.filter((_, i) => i !== (index - existingCount)));
    }
  };

  const handleSave = async () => {
    setUploading(true);
    let uploadedUrls: string[] = imagePreviews.filter((p) => p.startsWith("http"));
    
    for (const file of imageFiles) {
      const fileName = `${Date.now()}-${file.name}`;
      const { data, error } = await supabase.storage.from("product-images").upload(fileName, file);
      if (error) {
        toast.error(`Failed to upload ${file.name}`);
        continue;
      }
      const { data: { publicUrl } } = supabase.storage.from("product-images").getPublicUrl(data.path);
      uploadedUrls.push(publicUrl);
    }

    onSave({
      ...formData,
      image: uploadedUrls[0] || formData.image || "",
      images: uploadedUrls,
    });
    setUploading(false);
    setImageFiles([]);
    setImagePreviews([]);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{products.length} products</p>
        <button onClick={() => { onAdd(); startEdit(null); }} className="bg-primary text-primary-foreground px-4 py-2 rounded text-xs font-semibold flex items-center gap-1 hover:opacity-90 transition-opacity">
          <Plus className="w-3 h-3" /> Add Product
        </button>
      </div>

      {showForm && (
        <div className="bg-card border border-border rounded-lg p-4 space-y-3">
          <h3 className="font-semibold text-sm text-foreground">{editingProduct ? "Edit Product" : "Add Product"}</h3>
          <input placeholder="Product Name" value={formData.name || ""} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full border border-border rounded px-3 py-2 text-sm bg-background" />
          <div className="grid grid-cols-2 gap-3">
            <input type="number" placeholder="Price" value={formData.price || ""} onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
              className="border border-border rounded px-3 py-2 text-sm bg-background" />
            <input placeholder="Category" value={formData.category || ""} onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="border border-border rounded px-3 py-2 text-sm bg-background" />
          </div>
          <textarea placeholder="Description" value={formData.description || ""} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full border border-border rounded px-3 py-2 text-sm bg-background" rows={3} />
          
          {/* Image Upload */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-foreground flex items-center gap-1"><Image className="w-3 h-3" /> Product Images (up to 5)</label>
            <div className="flex flex-wrap gap-2">
              {imagePreviews.map((preview, i) => (
                <div key={i} className="relative w-20 h-20 border border-border rounded-md overflow-hidden">
                  <img src={preview} alt="" className="w-full h-full object-contain p-1" />
                  <button onClick={() => removeImage(i)} className="absolute top-0.5 right-0.5 bg-destructive text-destructive-foreground rounded-full p-0.5">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              {imagePreviews.length < 5 && (
                <button onClick={() => fileInputRef.current?.click()}
                  className="w-20 h-20 border-2 border-dashed border-border rounded-md flex flex-col items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-colors">
                  <Upload className="w-4 h-4" />
                  <span className="text-[9px] mt-0.5">Upload</span>
                </button>
              )}
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleImageSelect} className="hidden" />
          </div>

          <div className="flex gap-2">
            <button onClick={handleSave} disabled={uploading} className="bg-primary text-primary-foreground px-4 py-2 rounded text-xs font-semibold disabled:opacity-50">
              {uploading ? "Uploading..." : "Save"}
            </button>
            <button onClick={onCancel} className="border border-border px-4 py-2 rounded text-xs">Cancel</button>
          </div>
        </div>
      )}

      <div className="bg-card border border-border rounded-lg overflow-x-auto">
        <table className="w-full text-sm min-w-[600px]">
          <thead><tr className="border-b border-border bg-muted/50 text-left text-xs text-muted-foreground">
            <th className="p-3 font-medium">Product</th><th className="p-3 font-medium">Category</th><th className="p-3 font-medium">Price</th><th className="p-3 font-medium">Images</th><th className="p-3 font-medium">Stock</th><th className="p-3 font-medium">Actions</th>
          </tr></thead>
          <tbody>
            {products.map((p: Product) => (
              <tr key={p.id} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                <td className="p-3 flex items-center gap-3">
                  <img src={p.images && p.images.length > 0 ? p.images[0] : p.image} alt={p.name} className="w-10 h-10 object-contain rounded" />
                  <span className="font-medium text-foreground text-xs line-clamp-1">{p.name}</span>
                </td>
                <td className="p-3 text-xs text-muted-foreground">{p.category}</td>
                <td className="p-3 text-xs font-medium text-foreground">KSH {p.price.toLocaleString()}</td>
                <td className="p-3 text-xs text-muted-foreground">{p.images ? p.images.length : 1}</td>
                <td className="p-3"><span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${p.inStock ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}>{p.inStock ? "In Stock" : "Out"}</span></td>
                <td className="p-3 flex gap-1">
                  <button onClick={() => { onEdit(p); startEdit(p); }} className="p-1.5 border border-border rounded hover:bg-muted transition-colors"><Edit className="w-3 h-3" /></button>
                  <button onClick={() => onDelete(p.id)} className="p-1.5 border border-border rounded hover:bg-destructive/10 text-destructive transition-colors"><Trash2 className="w-3 h-3" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const OrdersTab = ({ orders, onUpdateStatus }: any) => (
  <div className="bg-card border border-border rounded-lg overflow-x-auto">
    <table className="w-full text-sm min-w-[600px]">
      <thead><tr className="border-b border-border bg-muted/50 text-left text-xs text-muted-foreground">
        <th className="p-3 font-medium">Order ID</th><th className="p-3 font-medium">Customer</th><th className="p-3 font-medium">Total</th><th className="p-3 font-medium">Status</th><th className="p-3 font-medium">Date</th><th className="p-3 font-medium">Actions</th>
      </tr></thead>
      <tbody>
        {orders.map((order: any) => (
          <tr key={order.id} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
            <td className="p-3 font-medium text-foreground">{order.id}</td>
            <td className="p-3 text-muted-foreground">{order.customer}</td>
            <td className="p-3 font-medium text-foreground">KSH {order.total.toLocaleString()}</td>
            <td className="p-3"><StatusBadge status={order.status} /></td>
            <td className="p-3 text-muted-foreground text-xs">{order.date}</td>
            <td className="p-3">
              <select
                value={order.status}
                onChange={(e) => { onUpdateStatus(order.id, e.target.value); toast.success(`Order ${order.id} updated`); }}
                className="border border-border rounded px-2 py-1 text-xs bg-background"
              >
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

const CustomersTab = ({ orders }: any) => {
  const customers = orders.reduce((acc: any[], order: any) => {
    if (!acc.find((c: any) => c.email === order.email)) {
      acc.push({ name: order.customer, email: order.email, orders: orders.filter((o: any) => o.email === order.email).length, total: orders.filter((o: any) => o.email === order.email).reduce((s: number, o: any) => s + o.total, 0) });
    }
    return acc;
  }, []);

  return (
    <div className="bg-card border border-border rounded-lg overflow-x-auto">
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
              <td className="p-3 font-medium text-foreground">${c.total.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const SettingsTab = ({ onSignOut }: { onSignOut: () => void }) => (
  <div className="space-y-4">
    <div className="bg-card border border-border rounded-lg p-6 space-y-4">
      <h3 className="font-semibold text-foreground">Store Settings</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><label className="text-xs text-muted-foreground block mb-1">Store Name</label><input defaultValue="AutozPro" className="w-full border border-border rounded px-3 py-2 text-sm bg-background" /></div>
        <div><label className="text-xs text-muted-foreground block mb-1">Contact Email</label><input defaultValue="support@autozpro.com" className="w-full border border-border rounded px-3 py-2 text-sm bg-background" /></div>
      </div>
      <button className="bg-primary text-primary-foreground px-6 py-2 rounded text-sm font-semibold hover:opacity-90 transition-opacity">Save Settings</button>
    </div>
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="font-semibold text-foreground mb-4">Account</h3>
      <button onClick={onSignOut} className="bg-destructive text-destructive-foreground px-6 py-2 rounded text-sm font-semibold hover:opacity-90 transition-opacity">Sign Out</button>
    </div>
  </div>
);

export default AdminPage;
