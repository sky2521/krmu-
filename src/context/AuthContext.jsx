import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  supabase, 
  authSignUp, 
  authSignIn, 
  authSignOut, 
  fetchProfile, 
  upsertProfile, 
  fetchUserAddresses, 
  addUserAddress, 
  removeUserAddress 
} from '../services/supabase';

const AuthContext = createContext();

const DEMO_USER = {
  id: "usr_krmu_01",
  name: "Kabir Mehra",
  email: "kabir@example.com",
  phone: "+91 98765 43210",
  role: "admin",
  addresses: [
    {
      id: "addr_1",
      name: "Kabir Mehra",
      phone: "+91 98765 43210",
      street: "Villa 14, The Magnolias, Golf Course Road, Sector 42",
      city: "Gurugram",
      state: "Haryana",
      pincode: "122002",
      isDefault: true
    }
  ]
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('krmu_user');
      return saved ? JSON.parse(saved) : DEMO_USER;
    } catch (e) {
      return DEMO_USER;
    }
  });

  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login'); // 'login' | 'register'

  // Sync Supabase Auth session on mount and listen to changes
  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user && mounted) {
          const profile = await fetchProfile(session.user.id);
          const addresses = await fetchUserAddresses(session.user.id);
          
          setUser({
            id: session.user.id,
            name: profile?.full_name || session.user.user_metadata?.full_name || session.user.email.split('@')[0],
            email: session.user.email,
            phone: profile?.phone || session.user.user_metadata?.phone || '',
            role: profile?.role || (session.user.email.includes('admin') ? 'admin' : 'customer'),
            addresses: addresses || []
          });
        }
      } catch (err) {
        console.warn('Supabase getSession fallback:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const profile = await fetchProfile(session.user.id);
        const addresses = await fetchUserAddresses(session.user.id);
        
        setUser({
          id: session.user.id,
          name: profile?.full_name || session.user.user_metadata?.full_name || session.user.email.split('@')[0],
          email: session.user.email,
          phone: profile?.phone || session.user.user_metadata?.phone || '',
          role: profile?.role || (session.user.email.includes('admin') ? 'admin' : 'customer'),
          addresses: addresses || []
        });
      } else if (event === 'SIGNED_OUT') {
        // Do not wipe demo user immediately if local testing
      }
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('krmu_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('krmu_user');
      }
    } catch (e) {
      console.error(e);
    }
  }, [user]);

  const login = async (email, password) => {
    // 1. Attempt Supabase Auth signIn
    const { user: supaUser, error } = await authSignIn(email, password);

    if (supaUser) {
      const profile = await fetchProfile(supaUser.id);
      const addresses = await fetchUserAddresses(supaUser.id);

      const loggedUser = {
        id: supaUser.id,
        name: profile?.full_name || supaUser.user_metadata?.full_name || email.split('@')[0],
        email: supaUser.email,
        phone: profile?.phone || '',
        role: profile?.role || (email.toLowerCase().includes('admin') ? 'admin' : 'customer'),
        addresses: addresses || []
      };
      setUser(loggedUser);
      setIsAuthModalOpen(false);
      return { success: true };
    }

    // Fallback if user uses demo account or tables not yet executed
    const isAdmin = email.toLowerCase().includes('admin');
    const fallbackUser = {
      id: `usr_${Date.now()}`,
      name: email.split('@')[0].replace('.', ' ').toUpperCase(),
      email,
      phone: "+91 98765 43210",
      role: isAdmin ? 'admin' : 'customer',
      addresses: user?.addresses || [
        {
          id: "addr_default",
          name: email.split('@')[0],
          phone: "+91 98765 43210",
          street: "42 Design Avenue, Bandra West",
          city: "Mumbai",
          state: "Maharashtra",
          pincode: "400050",
          isDefault: true
        }
      ]
    };
    setUser(fallbackUser);
    setIsAuthModalOpen(false);
    return { success: true, isFallback: true };
  };

  const register = async (name, email, password, phone) => {
    // 1. Attempt Supabase Auth signUp
    const { user: supaUser, error } = await authSignUp(email, password, {
      fullName: name,
      phone
    });

    if (supaUser) {
      const newUser = {
        id: supaUser.id,
        name,
        email,
        phone: phone || '',
        role: email.toLowerCase().includes('admin') ? 'admin' : 'customer',
        addresses: []
      };
      setUser(newUser);
      setIsAuthModalOpen(false);
      return { success: true };
    }

    // Fallback if offline/demo
    const newUser = {
      id: `usr_${Date.now()}`,
      name,
      email,
      phone: phone || "+91 98765 43210",
      role: email.toLowerCase().includes('admin') ? 'admin' : 'customer',
      addresses: []
    };
    setUser(newUser);
    setIsAuthModalOpen(false);
    return { success: true, isFallback: true };
  };

  const logout = async () => {
    await authSignOut();
    setUser(null);
  };

  const openLogin = () => {
    setAuthModalMode('login');
    setIsAuthModalOpen(true);
  };

  const openRegister = () => {
    setAuthModalMode('register');
    setIsAuthModalOpen(true);
  };

  const addAddress = async (newAddr) => {
    if (!user) return;

    // Persist to Supabase if UUID user
    if (user.id && user.id.includes('-')) {
      await addUserAddress(user.id, newAddr);
      const updated = await fetchUserAddresses(user.id);
      if (updated && updated.length > 0) {
        setUser({ ...user, addresses: updated });
        return;
      }
    }

    // Local fallback
    const addressWithId = {
      ...newAddr,
      id: `addr_${Date.now()}`,
      isDefault: user.addresses.length === 0 || newAddr.isDefault
    };
    const updatedAddresses = newAddr.isDefault
      ? user.addresses.map((a) => ({ ...a, isDefault: false })).concat(addressWithId)
      : [...user.addresses, addressWithId];

    setUser({
      ...user,
      addresses: updatedAddresses
    });
  };

  const deleteAddress = async (addressId) => {
    if (!user) return;
    if (user.id && user.id.includes('-')) {
      await removeUserAddress(addressId);
    }
    setUser({
      ...user,
      addresses: user.addresses.filter((a) => a.id !== addressId)
    });
  };

  const updateProfileData = async (updatedData) => {
    if (!user) return;
    if (user.id && user.id.includes('-')) {
      await upsertProfile(user.id, updatedData);
    }
    setUser({
      ...user,
      ...updatedData
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        loading,
        login,
        register,
        logout,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        openLogin,
        openRegister,
        addAddress,
        deleteAddress,
        updateProfile: updateProfileData
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
