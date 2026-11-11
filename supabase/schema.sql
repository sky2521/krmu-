-- ============================================================
-- KRMU ATELIER — PRODUCTION SUPABASE SCHEMA & STRICT RLS
-- Project: KRMU (uwbgoymzaxyhhiefzhcb)
-- ============================================================

CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM PUBLIC, anon;
GRANT USAGE ON SCHEMA private TO authenticated, service_role;

-- 1. User Profiles (synced automatically with auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name text,
  email text,
  phone text,
  role text DEFAULT 'customer',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 2. Saved Shipping Addresses
CREATE TABLE IF NOT EXISTS public.addresses (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  phone text,
  street text NOT NULL,
  city text NOT NULL,
  state text NOT NULL,
  pincode text NOT NULL,
  is_default boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- 3. Cloud Synced Cart Items
CREATE TABLE IF NOT EXISTS public.cart_items (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_id text NOT NULL,
  name text NOT NULL,
  slug text,
  price numeric NOT NULL,
  original_price numeric,
  image text,
  size text NOT NULL,
  color jsonb NOT NULL DEFAULT '{}'::jsonb,
  quantity integer NOT NULL DEFAULT 1,
  updated_at timestamptz DEFAULT now()
);

-- 4. Storefront Catalog Products
CREATE TABLE IF NOT EXISTS public.products (
  id text PRIMARY KEY,
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  category text NOT NULL,
  subcategory text NOT NULL,
  badge text,
  is_new_arrival boolean NOT NULL DEFAULT false,
  is_bestseller boolean NOT NULL DEFAULT false,
  price numeric(10, 2) NOT NULL,
  original_price numeric(10, 2),
  stock integer NOT NULL DEFAULT 10,
  rating numeric(3, 2) NOT NULL DEFAULT 5.0,
  review_count integer NOT NULL DEFAULT 0,
  sizes text[] NOT NULL DEFAULT ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
  description text,
  details text[] NOT NULL DEFAULT ARRAY[]::text[],
  care text,
  fit text,
  images text[] NOT NULL DEFAULT ARRAY[]::text[],
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 5. Orders & Fulfillment
CREATE TABLE IF NOT EXISTS public.orders (
  id text PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text NOT NULL,
  shipping_address jsonb NOT NULL DEFAULT '{}'::jsonb,
  pricing jsonb NOT NULL DEFAULT '{}'::jsonb,
  payment_method text NOT NULL DEFAULT 'Razorpay Online',
  payment_id text,
  payment_status text NOT NULL DEFAULT 'Paid',
  delivery_method text NOT NULL DEFAULT 'Standard Express Courier',
  status text NOT NULL DEFAULT 'Confirmed',
  tracking_number text,
  carrier text NOT NULL DEFAULT 'BlueDart Express Air',
  estimated_delivery text,
  timeline jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 6. Order Line Items
CREATE TABLE IF NOT EXISTS public.order_items (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id text REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id text NOT NULL,
  name text NOT NULL,
  price numeric NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  size text NOT NULL,
  color jsonb DEFAULT '{}'::jsonb,
  image text,
  created_at timestamptz DEFAULT now()
);

-- 7. Concierge Contact Inquiries
CREATE TABLE IF NOT EXISTS public.contact_inquiries (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  subject text NOT NULL DEFAULT 'General Inquiry',
  message text NOT NULL,
  status text NOT NULL DEFAULT 'New',
  created_at timestamptz DEFAULT now()
);

-- 8. Newsletter Subscribers
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text UNIQUE NOT NULL,
  coupon_sent text DEFAULT 'KRMU10',
  created_at timestamptz DEFAULT now()
);

-- 9. Product Reviews
CREATE TABLE IF NOT EXISTS public.product_reviews (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  product_id text NOT NULL,
  author text NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title text,
  comment text NOT NULL,
  verified boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Functions & Triggers
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, phone, role)
  VALUES (
    NEW.id,
    NULLIF(BTRIM(COALESCE(NEW.raw_user_meta_data ->> 'full_name', '')), ''),
    NEW.email,
    NULLIF(BTRIM(COALESCE(NEW.raw_user_meta_data ->> 'phone', '')), ''),
    CASE
      WHEN COALESCE(NEW.raw_app_meta_data ->> 'role', '') = 'admin' THEN 'admin'
      ELSE 'customer'
    END
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(public.profiles.full_name, EXCLUDED.full_name),
    phone = COALESCE(public.profiles.phone, EXCLUDED.phone),
    updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION private.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT (
    COALESCE((SELECT auth.jwt() -> 'app_metadata' ->> 'role'), '') = 'admin'
    OR EXISTS (
      SELECT 1
      FROM public.profiles
      WHERE id = (SELECT auth.uid())
        AND role = 'admin'
    )
  );
$$;

CREATE OR REPLACE FUNCTION private.current_user_role()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT COALESCE(
    (SELECT role FROM public.profiles WHERE id = (SELECT auth.uid())),
    'customer'
  );
$$;

REVOKE ALL ON FUNCTION private.is_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION private.is_admin() TO authenticated, service_role;
REVOKE ALL ON FUNCTION private.current_user_role() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION private.current_user_role() TO authenticated, service_role;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_addresses_user_id ON public.addresses (user_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON public.cart_items (user_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders (user_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items (order_id);
CREATE INDEX IF NOT EXISTS idx_product_reviews_product_id ON public.product_reviews (product_id);
CREATE INDEX IF NOT EXISTS idx_product_reviews_user_id ON public.product_reviews (user_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products (category);

-- Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;

-- Grants
REVOKE ALL ON public.profiles, public.addresses, public.cart_items, public.orders,
  public.order_items, public.contact_inquiries, public.newsletter_subscribers,
  public.product_reviews, public.products FROM anon, authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles, public.addresses, public.cart_items TO authenticated;
GRANT INSERT ON public.orders, public.order_items, public.contact_inquiries, public.newsletter_subscribers TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.orders, public.contact_inquiries, public.products TO authenticated;
GRANT SELECT, INSERT, DELETE ON public.order_items, public.newsletter_subscribers TO authenticated;
GRANT SELECT, INSERT ON public.product_reviews TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.product_reviews TO authenticated;
GRANT SELECT ON public.products TO anon;

-- Strict Policies (drop any legacy "Allow all ..." first before deploying to fresh project)
CREATE POLICY "profiles_select_own_or_admin"
  ON public.profiles FOR SELECT TO authenticated
  USING ((SELECT auth.uid()) = id OR (SELECT private.is_admin()));

CREATE POLICY "profiles_insert_own_customer"
  ON public.profiles FOR INSERT TO authenticated
  WITH CHECK ((SELECT private.is_admin()) OR ((SELECT auth.uid()) = id AND COALESCE(role, 'customer') = 'customer'));

CREATE POLICY "profiles_update_own_or_admin"
  ON public.profiles FOR UPDATE TO authenticated
  USING ((SELECT auth.uid()) = id OR (SELECT private.is_admin()))
  WITH CHECK ((SELECT private.is_admin()) OR ((SELECT auth.uid()) = id AND COALESCE(role, 'customer') = (SELECT private.current_user_role())));

CREATE POLICY "profiles_delete_admin"
  ON public.profiles FOR DELETE TO authenticated
  USING ((SELECT private.is_admin()));

CREATE POLICY "addresses_select_own_or_admin"
  ON public.addresses FOR SELECT TO authenticated
  USING ((SELECT auth.uid()) = user_id OR (SELECT private.is_admin()));

CREATE POLICY "addresses_insert_own"
  ON public.addresses FOR INSERT TO authenticated
  WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "addresses_update_own_or_admin"
  ON public.addresses FOR UPDATE TO authenticated
  USING ((SELECT auth.uid()) = user_id OR (SELECT private.is_admin()))
  WITH CHECK ((SELECT auth.uid()) = user_id OR (SELECT private.is_admin()));

CREATE POLICY "addresses_delete_own_or_admin"
  ON public.addresses FOR DELETE TO authenticated
  USING ((SELECT auth.uid()) = user_id OR (SELECT private.is_admin()));

CREATE POLICY "cart_items_select_own" ON public.cart_items FOR SELECT TO authenticated USING ((SELECT auth.uid()) = user_id);
CREATE POLICY "cart_items_insert_own" ON public.cart_items FOR INSERT TO authenticated WITH CHECK ((SELECT auth.uid()) = user_id);
CREATE POLICY "cart_items_update_own" ON public.cart_items FOR UPDATE TO authenticated USING ((SELECT auth.uid()) = user_id) WITH CHECK ((SELECT auth.uid()) = user_id);
CREATE POLICY "cart_items_delete_own" ON public.cart_items FOR DELETE TO authenticated USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "orders_select_own_or_admin" ON public.orders FOR SELECT TO authenticated USING ((SELECT auth.uid()) = user_id OR (SELECT private.is_admin()));
CREATE POLICY "orders_insert_anon_guest" ON public.orders FOR INSERT TO anon WITH CHECK (user_id IS NULL);
CREATE POLICY "orders_insert_authenticated" ON public.orders FOR INSERT TO authenticated WITH CHECK (user_id = (SELECT auth.uid()) OR user_id IS NULL OR (SELECT private.is_admin()));
CREATE POLICY "orders_update_cancel_own_or_admin" ON public.orders FOR UPDATE TO authenticated USING ((SELECT auth.uid()) = user_id OR (SELECT private.is_admin())) WITH CHECK ((SELECT private.is_admin()) OR ((SELECT auth.uid()) = user_id AND status = 'Cancelled'));
CREATE POLICY "orders_delete_admin" ON public.orders FOR DELETE TO authenticated USING ((SELECT private.is_admin()));

CREATE POLICY "order_items_select_own_or_admin" ON public.order_items FOR SELECT TO authenticated USING ((SELECT private.is_admin()) OR EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.user_id = (SELECT auth.uid())));
CREATE POLICY "order_items_insert_anon_guest" ON public.order_items FOR INSERT TO anon WITH CHECK (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.user_id IS NULL));
CREATE POLICY "order_items_insert_authenticated" ON public.order_items FOR INSERT TO authenticated WITH CHECK ((SELECT private.is_admin()) OR EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND (o.user_id = (SELECT auth.uid()) OR o.user_id IS NULL)));
CREATE POLICY "order_items_delete_admin" ON public.order_items FOR DELETE TO authenticated USING ((SELECT private.is_admin()));

CREATE POLICY "contact_inquiries_insert_public" ON public.contact_inquiries FOR INSERT TO anon, authenticated WITH CHECK (length(btrim(name)) > 0 AND length(btrim(email)) > 0 AND length(btrim(message)) > 0);
CREATE POLICY "contact_inquiries_select_admin" ON public.contact_inquiries FOR SELECT TO authenticated USING ((SELECT private.is_admin()));
CREATE POLICY "contact_inquiries_update_admin" ON public.contact_inquiries FOR UPDATE TO authenticated USING ((SELECT private.is_admin())) WITH CHECK ((SELECT private.is_admin()));
CREATE POLICY "contact_inquiries_delete_admin" ON public.contact_inquiries FOR DELETE TO authenticated USING ((SELECT private.is_admin()));

CREATE POLICY "newsletter_subscribers_insert_public" ON public.newsletter_subscribers FOR INSERT TO anon, authenticated WITH CHECK (length(btrim(email)) > 2);
CREATE POLICY "newsletter_subscribers_select_admin" ON public.newsletter_subscribers FOR SELECT TO authenticated USING ((SELECT private.is_admin()));
CREATE POLICY "newsletter_subscribers_delete_admin" ON public.newsletter_subscribers FOR DELETE TO authenticated USING ((SELECT private.is_admin()));

CREATE POLICY "product_reviews_select_public" ON public.product_reviews FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "product_reviews_insert_anon" ON public.product_reviews FOR INSERT TO anon WITH CHECK (user_id IS NULL AND rating BETWEEN 1 AND 5 AND length(btrim(author)) > 0 AND length(btrim(comment)) > 0);
CREATE POLICY "product_reviews_insert_authenticated" ON public.product_reviews FOR INSERT TO authenticated WITH CHECK ((user_id IS NULL OR user_id = (SELECT auth.uid())) AND rating BETWEEN 1 AND 5 AND length(btrim(author)) > 0 AND length(btrim(comment)) > 0);
CREATE POLICY "product_reviews_update_admin" ON public.product_reviews FOR UPDATE TO authenticated USING ((SELECT private.is_admin())) WITH CHECK ((SELECT private.is_admin()));
CREATE POLICY "product_reviews_delete_admin" ON public.product_reviews FOR DELETE TO authenticated USING ((SELECT private.is_admin()));

CREATE POLICY "products_select_public" ON public.products FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "products_insert_admin" ON public.products FOR INSERT TO authenticated WITH CHECK ((SELECT private.is_admin()));
CREATE POLICY "products_update_admin" ON public.products FOR UPDATE TO authenticated USING ((SELECT private.is_admin())) WITH CHECK ((SELECT private.is_admin()));
CREATE POLICY "products_delete_admin" ON public.products FOR DELETE TO authenticated USING ((SELECT private.is_admin()));
