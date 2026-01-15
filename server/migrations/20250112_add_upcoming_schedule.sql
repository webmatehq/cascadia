create table if not exists public.upcoming_schedule_weeks (
  id text primary key,
  week_label text not null,
  is_active boolean not null default false
);

create table if not exists public.upcoming_schedule_items (
  id text primary key,
  week_id text not null references public.upcoming_schedule_weeks(id) on delete cascade,
  title text not null,
  sort_order integer not null default 0
);

create table if not exists public.upcoming_schedule_lines (
  id serial primary key,
  item_id text not null references public.upcoming_schedule_items(id) on delete cascade,
  line_text text not null,
  sort_order integer not null default 0
);

create index if not exists upcoming_schedule_items_week_id_idx
  on public.upcoming_schedule_items(week_id);

create index if not exists upcoming_schedule_lines_item_id_idx
  on public.upcoming_schedule_lines(item_id);
