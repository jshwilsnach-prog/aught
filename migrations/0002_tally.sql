-- Anonymous entry counts only. One row per UTC day. No identities, IPs, or events.
create table if not exists tally_days (
  day  date primary key,
  hits integer not null default 0 check (hits >= 0)
);
