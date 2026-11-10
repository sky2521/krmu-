import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  Heart, 
  User, 
  Search, 
  Menu, 
  X, 
  ChevronRight, 
  ShieldAlert,
  SlidersHorizontal,
  LogOut,
  PackageCheck
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import { useProducts } from '../../context/ProductContext';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const { totalItemCount, setIsCartDrawerOpen } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, isAuthenticated, isAdmin, openLogin, logout } = useAuth();
  const { products } = useProducts();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { name: 'Men', path: '/shop?category=men' },
    { name: 'Women', path: '/shop?category=women' },
    { name: 'New Arrivals', path: '/shop?category=new-arrivals', highlight: true },
    { name: 'Brand Story', path: '/about' },
    { name: 'Track Order', path: '/track-order' },
  ];

  const searchSuggestions = products.slice(0, 4);

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#FAF8F5]/95 backdrop-blur-md shadow-sm border-b border-[#E6DED5]'
            : 'bg-[#FAF8F5] border-b border-[#EBE5DE]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Left: Mobile Menu Toggle & Desktop Nav */}
            <div className="flex items-center space-x-6">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-brand-dark hover:text-brand-gold transition-colors"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

              <nav className="hidden lg:flex items-center space-x-8">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.name}
                    to={link.path}
                    className={({ isActive }) =>
                      `text-xs font-semibold uppercase tracking-[0.2em] transition-all relative py-1 hover:text-[#C5A059] ${
                        isActive && !link.path.includes('?')
                          ? 'text-[#121214] font-bold after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1.5px] after:bg-[#121214]'
                          : 'text-[#3E3E42]'
                      } ${link.highlight ? 'text-[#B85D43]' : ''}`
                    }
                  >
                    {link.name}
                  </NavLink>
                ))}
              </nav>
            </div>

            {/* Center: Brand Wordmark */}
            <div className="flex-1 lg:flex-initial text-center lg:text-center">
              <Link to="/" className="inline-block group text-center">
                <span className="font-serif text-3xl sm:text-4xl tracking-[0.3em] font-light text-[#121214] group-hover:text-[#C5A059] transition-colors block">
                  K R M U
                </span>
                <span className="text-[9px] uppercase tracking-[0.45em] text-[#8C867E] block -mt-1 font-sans">
                  New Delhi • Atelier
                </span>
              </Link>
            </div>

            {/* Right: Actions (Search, Wishlist, User, Cart, Admin) */}
            <div className="flex items-center space-x-4 sm:space-x-6">
              {/* Search Toggle */}
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 text-[#2A2A2E] hover:text-[#C5A059] transition-colors"
                aria-label="Search items"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Wishlist Link */}
              <Link
                to="/account?tab=wishlist"
                className="p-2 text-[#2A2A2E] hover:text-[#C5A059] transition-colors relative"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-0 w-4 h-4 bg-[#B85D43] text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* User Dropdown / Sign in */}
              <div className="relative">
                {isAuthenticated ? (
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center space-x-1.5 p-1.5 text-xs font-medium text-[#2A2A2E] hover:text-[#C5A059] transition-colors"
                  >
                    <div className="w-7 h-7 rounded-full bg-[#121214] text-[#FAF8F5] text-xs font-semibold flex items-center justify-center uppercase">
                      {user.name ? user.name[0] : 'U'}
                    </div>
                  </button>
                ) : (
                  <button
                    onClick={openLogin}
                    className="p-2 text-[#2A2A2E] hover:text-[#C5A059] transition-colors"
                    aria-label="Sign In"
                  >
                    <User className="w-5 h-5" />
                  </button>
                )}

                {/* User Dropdown Panel */}
                {userDropdownOpen && isAuthenticated && (
                  <div
                    className="absolute right-0 mt-3 w-56 bg-white border border-[#E6DED5] rounded-sm shadow-xl py-2 z-50 animate-fade-in"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-[#F0ECE5]">
                      <p className="text-xs font-semibold text-[#121214] truncate">{user.name}</p>
                      <p className="text-[11px] text-[#7F7972] truncate">{user.email}</p>
                      {isAdmin && (
                        <span className="inline-block mt-1 bg-[#121214] text-[#C5A059] text-[9px] px-2 py-0.5 uppercase tracking-wider font-bold rounded">
                          Admin Atelier
                        </span>
                      )}
                    </div>

                    <Link
                      to="/account?tab=orders"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center px-4 py-2.5 text-xs text-[#2A2A2E] hover:bg-[#FAF8F5] hover:text-[#C5A059] transition-colors"
                    >
                      <PackageCheck className="w-4 h-4 mr-2.5 text-[#8C867E]" />
                      My Orders & Tracking
                    </Link>

                    <Link
                      to="/account?tab=wishlist"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center px-4 py-2.5 text-xs text-[#2A2A2E] hover:bg-[#FAF8F5] hover:text-[#C5A059] transition-colors"
                    >
                      <Heart className="w-4 h-4 mr-2.5 text-[#8C867E]" />
                      Wishlist ({wishlistCount})
                    </Link>

                    <Link
                      to="/account?tab=profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center px-4 py-2.5 text-xs text-[#2A2A2E] hover:bg-[#FAF8F5] hover:text-[#C5A059] transition-colors"
                    >
                      <User className="w-4 h-4 mr-2.5 text-[#8C867E]" />
                      Profile & Saved Addresses
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center px-4 py-2.5 text-xs text-[#B85D43] font-semibold hover:bg-[#FAF8F5] transition-colors border-t border-[#F0ECE5]"
                      >
                        <SlidersHorizontal className="w-4 h-4 mr-2.5" />
                        Admin Dashboard
                      </Link>
                    )}

                    <button
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left flex items-center px-4 py-2.5 text-xs text-red-600 hover:bg-red-50 transition-colors border-t border-[#F0ECE5]"
                    >
                      <LogOut className="w-4 h-4 mr-2.5" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>

              {/* Cart Drawer Trigger */}
              <button
                onClick={() => setIsCartDrawerOpen(true)}
                className="flex items-center p-2 text-[#2A2A2E] hover:text-[#C5A059] transition-colors relative"
                aria-label="View Cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {totalItemCount > 0 && (
                  <span className="absolute top-1 right-0 w-4 h-4 bg-[#121214] text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                    {totalItemCount}
                  </span>
                )}
              </button>

              {/* Admin Quick Link */}
              <Link
                to="/admin"
                className="hidden xl:inline-flex items-center text-[10px] uppercase tracking-widest px-2.5 py-1 bg-[#121214] text-[#C5A059] hover:bg-black transition-colors rounded-sm"
              >
                Admin
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-4/5 max-w-sm bg-[#FAF8F5] h-full shadow-2xl p-6 flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-[#E6DED5]">
                <span className="font-serif text-2xl tracking-[0.25em] text-[#121214]">KRMU</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 text-[#2A2A2E] hover:text-[#C5A059]"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="py-6 space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between py-2 text-sm font-medium uppercase tracking-[0.2em] text-[#121214] hover:text-[#C5A059] border-b border-[#F0ECE5]"
                  >
                    <span>{link.name}</span>
                    <ChevronRight className="w-4 h-4 text-[#8C867E]" />
                  </Link>
                ))}

                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between py-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#B85D43] border-b border-[#F0ECE5]"
                >
                  <span>Admin Dashboard</span>
                  <ChevronRight className="w-4 h-4 text-[#B85D43]" />
                </Link>
              </div>
            </div>

            <div className="pt-6 border-t border-[#E6DED5] space-y-3">
              {isAuthenticated ? (
                <div className="space-y-2">
                  <div className="text-xs text-[#7F7972]">Signed in as {user.name}</div>
                  <Link
                    to="/account"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full py-2.5 text-center text-xs uppercase tracking-widest font-semibold bg-[#121214] text-white"
                  >
                    My Account & Orders
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full py-2 text-center text-xs text-red-600 uppercase tracking-widest"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    openLogin();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-3 text-center text-xs uppercase tracking-widest font-semibold bg-[#121214] text-white"
                >
                  Sign In / Create Account
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Global Search Overlay Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/70 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-2xl bg-white rounded-sm shadow-2xl p-6 relative">
            <button
              onClick={() => setSearchOpen(false)}
              className="absolute top-5 right-5 text-neutral-400 hover:text-black transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <form onSubmit={handleSearchSubmit} className="mt-2">
              <label className="block text-xs uppercase tracking-widest text-[#7F7972] mb-2 font-medium">
                Search the KRMU Collection
              </label>
              <div className="relative">
                <input
                  type="text"
                  autoFocus
                  placeholder="e.g. Trench Coat, Silk Slip Dress, Linen, Blazer..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pb-3 pt-2 text-lg font-serif border-b-2 border-black focus:outline-none placeholder:text-neutral-300"
                />
                <button
                  type="submit"
                  className="absolute right-0 top-2 px-4 py-1.5 bg-[#121214] text-white text-xs uppercase tracking-widest hover:bg-[#C5A059] transition-colors"
                >
                  Search
                </button>
              </div>
            </form>

            <div className="mt-6">
              <p className="text-[11px] uppercase tracking-widest text-neutral-400 mb-3">Trending Searches</p>
              <div className="flex flex-wrap gap-2">
                {['Trench Coat', 'Linen Overshirt', 'Mulberry Silk', 'Wide Trouser', 'Double Breasted Blazer'].map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => {
                      navigate(`/shop?search=${encodeURIComponent(term)}`);
                      setSearchOpen(false);
                    }}
                    className="px-3 py-1 bg-[#FAF8F5] text-xs text-[#2A2A2E] hover:bg-[#121214] hover:text-white transition-colors border border-[#E6DED5]"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 border-t border-[#E6DED5] pt-4">
              <p className="text-[11px] uppercase tracking-widest text-neutral-400 mb-3">Featured Atelier Pieces</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {searchSuggestions.map((prod) => (
                  <div
                    key={prod.id}
                    onClick={() => {
                      navigate(`/product/${prod.slug}`);
                      setSearchOpen(false);
                    }}
                    className="cursor-pointer group"
                  >
                    <div className="aspect-[3/4] overflow-hidden bg-neutral-100 mb-2">
                      <img
                        src={prod.images[0]}
                        alt={prod.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <p className="text-[11px] font-medium text-neutral-900 truncate group-hover:text-[#C5A059]">
                      {prod.name}
                    </p>
                    <p className="text-[11px] text-[#7F7972]">₹{prod.price.toLocaleString('en-IN')}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
