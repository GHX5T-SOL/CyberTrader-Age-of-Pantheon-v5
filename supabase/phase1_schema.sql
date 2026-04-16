create extension if not exists "pgcrypto";

create type public.wallet_mode as enum ('dev-identity', 'web-wallet', 'mobile-wallet-adapter', 'server-session');
create type public.os_tier as enum ('pirate', 'agent', 'pantheon');
create type public.trade_type as enum ('buy', 'sell');
create type public.news_direction as enum ('up', 'down', 'mixed');

create table public.users (
  id uuid primary key default gen_random_uuid(),
  wallet_address text unique,
  wallet_mode public.wallet_mode not null default 'dev-identity',
  created_at timestamptz not null default now()
);

create table public.profiles (
  user_id uuid primary key references public.users(id) on delete cascade,
  eidolon_handle text not null unique check (length(eidolon_handle) between 2 and 32),
  current_os public.os_tier not null default 'pirate' check (current_os = 'pirate'),
  rank_level integer not null default 0 check (rank_level >= 0),
  rank_title text not null default 'Boot Ghost',
  xp integer not null default 0 check (xp >= 0)
);

create table public.resources (
  user_id uuid primary key references public.users(id) on delete cascade,
  energy_hours numeric(8,2) not null default 72 check (energy_hours >= 0 and energy_hours <= 96),
  heat numeric(6,2) not null default 12 check (heat >= 0 and heat <= 100),
  last_updated_at timestamptz not null default now()
);

create table public.currencies (
  user_id uuid primary key references public.users(id) on delete cascade,
  zero_bol numeric(16,2) not null default 1000000 check (zero_bol >= 0),
  obol_token numeric(16,6)
);

create table public.commodities (
  id uuid primary key default gen_random_uuid(),
  ticker text not null unique check (ticker ~ '^[A-Z0-9]{3,6}$'),
  name text not null,
  base_price numeric(14,2) not null check (base_price > 0),
  volatility numeric(6,4) not null check (volatility >= 0 and volatility <= 1),
  size integer not null check (size > 0),
  heat_risk integer not null check (heat_risk between 1 and 5)
);

create table public.market_state (
  commodity_id uuid primary key references public.commodities(id) on delete cascade,
  current_price numeric(14,2) not null check (current_price > 0),
  last_tick integer not null default 0 check (last_tick >= 0),
  trend_data jsonb not null default '{}'::jsonb
);

create table public.positions (
  user_id uuid not null references public.users(id) on delete cascade,
  commodity_id uuid not null references public.commodities(id) on delete restrict,
  quantity numeric(14,4) not null default 0 check (quantity >= 0),
  avg_entry numeric(14,2) not null default 0 check (avg_entry >= 0),
  realized_pnl numeric(16,2) not null default 0,
  primary key (user_id, commodity_id)
);

create table public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  type public.trade_type not null,
  commodity_id uuid not null references public.commodities(id) on delete restrict,
  quantity numeric(14,4) not null check (quantity > 0),
  price numeric(14,2) not null check (price > 0),
  created_at timestamptz not null default now()
);

create table public.market_news (
  id uuid primary key default gen_random_uuid(),
  headline text not null,
  affected_tickers text[] not null default '{}',
  direction public.news_direction not null,
  credibility numeric(5,4) not null check (credibility >= 0 and credibility <= 1),
  expires_at_tick integer not null check (expires_at_tick >= 0)
);

create table public.game_state (
  user_id uuid primary key references public.users(id) on delete cascade,
  current_screen text not null default 'deck',
  tutorial_step text not null default 'metrics',
  last_login_at timestamptz not null default now()
);

create index positions_user_idx on public.positions(user_id);
create index transactions_user_created_idx on public.transactions(user_id, created_at desc);
create index market_news_expires_idx on public.market_news(expires_at_tick);

alter table public.users enable row level security;
alter table public.profiles enable row level security;
alter table public.resources enable row level security;
alter table public.currencies enable row level security;
alter table public.positions enable row level security;
alter table public.transactions enable row level security;
alter table public.game_state enable row level security;
alter table public.commodities enable row level security;
alter table public.market_state enable row level security;
alter table public.market_news enable row level security;

create policy "users read own" on public.users for select using (auth.uid() = id);
create policy "profiles read own" on public.profiles for select using (auth.uid() = user_id);
create policy "resources read own" on public.resources for select using (auth.uid() = user_id);
create policy "currencies read own" on public.currencies for select using (auth.uid() = user_id);
create policy "positions read own" on public.positions for select using (auth.uid() = user_id);
create policy "transactions read own" on public.transactions for select using (auth.uid() = user_id);
create policy "game state read own" on public.game_state for select using (auth.uid() = user_id);

create policy "commodities read authenticated" on public.commodities for select to authenticated using (true);
create policy "market state read authenticated" on public.market_state for select to authenticated using (true);
create policy "market news read authenticated" on public.market_news for select to authenticated using (true);

create policy "users insert self" on public.users for insert with check (auth.uid() = id);
create policy "profiles insert self" on public.profiles for insert with check (auth.uid() = user_id);
create policy "resources insert self" on public.resources for insert with check (auth.uid() = user_id);
create policy "currencies insert self" on public.currencies for insert with check (auth.uid() = user_id);
create policy "game state insert self" on public.game_state for insert with check (auth.uid() = user_id);

insert into public.commodities (ticker, name, base_price, volatility, size, heat_risk) values
  ('FDST', 'Fractol Dust', 2340, 0.1800, 2, 2),
  ('PGAS', 'Plutonion Gas', 4100, 0.1400, 4, 3),
  ('NGLS', 'Neon Glass', 1200, 0.0900, 1, 1),
  ('HXMD', 'Helix Mud', 680, 0.1100, 3, 1),
  ('VBLM', 'Void Bloom', 310, 0.0600, 5, 1),
  ('ORRS', 'Oracle Resin', 1750, 0.1600, 1, 2),
  ('SNPS', 'Synapse Silk', 920, 0.1000, 2, 2),
  ('MTRX', 'Matrix Salt', 2600, 0.1300, 2, 2),
  ('AETH', 'Aether Tabs', 740, 0.2000, 1, 2),
  ('BLCK', 'Blacklight Serum', 3850, 0.2200, 1, 4)
on conflict (ticker) do nothing;

insert into public.market_state (commodity_id, current_price, last_tick, trend_data)
select id, base_price, 0, jsonb_build_object('momentum', 0, 'liquiditySkew', 1, 'sectorBias', 1)
from public.commodities
on conflict (commodity_id) do nothing;
