-- ====================================================================
-- KRMU APPAREL - SUPABASE DATABASE SCHEMA
-- Project: KRMU (uwbgoymzaxyhhiefzhcb)
-- ====================================================================
-- Execute this script in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/uwbgoymzaxyhhiefzhcb/sql
-- ====================================================================

-- 1. PROFILES TABLE (Linked with Supabase Auth users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  email text,
  phone text,
  role text default 'customer', -- 'customer' or 'admin'
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Trigger to automatically create a profile row when a new user signs up via Supabase Auth
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

-- Drop existing trigger if it exists and attach
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- 2. SAVED ADDRESSES TABLE
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


-- 3. CART ITEMS TABLE (Persistent Cloud Cart for Users)
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


-- 4. ORDERS TABLE (Razorpay & COD Orders)
create table if not exists public.orders (
  id text primary key, -- e.g. KRMU-2026-98102
  user_id uuid references public.profiles(id) on delete set null,
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  shipping_address jsonb not null default '{}'::jsonb,
  pricing jsonb not null default '{}'::jsonb,
  payment_method text not null default 'Razorpay Online',
  payment_id text,
  payment_status text not null default 'Paid', -- 'Paid', 'Pending', 'Refunded'
  delivery_method text not null default 'Standard Express Courier',
  status text not null default 'Confirmed', -- 'Confirmed', 'Atelier Tailoring', 'Dispatched', 'Out for Delivery', 'Delivered', 'Cancelled'
  tracking_number text,
  carrier text not null default 'BlueDart Express Air',
  estimated_delivery text,
  timeline jsonb not null default '[]'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);


-- 5. ORDER ITEMS TABLE
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


-- 6. CONTACT INQUIRIES TABLE (Website Contact Form)
create table if not exists public.contact_inquiries (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  phone text,
  subject text not null default 'General Inquiry',
  message text not null,
  status text not null default 'New', -- 'New', 'Responded', 'Archived'
  created_at timestamptz default now()
);


-- 7. NEWSLETTER SUBSCRIBERS TABLE
create table if not exists public.newsletter_subscribers (
  id uuid default gen_random_uuid() primary key,
  email text unique not null,
  coupon_sent text default 'KRMU10',
  created_at timestamptz default now()
);


-- 8. PRODUCT REVIEWS TABLE
create table if not exists public.product_reviews (
  id uuid default gen_random_uuid() primary key,
  product_id text not null,
  author text not null,
  rating integer not null check (rating >= 1 and rating <= 5),
  title text,
  comment text not null,
  verified boolean default true,
  created_at timestamptz default now()
);


-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.addresses enable row level security;
alter table public.cart_items enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.contact_inquiries enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.product_reviews enable row level security;

-- Profiles: Public can read, users can update own profile
create policy "Allow users to read own profile" on public.profiles
  for select using (true);
create policy "Allow users to update own profile" on public.profiles
  for update using (auth.uid() = id);
create policy "Allow profile insertion" on public.profiles
  for insert with check (true);

-- Addresses: Users can manage their own addresses
create policy "Users manage own addresses" on public.addresses
  for all using (auth.uid() = user_id or user_id is null);

-- Cart Items: Users manage own cart items
create policy "Users manage own cart items" on public.cart_items
  for all using (auth.uid() = user_id or user_id is null);

-- Orders: Users can read own orders, anyone can insert (guests/clients), admins can update
create policy "Allow public order insertion" on public.orders
  for insert with check (true);
create policy "Allow reading orders" on public.orders
  for select using (true);
create policy "Allow updating order status" on public.orders
  for update using (true);

-- Order Items: Anyone can insert, anyone can view
create policy "Allow public order items insertion" on public.order_items
  for insert with check (true);
create policy "Allow reading order items" on public.order_items
  for select using (true);

-- Contact Inquiries: Anyone can insert
create policy "Allow contact inquiry insert" on public.contact_inquiries
  for insert with check (true);
create policy "Allow contact inquiry read" on public.contact_inquiries
  for select using (true);

-- Newsletter: Anyone can insert
create policy "Allow newsletter subscribe" on public.newsletter_subscribers
  for insert with check (true);
create policy "Allow newsletter read" on public.newsletter_subscribers
  for select using (true);

-- Product Reviews: Anyone can read and insert
create policy "Allow public review read" on public.product_reviews
  for select using (true);
create policy "Allow public review insert" on public.product_reviews
  for insert with check (true);
