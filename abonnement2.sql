-- Sérénaissance : après les places gratuites, les nouvelles doulas peuvent s'inscrire mais doivent s'abonner tout de suite.
-- À coller dans Supabase (projet « Académie Sérénaissance ») > SQL Editor > Run. (Après abonnement.sql)
alter table public.fam_doulas add column if not exists essai_gratuit boolean not null default true;

-- Remplace le verrou : on n'empêche plus l'inscription, on décide seulement si elle a l'essai gratuit.
create or replace function public.fam_limite_doulas() returns trigger
language plpgsql security definer set search_path=public as $$
begin
  if coalesce(auth.role(),'')='service_role' then
    new.essai_gratuit := true;  -- invitée par la propriétaire
  else
    new.essai_gratuit := (select count(*) from fam_doulas) < (select valeur from fam_config where cle='max_doulas');
  end if;
  return new;
end; $$;

-- La doula ne peut pas modifier elle-même ce réglage
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
    new.essai_gratuit := old.essai_gratuit;
  end if;
  return new;
end; $$;

select count(*) as doulas, count(*) filter (where essai_gratuit) as avec_essai from public.fam_doulas;
