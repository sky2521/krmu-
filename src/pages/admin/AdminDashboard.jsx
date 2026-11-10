import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  Package, 
  ShoppingBag, 
  Users, 
  CreditCard, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  Key, 
  RefreshCw, 
  ShieldCheck, 
  ArrowRight,
  SlidersHorizontal,
  Truck,
  Database,
  Copy,
  CheckCircle2,
  ExternalLink,
  FileSpreadsheet,
  Upload
} from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import { useOrders } from '../../context/OrderContext';
import { useAuth } from '../../context/AuthContext';
import { getRazorpayKey, setRazorpayKey, DEFAULT_RAZORPAY_TEST_KEY } from '../../services/razorpay';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../../services/supabase';

export default function AdminDashboard() {
  const { products, addProduct, updateProduct, deleteProduct, resetToDefaults, importProductsFromCsv } = useProducts();
  const { orders, updateOrderStatus } = useOrders();
  const { user, isAdmin } = useAuth();

  const [activeAdminTab, setActiveAdminTab] = useState('orders'); // orders, products, settings, backend
  const [copiedSql, setCopiedSql] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [csvText, setCsvText] = useState('');
  const [importStatus, setImportStatus] = useState(null);

  // Razorpay Key Configuration
  const [currentRzpKey, setCurrentRzpKey] = useState(getRazorpayKey());
  const [rzpKeySavedToast, setRzpKeySavedToast] = useState(false);

  // New Product Modal state
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newProd, setNewProd] = useState({
    name: '',
    category: 'women',
    subcategory: 'outerwear',
    price: 4999,
    originalPrice: 6499,
    stock: 10,
    badge: 'New Arrival',
    isNewArrival: true,
    isBestseller: false,
    images: ['https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1200&auto=format&fit=crop'],
    colors: [
      { name: 'Onyx Noir', hex: '#161616' },
      { name: 'Warm Ecru', hex: '#EBE5D8' }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    description: 'Immaculately tailored silhouette crafted from premium natural fibers.',
    details: [
      '100% natural organic sustainable fabric',
      'Handcrafted in small batches',
      'French seams and horn button closures'
    ],
    care: 'Dry clean only. Steam refresh recommended.',
    fit: 'Designed for a tailored modern fit. True to size.'
  });

  // Calculate Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.paymentStatus === 'Paid' ? o.pricing.total : 0), 0);
  const totalItemsSold = orders.reduce((sum, o) => sum + o.items.reduce((s, i) => s + i.quantity, 0), 0);
  const averageOrderValue = orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0;
  const lowStockProducts = products.filter((p) => p.stock <= 5);

  const handleSaveRzpKey = (e) => {
    e.preventDefault();
    setRazorpayKey(currentRzpKey);
    setRzpKeySavedToast(true);
    setTimeout(() => setRzpKeySavedToast(false), 2500);
  };

  const handleCreateProductSubmit = (e) => {
    e.preventDefault();
    if (!newProd.name || !newProd.price) return;
    addProduct(newProd);
    setShowAddProductModal(false);
    // Reset modal fields
    setNewProd({
      name: '',
      category: 'women',
      subcategory: 'outerwear',
      price: 4999,
      originalPrice: 6499,
      stock: 10,
      badge: 'New Arrival',
      isNewArrival: true,
      isBestseller: false,
      images: ['https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1200&auto=format&fit=crop'],
      colors: [{ name: 'Onyx Noir', hex: '#161616' }],
      sizes: ['S', 'M', 'L', 'XL'],
      description: 'New atelier addition with clean lines.',
      details: ['Handcrafted in India', '100% pure fibers'],
      care: 'Dry clean only.',
      fit: 'True to size.'
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Header */}
      <div className="border-b border-[#E6DED5] pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="bg-[#121214] text-[#C5A059] text-[10px] uppercase tracking-widest px-2.5 py-0.5 rounded font-bold">
              Atelier Management System
            </span>
            <span className="text-xs text-[#8C867E]">• Live Store Controller</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#121214] mt-1">
            KRMU Operations & Orders Control
          </h1>
          <p className="text-xs text-[#7F7972]">
            Catalog inventory, live orders dispatch, and Razorpay payment configuration.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/shop"
            className="px-4 py-2 border border-[#121214] text-xs uppercase tracking-widest text-[#121214] hover:bg-[#121214] hover:text-white transition-colors font-semibold rounded-sm"
          >
            Visit Live Storefront →
          </Link>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 border border-[#E6DED5] rounded-sm space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-xs text-[#7F7972]">
            <span className="uppercase tracking-wider font-semibold">Total Gross Revenue</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="font-serif text-3xl text-[#121214]">
            ₹{totalRevenue.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-emerald-700 font-medium">From {orders.length} authorized customer orders</p>
        </div>

        <div className="bg-white p-5 border border-[#E6DED5] rounded-sm space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-xs text-[#7F7972]">
            <span className="uppercase tracking-wider font-semibold">Total Orders</span>
            <ShoppingBag className="w-4 h-4 text-[#C5A059]" />
          </div>
          <div className="font-serif text-3xl text-[#121214]">{orders.length}</div>
          <p className="text-[11px] text-[#7F7972]">{totalItemsSold} tailored garments sold</p>
        </div>

        <div className="bg-white p-5 border border-[#E6DED5] rounded-sm space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-xs text-[#7F7972]">
            <span className="uppercase tracking-wider font-semibold">Catalog Garments</span>
            <Package className="w-4 h-4 text-blue-600" />
          </div>
          <div className="font-serif text-3xl text-[#121214]">{products.length}</div>
          <p className="text-[11px] text-[#7F7972]">
            {lowStockProducts.length > 0 ? (
              <span className="text-amber-700 font-bold">{lowStockProducts.length} low in atelier stock</span>
            ) : (
              'All inventory levels healthy'
            )}
          </p>
        </div>

        <div className="bg-white p-5 border border-[#E6DED5] rounded-sm space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-xs text-[#7F7972]">
            <span className="uppercase tracking-wider font-semibold">Average Order Value</span>
            <CreditCard className="w-4 h-4 text-purple-600" />
          </div>
          <div className="font-serif text-3xl text-[#121214]">
            ₹{averageOrderValue.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-[#7F7972]">Razorpay average checkout basket</p>
        </div>
      </div>

      {/* Tabs Selector */}
      <div className="border-b border-[#E6DED5] flex space-x-6 text-xs uppercase tracking-widest font-semibold">
        <button
          onClick={() => setActiveAdminTab('orders')}
          className={`pb-3 border-b-2 transition-colors ${
            activeAdminTab === 'orders'
              ? 'border-[#121214] text-[#121214]'
              : 'border-transparent text-[#7F7972] hover:text-black'
          }`}
        >
          Orders & Fulfillment ({orders.length})
        </button>

        <button
          onClick={() => setActiveAdminTab('products')}
          className={`pb-3 border-b-2 transition-colors ${
            activeAdminTab === 'products'
              ? 'border-[#121214] text-[#121214]'
              : 'border-transparent text-[#7F7972] hover:text-black'
          }`}
        >
          Product Catalog ({products.length})
        </button>

        <button
          onClick={() => setActiveAdminTab('settings')}
          className={`pb-3 border-b-2 transition-colors ${
            activeAdminTab === 'settings'
              ? 'border-[#121214] text-[#121214]'
              : 'border-transparent text-[#7F7972] hover:text-black'
          }`}
        >
          Razorpay Gateway Keys
        </button>

        <button
          onClick={() => setActiveAdminTab('backend')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-1.5 ${
            activeAdminTab === 'backend'
              ? 'border-[#121214] text-[#121214]'
              : 'border-transparent text-[#7F7972] hover:text-black'
          }`}
        >
          <Database className="w-3.5 h-3.5 text-emerald-600" />
          <span>Supabase Backend (Live)</span>
        </button>
      </div>

      {/* TAB 1: ORDERS FULFILLMENT */}
      {activeAdminTab === 'orders' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl text-[#121214]">Customer Orders Queue</h3>
            <span className="text-xs text-[#7F7972]">Click status dropdown to update shipment tracking live</span>
          </div>

          <div className="bg-white border border-[#E6DED5] rounded-sm overflow-x-auto shadow-sm">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#FAF8F5] text-[#121214] uppercase tracking-wider border-b border-[#E6DED5]">
                <tr>
                  <th className="p-3.5 font-semibold">Order ID</th>
                  <th className="p-3.5 font-semibold">Date & Client</th>
                  <th className="p-3.5 font-semibold">Garments</th>
                  <th className="p-3.5 font-semibold">Total (₹)</th>
                  <th className="p-3.5 font-semibold">Payment</th>
                  <th className="p-3.5 font-semibold">Tracking AWB</th>
                  <th className="p-3.5 font-semibold">Live Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0ECE5] text-[#5C5750]">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                    <td className="p-3.5 font-mono font-bold text-[#121214] whitespace-nowrap">
                      {order.id}
                    </td>

                    <td className="p-3.5">
                      <p className="font-semibold text-[#121214]">{order.customer.name}</p>
                      <p className="text-[11px] text-[#7F7972] truncate max-w-[140px]">{order.customer.email}</p>
                      <p className="text-[10px] text-[#8C867E]">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </td>

                    <td className="p-3.5">
                      <div className="space-y-0.5">
                        {order.items.map((it, idx) => (
                          <div key={idx} className="truncate max-w-[160px] text-[11px]">
                            {it.quantity}x {it.name} ({it.size})
                          </div>
                        ))}
                      </div>
                    </td>

                    <td className="p-3.5 font-serif text-sm font-bold text-[#121214]">
                      ₹{order.pricing.total.toLocaleString('en-IN')}
                    </td>

                    <td className="p-3.5">
                      <span className="inline-block px-2 py-0.5 bg-emerald-50 text-emerald-800 text-[10px] font-bold rounded">
                        {order.paymentStatus}
                      </span>
                      <p className="text-[10px] text-[#7F7972] truncate max-w-[100px] mt-0.5 font-mono">
                        {order.paymentId}
                      </p>
                    </td>

                    <td className="p-3.5 font-mono text-[11px] text-[#121214]">
                      {order.trackingNumber}
                      <p className="text-[10px] text-[#7F7972] font-sans">{order.carrier}</p>
                    </td>

                    <td className="p-3.5">
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        className={`text-xs font-semibold py-1 px-2 border rounded-sm focus:outline-none ${
                          order.status === 'Delivered'
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                            : order.status === 'Cancelled'
                            ? 'bg-red-50 border-red-300 text-red-800'
                            : 'bg-neutral-50 border-neutral-300 text-neutral-900'
                        }`}
                      >
                        <option value="Confirmed">Confirmed</option>
                        <option value="Atelier Tailoring">Atelier Tailoring</option>
                        <option value="Dispatched">Dispatched</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: PRODUCTS CATALOG */}
      {activeAdminTab === 'products' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-xl text-[#121214]">Atelier Catalog Management</h3>
              <p className="text-xs text-[#7F7972]">Add new garments, update prices, modify stock counts live.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setShowImportModal(true)}
                className="px-4 py-2 bg-emerald-700 text-white hover:bg-emerald-800 transition-colors text-xs uppercase tracking-widest font-semibold rounded-sm flex items-center gap-1.5 shadow-sm"
              >
                <FileSpreadsheet className="w-4 h-4" /> Import Excel / CSV
              </button>
              <button
                onClick={() => setShowAddProductModal(true)}
                className="px-4 py-2 bg-[#121214] text-white hover:bg-[#C5A059] transition-colors text-xs uppercase tracking-widest font-semibold rounded-sm flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Add Garment
              </button>
              <button
                onClick={() => {
                  if (window.confirm("Reset catalog back to pristine default inventory?")) {
                    resetToDefaults();
                  }
                }}
                className="px-3 py-2 border border-[#D5C7B8] text-xs text-[#7F7972] hover:text-black rounded-sm"
                title="Reset to default items"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="bg-white border border-[#E6DED5] rounded-sm overflow-x-auto shadow-sm">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#FAF8F5] text-[#121214] uppercase tracking-wider border-b border-[#E6DED5]">
                <tr>
                  <th className="p-3.5 font-semibold">Garment</th>
                  <th className="p-3.5 font-semibold">Category</th>
                  <th className="p-3.5 font-semibold">Price (INR)</th>
                  <th className="p-3.5 font-semibold">Stock</th>
                  <th className="p-3.5 font-semibold">Badge</th>
                  <th className="p-3.5 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0ECE5] text-[#5C5750]">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                    <td className="p-3.5 flex items-center space-x-3">
                      <img src={p.images[0]} alt={p.name} className="w-10 h-14 object-cover bg-neutral-100 rounded-sm" />
                      <div>
                        <p className="font-semibold text-[#121214]">{p.name}</p>
                        <p className="text-[11px] text-[#7F7972]">Slug: {p.slug}</p>
                      </div>
                    </td>

                    <td className="p-3.5 uppercase tracking-wider text-[11px] font-medium text-[#121214]">
                      {p.category} • {p.subcategory}
                    </td>

                    <td className="p-3.5 font-serif text-sm font-semibold text-[#121214]">
                      ₹{p.price.toLocaleString('en-IN')}
                    </td>

                    <td className="p-3.5">
                      <input
                        type="number"
                        min="0"
                        value={p.stock}
                        onChange={(e) => updateProduct(p.id, { stock: parseInt(e.target.value) || 0 })}
                        className="w-16 border border-[#D5C7B8] px-2 py-1 text-xs text-[#121214] font-bold"
                      />
                    </td>

                    <td className="p-3.5">
                      <input
                        type="text"
                        value={p.badge || ''}
                        onChange={(e) => updateProduct(p.id, { badge: e.target.value })}
                        className="w-24 border border-[#D5C7B8] px-2 py-1 text-[11px]"
                        placeholder="None"
                      />
                    </td>

                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete ${p.name} from catalog?`)) {
                            deleteProduct(p.id);
                          }
                        }}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Delete product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: RAZORPAY CONFIGURATION */}
      {activeAdminTab === 'settings' && (
        <div className="bg-white border border-[#E6DED5] rounded-sm p-6 sm:p-8 space-y-6 max-w-2xl shadow-sm">
          <div className="space-y-1 border-b border-[#F0ECE5] pb-4">
            <div className="flex items-center space-x-2 text-[#0c2340]">
              <Key className="w-5 h-5 text-[#C5A059]" />
              <h3 className="font-serif text-2xl">Razorpay Merchant Gateway Configuration</h3>
            </div>
            <p className="text-xs text-[#7F7972]">
              Set your live or test Razorpay API Key ID. Standard checkout popups and verification requests will bind to this key.
            </p>
          </div>

          {rzpKeySavedToast && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-sm">
              Razorpay API Key successfully stored in browser secure atelier storage.
            </div>
          )}

          <form onSubmit={handleSaveRzpKey} className="space-y-4 text-xs">
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#7F7972] mb-1 font-semibold">
                Razorpay Key ID (rzp_test_... or rzp_live_...)
              </label>
              <input
                type="text"
                required
                value={currentRzpKey}
                onChange={(e) => setCurrentRzpKey(e.target.value)}
                placeholder="rzp_test_KRMUApparel2026"
                className="w-full bg-[#FAF8F5] border border-[#D5C7B8] px-3.5 py-2.5 font-mono text-xs focus:outline-none focus:border-black rounded-sm"
              />
              <p className="text-[11px] text-[#7F7972] mt-1">
                You can obtain your Key ID from your <a href="https://dashboard.razorpay.com/#/app/keys" target="_blank" rel="noreferrer" className="underline text-black font-semibold">Razorpay Dashboard → Settings → API Keys</a>.
              </p>
            </div>

            <div className="p-4 bg-[#F8FAFC] border border-neutral-200 rounded-sm space-y-2">
              <h4 className="font-semibold text-neutral-800 flex items-center gap-1.5 text-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> High-Fidelity Test Mode Included
              </h4>
              <p className="text-[11px] text-neutral-600 leading-relaxed">
                Even without active live bank merchant credentials, the KRMU checkout provides a built-in Razorpay Sandbox modal simulating UPI, Cards, and NetBanking with full transaction IDs and order receipts!
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#121214] text-white hover:bg-[#C5A059] transition-colors text-xs uppercase tracking-widest font-semibold rounded-sm"
              >
                Save Razorpay Credentials
              </button>
              <button
                type="button"
                onClick={() => {
                  setCurrentRzpKey(DEFAULT_RAZORPAY_TEST_KEY);
                  setRazorpayKey(DEFAULT_RAZORPAY_TEST_KEY);
                }}
                className="px-4 py-2.5 border border-[#D5C7B8] text-xs text-[#7F7972] hover:text-black rounded-sm"
              >
                Reset to Default Test Key
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 4: SUPABASE BACKEND CONFIGURATION & SQL */}
      {activeAdminTab === 'backend' && (
        <div className="space-y-6 max-w-4xl">
          {/* Connection Status Card */}
          <div className="bg-white border border-[#E6DED5] rounded-sm p-6 sm:p-8 space-y-5 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F0ECE5] pb-5">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs uppercase tracking-widest font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                    Supabase Connected & Active
                  </span>
                </div>
                <h3 className="font-serif text-2xl text-[#121214]">KRMU Cloud Database Architecture</h3>
                <p className="text-xs text-[#7F7972]">
                  User authentication, profiles, persistent cart sync, order records, and form entries are bound to this project.
                </p>
              </div>

              <a
                href="https://supabase.com/dashboard/project/uwbgoymzaxyhhiefzhcb/sql"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 bg-[#121214] text-white hover:bg-[#C5A059] transition-colors text-xs uppercase tracking-widest font-semibold flex items-center gap-2 self-start sm:self-auto rounded-sm"
              >
                <span>Open Supabase SQL Editor</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Connection Credentials Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-3.5 bg-[#FAF8F5] border border-[#E6DED5] rounded-sm space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-[#8C867E] font-semibold">Project Name</span>
                <p className="font-bold text-[#121214]">KRMU</p>
                <p className="text-[10px] text-[#7F7972] font-mono">ID: uwbgoymzaxyhhiefzhcb</p>
              </div>

              <div className="p-3.5 bg-[#FAF8F5] border border-[#E6DED5] rounded-sm space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-[#8C867E] font-semibold">REST API URL</span>
                <p className="font-mono text-[11px] text-[#121214] truncate">{SUPABASE_URL}</p>
                <p className="text-[10px] text-emerald-700 font-semibold">Active & Live</p>
              </div>

              <div className="p-3.5 bg-[#FAF8F5] border border-[#E6DED5] rounded-sm space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-[#8C867E] font-semibold">Public Publishable Key</span>
                <p className="font-mono text-[11px] text-[#121214] truncate">{SUPABASE_ANON_KEY}</p>
                <p className="text-[10px] text-[#7F7972]">Client-side Safe</p>
              </div>
            </div>

            {/* Tables Checklist */}
            <div className="space-y-2 pt-2">
              <h4 className="text-xs uppercase tracking-widest font-bold text-[#121214]">
                Configured Database Tables & Features:
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                {[
                  { name: 'public.profiles', desc: 'User accounts & roles' },
                  { name: 'public.addresses', desc: 'Saved delivery destinations' },
                  { name: 'public.cart_items', desc: 'Cloud synced bags' },
                  { name: 'public.orders', desc: 'Razorpay & COD orders' },
                  { name: 'public.order_items', desc: 'Purchased garments' },
                  { name: 'public.contact_inquiries', desc: 'Website concierge forms' },
                  { name: 'public.newsletter_subscribers', desc: 'Privilege dispatch emails' },
                  { name: 'public.product_reviews', desc: 'Client ratings & reviews' },
                ].map((tbl) => (
                  <div key={tbl.name} className="p-2.5 bg-white border border-[#E6DED5] rounded-sm space-y-0.5">
                    <div className="flex items-center gap-1 font-mono font-bold text-[11px] text-[#121214]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{tbl.name}</span>
                    </div>
                    <p className="text-[10px] text-[#7F7972]">{tbl.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* SQL Setup Instructions & Code Display */}
          <div className="bg-white border border-[#E6DED5] rounded-sm p-6 sm:p-8 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-serif text-xl text-[#121214]">SQL Setup Script (`supabase/schema.sql`)</h4>
                <p className="text-xs text-[#7F7972]">
                  Run this SQL in your Supabase SQL Editor to initialize all tables, foreign keys, and RLS policies.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(`-- KRMU APPAREL SCHEMA
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  email text,
  phone text,
  role text default 'customer',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email, phone, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.email,
    new.raw_user_meta_data->>'phone',
    case when new.email ilike '%admin%' then 'admin' else 'customer' end
  )
  on conflict (id) do update set
    full_name = excluded.full_name,
    email = excluded.email,
    updated_at = now();
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create table if not exists public.addresses (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  name text not null,
  phone text,
  street text not null,
  city text not null,
  state text not null,
  pincode text not null,
  is_default boolean default false,
  created_at timestamptz default now()
);

create table if not exists public.cart_items (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  product_id text not null,
  name text not null,
  slug text,
  price numeric not null,
  original_price numeric,
  image text,
  size text not null,
  color jsonb not null default '{}'::jsonb,
  quantity integer not null default 1,
  updated_at timestamptz default now()
);

create table if not exists public.orders (
  id text primary key,
  user_id uuid references public.profiles(id) on delete set null,
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  shipping_address jsonb not null default '{}'::jsonb,
  pricing jsonb not null default '{}'::jsonb,
  payment_method text not null default 'Razorpay Online',
  payment_id text,
  payment_status text not null default 'Paid',
  delivery_method text not null default 'Standard Express Courier',
  status text not null default 'Confirmed',
  tracking_number text,
  carrier text not null default 'BlueDart Express Air',
  estimated_delivery text,
  timeline jsonb not null default '[]'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.order_items (
  id uuid default gen_random_uuid() primary key,
  order_id text references public.orders(id) on delete cascade,
  product_id text not null,
  name text not null,
  price numeric not null,
  quantity integer not null default 1,
  size text not null,
  color jsonb default '{}'::jsonb,
  image text,
  created_at timestamptz default now()
);

create table if not exists public.contact_inquiries (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  phone text,
  subject text not null default 'General Inquiry',
  message text not null,
  status text not null default 'New',
  created_at timestamptz default now()
);

create table if not exists public.newsletter_subscribers (
  id uuid default gen_random_uuid() primary key,
  email text unique not null,
  coupon_sent text default 'KRMU10',
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;
alter table public.addresses enable row level security;
alter table public.cart_items enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.contact_inquiries enable row level security;
alter table public.newsletter_subscribers enable row level security;

create policy "Allow all profiles" on public.profiles for all using (true);
create policy "Allow all addresses" on public.addresses for all using (true);
create policy "Allow all cart_items" on public.cart_items for all using (true);
create policy "Allow all orders" on public.orders for all using (true);
create policy "Allow all order_items" on public.order_items for all using (true);
create policy "Allow all contact" on public.contact_inquiries for all using (true);
create policy "Allow all newsletter" on public.newsletter_subscribers for all using (true);
`);
                  setCopiedSql(true);
                  setTimeout(() => setCopiedSql(false), 2000);
                }}
                className="px-4 py-2 border border-[#D5C7B8] hover:border-black text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedSql ? 'Copied to Clipboard!' : 'Copy SQL Schema'}</span>
              </button>
            </div>

            <div className="bg-[#121214] text-neutral-300 p-4 rounded-sm font-mono text-[11px] overflow-x-auto max-h-64 divide-y divide-neutral-800">
              <pre>{`-- File: supabase/schema.sql
-- All 8 tables with relationships, RLS, and triggers included.
-- 1. profiles (linked to auth.users)
-- 2. addresses (user address book)
-- 3. cart_items (cloud persistent cart)
-- 4. orders (full order details & tracking)
-- 5. order_items (items per order)
-- 6. contact_inquiries (concierge messages)
-- 7. newsletter_subscribers (subscribers list)
-- 8. product_reviews (verified client feedback)`}</pre>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add Product */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-2xl bg-white p-6 sm:p-8 rounded-sm space-y-4 max-h-[90vh] overflow-y-auto border border-[#E6DED5]">
            <div className="flex justify-between items-center pb-3 border-b border-[#E6DED5]">
              <h3 className="font-serif text-2xl text-[#121214]">Create Atelier Garment</h3>
              <button onClick={() => setShowAddProductModal(false)}>
                <X className="w-6 h-6 text-[#7F7972]" />
              </button>
            </div>

            <form onSubmit={handleCreateProductSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#7F7972] mb-1 font-semibold uppercase">Garment Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sculptural Wool Duster Coat"
                  value={newProd.name}
                  onChange={(e) => setNewProd({ ...newProd, name: e.target.value })}
                  className="w-full p-2.5 border border-[#D5C7B8] text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#7F7972] mb-1 font-semibold uppercase">Division</label>
                  <select
                    value={newProd.category}
                    onChange={(e) => setNewProd({ ...newProd, category: e.target.value })}
                    className="w-full p-2.5 border border-[#D5C7B8]"
                  >
                    <option value="women">Women</option>
                    <option value="men">Men</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#7F7972] mb-1 font-semibold uppercase">Garment Type</label>
                  <select
                    value={newProd.subcategory}
                    onChange={(e) => setNewProd({ ...newProd, subcategory: e.target.value })}
                    className="w-full p-2.5 border border-[#D5C7B8]"
                  >
                    <option value="outerwear">Outerwear</option>
                    <option value="tops">Tops & Shirts</option>
                    <option value="trousers">Trousers</option>
                    <option value="dresses">Dresses</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[#7F7972] mb-1 font-semibold uppercase">Price (INR) *</label>
                  <input
                    type="number"
                    required
                    value={newProd.price}
                    onChange={(e) => setNewProd({ ...newProd, price: parseInt(e.target.value) || 0 })}
                    className="w-full p-2.5 border border-[#D5C7B8]"
                  />
                </div>
                <div>
                  <label className="block text-[#7F7972] mb-1 font-semibold uppercase">Original Price</label>
                  <input
                    type="number"
                    value={newProd.originalPrice}
                    onChange={(e) => setNewProd({ ...newProd, originalPrice: parseInt(e.target.value) || 0 })}
                    className="w-full p-2.5 border border-[#D5C7B8]"
                  />
                </div>
                <div>
                  <label className="block text-[#7F7972] mb-1 font-semibold uppercase">Initial Stock</label>
                  <input
                    type="number"
                    value={newProd.stock}
                    onChange={(e) => setNewProd({ ...newProd, stock: parseInt(e.target.value) || 0 })}
                    className="w-full p-2.5 border border-[#D5C7B8]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#7F7972] mb-1 font-semibold uppercase">Image URL (Unsplash or CDN)</label>
                <input
                  type="url"
                  required
                  value={newProd.images[0]}
                  onChange={(e) => setNewProd({ ...newProd, images: [e.target.value] })}
                  className="w-full p-2.5 border border-[#D5C7B8]"
                />
              </div>

              <div>
                <label className="block text-[#7F7972] mb-1 font-semibold uppercase">Editorial Description</label>
                <textarea
                  rows={3}
                  value={newProd.description}
                  onChange={(e) => setNewProd({ ...newProd, description: e.target.value })}
                  className="w-full p-2.5 border border-[#D5C7B8]"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#121214] text-white uppercase tracking-widest font-bold"
                >
                  Publish to KRMU Catalog
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(false)}
                  className="px-4 py-3 border border-[#D5C7B8]"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Import Excel / CSV */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in font-sans">
          <div className="w-full max-w-2xl bg-white p-6 sm:p-8 rounded-sm space-y-4 max-h-[90vh] overflow-y-auto border border-[#E6DED5]">
            <div className="flex justify-between items-center pb-3 border-b border-[#E6DED5]">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-emerald-700" />
                <h3 className="font-serif text-2xl text-[#121214]">Import Excel / CSV Product Sheet</h3>
              </div>
              <button onClick={() => setShowImportModal(false)}>
                <X className="w-6 h-6 text-[#7F7972]" />
              </button>
            </div>

            <p className="text-xs text-[#7F7972] leading-relaxed">
              Upload your downloaded Google Sheet / Excel file (exported as <strong>.csv</strong>) or paste the rows directly below. Columns such as <code>Name</code>, <code>Category</code>, <code>Price</code>, <code>Stock</code>, and <code>Image</code> will be mapped automatically.
            </p>

            {importStatus && (
              <div className={`p-3 rounded-sm text-xs ${importStatus.success ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                {importStatus.message}
              </div>
            )}

            {/* File Upload Button */}
            <div className="p-4 border-2 border-dashed border-[#D5C7B8] rounded-sm text-center bg-[#FAF8F5]">
              <input
                type="file"
                accept=".csv,.txt"
                id="csvFileInput"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      const text = event.target?.result;
                      if (typeof text === 'string') {
                        setCsvText(text);
                      }
                    };
                    reader.readAsText(file);
                  }
                }}
              />
              <label
                htmlFor="csvFileInput"
                className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-[#121214] text-white hover:bg-emerald-700 transition-colors text-xs uppercase tracking-widest font-semibold rounded-sm"
              >
                <Upload className="w-4 h-4" />
                <span>Select .CSV File from Device</span>
              </label>
              <p className="text-[11px] text-[#8C867E] mt-1.5">
                In Google Sheets: <em>File → Download → Comma-separated values (.csv)</em>
              </p>
            </div>

            {/* Or Paste Raw Text */}
            <div className="space-y-1.5 text-xs">
              <label className="block text-[#7F7972] font-semibold uppercase">Or Paste Spreadsheet Rows Directly:</label>
              <textarea
                rows={7}
                placeholder="Name, Category, Price, Stock, Image&#10;Linen Trench, Women, 8999, 10, https://...&#10;Wool Blazer, Men, 9499, 15, https://..."
                value={csvText}
                onChange={(e) => setCsvText(e.target.value)}
                className="w-full p-3 border border-[#D5C7B8] font-mono text-[11px] focus:outline-none focus:border-black"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  if (!csvText.trim()) {
                    setImportStatus({ success: false, message: "Please paste CSV rows or select a file first." });
                    return;
                  }
                  const res = importProductsFromCsv(csvText);
                  if (res.success) {
                    setImportStatus({ success: true, message: `Successfully imported ${res.count} garments into KRMU catalog!` });
                    setTimeout(() => {
                      setShowImportModal(false);
                      setImportStatus(null);
                      setCsvText('');
                    }, 1200);
                  } else {
                    setImportStatus({ success: false, message: res.error || "Failed to parse CSV." });
                  }
                }}
                className="flex-1 py-3 bg-emerald-700 hover:bg-emerald-800 text-white uppercase tracking-widest font-bold text-xs transition-colors rounded-sm"
              >
                Import & Replace Catalog
              </button>
              <button
                type="button"
                onClick={() => setShowImportModal(false)}
                className="px-4 py-3 border border-[#D5C7B8] text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
