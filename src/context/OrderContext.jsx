import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  createSupabaseOrder, 
  fetchSupabaseOrders, 
  fetchSupabaseOrderById, 
  updateSupabaseOrderStatus 
} from '../services/supabase';
import { useAuth } from './AuthContext';

const OrderContext = createContext();

const INITIAL_ORDERS = [
  {
    id: "KRMU-2026-98102",
    createdAt: "2026-11-05T10:30:00.000Z",
    status: "Dispatched",
    estimatedDelivery: "2026-11-12",
    trackingNumber: "DELHIVERY-KRMU-894124",
    carrier: "Delhivery Express Air",
    paymentMethod: "Razorpay (UPI / NetBanking)",
    paymentId: "pay_rzp_mock_89124912",
    paymentStatus: "Paid",
    customer: {
      name: "Kabir Mehra",
      email: "kabir@example.com",
      phone: "+91 98765 43210"
    },
    shippingAddress: {
      name: "Kabir Mehra",
      street: "Villa 14, The Magnolias, Golf Course Road, Sector 42",
      city: "Gurugram",
      state: "Haryana",
      pincode: "122002",
      phone: "+91 98765 43210"
    },
    items: [
      {
        productId: "krmu-02",
        name: "Architectural Double-Breasted Blazer",
        price: 9499,
        quantity: 1,
        size: "L",
        color: { name: "Charcoal Slate", hex: "#2A2E33" },
        image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200&auto=format&fit=crop"
      }
    ],
    pricing: {
      subtotal: 9499,
      discount: 950,
      shipping: 0,
      total: 8549
    },
    timeline: [
      { status: "Order Placed", date: "2026-11-05 10:30 AM", completed: true },
      { status: "Confirmed & Quality Inspected", date: "2026-11-05 02:15 PM", completed: true },
      { status: "Atelier Tailoring & Hand-Finishing", date: "2026-11-06 11:00 AM", completed: true },
      { status: "Dispatched from Gurugram Hub", date: "2026-11-08 09:40 AM", completed: true },
      { status: "Out for Delivery", date: "Pending", completed: false },
      { status: "Delivered", date: "Estimated Nov 12, 2026", completed: false }
    ]
  }
];

export const OrderProvider = ({ children }) => {
  const { user, isAdmin } = useAuth();

  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('krmu_orders');
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch (e) {
      return INITIAL_ORDERS;
    }
  });

  // Pull orders from Supabase on mount / user change
  useEffect(() => {
    async function loadSupabaseOrders() {
      // If admin, load all orders; if customer with uuid, load their orders
      const userIdToQuery = isAdmin ? null : (user?.id && user.id.includes('-') ? user.id : null);
      const cloudOrders = await fetchSupabaseOrders(userIdToQuery);
      if (cloudOrders && cloudOrders.length > 0) {
        setOrders(cloudOrders);
      }
    }

    loadSupabaseOrders();
  }, [user?.id, isAdmin]);

  useEffect(() => {
    try {
      localStorage.setItem('krmu_orders', JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
  }, [orders]);

  const createOrder = async (orderData) => {
    const newOrderId = `KRMU-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
    const now = new Date();
    
    // Add 4-6 business days for delivery
    const deliveryDate = new Date(now);
    deliveryDate.setDate(deliveryDate.getDate() + 5);

    const fullOrder = {
      id: newOrderId,
      createdAt: now.toISOString(),
      status: "Confirmed",
      estimatedDelivery: deliveryDate.toISOString().split('T')[0],
      trackingNumber: `KRMU-EXP-${Math.floor(10000000 + Math.random() * 90000000)}`,
      carrier: "BlueDart Express Courier",
      ...orderData,
      timeline: [
        { status: "Order Placed", date: now.toLocaleString(), completed: true },
        { status: "Confirmed & Quality Inspected", date: now.toLocaleString(), completed: true },
        { status: "Atelier Packaging", date: "In Progress", completed: false },
        { status: "Dispatched", date: "Expected in 24 hours", completed: false },
        { status: "Out for Delivery", date: "Pending", completed: false },
        { status: "Delivered", date: `Estimated ${deliveryDate.toLocaleDateString()}`, completed: false }
      ]
    };

    // Save to Supabase
    const userId = user?.id && user.id.includes('-') ? user.id : null;
    await createSupabaseOrder(fullOrder, userId);

    setOrders((prev) => [fullOrder, ...prev]);
    return fullOrder;
  };

  const getOrderById = (orderId) => {
    if (!orderId) return null;
    const local = orders.find(
      (o) => o.id.toLowerCase() === orderId.trim().toLowerCase() ||
             o.trackingNumber?.toLowerCase() === orderId.trim().toLowerCase()
    );
    if (local) return local;

    // Trigger async fetch from Supabase if not found locally
    fetchSupabaseOrderById(orderId).then((remote) => {
      if (remote) {
        setOrders((prev) => [remote, ...prev.filter((p) => p.id !== remote.id)]);
      }
    });

    return local;
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    // 1. Update Supabase
    await updateSupabaseOrderStatus(orderId, newStatus);

    // 2. Update local state
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          const nowStr = new Date().toLocaleString();
          const updatedTimeline = order.timeline.map((step) => {
            if (step.status.toLowerCase().includes(newStatus.toLowerCase())) {
              return { ...step, date: nowStr, completed: true };
            }
            return step;
          });

          return {
            ...order,
            status: newStatus,
            timeline: updatedTimeline
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
            status: "Cancelled",
            cancellationReason: reason,
            refundStatus: order.paymentStatus === "Paid" ? "Refund Initiated (3-5 business days via Razorpay)" : "N/A"
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
        createOrder,
        getOrderById,
        updateOrderStatus,
        cancelOrder
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => useContext(OrderContext);
