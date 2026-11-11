import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  createSupabaseOrder,
  fetchSupabaseOrders,
  fetchSupabaseOrderById,
  updateSupabaseOrderStatus,
  logSupabasePaymentTransaction,
  fetchSupabasePaymentTransactions
} from '../services/supabase';
import { useAuth } from './AuthContext';

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const { user, isAdmin } = useAuth();

  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('krmu_guest_orders');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [paymentTransactions, setPaymentTransactions] = useState([]);

  const loadSupabaseOrdersAndLedger = useCallback(async () => {
    localStorage.removeItem('krmu_orders');

    if (!user?.id || !user.id.includes('-')) {
      try {
        const guest = localStorage.getItem('krmu_guest_orders');
        setOrders(guest ? JSON.parse(guest) : []);
      } catch {
        setOrders([]);
      }
      setPaymentTransactions([]);
      return;
    }

    const userIdToQuery = isAdmin ? null : user.id;
    const [cloudOrders, txRes] = await Promise.all([
      fetchSupabaseOrders(userIdToQuery),
      fetchSupabasePaymentTransactions(userIdToQuery)
    ]);

    if (Array.isArray(cloudOrders)) {
      setOrders(cloudOrders);
    }
    if (txRes && Array.isArray(txRes.data)) {
      setPaymentTransactions(txRes.data);
    }
  }, [user?.id, isAdmin]);

  useEffect(() => {
    loadSupabaseOrdersAndLedger();
  }, [loadSupabaseOrdersAndLedger]);

  useEffect(() => {
    try {
      if (!user?.id) {
        localStorage.setItem('krmu_guest_orders', JSON.stringify(orders));
      }
    } catch (e) {
      console.error(e);
    }
  }, [orders, user?.id]);

  const createOrder = async (orderData) => {
    const newOrderId = `KRMU-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
    const now = new Date();

    const isWhiteGlove = orderData.deliveryMethod?.toLowerCase().includes('white glove');
    const deliveryDate = new Date(now);
    deliveryDate.setDate(deliveryDate.getDate() + (isWhiteGlove ? 2 : 5));

    const fullOrder = {
      id: newOrderId,
      createdAt: now.toISOString(),
      status: 'Confirmed',
      estimatedDelivery: deliveryDate.toISOString().split('T')[0],
      trackingNumber: `KRMU-EXP-${Math.floor(10000000 + Math.random() * 90000000)}`,
      carrier: isWhiteGlove ? 'KRMU Private Concierge Courier' : 'BlueDart Express Air',
      ...orderData,
      timeline: [
        { status: 'Order Placed & Vault Authorized', date: now.toLocaleString(), completed: true },
        { status: 'Confirmed & Quality Inspected', date: now.toLocaleString(), completed: true },
        { status: 'Atelier Packaging', date: 'In Progress', completed: false },
        { status: 'Dispatched', date: isWhiteGlove ? 'Same-Day Concierge Dispatch' : 'Expected in 24 hours', completed: false },
        { status: 'Out for Delivery', date: 'Pending', completed: false },
        { status: 'Delivered', date: `Estimated ${deliveryDate.toLocaleDateString()}`, completed: false }
      ]
    };

    const userId = user?.id && user.id.includes('-') ? user.id : null;
    const dbRes = await createSupabaseOrder(fullOrder, userId);

    const persistedOrder = {
      ...fullOrder,
      dbPersisted: Boolean(dbRes.success),
      dbError: dbRes.error || null
    };

    setOrders((prev) => [persistedOrder, ...prev.filter((o) => o.id !== persistedOrder.id)]);

    if (userId) {
      fetchSupabasePaymentTransactions(isAdmin ? null : userId).then((txRes) => {
        if (txRes && Array.isArray(txRes.data)) {
          setPaymentTransactions(txRes.data);
        }
      });
    }

    return persistedOrder;
  };

  const recordPaymentAttempt = async (txData) => {
    const userId = user?.id && user.id.includes('-') ? user.id : null;
    const res = await logSupabasePaymentTransaction(txData, userId);
    if (userId) {
      fetchSupabasePaymentTransactions(isAdmin ? null : userId).then((txRes) => {
        if (txRes && Array.isArray(txRes.data)) {
          setPaymentTransactions(txRes.data);
        }
      });
    }
    return res;
  };

  const fetchOrderByIdAsync = async (orderId) => {
    if (!orderId) return null;
    const clean = orderId.trim().toLowerCase();
    const local = orders.find(
      (o) =>
        o.id.toLowerCase() === clean ||
        o.trackingNumber?.toLowerCase() === clean
    );
    if (local) return local;

    const remote = await fetchSupabaseOrderById(orderId.trim());
    if (remote) {
      setOrders((prev) => [remote, ...prev.filter((p) => p.id !== remote.id)]);
    }
    return remote;
  };

  const getOrderById = (orderId) => {
    if (!orderId) return null;
    const clean = orderId.trim().toLowerCase();
    const local = orders.find(
      (o) =>
        o.id.toLowerCase() === clean ||
        o.trackingNumber?.toLowerCase() === clean
    );
    if (local) return local;

    fetchSupabaseOrderById(orderId.trim()).then((remote) => {
      if (remote) {
        setOrders((prev) => [remote, ...prev.filter((p) => p.id !== remote.id)]);
      }
    });

    return null;
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    const existing = orders.find((o) => o.id === orderId);
    const nowStr = new Date().toLocaleString();
    const updatedTimeline = existing?.timeline
      ? existing.timeline.map((step) =>
          step.status.toLowerCase().includes(newStatus.toLowerCase())
            ? { ...step, date: nowStr, completed: true }
            : step
        )
      : null;

    await updateSupabaseOrderStatus(orderId, newStatus, updatedTimeline);

    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          return {
            ...order,
            status: newStatus,
            timeline: updatedTimeline || order.timeline
          };
        }
        return order;
      })
    );
  };

  const cancelOrder = async (orderId, reason) => {
    await updateSupabaseOrderStatus(orderId, 'Cancelled');
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          return {
            ...order,
            status: 'Cancelled',
            cancellationReason: reason,
            refundStatus:
              order.paymentStatus === 'Paid'
                ? 'Refund Initiated (3-5 business days via Razorpay)'
                : 'N/A'
          };
        }
        return order;
      })
    );
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        paymentTransactions,
        createOrder,
        recordPaymentAttempt,
        getOrderById,
        fetchOrderByIdAsync,
        updateOrderStatus,
        cancelOrder,
        refreshOrdersAndLedger: loadSupabaseOrdersAndLedger
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => useContext(OrderContext);
