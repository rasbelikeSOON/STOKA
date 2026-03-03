-- ============================================================
-- STOKA V2.0 FULL SCHEMA MIGRATION
-- ============================================================

-- ============================================================
-- CORE: BUSINESSES & USERS
-- ============================================================

create table if not exists businesses (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  owner_id uuid references auth.users(id) on delete cascade,
  business_type text,
  currency text not null default 'NGN',
  timezone text default 'Africa/Lagos',
  logo_url text,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists business_members (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references businesses(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  role text not null check (role in ('owner', 'manager', 'staff')),
  full_name text,
  email text,
  is_active boolean default true,
  invited_at timestamptz default now(),
  joined_at timestamptz,
  created_at timestamptz default now(),
  unique(business_id, user_id)
);

-- ============================================================
-- LOCATIONS
-- ============================================================

create table if not exists locations (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references businesses(id) on delete cascade,
  name text not null,
  address text,
  is_default boolean default false,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- ============================================================
-- PRODUCTS & VARIANTS
-- ============================================================

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references businesses(id) on delete cascade,
  name text not null,
  category text,
  description text,
  unit_of_measure text not null default 'unit',
  image_url text,
  barcode text,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete cascade,
  sku text,
  size text,
  color text,
  scent text,
  flavor text,
  weight text,
  other_attributes jsonb default '{}',
  cost_price numeric(14,2) default 0,
  selling_price numeric(14,2) default 0,
  reorder_threshold int not null default 10,
  expiry_date date,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- STOCK LEVELS
-- ============================================================

create table if not exists stock_levels (
  id uuid primary key default gen_random_uuid(),
  variant_id uuid references product_variants(id) on delete cascade,
  location_id uuid references locations(id) on delete cascade,
  quantity int not null default 0 check (quantity >= 0),
  updated_at timestamptz default now(),
  unique(variant_id, location_id)
);

-- ============================================================
-- SUPPLIERS & CUSTOMERS
-- ============================================================

create table if not exists suppliers (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references businesses(id) on delete cascade,
  name text not null,
  phone text,
  email text,
  address text,
  notes text,
  is_active boolean default true,
  created_at timestamptz default now()
);

create table if not exists customers (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references businesses(id) on delete cascade,
  name text not null,
  phone text,
  email text,
  notes text,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- ============================================================
-- TRANSACTIONS
-- ============================================================

create table if not exists transactions (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references businesses(id) on delete cascade,
  location_id uuid references locations(id),
  type text not null check (type in ('purchase','sale','return_in','return_out','adjustment','transfer_in','transfer_out')),
  status text not null default 'confirmed' check (status in ('pending','confirmed','cancelled')),
  reference_code text unique,
  supplier_id uuid references suppliers(id),
  customer_id uuid references customers(id),
  transfer_to_location_id uuid references locations(id),
  total_amount numeric(14,2) default 0,
  note text,
  raw_message text,
  ai_response jsonb,
  performed_by uuid references auth.users(id),
  transaction_date date not null default current_date,
  created_at timestamptz default now()
);

create table if not exists transaction_items (
  id uuid primary key default gen_random_uuid(),
  transaction_id uuid references transactions(id) on delete cascade,
  variant_id uuid references product_variants(id),
  quantity int not null,
  unit_price numeric(14,2) not null default 0,
  total_price numeric(14,2) generated always as (quantity * unit_price) stored
);

-- ============================================================
-- CHAT HISTORY
-- ============================================================

create table if not exists chat_messages (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references businesses(id) on delete cascade,
  user_id uuid references auth.users(id),
  role text not null check (role in ('user','assistant')),
  content text not null,
  message_type text default 'text' check (message_type in ('text','confirmation_card','insight_card','system')),
  metadata jsonb default '{}',
  is_read boolean default true,
  created_at timestamptz default now()
);

-- ============================================================
-- INSIGHTS
-- ============================================================

create table if not exists insights_log (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references businesses(id) on delete cascade,
  type text not null check (type in ('low_stock','reorder_suggestion','slow_mover','revenue_milestone','expiry_warning','top_performer','weekly_summary')),
  severity text default 'info' check (severity in ('info','warning','critical')),
  title text not null,
  message text not null,
  metadata jsonb default '{}',
  is_read boolean default false,
  is_dismissed boolean default false,
  created_at timestamptz default now()
);

-- ============================================================
-- INVITATIONS
-- ============================================================

create table if not exists invitations (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references businesses(id) on delete cascade,
  email text not null,
  role text check (role in ('manager','staff')),
  token text unique default gen_random_uuid()::text,
  invited_by uuid references auth.users(id),
  accepted_at timestamptz,
  expires_at timestamptz default (now() + interval '7 days'),
  created_at timestamptz default now()
);

-- ============================================================
-- USEFUL INDEXES
-- ============================================================

create index if not exists idx_stock_levels_variant_id on stock_levels(variant_id);
create index if not exists idx_transactions_business_date on transactions(business_id, transaction_date desc);
create index if not exists idx_transaction_items_transaction_id on transaction_items(transaction_id);
create index if not exists idx_chat_messages_business_created on chat_messages(business_id, created_at desc);
create index if not exists idx_insights_log_business_read_created on insights_log(business_id, is_read, created_at desc);
create index if not exists idx_products_business_name on products(business_id, name);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- Enable RLS on every table
alter table businesses enable row level security;
alter table business_members enable row level security;
alter table locations enable row level security;
alter table products enable row level security;
alter table product_variants enable row level security;
alter table stock_levels enable row level security;
alter table suppliers enable row level security;
alter table customers enable row level security;
alter table transactions enable row level security;
alter table transaction_items enable row level security;
alter table chat_messages enable row level security;
alter table insights_log enable row level security;
alter table invitations enable row level security;

-- Helper function: get the user's business_id
create or replace function get_user_business_id()
returns uuid as $$
  select business_id from business_members
  where user_id = auth.uid()
  limit 1;
$$ language sql security definer stable;

-- Apply policies: users can only access their own business's data
-- Drop existing if any to avoid errors during re-run
drop policy if exists "Users access own business data" on businesses;
create policy "Users access own business data" on businesses
  using (id = get_user_business_id());

drop policy if exists "Users access own business members" on business_members;
create policy "Users access own business members" on business_members
  using (business_id = get_user_business_id());

drop policy if exists "Users access own locations" on locations;
create policy "Users access own locations" on locations
  using (business_id = get_user_business_id());

drop policy if exists "Users access own products" on products;
create policy "Users access own products" on products
  using (business_id = get_user_business_id());

drop policy if exists "Users access own transactions" on transactions;
create policy "Users access own transactions" on transactions
  using (business_id = get_user_business_id());

drop policy if exists "Users access own chat messages" on chat_messages;
create policy "Users access own chat messages" on chat_messages
  using (business_id = get_user_business_id());

drop policy if exists "Users access own insights" on insights_log;
create policy "Users access own insights" on insights_log
  using (business_id = get_user_business_id());

-- Additional policies for child tables
drop policy if exists "Users access own variants" on product_variants;
create policy "Users access own variants" on product_variants
  using (product_id in (select id from products where business_id = get_user_business_id()));

drop policy if exists "Users access own stock levels" on stock_levels;
create policy "Users access own stock levels" on stock_levels
  using (variant_id in (select id from product_variants where product_id in (select id from products where business_id = get_user_business_id())));

drop policy if exists "Users access own suppliers" on suppliers;
create policy "Users access own suppliers" on suppliers
  using (business_id = get_user_business_id());

drop policy if exists "Users access own customers" on customers;
create policy "Users access own customers" on customers
  using (business_id = get_user_business_id());

drop policy if exists "Users access own transaction items" on transaction_items;
create policy "Users access own transaction_items" on transaction_items
  using (transaction_id in (select id from transactions where business_id = get_user_business_id()));

drop policy if exists "Users access own invitations" on invitations;
create policy "Users access own invitations" on invitations
  using (business_id = get_user_business_id());
