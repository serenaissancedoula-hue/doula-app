-- Sérénaissance : abonnements (6 mois gratuits dès l'inscription, puis 8 $/mois ou 90 $/an)
-- À coller dans Supabase (projet « Académie Sérénaissance ») > SQL Editor > Run.
alter table public.fam_doulas
  add column if not exists abonnement_statut text,
  add column if not exists abonnement_fin timestamptz,
  add column if not exists stripe_customer text,
  add column if not exists stripe_sub text,
  add column if not exists acces_gratuit boolean not null default false;

-- Une doula ne peut jamais se donner un abonnement elle-même : seul le serveur (webhook Stripe) ou la propriétaire le change.
create or replace function public.fam_proteger_abonnement() returns trigger
language plpgsql security definer set search_path=public as $$
begin
  if coalesce(auth.role(),'')<>'service_role'
     and coalesce(auth.jwt()->>'email','')<>'materniteenconfiance@gmail.com' then
    new.abonnement_statut := old.abonnement_statut;
    new.abonnement_fin := old.abonnement_fin;
    new.stripe_customer := old.stripe_customer;
    new.stripe_sub := old.stripe_sub;
    new.acces_gratuit := old.acces_gratuit;
  end if;
  return new;
end; $$;
drop trigger if exists fam_proteger_abonnement_trg on public.fam_doulas;
create trigger fam_proteger_abonnement_trg before update on public.fam_doulas
  for each row execute function public.fam_proteger_abonnement();

-- Pour offrir (ou retirer) l'accès gratuit à une doula, propriétaire seulement
create or replace function public.fam_admin_acces(p_doula uuid, p_gratuit boolean) returns void
language plpgsql security definer set search_path=public as $$
begin
  if coalesce(auth.jwt()->>'email','')<>'materniteenconfiance@gmail.com' then raise exception 'Réservé à la propriétaire'; end if;
  update fam_doulas set acces_gratuit=p_gratuit where id=p_doula;
end; $$;
revoke all on function public.fam_admin_acces(uuid,boolean) from public;
grant execute on function public.fam_admin_acces(uuid,boolean) to authenticated;

select count(*) as doulas from public.fam_doulas;
