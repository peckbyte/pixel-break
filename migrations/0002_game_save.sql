create table if not exists game_save (
  id text primary key,
  high_score integer not null default 0,
  unlocked integer not null default 1,
  best_combo integer not null default 0,
  last_level integer not null default 0,
  sfx boolean not null default true,
  music boolean not null default true,
  shake boolean not null default true,
  updated_at timestamptz not null default now()
);

insert into game_save (id, unlocked)
values ('world', 5)
on conflict (id) do nothing;
