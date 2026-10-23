// Fonction « stripe-webhook » (Supabase Edge Function). Reçoit les paiements Stripe et met à jour fam_doulas.
// Réglages : « Verify JWT » désactivé. Secret à ajouter : STRIPE_WEBHOOK_SECRET.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
const SECRET = Deno.env.get("STRIPE_WEBHOOK_SECRET") ?? "";

async function signatureValide(corps: string, entete: string): Promise<boolean> {
  const p = Object.fromEntries(entete.split(",").map((x) => x.split("=") as [string, string]));
  if (!p.t || !p.v1 || !SECRET) return false;
  if (Math.abs(Date.now() / 1000 - Number(p.t)) > 300) return false;
  const cle = await crypto.subtle.importKey("raw", new TextEncoder().encode(SECRET), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", cle, new TextEncoder().encode(`${p.t}.${corps}`));
  const hex = [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, "0")).join("");
  return hex === p.v1;
}

const statut = (s: string) => s === "active" || s === "trialing" ? "actif" : s === "past_due" ? "impaye" : "annule";

Deno.serve(async (req) => {
  const corps = await req.text();
  if (!(await signatureValide(corps, req.headers.get("stripe-signature") ?? ""))) return new Response("signature invalide", { status: 400 });
  const ev = JSON.parse(corps);
  const o = ev.data.object;
  try {
    if (ev.type === "checkout.session.completed" && o.mode === "subscription") {
      const patch = { abonnement_statut: "actif", stripe_customer: o.customer, stripe_sub: o.subscription };
      if (o.client_reference_id) await sb.from("fam_doulas").update(patch).eq("id", o.client_reference_id);
      else if (o.customer_details?.email) await sb.from("fam_doulas").update(patch).ilike("courriel", o.customer_details.email);
    } else if (ev.type === "customer.subscription.updated" || ev.type === "customer.subscription.deleted") {
      const fin = o.current_period_end ? new Date(o.current_period_end * 1000).toISOString() : null;
      await sb.from("fam_doulas").update({ abonnement_statut: ev.type.endsWith("deleted") ? "annule" : statut(o.status), abonnement_fin: fin, stripe_sub: o.id }).eq("stripe_customer", o.customer);
    }
  } catch (e) {
    return new Response("erreur : " + e, { status: 500 });
  }
  return new Response("ok");
});
