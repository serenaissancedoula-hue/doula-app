// Fonction « fam-notifier » (Supabase Edge Function) : envoie un courriel à la famille depuis le Gmail de la doula.
// Réglages : « Verify JWT » ACTIVÉ (laisser par défaut). Secrets à ajouter : GMAIL_USER (ex. sc@academiesere.ca) et GMAIL_APP_PASSWORD (mot de passe d'application Google, 16 lettres).
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

const URL_ = Deno.env.get("SUPABASE_URL")!;
const sb = createClient(URL_, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
const CORS = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type" };
const LIEN = "https://serenaissancedoula-hue.github.io/doula-app/parents/";
const esc = (s: string) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]!));

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  const rep = (o: unknown, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { ...CORS, "Content-Type": "application/json" } });
  try {
    const jwt = (req.headers.get("Authorization") ?? "").replace("Bearer ", "");
    const { data: u } = await sb.auth.getUser(jwt);
    const email = u?.user?.email?.toLowerCase();
    if (!email) return rep({ ok: false, erreur: "non connecté" }, 401);
    const { famille, type, titre } = await req.json();
    const { data: d } = await sb.from("fam_doulas").select("id,prenom,nom,entreprise,courriel").ilike("courriel", email).maybeSingle();
    const { data: f } = await sb.from("fam_familles").select("id,doula_id,courriel,prenom").eq("id", famille).maybeSingle();
    if (!d || !f || f.doula_id !== d.id || !f.courriel) return rep({ ok: false, erreur: "famille introuvable" }, 403);
    const doula = [d.prenom, d.nom].filter(Boolean).join(" ") || "Votre doula";
    const ent = d.entreprise || doula;
    const T: Record<string, [string, string]> = {
      signe: ["Votre document est signé", `${doula} a signé « ${titre ?? "votre document"} ». Vous le retrouvez dans l'appli, section Documents, et vos options de paiement s'y affichent.`],
      document: ["Nouveau document de votre doula", `${doula} vous a déposé « ${titre ?? "un document"} ». Vous le retrouvez dans l'appli, section Documents.`],
      recu: ["Votre reçu de paiement", `${doula} vous a déposé un reçu de paiement. Vous le retrouvez dans l'appli, section Messages.`],
    };
    const [sujet, texte] = T[type] ?? T.document;
    const html = `<div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;color:#3d312b"><h2 style="color:#b5644d;font-weight:500">${esc(sujet)}</h2><p>Bonjour ${esc(f.prenom ?? "")},</p><p>${esc(texte)}</p><p><a href="${LIEN}" style="background:#b5644d;color:#fff;padding:10px 18px;border-radius:20px;text-decoration:none;display:inline-block">Ouvrir mon appli</a></p><p style="color:#8a7a70;font-size:13px">${esc(ent)} · ${esc(doula)}</p></div>`;
    const smtp = new SMTPClient({ connection: { hostname: "smtp.gmail.com", port: 465, tls: true, auth: { username: Deno.env.get("GMAIL_USER")!, password: Deno.env.get("GMAIL_APP_PASSWORD")! } } });
    await smtp.send({ from: `${ent} <${Deno.env.get("GMAIL_USER")}>`, to: f.courriel, replyTo: d.courriel, subject: sujet, content: texte, html });
    await smtp.close();
    return rep({ ok: true });
  } catch (e) {
    return rep({ ok: false, erreur: String(e) }, 500);
  }
});
