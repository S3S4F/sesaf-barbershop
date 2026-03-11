import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

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
  const priceFormatted = (data.price / 100).toFixed(2).replace(".", ",");
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://sesaf-barbershop.vercel.app";
  const logoUrl = `${baseUrl}/logo.png`;

  const locationHtml =
    data.locationType === "DOMICILE"
      ? `<tr><td style="padding:12px 16px;color:#9ca3af;font-size:14px;border-bottom:1px solid #333;">Lieu</td><td style="padding:12px 16px;text-align:right;color:#ffffff;font-weight:600;font-size:14px;border-bottom:1px solid #333;">A domicile</td></tr><tr><td style="padding:12px 16px;color:#9ca3af;font-size:14px;border-bottom:none;">Adresse</td><td style="padding:12px 16px;text-align:right;color:#ffffff;font-weight:600;font-size:14px;border-bottom:none;">${data.address || ""}</td></tr>`
      : `<tr><td style="padding:12px 16px;color:#9ca3af;font-size:14px;border-bottom:none;">Lieu</td><td style="padding:12px 16px;text-align:right;color:#ffffff;font-weight:600;font-size:14px;border-bottom:none;">Salon - Bat D Arancette</td></tr>`;

  const locationMapHtml =
    data.locationType === "DOMICILE" && data.address
      ? `<!-- ADRESSE DOMICILE -->
  <tr><td style="background-color:#1a1a1a;padding:0 40px 24px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#252525;border-radius:12px;border:1px solid #333;">
      <tr><td style="padding:20px;">
        <p style="margin:0 0 8px;font-size:14px;color:#fbbf24;font-weight:600;">Adresse de livraison</p>
        <p style="margin:0;font-size:13px;color:#d4d4d8;line-height:1.6;">${data.address}</p>
      </td></tr>
    </table>
  </td></tr>`
      : `<!-- LOCALISATION SALON -->
  <tr><td style="background-color:#1a1a1a;padding:0 40px 24px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#252525;border-radius:12px;border:1px solid #333;">
      <tr><td style="padding:20px;">
        <p style="margin:0 0 8px;font-size:14px;color:#fbbf24;font-weight:600;">Localisation du salon</p>
        <p style="margin:0 0 12px;font-size:13px;color:#d4d4d8;line-height:1.6;">Residence Arancette, Bat D<br>64100 Bayonne, France</p>
        <a href="https://www.google.com/maps/search/Residence+Arancette+Bat+D+Bayonne+64100" style="display:inline-block;background-color:#d97706;color:#ffffff;text-decoration:none;padding:10px 20px;border-radius:8px;font-size:13px;font-weight:600;">Voir sur Google Maps</a>
      </td></tr>
    </table>
  </td></tr>`;

  const html = `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#0f0f0f;font-family:'Segoe UI',Roboto,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0f0f0f;padding:32px 16px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

  <!-- LOGO HEADER -->
  <tr><td style="background:linear-gradient(135deg,#d97706,#b45309,#92400e);border-radius:20px 20px 0 0;padding:40px 40px 32px;text-align:center;">
    <img src="${logoUrl}" alt="SESAF Barbershop" width="180" style="display:block;margin:0 auto 16px;max-width:180px;height:auto;" />
    <p style="margin:0;font-size:14px;color:#fde68a;letter-spacing:1px;text-transform:uppercase;">Residence Arancette, Bat D - Bayonne</p>
  </td></tr>

  <!-- STATUS BANNER -->
  <tr><td style="background-color:#1a1a1a;padding:24px 40px;text-align:center;border-bottom:1px solid #2a2a2a;">
    <table cellpadding="0" cellspacing="0" style="margin:0 auto;"><tr>
      <td style="background-color:#065f46;border-radius:24px;padding:8px 24px;">
        <span style="color:#34d399;font-size:13px;font-weight:700;letter-spacing:0.5px;">RESERVATION CONFIRMEE</span>
      </td>
    </tr></table>
  </td></tr>

  <!-- GREETING -->
  <tr><td style="background-color:#1a1a1a;padding:32px 40px 16px;">
    <h2 style="margin:0;font-size:22px;color:#f5f5f5;font-weight:600;">Salut ${data.customerName} !</h2>
    <p style="margin:12px 0 0;font-size:15px;color:#a1a1aa;line-height:1.6;">Ton rendez-vous est enregistre. Voici le recap :</p>
  </td></tr>

  <!-- DETAILS CARD -->
  <tr><td style="background-color:#1a1a1a;padding:8px 40px 24px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#252525;border-radius:16px;overflow:hidden;border:1px solid #333;">
      <tr><td style="padding:12px 16px;color:#9ca3af;font-size:14px;border-bottom:1px solid #333;">Service</td><td style="padding:12px 16px;text-align:right;color:#fbbf24;font-weight:700;font-size:15px;border-bottom:1px solid #333;">${data.serviceName}</td></tr>
      <tr><td style="padding:12px 16px;color:#9ca3af;font-size:14px;border-bottom:1px solid #333;">Date</td><td style="padding:12px 16px;text-align:right;color:#ffffff;font-weight:600;font-size:14px;border-bottom:1px solid #333;">${data.date}</td></tr>
      <tr><td style="padding:12px 16px;color:#9ca3af;font-size:14px;border-bottom:1px solid #333;">Heure</td><td style="padding:12px 16px;text-align:right;color:#ffffff;font-weight:600;font-size:14px;border-bottom:1px solid #333;">${data.time}</td></tr>
      ${locationHtml}
    </table>
  </td></tr>

  <!-- PRICE -->
  <tr><td style="background-color:#1a1a1a;padding:8px 40px 24px;text-align:center;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,#292524,#1c1917);border-radius:16px;border:1px solid #d97706;">
      <tr><td style="padding:24px;text-align:center;">
        <p style="margin:0 0 4px;font-size:12px;color:#a1a1aa;text-transform:uppercase;letter-spacing:1px;">Total a payer</p>
        <p style="margin:0;font-size:36px;font-weight:800;color:#fbbf24;">${priceFormatted}&#8364;</p>
      </td></tr>
    </table>
  </td></tr>

  ${locationMapHtml}

  <!-- INFO -->
  <tr><td style="background-color:#1a1a1a;padding:0 40px 32px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#1e293b;border-radius:12px;border:1px solid #334155;">
      <tr><td style="padding:20px;">
        <p style="margin:0 0 8px;font-size:14px;color:#93c5fd;font-weight:600;">Bon a savoir</p>
        <p style="margin:0;font-size:13px;color:#94a3b8;line-height:1.6;">Presente-toi <strong style="color:#e2e8f0;">5 minutes avant</strong> l'heure prevue. Pour modifier ou annuler, contacte-nous directement.</p>
      </td></tr>
    </table>
  </td></tr>

  <!-- FOOTER -->
  <tr><td style="background-color:#111111;border-radius:0 0 20px 20px;padding:28px 40px;text-align:center;border-top:1px solid #2a2a2a;">
    <img src="${logoUrl}" alt="SESAF" width="80" style="display:block;margin:0 auto 12px;max-width:80px;height:auto;opacity:0.6;" />
    <p style="margin:0 0 4px;font-size:13px;color:#71717a;font-weight:600;">SESAF Barbershop</p>
    <p style="margin:0;font-size:12px;color:#52525b;">Residence Arancette, Bat D - Bayonne, France</p>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;

  try {
    // Email au client
    await transporter.sendMail({
      from: `"SESAF Barbershop" <${process.env.SMTP_USER}>`,
      to: data.customerEmail,
      subject: "Reservation confirmee - SESAF Barbershop",
      html,
    });

    // Notification au barber (admin)
    const adminEmail = process.env.SMTP_USER;
    if (adminEmail) {
      const locationText = data.locationType === "DOMICILE"
        ? `A domicile - ${data.address || "adresse non precisee"}`
        : "Au salon - Bat D Arancette";

      await transporter.sendMail({
        from: `"SESAF Barbershop" <${adminEmail}>`,
        to: adminEmail,
        subject: `Nouvelle reservation - ${data.customerName}`,
        html: `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#0f0f0f;font-family:'Segoe UI',Roboto,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0f0f0f;padding:32px 16px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

  <tr><td style="background:linear-gradient(135deg,#1e40af,#1e3a8a,#172554);border-radius:20px 20px 0 0;padding:40px 40px 32px;text-align:center;">
    <img src="${logoUrl}" alt="SESAF Barbershop" width="140" style="display:block;margin:0 auto 16px;max-width:140px;height:auto;" />
    <p style="margin:0;font-size:14px;color:#93c5fd;letter-spacing:1px;text-transform:uppercase;">Nouvelle reservation</p>
  </td></tr>

  <tr><td style="background-color:#1a1a1a;padding:32px 40px;">
    <h2 style="margin:0 0 20px;font-size:20px;color:#f5f5f5;font-weight:600;">Un client a reserve !</h2>

    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#252525;border-radius:16px;overflow:hidden;border:1px solid #333;">
      <tr><td style="padding:12px 16px;color:#9ca3af;font-size:14px;border-bottom:1px solid #333;">Client</td><td style="padding:12px 16px;text-align:right;color:#ffffff;font-weight:600;font-size:14px;border-bottom:1px solid #333;">${data.customerName}</td></tr>
      <tr><td style="padding:12px 16px;color:#9ca3af;font-size:14px;border-bottom:1px solid #333;">Email</td><td style="padding:12px 16px;text-align:right;color:#ffffff;font-weight:600;font-size:14px;border-bottom:1px solid #333;">${data.customerEmail}</td></tr>
      <tr><td style="padding:12px 16px;color:#9ca3af;font-size:14px;border-bottom:1px solid #333;">Service</td><td style="padding:12px 16px;text-align:right;color:#fbbf24;font-weight:700;font-size:15px;border-bottom:1px solid #333;">${data.serviceName}</td></tr>
      <tr><td style="padding:12px 16px;color:#9ca3af;font-size:14px;border-bottom:1px solid #333;">Date</td><td style="padding:12px 16px;text-align:right;color:#ffffff;font-weight:600;font-size:14px;border-bottom:1px solid #333;">${data.date}</td></tr>
      <tr><td style="padding:12px 16px;color:#9ca3af;font-size:14px;border-bottom:1px solid #333;">Heure</td><td style="padding:12px 16px;text-align:right;color:#ffffff;font-weight:600;font-size:14px;border-bottom:1px solid #333;">${data.time}</td></tr>
      <tr><td style="padding:12px 16px;color:#9ca3af;font-size:14px;border-bottom:1px solid #333;">Lieu</td><td style="padding:12px 16px;text-align:right;color:#ffffff;font-weight:600;font-size:14px;border-bottom:1px solid #333;">${locationText}</td></tr>
      <tr><td style="padding:12px 16px;color:#9ca3af;font-size:14px;border-bottom:none;">Prix</td><td style="padding:12px 16px;text-align:right;color:#fbbf24;font-weight:800;font-size:18px;border-bottom:none;">${priceFormatted}&#8364;</td></tr>
    </table>
  </td></tr>

  <tr><td style="background-color:#111111;border-radius:0 0 20px 20px;padding:20px 40px;text-align:center;border-top:1px solid #2a2a2a;">
    <p style="margin:0;font-size:12px;color:#52525b;">SESAF Barbershop - Notification admin</p>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`,
      });
    }

    return { success: true };
  } catch (error) {
    console.error("Erreur envoi email:", error);
    return { success: false, error };
  }
}
