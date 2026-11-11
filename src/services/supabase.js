import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || 'https://uwbgoymzaxyhhiefzhcb.supabase.co';
export const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'sb_publishable_BF5z-89YOp_lgLRghUQSNg_b6v7LzPR';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

// ==========================================
// 1. AUTHENTICATION SERVICES (SUPABASE AUTH)
// ==========================================

export async function authSignUp(email, password, { fullName, phone }) {
  try {
    const cleanEmail = email.trim().toLowerCase();
    const redirectTo =
      typeof window !== 'undefined' ? `${window.location.origin}/account` : undefined;

    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: {
        emailRedirectTo: redirectTo,
        data: {
          full_name: (fullName || '').trim(),
          phone: (phone || '').trim(),
        },
      },
    });

    if (error) throw error;

    // Supabase Auth returns empty identities array when email already exists and confirmation is enabled
    if (
      data?.user &&
      Array.isArray(data.user.identities) &&
      data.user.identities.length === 0
    ) {
      return {
        user: null,
        session: null,
        needsEmailConfirmation: false,
        error:
          'An account with this email already exists. Please sign in or reset your password.',
      };
    }

    // Email confirmation enabled: session is null until user clicks confirmation link.
    // Profile row is already inserted safely in DB by trigger on_auth_user_created.
    if (data?.user && !data?.session) {
      return {
        user: data.user,
        session: null,
        needsEmailConfirmation: true,
        error: null,
      };
    }

    // Immediate active session (email auto-confirm enabled)
    if (data?.user && data?.session) {
      await upsertProfile(data.user.id, {
        full_name: (fullName || '').trim(),
        email: cleanEmail,
        phone: (phone || '').trim(),
      });
    }

    return {
      user: data.user,
      session: data.session,
      needsEmailConfirmation: false,
      error: null,
    };
  } catch (err) {
    console.error('Supabase SignUp Error:', err.message);
    return {
      user: null,
      session: null,
      needsEmailConfirmation: false,
      error: err.message,
    };
  }
}

export async function authSignIn(email, password) {
  try {
    const cleanEmail = email.trim().toLowerCase();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password,
    });

    if (error) throw error;

    return { user: data.user, session: data.session, error: null };
  } catch (err) {
    console.error('Supabase SignIn Error:', err.message);
    return { user: null, session: null, error: err.message };
  }
}

export async function authResendConfirmation(email) {
  try {
    const cleanEmail = email.trim().toLowerCase();
    const redirectTo =
      typeof window !== 'undefined' ? `${window.location.origin}/account` : undefined;

    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: cleanEmail,
      options: { emailRedirectTo: redirectTo },
    });

    if (error) throw error;
    return { success: true, error: null };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

export async function authResetPassword(email) {
  try {
    const cleanEmail = email.trim().toLowerCase();
    const redirectTo =
      typeof window !== 'undefined' ? `${window.location.origin}/account` : undefined;

    const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
      redirectTo,
    });

    if (error) throw error;
    return { success: true, error: null };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

export async function authUpdatePassword(newPassword) {
  try {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) throw error;
    return { success: true, user: data.user, error: null };
  } catch (err) {
    return { success: false, user: null, error: err.message };
  }
}

export async function authSignOut() {
  try {
    const { error } = await supabase.auth.signOut({ scope: 'local' });
    if (error) throw error;
    return { error: null };
  } catch (err) {
    console.error('Supabase SignOut Error:', err.message);
    return { error: err.message };
  }
}

// ==========================================
// 2. USER PROFILES & ADDRESSES
// ==========================================

export async function upsertProfile(userId, profileData) {
  try {
    const safePayload = {
      id: userId,
      ...(profileData.full_name !== undefined ? { full_name: profileData.full_name } : {}),
      ...(profileData.email !== undefined ? { email: profileData.email } : {}),
      ...(profileData.phone !== undefined ? { phone: profileData.phone } : {}),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('profiles')
      .upsert(safePayload, { onConflict: 'id' })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (err) {
    console.warn('upsertProfile error:', err.message);
    return null;
  }
}

export async function fetchProfile(userId) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) throw error;
    return data;
  } catch (err) {
    return null;
  }
}

export async function fetchUserAddresses(userId) {
  try {
    const { data, error } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map((row) => ({
      ...row,
      isDefault: Boolean(row.is_default),
    }));
  } catch (err) {
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
        phone: addressData.phone,
        street: addressData.street,
        city: addressData.city,
        state: addressData.state,
        pincode: addressData.pincode,
        is_default: Boolean(addressData.isDefault || addressData.is_default),
      })
      .select()
      .single();

    if (error) throw error;
    return data ? { ...data, isDefault: Boolean(data.is_default) } : null;
  } catch (err) {
    console.error('addUserAddress error:', err.message);
    return null;
  }
}

export async function removeUserAddress(addressId) {
  try {
    const { error } = await supabase.from('addresses').delete().eq('id', addressId);

    if (error) throw error;
    return true;
  } catch (err) {
    console.error('removeUserAddress error:', err.message);
    return false;
  }
}

// ==========================================
// 3. CART CLOUD PERSISTENCE
// ==========================================

export async function syncCartToSupabase(userId, items) {
  if (!userId) return false;
  try {
    const { error: deleteErr } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', userId);
    if (deleteErr) throw deleteErr;

    if (items && items.length > 0) {
      const formatted = items.map((item) => ({
        user_id: userId,
        product_id: String(item.productId),
        name: item.name,
        slug: item.slug || null,
        price: Number(item.price),
        original_price: item.originalPrice != null ? Number(item.originalPrice) : null,
        image: item.image || null,
        size: String(item.size),
        color: {},
        quantity: Number(item.quantity) || 1,
      }));

      const { error: insertErr } = await supabase.from('cart_items').insert(formatted);
      if (insertErr) throw insertErr;
    }
    return true;
  } catch (err) {
    console.warn('syncCartToSupabase error:', err.message);
    return false;
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
      key: `${row.product_id}-${row.size}`,
      productId: row.product_id,
      name: row.name,
      slug: row.slug,
      price: Number(row.price),
      originalPrice: row.original_price != null ? Number(row.original_price) : null,
      image: row.image,
      size: row.size,
      quantity: row.quantity,
    }));
  } catch (err) {
    return [];
  }
}

// ==========================================
// 4. ORDER MANAGEMENT & ITEMS
// ==========================================

function mapOrderRow(row) {
  return {
    id: row.id,
    userId: row.user_id,
    customer: {
      name: row.customer_name,
      email: row.customer_email,
      phone: row.customer_phone,
    },
    shippingAddress: row.shipping_address,
    pricing: row.pricing,
    paymentMethod: row.payment_method,
    paymentId: row.payment_id,
    paymentStatus: row.payment_status,
    deliveryMethod: row.delivery_method,
    status: row.status,
    trackingNumber: row.tracking_number,
    carrier: row.carrier,
    estimatedDelivery: row.estimated_delivery,
    timeline: row.timeline || [],
    createdAt: row.created_at,
    items: (row.order_items || []).map((it) => ({
      productId: it.product_id,
      name: it.name,
      price: Number(it.price),
      quantity: it.quantity,
      size: it.size,
      image: it.image,
    })),
  };
}

export async function createSupabaseOrder(orderData, userId = null) {
  try {
    const orderPayload = {
      id: orderData.id,
      user_id: userId || null,
      customer_name: orderData.customer.name,
      customer_email: orderData.customer.email,
      customer_phone: orderData.customer.phone,
      shipping_address: orderData.shippingAddress,
      pricing: orderData.pricing,
      payment_method: orderData.paymentMethod,
      payment_id: orderData.paymentId,
      payment_status: orderData.paymentStatus,
      delivery_method: orderData.deliveryMethod,
      status: orderData.status,
      tracking_number: orderData.trackingNumber,
      carrier: orderData.carrier,
      estimated_delivery: orderData.estimatedDelivery,
      timeline: orderData.timeline,
    };

    const { error: orderErr } = await supabase.from('orders').insert(orderPayload);

    if (orderErr) throw orderErr;

    if (orderData.items && orderData.items.length > 0) {
      const itemsPayload = orderData.items.map((item) => ({
        order_id: orderData.id,
        product_id: String(item.productId),
        name: item.name,
        price: Number(item.price),
        quantity: Number(item.quantity) || 1,
        size: String(item.size),
        color: {},
        image: item.image || null,
      }));

      const { error: itemsErr } = await supabase.from('order_items').insert(itemsPayload);
      if (itemsErr) throw itemsErr;
    }

    return { success: true, orderId: orderData.id, error: null };
  } catch (err) {
    console.warn('createSupabaseOrder error:', err.message);
    return { success: false, orderId: null, error: err.message };
  }
}

export async function fetchSupabaseOrders(userId = null) {
  try {
    let query = supabase
      .from('orders')
      .select('*, order_items(*)')
      .order('created_at', { ascending: false });

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query;
    if (error) throw error;
    if (!data) return [];

    return data.map(mapOrderRow);
  } catch (err) {
    console.warn('fetchSupabaseOrders error:', err.message);
    return null;
  }
}

export async function fetchSupabaseOrderById(orderId) {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('id', orderId)
      .maybeSingle();

    if (error || !data) return null;
    return mapOrderRow(data);
  } catch (err) {
    return null;
  }
}

export async function updateSupabaseOrderStatus(orderId, newStatus, timeline = null) {
  try {
    const updateFields = {
      status: newStatus,
      updated_at: new Date().toISOString(),
      ...(Array.isArray(timeline) ? { timeline } : {}),
    };

    const { error } = await supabase
      .from('orders')
      .update(updateFields)
      .eq('id', orderId);

    if (error) throw error;
    return { success: true, error: null };
  } catch (err) {
    console.warn('updateSupabaseOrderStatus error:', err.message);
    return { success: false, error: err.message };
  }
}

// ==========================================
// 5. PRODUCTS CATALOG & CLIENT REVIEWS
// ==========================================

function mapProductRow(row, reviewsByProduct = {}) {
  const attachedReviews = reviewsByProduct[row.id] || [];
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    category: row.category,
    subcategory: row.subcategory,
    badge: row.badge || null,
    isNewArrival: Boolean(row.is_new_arrival),
    isBestseller: Boolean(row.is_bestseller),
    price: Number(row.price),
    originalPrice: row.original_price != null ? Number(row.original_price) : null,
    stock: Number(row.stock ?? 0),
    rating: Number(row.rating ?? 5),
    reviewCount: Math.max(Number(row.review_count ?? 0), attachedReviews.length),
    sizes: Array.isArray(row.sizes) && row.sizes.length > 0 ? row.sizes : ['XS', 'S', 'M', 'L', 'XL'],
    description: row.description || '',
    details: Array.isArray(row.details) ? row.details : [],
    care: row.care || '',
    fit: row.fit || '',
    images: Array.isArray(row.images) ? row.images : [],
    reviews: attachedReviews,
  };
}

function toDbProductPayload(product) {
  return {
    id: String(product.id),
    name: product.name,
    slug: product.slug,
    category: product.category,
    subcategory: product.subcategory || 'outerwear',
    badge: product.badge || null,
    is_new_arrival: Boolean(product.isNewArrival),
    is_bestseller: Boolean(product.isBestseller),
    price: Number(product.price),
    original_price: product.originalPrice != null ? Number(product.originalPrice) : null,
    stock: Number(product.stock ?? 10),
    rating: Number(product.rating ?? 5),
    review_count: Number(product.reviewCount ?? 0),
    sizes: Array.isArray(product.sizes) && product.sizes.length > 0 ? product.sizes : ['S', 'M', 'L', 'XL'],
    description: product.description || '',
    details: Array.isArray(product.details) ? product.details : [],
    care: product.care || '',
    fit: product.fit || '',
    images: Array.isArray(product.images) ? product.images : [],
  };
}

export async function fetchSupabaseProducts() {
  try {
    const [{ data: prodRows, error: prodErr }, { data: revRows, error: revErr }] =
      await Promise.all([
        supabase.from('products').select('*').order('id', { ascending: true }),
        supabase
          .from('product_reviews')
          .select('*')
          .order('created_at', { ascending: false }),
      ]);

    if (prodErr) throw prodErr;

    const reviewsByProduct = {};
    if (!revErr && Array.isArray(revRows)) {
      revRows.forEach((r) => {
        if (!reviewsByProduct[r.product_id]) reviewsByProduct[r.product_id] = [];
        reviewsByProduct[r.product_id].push({
          id: r.id,
          author: r.author,
          rating: Number(r.rating),
          title: r.title || 'Verified Review',
          comment: r.comment,
          verified: Boolean(r.verified),
          date: r.created_at ? r.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
        });
      });
    }

    if (!prodRows || prodRows.length === 0) return [];
    return prodRows.map((row) => mapProductRow(row, reviewsByProduct));
  } catch (err) {
    console.warn('fetchSupabaseProducts error:', err.message);
    return null;
  }
}

export async function upsertSupabaseProduct(product) {
  try {
    const payload = toDbProductPayload(product);
    const { data, error } = await supabase
      .from('products')
      .upsert(payload, { onConflict: 'id' })
      .select()
      .single();

    if (error) throw error;
    return { success: true, data, error: null };
  } catch (err) {
    console.warn('upsertSupabaseProduct error:', err.message);
    return { success: false, data: null, error: err.message };
  }
}

export async function deleteSupabaseProduct(productId) {
  try {
    const { error } = await supabase.from('products').delete().eq('id', productId);
    if (error) throw error;
    return { success: true, error: null };
  } catch (err) {
    console.warn('deleteSupabaseProduct error:', err.message);
    return { success: false, error: err.message };
  }
}

export async function syncCatalogToSupabase(productsList) {
  try {
    const payloads = productsList.map(toDbProductPayload);
    const { error } = await supabase
      .from('products')
      .upsert(payloads, { onConflict: 'id' });
    if (error) throw error;
    return { success: true, error: null };
  } catch (err) {
    console.warn('syncCatalogToSupabase error:', err.message);
    return { success: false, error: err.message };
  }
}

export async function submitSupabaseProductReview(productId, reviewData, userId = null) {
  try {
    const { data, error } = await supabase
      .from('product_reviews')
      .insert({
        product_id: String(productId),
        user_id: userId || null,
        author: reviewData.author.trim(),
        rating: Number(reviewData.rating),
        title: (reviewData.title || 'Verified Review').trim(),
        comment: reviewData.comment.trim(),
        verified: true,
      })
      .select()
      .single();

    if (error) throw error;
    return { success: true, data, error: null };
  } catch (err) {
    console.warn('submitSupabaseProductReview error:', err.message);
    return { success: false, data: null, error: err.message };
  }
}

// ==========================================
// 6. CONTACT INQUIRIES & NEWSLETTER
// ==========================================

export async function submitSupabaseContactInquiry({
  name,
  email,
  phone,
  subject,
  message,
}) {
  try {
    const { error } = await supabase.from('contact_inquiries').insert({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || null,
      subject: subject || 'General Inquiry',
      message: message.trim(),
      status: 'New',
    });

    if (error) throw error;
    return { success: true, error: null };
  } catch (err) {
    console.warn('submitSupabaseContactInquiry error:', err.message);
    return { success: false, error: err.message };
  }
}

export async function submitSupabaseNewsletter(email) {
  try {
    const cleanEmail = email.trim().toLowerCase();
    const { error } = await supabase
      .from('newsletter_subscribers')
      .insert({ email: cleanEmail, coupon_sent: 'KRMU10' });

    if (error) {
      if (error.code === '23505') {
        return { success: true, alreadySubscribed: true, error: null };
      }
      throw error;
    }
    return { success: true, alreadySubscribed: false, error: null };
  } catch (err) {
    console.warn('submitSupabaseNewsletter error:', err.message);
    return { success: false, error: err.message };
  }
}

// ==========================================
// 7. ADMIN DATABASE MANAGEMENT QUERIES
// ==========================================

export async function fetchAdminProfiles() {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data: data || [], error: null };
  } catch (err) {
    return { data: [], error: err.message };
  }
}

export async function updateAdminProfileRole(profileId, role) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update({ role, updated_at: new Date().toISOString() })
      .eq('id', profileId)
      .select()
      .single();

    if (error) throw error;
    return { success: true, data, error: null };
  } catch (err) {
    return { success: false, data: null, error: err.message };
  }
}

export async function fetchAdminInquiries() {
  try {
    const { data, error } = await supabase
      .from('contact_inquiries')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data: data || [], error: null };
  } catch (err) {
    return { data: [], error: err.message };
  }
}

export async function updateAdminInquiryStatus(inquiryId, status) {
  try {
    const { data, error } = await supabase
      .from('contact_inquiries')
      .update({ status })
      .eq('id', inquiryId)
      .select()
      .single();

    if (error) throw error;
    return { success: true, data, error: null };
  } catch (err) {
    return { success: false, data: null, error: err.message };
  }
}

export async function fetchAdminNewsletterSubscribers() {
  try {
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data: data || [], error: null };
  } catch (err) {
    return { data: [], error: err.message };
  }
}

export async function deleteAdminNewsletterSubscriber(id) {
  try {
    const { error } = await supabase
      .from('newsletter_subscribers')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true, error: null };
  } catch (err) {
    return { success: false, error: err.message };
  }
}
