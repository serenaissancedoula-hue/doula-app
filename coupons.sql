-- Sérénaissance : codes promo (6 mois gratuits), essai par code, abonnement des mamans.
-- À coller dans Supabase (projet « Académie Sérénaissance ») > SQL Editor > Run.

create table if not exists public.fam_coupons(
  code text primary key,
  pour text not null check (pour in ('doula','famille')),
  mois integer not null default 6 check (mois between 1 and 24),
  max_utilisations integer not null default 10,
  utilisations integer not null default 0,
  actif boolean not null default true,
  created_at timestamptz not null default now());
alter table public.fam_coupons enable row level security;
drop policy if exists fam_coupons_admin on public.fam_coupons;
create policy fam_coupons_admin on public.fam_coupons for all using (public.est_admin()) with check (public.est_admin());

create table if not exists public.fam_coupons_util(
  code text not null references public.fam_coupons(code) on delete cascade,
  compte uuid not null,
  pour text not null,
  nom text,
  le timestamptz not null default now(),
  primary key(code, compte));
alter table public.fam_coupons_util enable row level security;
drop policy if exists fam_coupons_util_admin on public.fam_coupons_util;
create policy fam_coupons_util_admin on public.fam_coupons_util for select using (public.est_admin());

alter table public.fam_doulas add column if not exists essai_fin timestamptz, add column if not exists coupon text;
alter table public.fam_familles add column if not exists essai_fin timestamptz, add column if not exists coupon text,
  add column if not exists abonnement_statut text, add column if not exists abonnement_fin timestamptz,
  add column if not exists stripe_customer text, add column if not exists stripe_sub text;

update public.fam_doulas set essai_fin = created_at + interval '6 months' where essai_fin is null and essai_gratuit is not false;
update public.fam_familles set essai_fin = created_at + interval '6 months' where essai_fin is null;

create or replace function public.fam_limite_doulas() returns trigger
language plpgsql security definer set search_path=public as $$
begin
  -- doula ajoutée par la propriétaire : 6 mois offerts; inscription libre : essai seulement avec un code promo
  if public.est_admin() then
    new.essai_gratuit := true; new.essai_fin := coalesce(new.essai_fin, now() + interval '6 months');
  elsif coalesce(current_setting('sere.fam', true),'')<>'1' then
    new.essai_gratuit := false; new.essai_fin := null;
  end if;
  return new;
end; $$;

create or replace function public.fam_proteger_abonnement() returns trigger
language plpgsql security definer set search_path=public as $$
begin
  if coalesce(auth.role(),'')<>'service_role' and not public.est_admin()
     and coalesce(current_setting('sere.fam', true),'')<>'1' then
    new.abonnement_statut := old.abonnement_statut; new.abonnement_fin := old.abonnement_fin;
    new.stripe_customer := old.stripe_customer; new.stripe_sub := old.stripe_sub;
    new.acces_gratuit := old.acces_gratuit; new.essai_gratuit := old.essai_gratuit;
    new.essai_fin := old.essai_fin; new.coupon := old.coupon;
  end if;
  return new;
end; $$;

create or replace function public.fam_proteger_abo_famille() returns trigger
language plpgsql security definer set search_path=public as $$
begin
  if coalesce(auth.role(),'')<>'service_role' and not public.est_admin()
     and coalesce(current_setting('sere.fam', true),'')<>'1' then
    new.abonnement_statut := old.abonnement_statut; new.abonnement_fin := old.abonnement_fin;
    new.stripe_customer := old.stripe_customer; new.stripe_sub := old.stripe_sub;
    new.essai_fin := old.essai_fin; new.coupon := old.coupon;
  end if;
  return new;
end; $$;
drop trigger if exists fam_proteger_abo_famille_trg on public.fam_familles;
create trigger fam_proteger_abo_famille_trg before update on public.fam_familles for each row execute function public.fam_proteger_abo_famille();

create or replace function public.fam_famille_essai_ins() returns trigger
language plpgsql security definer set search_path=public as $$
begin
  if coalesce(current_setting('sere.fam', true),'')<>'1' and not public.est_admin() then
    new.essai_fin := null; new.coupon := null;
    new.abonnement_statut := null; new.abonnement_fin := null; new.stripe_customer := null; new.stripe_sub := null; end if;
  return new;
end; $$;
drop trigger if exists fam_famille_essai_ins_trg on public.fam_familles;
create trigger fam_famille_essai_ins_trg before insert on public.fam_familles for each row execute function public.fam_famille_essai_ins();

create or replace function public.fam_abonnement_ok(p_doula uuid) returns boolean
language sql stable security definer set search_path=public as $$
  select public.est_admin() or coalesce((
    select d.acces_gratuit
        or d.abonnement_statut in ('actif','impaye')
        or (d.essai_fin is not null and d.essai_fin > now())
    from public.fam_doulas d where d.id = p_doula), false);
$$;

create or replace function public.fam_acces_famille() returns json
language plpgsql stable security definer set search_path=public as $$
declare f record;
begin
  select * into f from fam_familles where parent_user = auth.uid() order by created_at desc limit 1;
  if f.id is null then return json_build_object('ok', true, 'type', 'inconnu'); end if;
  if public.est_admin() then return json_build_object('ok', true, 'type', 'proprio'); end if;
  if f.doula_id is not null and public.fam_abonnement_ok(f.doula_id) then return json_build_object('ok', true, 'type', 'doula'); end if;
  if f.abonnement_statut in ('actif','impaye') then return json_build_object('ok', true, 'type', 'abonnee', 'fin', f.abonnement_fin); end if;
  if f.essai_fin is not null and f.essai_fin > now() then
    return json_build_object('ok', true, 'type', 'essai', 'fin', f.essai_fin, 'coupon', f.coupon); end if;
  return json_build_object('ok', false, 'type', case when f.essai_fin is null then 'sansEssai' else 'expire' end, 'fin', f.essai_fin, 'id', f.id);
end; $$;
grant execute on function public.fam_acces_famille() to authenticated;

create or replace function public.fam_utiliser_coupon(p_code text) returns json
language plpgsql security definer set search_path=public as $$
declare c record; d record; f record; v_pour text; v_compte uuid; v_fin timestamptz; v_nom text;
begin
  if auth.uid() is null then return json_build_object('ok', false, 'msg', 'Connectez-vous d''abord'); end if;
  select * into c from fam_coupons where upper(code) = upper(trim(p_code)) for update;
  if c.code is null or not c.actif then return json_build_object('ok', false, 'msg', 'Ce code n''existe pas ou n''est plus actif'); end if;
  select * into d from fam_doulas where user_id = auth.uid() limit 1;
  if d.id is not null then v_pour := 'doula'; v_compte := d.id; v_nom := trim(coalesce(d.prenom,'')||' '||coalesce(d.nom,''));
  else select * into f from fam_familles where parent_user = auth.uid() order by created_at desc limit 1;
    if f.id is null then return json_build_object('ok', false, 'msg', 'Compte introuvable'); end if;
    v_pour := 'famille'; v_compte := f.id; v_nom := trim(coalesce(f.prenom,'')||' '||coalesce(f.nom,'')); end if;
  if c.pour <> v_pour then return json_build_object('ok', false, 'msg', case when c.pour='doula' then 'Ce code est réservé aux doulas' else 'Ce code est réservé aux mamans' end); end if;
  if exists(select 1 from fam_coupons_util where compte = v_compte) then return json_build_object('ok', false, 'msg', 'Un code promo a déjà été utilisé pour ce compte'); end if;
  if c.utilisations >= c.max_utilisations then return json_build_object('ok', false, 'msg', 'Ce code a déjà été utilisé le nombre de fois permis'); end if;
  v_fin := now() + make_interval(months => c.mois);
  perform set_config('sere.fam', '1', true);
  if v_pour = 'doula' then update fam_doulas set essai_gratuit = true, essai_fin = v_fin, coupon = c.code where id = v_compte;
  else update fam_familles set essai_fin = v_fin, coupon = c.code where id = v_compte; end if;
  update fam_coupons set utilisations = utilisations + 1 where code = c.code;
  insert into fam_coupons_util(code, compte, pour, nom) values (c.code, v_compte, v_pour, nullif(v_nom,''));
  return json_build_object('ok', true, 'fin', v_fin, 'mois', c.mois, 'restants', c.max_utilisations - c.utilisations - 1);
end; $$;
grant execute on function public.fam_utiliser_coupon(text) to authenticated;

insert into public.fam_coupons(code, pour, mois, max_utilisations) values ('DOULA6MOIS','doula',6,10),('MAMAN6MOIS','famille',6,10) on conflict do nothing;

select code, pour, max_utilisations, utilisations from public.fam_coupons;

-- Sécurité : les fonctions de l'appli qui demandent d'être connectée ne sont plus appelables sans connexion.
do $$
declare r record;
begin
  for r in select p.oid::regprocedure as f from pg_proc p join pg_namespace n on n.oid=p.pronamespace
    where n.nspname='public' and p.proname in ('fam_admin_acces','fam_admin_places','fam_annuaire_stats','fam_avis_document','fam_avis_message','fam_avis_rdv',
      'fam_chat_acces','fam_choisir_forfait','fam_devenir_doula','fam_doc_doula','fam_doc_parent','fam_doc_parent2','fam_marquer_lus','fam_moi','fam_paiements',
      'fam_rdv_annuler','fam_rdv_repondre','fam_annuaire2','fam_annuaire3','fam_utiliser_coupon','fam_acces_famille')
  loop
    execute format('revoke execute on function %s from anon, public', r.f);
    execute format('grant execute on function %s to authenticated', r.f);
  end loop;
end $$;
