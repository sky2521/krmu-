import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  supabase,
  authSignIn,
  authSignUp,
  authSignOut,
  authResendConfirmation,
  authResetPassword,
  authUpdatePassword,
  upsertProfile,
  fetchProfile,
  fetchUserAddresses,
  addUserAddress,
  removeUserAddress,
} from '../services/supabase';

const AuthContext = createContext(null);

function buildAppUser(supaUser, profile = null, addresses = []) {
  return {
    id: supaUser.id,
    name:
      profile?.full_name ||
      supaUser.user_metadata?.full_name ||
      supaUser.email?.split('@')[0] ||
      'KRMU Client',
    email: supaUser.email,
    phone: profile?.phone || supaUser.user_metadata?.phone || '',
    role: profile?.role || supaUser.app_metadata?.role || 'customer',
    addresses: Array.isArray(addresses) ? addresses : [],
  };
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login'); // 'login' | 'register' | 'forgot' | 'recovery'
  const [isPasswordRecovery, setIsPasswordRecovery] = useState(false);

  const hydrateUserSession = useCallback(async (supaUser) => {
    if (!supaUser) {
      setUser(null);
      localStorage.removeItem('krmu_user');
      return null;
    }

    const [profile, addresses] = await Promise.all([
      fetchProfile(supaUser.id),
      fetchUserAddresses(supaUser.id),
    ]);

    const appUser = buildAppUser(supaUser, profile, addresses);
    setUser(appUser);
    return appUser;
  }, []);

  useEffect(() => {
    let mounted = true;
    // Clear legacy mock user cache so only active Supabase Auth sessions authenticate
    localStorage.removeItem('krmu_user');

    async function initAuth() {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (!error && session?.user && mounted) {
          await hydrateUserSession(session.user);
        } else if (mounted) {
          setUser(null);
        }
      } catch (err) {
        console.warn('Supabase session check failed:', err);
        if (mounted) setUser(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    initAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;

      if (event === 'PASSWORD_RECOVERY') {
        setIsPasswordRecovery(true);
        setAuthModalMode('recovery');
        setIsAuthModalOpen(true);
      }

      if (
        (event === 'SIGNED_IN' ||
          event === 'TOKEN_REFRESHED' ||
          event === 'USER_UPDATED') &&
        session?.user
      ) {
        // Defer DB reads outside GoTrue lock callback
        setTimeout(() => {
          if (mounted) {
            hydrateUserSession(session.user);
          }
        }, 0);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setIsPasswordRecovery(false);
        localStorage.removeItem('krmu_user');
      }
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, [hydrateUserSession]);

  const login = async (email, password) => {
    const { user: supaUser, error } = await authSignIn(email, password);

    if (error || !supaUser) {
      return {
        success: false,
        error: error || 'Invalid email or password.',
      };
    }

    await hydrateUserSession(supaUser);
    setIsAuthModalOpen(false);
    return { success: true, error: null };
  };

  const register = async (name, email, password, phone) => {
    const { user: supaUser, session, needsEmailConfirmation, error } = await authSignUp(
      email,
      password,
      { fullName: name, phone }
    );

    if (error) {
      return {
        success: false,
        needsEmailConfirmation: false,
        error,
      };
    }

    if (needsEmailConfirmation || !session) {
      return {
        success: true,
        needsEmailConfirmation: true,
        email: email.trim().toLowerCase(),
        error: null,
      };
    }

    if (supaUser) {
      await hydrateUserSession(supaUser);
      setIsAuthModalOpen(false);
    }

    return {
      success: true,
      needsEmailConfirmation: false,
      error: null,
    };
  };

  const resendConfirmation = async (email) => {
    return authResendConfirmation(email);
  };

  const sendPasswordReset = async (email) => {
    return authResetPassword(email);
  };

  const completePasswordReset = async (newPassword) => {
    const res = await authUpdatePassword(newPassword);
    if (res.success && res.user) {
      setIsPasswordRecovery(false);
      await hydrateUserSession(res.user);
      setIsAuthModalOpen(false);
    }
    return res;
  };

  const logout = async () => {
    await authSignOut();
    setUser(null);
    setIsPasswordRecovery(false);
    localStorage.removeItem('krmu_user');
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
    if (!user?.id) return { success: false, error: 'Not signed in.' };

    const inserted = await addUserAddress(user.id, newAddr);
    if (!inserted) {
      return { success: false, error: 'Failed to save address to database.' };
    }

    setUser((prev) =>
      prev ? { ...prev, addresses: [inserted, ...(prev.addresses || [])] } : null
    );
    return { success: true, address: inserted };
  };

  const deleteAddress = async (addressId) => {
    if (!user?.id) return { success: false };

    const ok = await removeUserAddress(addressId);
    if (!ok) return { success: false };

    setUser((prev) =>
      prev
        ? {
            ...prev,
            addresses: (prev.addresses || []).filter((a) => a.id !== addressId),
          }
        : null
    );
    return { success: true };
  };

  const updateProfileData = async (updatedData) => {
    if (!user?.id) return { success: false, error: 'Not signed in.' };

    const saved = await upsertProfile(user.id, {
      full_name: updatedData.name,
      email: user.email,
      phone: updatedData.phone,
    });

    if (!saved) {
      return { success: false, error: 'Could not update profile.' };
    }

    setUser((prev) =>
      prev
        ? {
            ...prev,
            name: saved.full_name || updatedData.name,
            phone: saved.phone ?? updatedData.phone,
            role: saved.role || prev.role,
          }
        : null
    );
    return { success: true };
  };

  const refreshProfile = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (session?.user) {
      return hydrateUserSession(session.user);
    }
    return null;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        isPasswordRecovery,
        login,
        register,
        logout,
        resendConfirmation,
        sendPasswordReset,
        completePasswordReset,
        openLogin,
        openRegister,
        addAddress,
        deleteAddress,
        updateProfile: updateProfileData,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
