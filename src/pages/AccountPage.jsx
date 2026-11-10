import React, { useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { 
  User, 
  PackageCheck, 
  Heart, 
  MapPin, 
  LogOut, 
  Plus, 
  Trash2, 
  Truck, 
  Clock, 
  ShieldCheck, 
  SlidersHorizontal,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/product/ProductCard';

export default function AccountPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'orders'; // orders, wishlist, addresses, profile
  const { user, isAuthenticated, isAdmin, logout, openLogin, addAddress, deleteAddress, updateProfile } = useAuth();
  const { orders, cancelOrder } = useOrders();
  const { wishlist } = useWishlist();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  // Address form modal
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newAddr, setNewAddr] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: false
  });

  // Profile form
  const [profileName, setProfileName] = useState(user?.name || '');
  const [profilePhone, setProfilePhone] = useState(user?.phone || '');
  const [profileSavedToast, setProfileSavedToast] = useState(false);

  const setTab = (tab) => {
    setSearchParams({ tab });
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-6">
        <div className="w-16 h-16 bg-[#F3EFEA] rounded-full flex items-center justify-center mx-auto text-[#121214]">
          <User className="w-8 h-8 stroke-1" />
        </div>
        <div className="space-y-2">
          <h2 className="font-serif text-3xl sm:text-4xl text-[#121214]">Atelier Client Portal</h2>
          <p className="text-xs sm:text-sm text-[#7F7972] max-w-sm mx-auto">
            Please sign in to access your order history, delivery tracking, and saved preferences.
          </p>
        </div>
        <button
          onClick={openLogin}
          className="px-8 py-3.5 bg-[#121214] text-white hover:bg-[#C5A059] transition-colors text-xs uppercase tracking-[0.25em] font-semibold"
        >
          Sign In / Create Account
        </button>
      </div>
    );
  }

  const handleAddAddress = (e) => {
    e.preventDefault();
    if (!newAddr.street || !newAddr.city || !newAddr.pincode) return;
    addAddress(newAddr);
    setShowAddressModal(false);
    setNewAddr({ name: user.name, phone: user.phone, street: '', city: '', state: '', pincode: '', isDefault: false });
  };

  const handleProfileSave = (e) => {
    e.preventDefault();
    updateProfile({ name: profileName, phone: profilePhone });
    setProfileSavedToast(true);
    setTimeout(() => setProfileSavedToast(false), 2500);
  };

  const handleCancelOrder = (orderId) => {
    if (window.confirm(`Are you sure you want to cancel order ${orderId}? If already paid via Razorpay, a full refund will be initiated to your original payment method.`)) {
      cancelOrder(orderId, "Customer requested cancellation via portal");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-[#E6DED5] pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#8C867E]">
            Client Account
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#121214] mt-0.5">
            Welcome, {user.name}
          </h1>
          <p className="text-xs text-[#7F7972]">{user.email} • Client ID #{user.id.slice(-6)}</p>
        </div>

        <div className="flex items-center gap-3">
          {isAdmin && (
            <Link
              to="/admin"
              className="px-4 py-2 bg-[#121214] text-[#C5A059] hover:bg-black transition-colors text-xs uppercase tracking-widest font-semibold rounded-sm flex items-center gap-1.5"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" /> Admin Dashboard
            </Link>
          )}

          <button
            onClick={logout}
            className="px-4 py-2 border border-[#D5C7B8] text-xs uppercase tracking-widest text-red-600 hover:bg-red-50 transition-colors font-medium flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </button>
        </div>
      </div>

      {/* Grid Layout: Sidebar Tabs + Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Navigation Sidebar */}
        <aside className="lg:col-span-3 space-y-1">
          <button
            onClick={() => setTab('orders')}
            className={`w-full text-left px-4 py-3 flex items-center space-x-3 text-xs uppercase tracking-wider transition-colors rounded-sm font-semibold ${
              activeTab === 'orders' ? 'bg-[#121214] text-white' : 'text-[#7F7972] hover:bg-[#F3EFEA] hover:text-black'
            }`}
          >
            <PackageCheck className="w-4 h-4" />
            <span>Orders & Tracking ({orders.length})</span>
          </button>

          <button
            onClick={() => setTab('wishlist')}
            className={`w-full text-left px-4 py-3 flex items-center space-x-3 text-xs uppercase tracking-wider transition-colors rounded-sm font-semibold ${
              activeTab === 'wishlist' ? 'bg-[#121214] text-white' : 'text-[#7F7972] hover:bg-[#F3EFEA] hover:text-black'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>Saved Wishlist ({wishlist.length})</span>
          </button>

          <button
            onClick={() => setTab('addresses')}
            className={`w-full text-left px-4 py-3 flex items-center space-x-3 text-xs uppercase tracking-wider transition-colors rounded-sm font-semibold ${
              activeTab === 'addresses' ? 'bg-[#121214] text-white' : 'text-[#7F7972] hover:bg-[#F3EFEA] hover:text-black'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Saved Addresses ({user.addresses?.length || 0})</span>
          </button>

          <button
            onClick={() => setTab('profile')}
            className={`w-full text-left px-4 py-3 flex items-center space-x-3 text-xs uppercase tracking-wider transition-colors rounded-sm font-semibold ${
              activeTab === 'profile' ? 'bg-[#121214] text-white' : 'text-[#7F7972] hover:bg-[#F3EFEA] hover:text-black'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile Details</span>
          </button>
        </aside>

        {/* Tab Body */}
        <main className="lg:col-span-9">
          {/* TAB 1: ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <h3 className="font-serif text-2xl text-[#121214] border-b border-[#F0ECE5] pb-3">
                Order History & Logistics
              </h3>

              {orders.length === 0 ? (
                <div className="bg-white border border-[#E6DED5] p-10 text-center rounded-sm space-y-3">
                  <PackageCheck className="w-10 h-10 text-[#B89F88] mx-auto stroke-1" />
                  <p className="font-serif text-xl text-[#121214]">No Orders Placed Yet</p>
                  <p className="text-xs text-[#7F7972]">When you order tailored garments, they will appear here.</p>
                  <Link
                    to="/shop"
                    className="inline-block mt-2 px-6 py-2.5 bg-[#121214] text-white text-xs uppercase tracking-widest font-semibold"
                  >
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="bg-white border border-[#E6DED5] rounded-sm p-6 space-y-4 shadow-sm"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#F0ECE5] gap-2">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-mono text-xs font-bold text-[#121214]">{order.id}</span>
                            <span>•</span>
                            <span className="text-xs text-[#7F7972]">{new Date(order.createdAt).toLocaleDateString()}</span>
                          </div>
                          <p className="text-xs text-[#7F7972] mt-0.5">
                            Payment: <strong>{order.paymentMethod}</strong> ({order.paymentStatus})
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          <span
                            className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-sm ${
                              order.status === 'Cancelled'
                                ? 'bg-red-50 text-red-700'
                                : order.status === 'Delivered'
                                ? 'bg-emerald-50 text-emerald-800'
                                : 'bg-[#121214] text-[#C5A059]'
                            }`}
                          >
                            {order.status}
                          </span>
                        </div>
                      </div>

                      {/* Items row */}
                      <div className="space-y-3">
                        {order.items.map((item, i) => (
                          <div key={i} className="flex items-center justify-between text-xs">
                            <div className="flex items-center space-x-3">
                              <img src={item.image} alt={item.name} className="w-12 h-16 object-cover rounded-sm bg-neutral-100" />
                              <div>
                                <h5 className="font-medium text-[#121214]">{item.name}</h5>
                                <p className="text-[11px] text-[#7F7972]">
                                  Size: {item.size} • Qty: {item.quantity}
                                </p>
                              </div>
                            </div>
                            <span className="font-bold text-[#121214]">
                              ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Footer Actions */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 border-t border-[#F0ECE5] gap-3">
                        <div className="text-xs">
                          <span className="text-[#7F7972]">Total: </span>
                          <span className="font-serif text-lg font-bold text-[#121214]">
                            ₹{order.pricing.total.toLocaleString('en-IN')}
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <Link
                            to={`/track-order?orderId=${order.id}`}
                            className="px-4 py-2 bg-[#FAF8F5] border border-black text-[#121214] hover:bg-black hover:text-white transition-colors text-xs uppercase tracking-widest font-semibold flex items-center gap-1.5"
                          >
                            <Truck className="w-3.5 h-3.5" /> Track Shipment
                          </Link>

                          {order.status !== 'Cancelled' && order.status !== 'Delivered' && (
                            <button
                              onClick={() => handleCancelOrder(order.id)}
                              className="text-xs text-red-600 hover:underline uppercase tracking-wider font-semibold"
                            >
                              Cancel Order
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: WISHLIST */}
          {activeTab === 'wishlist' && (
            <div className="space-y-6">
              <h3 className="font-serif text-2xl text-[#121214] border-b border-[#F0ECE5] pb-3">
                Saved Wishlist ({wishlist.length})
              </h3>

              {wishlist.length === 0 ? (
                <div className="bg-white border border-[#E6DED5] p-10 text-center rounded-sm space-y-3">
                  <Heart className="w-10 h-10 text-[#B89F88] mx-auto stroke-1" />
                  <p className="font-serif text-xl text-[#121214]">Your Wishlist is Empty</p>
                  <p className="text-xs text-[#7F7972]">Click the heart icon on any garment to save it here for later.</p>
                  <Link
                    to="/shop"
                    className="inline-block mt-2 px-6 py-2.5 bg-[#121214] text-white text-xs uppercase tracking-widest font-semibold"
                  >
                    Browse Collections
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {wishlist.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ADDRESSES */}
          {activeTab === 'addresses' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-[#F0ECE5] pb-3">
                <h3 className="font-serif text-2xl text-[#121214]">Saved Delivery Addresses</h3>
                <button
                  onClick={() => setShowAddressModal(true)}
                  className="px-4 py-2 bg-[#121214] text-white hover:bg-[#C5A059] transition-colors text-xs uppercase tracking-widest font-semibold flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Add Address
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {user.addresses?.map((addr) => (
                  <div key={addr.id} className="bg-white border border-[#E6DED5] p-5 rounded-sm relative space-y-2">
                    {addr.isDefault && (
                      <span className="inline-block bg-[#121214] text-white text-[9px] uppercase tracking-widest px-2 py-0.5 rounded font-bold">
                        Default Address
                      </span>
                    )}
                    <h4 className="font-bold text-xs text-[#121214]">{addr.name}</h4>
                    <p className="text-xs text-[#5C5750]">{addr.street}</p>
                    <p className="text-xs text-[#5C5750]">{addr.city}, {addr.state} {addr.pincode}</p>
                    <p className="text-xs text-[#7F7972]">Phone: {addr.phone}</p>

                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={() => deleteAddress(addr.id)}
                        className="text-xs text-red-600 hover:underline flex items-center gap-1 font-semibold"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Address Form Modal */}
              {showAddressModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
                  <div className="w-full max-w-md bg-white p-6 rounded-sm space-y-4 border border-[#E6DED5]">
                    <h4 className="font-serif text-xl text-[#121214]">New Delivery Destination</h4>
                    <form onSubmit={handleAddAddress} className="space-y-3 text-xs">
                      <div>
                        <label className="block text-[#7F7972] mb-1">Full Recipient Name *</label>
                        <input
                          type="text"
                          required
                          value={newAddr.name}
                          onChange={(e) => setNewAddr({ ...newAddr, name: e.target.value })}
                          className="w-full p-2 border border-[#D5C7B8]"
                        />
                      </div>
                      <div>
                        <label className="block text-[#7F7972] mb-1">Street Address *</label>
                        <input
                          type="text"
                          required
                          value={newAddr.street}
                          onChange={(e) => setNewAddr({ ...newAddr, street: e.target.value })}
                          className="w-full p-2 border border-[#D5C7B8]"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[#7F7972] mb-1">City *</label>
                          <input
                            type="text"
                            required
                            value={newAddr.city}
                            onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                            className="w-full p-2 border border-[#D5C7B8]"
                          />
                        </div>
                        <div>
                          <label className="block text-[#7F7972] mb-1">State *</label>
                          <input
                            type="text"
                            required
                            value={newAddr.state}
                            onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })}
                            className="w-full p-2 border border-[#D5C7B8]"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[#7F7972] mb-1">PIN Code *</label>
                          <input
                            type="text"
                            required
                            value={newAddr.pincode}
                            onChange={(e) => setNewAddr({ ...newAddr, pincode: e.target.value })}
                            className="w-full p-2 border border-[#D5C7B8]"
                          />
                        </div>
                        <div>
                          <label className="block text-[#7F7972] mb-1">Phone Number</label>
                          <input
                            type="tel"
                            value={newAddr.phone}
                            onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                            className="w-full p-2 border border-[#D5C7B8]"
                          />
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <button
                          type="submit"
                          className="flex-1 py-2.5 bg-[#121214] text-white uppercase tracking-widest font-semibold"
                        >
                          Save Address
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowAddressModal(false)}
                          className="px-4 py-2.5 border border-[#D5C7B8]"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: PROFILE */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <h3 className="font-serif text-2xl text-[#121214] border-b border-[#F0ECE5] pb-3">
                Atelier Client Profile
              </h3>

              {profileSavedToast && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-sm">
                  Your profile information has been securely updated.
                </div>
              )}

              <form onSubmit={handleProfileSave} className="bg-white p-6 border border-[#E6DED5] rounded-sm space-y-4 max-w-md">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#7F7972] mb-1">Full Name</label>
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#D5C7B8] px-3 py-2 text-xs text-[#121214]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#7F7972] mb-1">Email Address</label>
                  <input
                    type="email"
                    disabled
                    value={user.email}
                    className="w-full bg-neutral-100 border border-neutral-200 px-3 py-2 text-xs text-neutral-500 cursor-not-allowed"
                  />
                  <p className="text-[10px] text-neutral-400 mt-1">Email is linked to your Razorpay client key.</p>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#7F7972] mb-1">Contact Phone</label>
                  <input
                    type="tel"
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#D5C7B8] px-3 py-2 text-xs text-[#121214]"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#121214] text-white hover:bg-[#C5A059] transition-colors text-xs uppercase tracking-widest font-semibold"
                >
                  Save Profile Changes
                </button>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
