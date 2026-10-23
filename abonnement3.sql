-- Reçu du dernier paiement d'abonnement (rempli par la fonction stripe-webhook).
alter table public.fam_doulas add column if not exists abonnement_recu text;
alter table public.fam_doulas add column if not exists abonnement_recu_le timestamptz;
