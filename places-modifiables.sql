-- Sérénaissance : nombre de places modifiable depuis l'appli (propriétaire)
-- À coller dans Supabase (projet « Académie Sérénaissance ») > SQL Editor > Run.
create table if not exists public.fam_config (cle text primary key, valeur int not null);
alter table public.fam_config enable row level security;
insert into public.fam_config values ('max_doulas',10) on conflict do nothing;

create or replace function public.fam_places_doulas() returns json
language sql security definer set search_path=public stable as $$
  select json_build_object('max',(select valeur from fam_config where cle='max_doulas'),
    'prises',(select count(*) from fam_doulas),
    'ouvert',(select count(*) from fam_doulas)<(select valeur from fam_config where cle='max_doulas'));
$$;
grant execute on function public.fam_places_doulas() to anon, authenticated;

create or replace function public.fam_limite_doulas() returns trigger
language plpgsql security definer set search_path=public as $$
begin
  if coalesce(auth.role(),'')<>'service_role'
     and (select count(*) from fam_doulas)>=(select valeur from fam_config where cle='max_doulas') then
    raise exception 'Les inscriptions sont complètes pour la période de test.';
  end if;
  return new;
end; $$;

create or replace function public.fam_admin_places(p_max int) returns void
language plpgsql security definer set search_path=public as $$
begin
  if coalesce(auth.jwt()->>'email','')<>'materniteenconfiance@gmail.com' then raise exception 'Réservé à la propriétaire'; end if;
  update fam_config set valeur=p_max where cle='max_doulas';
end; $$;
revoke all on function public.fam_admin_places(int) from public;
grant execute on function public.fam_admin_places(int) to authenticated;
select public.fam_places_doulas();
