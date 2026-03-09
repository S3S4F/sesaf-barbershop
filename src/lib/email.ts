import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface BookingEmailData {
  customerName: string;
  customerEmail: string;
  serviceName: string;
  date: string;
  time: string;
  price: number;
  locationType: string;
  address?: string;
}

export async function sendBookingConfirmation(data: BookingEmailData) {
  try {
    const { error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || "SESAF Barbershop <onboarding@resend.dev>",
      to: data.customerEmail,
      subject: "✅ Réservation confirmée - SESAF Barbershop",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 0; background: #0a0a0a; }
            .container { max-width: 600px; margin: 0 auto; background: #1a1a1a; border-radius: 16px; overflow: hidden; }
            .header { background: linear-gradient(135deg, #d4a574, #c4956a); padding: 40px 30px; text-align: center; }
            .header h1 { color: #0a0a0a; margin: 0; font-size: 28px; font-weight: 700; }
            .header p { color: #2a2a2a; margin: 8px 0 0; font-size: 14px; }
            .body { padding: 30px; color: #e0e0e0; }
            .body h2 { color: #d4a574; font-size: 20px; margin-bottom: 20px; }
            .detail-box { background: #252525; border-radius: 12px; padding: 20px; margin: 16px 0; border-left: 4px solid #d4a574; }
            .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #333; }
            .detail-row:last-child { border-bottom: none; }
            .label { color: #888; font-size: 14px; }
            .value { color: #fff; font-weight: 600; font-size: 14px; }
            .price { color: #d4a574; font-size: 24px; font-weight: 700; text-align: center; margin: 20px 0; }
            .footer { padding: 20px 30px; text-align: center; color: #666; font-size: 12px; border-top: 1px solid #333; }
            .badge { display: inline-block; background: #22c55e; color: #fff; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✂️ SESAF Barbershop</h1>
              <p>Résidence Arancette, Bât D — Bayonne</p>
            </div>
            <div class="body">
              <h2>Salut ${data.customerName} ! 👋</h2>
              <p>Ta réservation est confirmée ! <span class="badge">Confirmée</span></p>
              
              <div class="detail-box">
                <table width="100%" cellpadding="8" cellspacing="0">
                  <tr><td class="label">Service</td><td class="value" align="right">${data.serviceName}</td></tr>
                  <tr><td class="label">Date</td><td class="value" align="right">${data.date}</td></tr>
                  <tr><td class="label">Heure</td><td class="value" align="right">${data.time}</td></tr>
                  ${data.locationType === "DOMICILE" ? `<tr><td class="label">Lieu</td><td class="value" align="right">À domicile</td></tr><tr><td class="label">Adresse</td><td class="value" align="right">${data.address || ""}</td></tr>` : `<tr><td class="label">Lieu</td><td class="value" align="right">Salon — Bât D Arancette</td></tr>`}
                </table>
              </div>
              
              <div class="price">${(data.price / 100).toFixed(2).replace(".", ",")}€</div>
              
              <p style="color: #888; font-size: 13px; text-align: center;">
                Présente-toi au salon 5 minutes avant l'heure.<br>
                Pour annuler, contacte-nous par téléphone.
              </p>
            </div>
            <div class="footer">
              <p>SESAF Barbershop — Résidence Arancette, Bât D, Bayonne 💈</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error("Erreur envoi email:", error);
      return { success: false, error };
    }

    return { success: true };
  } catch (error) {
    console.error("Erreur envoi email:", error);
    return { success: false, error };
  }
}
