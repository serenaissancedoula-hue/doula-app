-- Sérénaissance : complément pour l'annuaire (mois automatiques, formations). À coller dans Supabase > SQL Editor > Run.
-- Annuaire : mois disponibles mis à jour automatiquement (selon le nombre de familles par mois), sans nouvelle approbation.
create or replace function public.fam_maj_dispo(p_mois text) returns json
language plpgsql security definer set search_path=public as $$
declare v text := nullif(regexp_replace(coalesce(p_mois,''),'[^0-9,-]','','g'),'');
begin
  perform set_config('sere.fam', '1', true);
  update fam_doulas set
    annuaire_pub = case when annuaire_pub is null then null else jsonb_set(annuaire_pub, '{dispo_mois}', coalesce(to_jsonb(v),'null'::jsonb)) end,
    annuaire_brouillon = case when annuaire_brouillon is null then null else jsonb_set(annuaire_brouillon, '{dispo_mois}', coalesce(to_jsonb(v),'null'::jsonb)) end
  where user_id = auth.uid();
  return json_build_object('ok', true);
end; $$;
revoke execute on function public.fam_maj_dispo(text) from anon, public;
grant execute on function public.fam_maj_dispo(text) to authenticated;

-- Annuaire : formations et qualifications des doulas visibles
create or replace function public.fam_annuaire_qualifs() returns table(id uuid, qualifs text)
language sql stable security definer set search_path=public as $$
  select d.id, d.annuaire_pub->>'qualifs' from fam_doulas d where public.fam_annuaire_visible(d);
$$;
grant execute on function public.fam_annuaire_qualifs() to anon, authenticated;
