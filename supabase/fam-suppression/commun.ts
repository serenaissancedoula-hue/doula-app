// Appli Sérénaissance — pièces communes pour le courriel de suppression de compte.
export const APP = "https://app.academiesere.ca/";
export const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
export const esc = (t: unknown) => String(t ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const haut = `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body style="margin:0;padding:0;background-color:#f7f1ea;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f7f1ea;"><tr><td align="center" style="padding:30px 14px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;"><tr><td align="center" style="padding-bottom:20px;"><img src="${APP}logo.png" alt="Sérénaissance" width="190" style="display:block;width:190px;height:auto;border:0;"></td></tr>`;
const bas = `<tr><td align="center" style="padding:24px 10px 0;font-family:Arial,sans-serif;font-size:12px;line-height:1.7;color:#7a685e;">Sérénaissance · l'appli des doulas et des familles</td></tr></table></td></tr></table></body></html>`;

// Courriel de confirmation : titre + paragraphes + liste de points
export function courrielSuppression(prenom: string, intro: string, points: string[], fin: string) {
  const li = points.map((p) => `<li style="margin:0 0 8px;">${p}</li>`).join("");
  return haut
    + `<tr><td style="background-color:#fffbf8;border:1px solid #e3d5c8;border-radius:24px;padding:36px 30px;">`
    + `<h1 style="font-family:Georgia,serif;font-size:23px;color:#2c221e;margin:0 0 18px;text-align:center;">Votre compte est supprimé</h1>`
    + `<div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.7;color:#3d312b;">`
    + `<p style="margin:0 0 14px;">Bonjour${prenom ? " " + esc(prenom) : ""},</p><p style="margin:0 0 14px;">${intro}</p>`
    + `<ul style="margin:0 0 14px;padding-left:20px;">${li}</ul><p style="margin:0 0 14px;">${fin}</p></div>`
    + `<p style="font-family:Arial,sans-serif;font-size:14px;color:#3d312b;margin:18px 0 0;">Avec douceur,<br>L'équipe Sérénaissance</p></td></tr>` + bas;
}

// Envoi par Resend (noreply@academiesere.ca : rien dans les « Envoyés » du Gmail).
// Repli sur l'ancien envoi (EmailJS / Gmail) si Resend refuse ou n'est pas configuré.
export async function envoyer(a: string, sujet: string, html: string) {
  const cle = (Deno.env.get("RESEND_API_KEY") ?? "").trim();
  if (cle) {
    try {
      const r = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${cle}`, "Content-Type": "application/json" },
        body: JSON.stringify({ from: "Sérénaissance <noreply@academiesere.ca>", to: [a], reply_to: "serenaissance.doula@gmail.com", subject: sujet, html }),
      });
      if (r.ok) return;
      console.error("Resend refus", r.status, (await r.text()).slice(0, 200));
    } catch (e) { console.error("Resend erreur", String(e)); }
  } else console.error("RESEND_API_KEY absente : repli EmailJS");
  const r = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: "https://academiesere.ca" },
    body: JSON.stringify({ service_id: "service_82vfhfg", template_id: "template_infolettre", user_id: "HNvKdORRpRy_vT_FI", template_params: { courriel: a, sujet, html } }),
  });
  if (!r.ok) throw new Error("Le courriel n'a pas pu partir : " + (await r.text()).slice(0, 120));
}
