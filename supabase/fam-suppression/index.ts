// Appli Sérénaissance — suppression de compte : supprime le compte (fonction fam_supprimer_mon_compte, au nom de la personne
// connectée), puis envoie un courriel qui résume ce qui a été supprimé et ce qui est conservé, et avise la propriétaire.
import { createClient } from "npm:@supabase/supabase-js@2";
import { CORS, courrielSuppression, envoyer, esc } from "./commun.ts";

const URL_ = Deno.env.get("SUPABASE_URL")!;
const admin = createClient(URL_, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  const rep = (o: unknown, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { ...CORS, "Content-Type": "application/json" } });
  try {
    const auth = req.headers.get("Authorization") ?? "";
    const moi = createClient(URL_, Deno.env.get("SUPABASE_ANON_KEY")!, { global: { headers: { Authorization: auth } } });
    const { data: { user } } = await moi.auth.getUser();
    if (!user || !user.email) return rep({ erreur: "Connectez-vous d'abord." }, 401);
    const courriel = user.email;

    // Ce qu'il faut savoir AVANT la suppression
    const { data: dl } = await admin.from("fam_doulas").select("id,prenom,nom,abonnement_statut,stripe_sub,test").eq("user_id", user.id).maybeSingle();
    const { data: fa } = dl ? { data: null } : await admin.from("fam_familles").select("id,prenom,doula_id,test,stripe_sub").eq("parent_user", user.id).limit(1).maybeSingle();
    let nbFam = 0, nomDoula = "";
    if (dl) { const { count } = await admin.from("fam_familles").select("id", { count: "exact", head: true }).eq("doula_id", dl.id).not("statut", "in", "(archivee,non_retenue)"); nbFam = count ?? 0; }
    if (fa?.doula_id) { const { data: d } = await admin.from("fam_doulas").select("prenom,nom").eq("id", fa.doula_id).maybeSingle(); nomDoula = [d?.prenom, d?.nom].filter(Boolean).join(" "); }

    // Suppression (au nom de la personne : la fonction refuse le compte propriétaire)
    const { error } = await moi.rpc("fam_supprimer_mon_compte");
    if (error) return rep({ erreur: error.message }, 400);

    // Abonnement Stripe : annulé automatiquement si la clé restreinte (secret STRIPE_CLE_ANNULATION) est installée
    const subId = dl?.stripe_sub || (fa as { stripe_sub?: string } | null)?.stripe_sub || "";
    let abonnementAnnule = false;
    const cleStripe = Deno.env.get("STRIPE_CLE_ANNULATION") ?? "";
    if (subId && cleStripe) {
      try {
        const r = await fetch("https://api.stripe.com/v1/subscriptions/" + encodeURIComponent(subId), { method: "DELETE", headers: { Authorization: "Bearer " + cleStripe } });
        abonnementAnnule = r.ok || r.status === 404;
        if (!abonnementAnnule) console.log("annulation Stripe refusée", r.status);
      } catch (e) { console.log("annulation Stripe impossible", String(e).slice(0, 120)); }
    }

    // Courriel de confirmation
    try {
      const date = new Date().toLocaleDateString("fr-CA", { day: "numeric", month: "long", year: "numeric", timeZone: "America/Toronto" });
      let intro = `Nous confirmons que votre compte Sérénaissance (${esc(courriel)}) a été supprimé le ${date}.`;
      let pts: string[]; let prenom = "";
      if (dl) {
        prenom = dl.prenom ?? "";
        pts = [
          "<b>Supprimé ou fermé :</b> votre accès à l'appli, votre profil et votre fiche dans l'annuaire « Trouver ma doula ».",
          `<b>Vos familles${nbFam ? " (" + nbFam + ")" : ""} :</b> leurs dossiers sont archivés et conservés au moins un an, comme prévu à vos conditions d'utilisation. Vos familles en sont avisées par vous, et non par l'appli.`,
          "<b>Votre abonnement :</b> la suppression du compte n'annule pas à elle seule un abonnement payant. " + (abonnementAnnule ? "Il est annulé : vous ne serez plus facturée. Stripe peut vous envoyer sa propre confirmation." : dl.stripe_sub ? "Nous avons avisé l'Académie Sérénaissance, qui l'annule auprès de Stripe. Vous recevrez un courriel de Stripe à l'annulation." : "Vous n’aviez pas d'abonnement actif lié à ce compte."),
          "<b>Vos droits :</b> vous pouvez demander à voir, corriger ou obtenir une copie de vos renseignements en écrivant à sc@academiesere.ca. Nous répondons dans les 30 jours.",
        ];
      } else {
        prenom = fa?.prenom ?? "";
        if (fa?.doula_id) pts = [
          "<b>Supprimé :</b> votre accès à l'appli. Votre doula" + (nomDoula ? " (" + esc(nomDoula) + ")" : "") + " n'a plus accès à votre espace en direct.",
          "<b>Conservé :</b> le dossier tenu par votre doula (contrat, paiements) reste chez elle pour la durée prévue à votre contrat, au moins un an.",
          "<b>Vos droits :</b> pour voir, corriger ou obtenir une copie de vos renseignements, écrivez à sc@academiesere.ca. Nous répondons dans les 30 jours.",
        ];
        else pts = [
          "<b>Supprimé définitivement :</b> votre espace, votre journal, votre suivi, vos photos et tous vos renseignements.",
          "<b>Impossible à récupérer :</b> nous ne gardons pas de copie.",
        ];
      }
      await envoyer(courriel, "Votre compte Sérénaissance est supprimé", courrielSuppression(prenom, intro, pts, "Si vous n'êtes pas à l'origine de cette suppression, écrivez-nous tout de suite à sc@academiesere.ca."));
    } catch (e) { console.log("courriel non envoyé", String(e).slice(0, 150)); }

    // Avis à la propriétaire (surtout si un abonnement Stripe reste à annuler)
    try {
      if (!(dl?.test) && !(fa?.test)) {
        const titre = dl ? (dl.stripe_sub && !abonnementAnnule ? "⚠️ Une doula a supprimé son compte : abonnement Stripe à annuler" : dl.stripe_sub ? "Une doula a supprimé son compte (abonnement Stripe annulé)" : "Une doula a supprimé son compte") : "Une maman a supprimé son compte";
        const corps = dl ? ([dl.prenom, dl.nom].filter(Boolean).join(" ") + " · " + courriel + (dl.stripe_sub ? " · abonnement " + dl.stripe_sub : "")) : ((fa?.prenom ?? "Une maman") + (fa?.doula_id ? " (avec doula)" : " (sans doula)"));
        await admin.rpc("envoyer_notification", { p_pour: null, p_titre: titre, p_message: corps, p_url: "https://app.academiesere.ca/#admin", p_tag: "appli" });
      }
    } catch (_) { /* jamais bloquant */ }

    return rep({ ok: true });
  } catch (e) {
    return rep({ erreur: String((e as Error).message || e).slice(0, 200) }, 500);
  }
});
