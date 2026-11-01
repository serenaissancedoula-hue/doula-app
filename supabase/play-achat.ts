// Fonction « play-achat » (Supabase Edge Function) : vérifie un achat Google Play auprès de Google, puis active l'abonnement.
// Secret requis : GOOGLE_PLAY_SA = contenu JSON du compte de service Google (accès « Finances » à la Play Console).
// Appelée par l'appli Android (connectée) avec { produit, token, paquet }.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
const PAQUETS = ["ca.academiesere.doula", "ca.academiesere.famille"];
const CORS = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, content-type, apikey, x-client-info" };
const rep = (o: unknown, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { ...CORS, "Content-Type": "application/json" } });

const b64 = (b: ArrayBuffer | string) => {
  const u = typeof b === "string" ? new TextEncoder().encode(b) : new Uint8Array(b);
  return btoa(String.fromCharCode(...u)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};

async function jetonGoogle(): Promise<string> {
  const sa = JSON.parse(Deno.env.get("GOOGLE_PLAY_SA") ?? "{}");
  if (!sa.private_key) throw new Error("GOOGLE_PLAY_SA manquant");
  const maintenant = Math.floor(Date.now() / 1000);
  const entete = b64(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const charge = b64(JSON.stringify({ iss: sa.client_email, scope: "https://www.googleapis.com/auth/androidpublisher", aud: "https://oauth2.googleapis.com/token", iat: maintenant, exp: maintenant + 3600 }));
  const pem = sa.private_key.replace(/-----[^-]+-----/g, "").replace(/\s+/g, "");
  const cle = await crypto.subtle.importKey("pkcs8", Uint8Array.from(atob(pem), (c) => c.charCodeAt(0)), { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", cle, new TextEncoder().encode(`${entete}.${charge}`));
  const r = await fetch("https://oauth2.googleapis.com/token", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion: `${entete}.${charge}.${b64(sig)}` }) });
  const j = await r.json();
  if (!j.access_token) throw new Error("jeton Google refusé");
  return j.access_token;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  try {
    const jwt = (req.headers.get("authorization") ?? "").replace(/^Bearer /i, "");
    const { data: u } = await sb.auth.getUser(jwt);
    const courriel = u?.user?.email?.toLowerCase();
    if (!courriel) return rep({ ok: false, erreur: "non connectée" }, 401);
    const { produit, token, paquet } = await req.json();
    if (!produit || !token || !PAQUETS.includes(paquet)) return rep({ ok: false, erreur: "demande invalide" }, 400);

    const acces = await jetonGoogle();
    const base = `https://androidpublisher.googleapis.com/androidpublisher/v3/applications/${paquet}/purchases`;
    const r = await fetch(`${base}/subscriptionsv2/tokens/${encodeURIComponent(token)}`, { headers: { Authorization: `Bearer ${acces}` } });
    const a = await r.json();
    if (!r.ok) return rep({ ok: false, erreur: "achat introuvable chez Google" }, 400);

    const ligne = (a.lineItems ?? []).find((l: { productId: string }) => l.productId === produit) ?? a.lineItems?.[0];
    const fin = ligne?.expiryTime ?? null;
    const etat: string = a.subscriptionState ?? "";
    const actif = ["SUBSCRIPTION_STATE_ACTIVE", "SUBSCRIPTION_STATE_IN_GRACE_PERIOD", "SUBSCRIPTION_STATE_CANCELED"].includes(etat) && fin && new Date(fin) > new Date();
    const statut = actif ? (etat === "SUBSCRIPTION_STATE_IN_GRACE_PERIOD" ? "impaye" : "actif") : "annule";

    // Google annule l'achat au bout de 3 jours s'il n'est pas « reconnu »
    if (a.acknowledgementState === "ACKNOWLEDGEMENT_STATE_PENDING") {
      await fetch(`${base}/subscriptions/${encodeURIComponent(produit)}/tokens/${encodeURIComponent(token)}:acknowledge`, { method: "POST", headers: { Authorization: `Bearer ${acces}`, "Content-Type": "application/json" }, body: "{}" });
    }

    if (produit.startsWith("annuaire")) {
      if (actif) await sb.from("fam_doulas").update({ annuaire_fin: fin }).ilike("courriel", courriel);
    } else {
      const patch = { abonnement_statut: statut, abonnement_fin: fin, play_token: token, play_produit: produit };
      const table = produit.startsWith("doula") ? "fam_doulas" : "fam_familles";
      await sb.from(table).update(patch).ilike("courriel", courriel);
    }
    return rep({ ok: true, statut, fin });
  } catch (e) {
    return rep({ ok: false, erreur: String(e) }, 500);
  }
});
