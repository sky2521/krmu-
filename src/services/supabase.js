import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://uwbgoymzaxyhhiefzhcb.supabase.co';
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_BF5z-89YOp_lgLRghUQSNg_b6v7LzPR';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

/**
 * ----------------------------------------------------
 * SUPABASE AUTHENTICATION & PROFILE HELPERS
 * ----------------------------------------------------
 */

export async function authSignUp(email, password, { fullName, phone }) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone: phone || ''
        }
      }
    });

    if (error) throw error;

    // In case triggers didn't run or email confirmation is pending
    if (data?.user) {
      await upsertProfile(data.user.id, {
        full_name: fullName,
        email,
        phone: phone || '',
        role: email.toLowerCase().includes('admin') ? 'admin' : 'customer'
      });
    }

    return { user: data.user, session: data.session, error: null };
  } catch (err) {
    console.warn('Supabase authSignUp error:', err);
    return { user: null, session: null, error: err };
  }
}

export async function authSignIn(email, password) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
    return { user: data.user, session: data.session, error: null };
  } catch (err) {
    console.warn('Supabase authSignIn error:', err);
    return { user: null, session: null, error: err };
  }
}

export async function authSignOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { error: null };
  } catch (err) {
    console.warn('Supabase authSignOut error:', err);
    return { error: err };
  }
}

export async function upsertProfile(userId, profileData) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        ...profileData,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (err) {
    console.warn('Supabase upsertProfile fallback:', err.message);
    return null;
  }
}

export async function fetchProfile(userId) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  } catch (err) {
    console.warn('Supabase fetchProfile fallback:', err.message);
    return null;
  }
}

/**
 * ----------------------------------------------------
 * SAVED ADDRESSES
 * ----------------------------------------------------
 */

export async function fetchUserAddresses(userId) {
  try {
    const { data, error } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.warn('Supabase fetchUserAddresses fallback:', err.message);
    return [];
  }
}

export async function addUserAddress(userId, addressData) {
  try {
    const { data, error } = await supabase
      .from('addresses')
      .insert({
        user_id: userId,
        name: addressData.name,
        phone: addressData.phone || '',
        street: addressData.street,
        city: addressData.city,
        state: addressData.state,
        pincode: addressData.pincode,
        is_default: !!addressData.isDefault
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (err) {
    console.warn('Supabase addUserAddress fallback:', err.message);
    return null;
  }
}

export async function removeUserAddress(addressId) {
  try {
    const { error } = await supabase
      .from('addresses')
      .delete()
      .eq('id', addressId);

    if (error) throw error;
    return true;
  } catch (err) {
    console.warn('Supabase removeUserAddress fallback:', err.message);
    return false;
  }
}

/**
 * ----------------------------------------------------
 * CLOUD CART SYNCHRONIZATION
 * ----------------------------------------------------
 */

export async function syncCartToSupabase(userId, items) {
  if (!userId) return;
  try {
    // Delete old items and insert current
    await supabase.from('cart_items').delete().eq('user_id', userId);

    if (items.length > 0) {
      const rows = items.map((item) => ({
        user_id: userId,
        product_id: item.productId || item.id,
        name: item.name,
        slug: item.slug || '',
        price: item.price,
        original_price: item.originalPrice || null,
        image: item.image,
        size: item.size,
        color: item.color || {},
        quantity: item.quantity,
        updated_at: new Date().toISOString()
      }));

      await supabase.from('cart_items').insert(rows);
    }
  } catch (err) {
    console.warn('Supabase syncCartToSupabase fallback:', err.message);
  }
}

export async function fetchCartFromSupabase(userId) {
  if (!userId) return [];
  try {
    const { data, error } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', userId);

    if (error) throw error;
    if (!data) return [];

    return data.map((row) => ({
      key: `${row.product_id}-${row.size}-${row.color?.name || 'default'}`,
      productId: row.product_id,
      name: row.name,
      slug: row.slug,
      price: Number(row.price),
      originalPrice: row.original_price ? Number(row.original_price) : null,
      image: row.image,
      size: row.size,
      color: row.color,
      quantity: row.quantity
    }));
  } catch (err) {
    console.warn('Supabase fetchCartFromSupabase fallback:', err.message);
    return [];
  }
}

/**
 * ----------------------------------------------------
 * ORDERS & FULFILLMENT
 * ----------------------------------------------------
 */

export async function createSupabaseOrder(orderData, userId = null) {
  try {
    const orderRow = {
      id: orderData.id,
      user_id: userId || null,
      customer_name: orderData.customer.name,
      customer_email: orderData.customer.email,
      customer_phone: orderData.customer.phone || '',
      shipping_address: orderData.shippingAddress,
      pricing: orderData.pricing,
      payment_method: orderData.paymentMethod || 'Razorpay Online',
      payment_id: orderData.paymentId || '',
      payment_status: orderData.paymentStatus || 'Paid',
      delivery_method: orderData.deliveryMethod || 'Standard Express Courier',
      status: orderData.status || 'Confirmed',
      tracking_number: orderData.trackingNumber || '',
      carrier: orderData.carrier || 'BlueDart Express Air',
      estimated_delivery: orderData.estimatedDelivery || '',
      timeline: orderData.timeline || [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('orders')
      .insert(orderRow)
      .select()
      .single();

    if (error) throw error;

    // Insert order items
    if (orderData.items && orderData.items.length > 0) {
      const itemsRows = orderData.items.map((it) => ({
        order_id: orderData.id,
        product_id: it.productId || it.id || 'krmu-prod',
        name: it.name,
        price: it.price,
        quantity: it.quantity,
        size: it.size,
        color: it.color || {},
        image: it.image
      }));
      await supabase.from('order_items').insert(itemsRows);
    }

    return data;
  } catch (err) {
    console.warn('Supabase createSupabaseOrder fallback:', err.message);
    return null;
  }
}

export async function fetchSupabaseOrders(userId = null) {
  try {
    let query = supabase
      .from('orders')
      .select('*, order_items (*)')
      .order('created_at', { ascending: false });

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query;
    if (error) throw error;

    return data.map((o) => ({
      id: o.id,
      createdAt: o.created_at,
      status: o.status,
      estimatedDelivery: o.estimated_delivery,
      trackingNumber: o.tracking_number,
      carrier: o.carrier,
      paymentMethod: o.payment_method,
      paymentId: o.payment_id,
      paymentStatus: o.payment_status,
      customer: {
        name: o.customer_name,
        email: o.customer_email,
        phone: o.customer_phone
      },
      shippingAddress: o.shipping_address,
      pricing: o.pricing,
      timeline: o.timeline || [],
      items: (o.order_items || []).map((it) => ({
        productId: it.product_id,
        name: it.name,
        price: Number(it.price),
        quantity: it.quantity,
        size: it.size,
        color: it.color,
        image: it.image
      }))
    }));
  } catch (err) {
    console.warn('Supabase fetchSupabaseOrders fallback:', err.message);
    return null;
  }
}

export async function fetchSupabaseOrderById(orderId) {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items (*)')
      .or(`id.ilike.${orderId.trim()},tracking_number.ilike.${orderId.trim()}`)
      .single();

    if (error) throw error;
    if (!data) return null;

    return {
      id: data.id,
      createdAt: data.created_at,
      status: data.status,
      estimatedDelivery: data.estimated_delivery,
      trackingNumber: data.tracking_number,
      carrier: data.carrier,
      paymentMethod: data.payment_method,
      paymentId: data.payment_id,
      paymentStatus: data.payment_status,
      customer: {
        name: data.customer_name,
        email: data.customer_email,
        phone: data.customer_phone
      },
      shippingAddress: data.shipping_address,
      pricing: data.pricing,
      timeline: data.timeline || [],
      items: (data.order_items || []).map((it) => ({
        productId: it.product_id,
        name: it.name,
        price: Number(it.price),
        quantity: it.quantity,
        size: it.size,
        color: it.color,
        image: it.image
      }))
    };
  } catch (err) {
    console.warn('Supabase fetchSupabaseOrderById fallback:', err.message);
    return null;
  }
}

export async function updateSupabaseOrderStatus(orderId, newStatus) {
  try {
    const { data, error } = await supabase
      .from('orders')
      .update({
        status: newStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (err) {
    console.warn('Supabase updateSupabaseOrderStatus fallback:', err.message);
    return null;
  }
}

/**
 * ----------------------------------------------------
 * WEBSITE FORM DATA (Contact & Newsletter)
 * ----------------------------------------------------
 */

export async function submitSupabaseContactInquiry({ name, email, phone, subject, message }) {
  try {
    const { data, error } = await supabase
      .from('contact_inquiries')
      .insert({
        name,
        email,
        phone: phone || '',
        subject: subject || 'General Inquiry',
        message
      })
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (err) {
    console.warn('Supabase submitSupabaseContactInquiry fallback:', err.message);
    return { success: false, error: err };
  }
}

export async function submitSupabaseNewsletter(email) {
  try {
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .insert({
        email: email.trim().toLowerCase(),
        coupon_sent: 'KRMU10'
      })
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (err) {
    console.warn('Supabase submitSupabaseNewsletter fallback:', err.message);
    return { success: false, error: err };
  }
}
