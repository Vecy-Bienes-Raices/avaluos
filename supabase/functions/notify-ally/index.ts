// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// @ts-ignore
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

// @ts-ignore: Deno env check
const ONESIGNAL_APP_ID = Deno.env.get('ONESIGNAL_APP_ID')!;
// @ts-ignore: Deno env check
const ONESIGNAL_API_KEY = Deno.env.get('ONESIGNAL_API_KEY')!;

serve(async (req: Request) => {
    try {
        const { record, old_record, type } = await req.json();

        // 1. FILTER LOGIC: Status 'waiting_ally' AND Plan 'oro' AND Triggered by Update/Insert
        if (
            record.status === 'waiting_ally' &&
            record.plan_type === 'oro' &&
            record.ally_id
        ) {

            // Prevent duplicate alerts: Check if status JUST changed to waiting_ally
            if (type === 'UPDATE' && old_record.status === 'waiting_ally') {
                return new Response(JSON.stringify({ message: "Status didn't change, skipping" }), { headers: { "Content-Type": "application/json" } });
            }

            console.log(`🔔 Triggering Ally Alert for Appraisal: ${record.id}`);

            // 2. SEND ONESIGNAL NOTIFICATION
            const notificationBody = {
                app_id: ONESIGNAL_APP_ID,
                include_external_user_ids: [record.ally_id], // Targeting the Ally by their Auth UID
                headings: { en: "Nuevo Avalúo CERTIFICADO 🛡️" },
                contents: { en: "¡Hola Vecino Experto! Tienes un nuevo Avalúo Plan Oro pendiente. Entra a tu tablero para revisarlo." },
                data: { appraisal_id: record.id, type: "ally_alert" },
                small_icon: "ic_stat_onesignal_default" // Ensure this icon resource exists in app
            };

            const response = await fetch("https://onesignal.com/api/v1/notifications", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Basic ${ONESIGNAL_API_KEY}`
                },
                body: JSON.stringify(notificationBody)
            });

            const result = await response.json();
            console.log("✅ OneSignal Response:", result);

            if (result.errors) {
                return new Response(JSON.stringify({ error: "OneSignal delivery failed", details: result.errors }), { status: 400 });
            }

            return new Response(JSON.stringify({ success: true, message: "Ally Notified" }), {
                headers: { "Content-Type": "application/json" },
            });

        } else {
            return new Response(JSON.stringify({ message: "Condition not met (Not waiting_ally or Not Oro)" }), {
                headers: { "Content-Type": "application/json" },
            });
        }

    } catch (error: any) {
        console.error("❌ Function Error:", error);
        return new Response(JSON.stringify({ error: error.message || "Unknown Error" }), {
            headers: { "Content-Type": "application/json" },
            status: 400,
        });
    }
});
