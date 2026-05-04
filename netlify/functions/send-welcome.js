/* ================================================================
   Netlify Function: send-welcome
   Fires when a borrower submits the intake form.
   Sends a branded welcome email via Resend in English or Spanish.

   Required env variables (set in Netlify → Site Settings → Env vars):
     RESEND_API_KEY     — your Resend API key (re_xxxxxxxxxx)
     RESEND_FROM_EMAIL  — verified sender, e.g. welcome@dukeallenco.com
   ================================================================ */

const LENDINGWISE_URL = 'https://app.lendingwise.com/HMLOWebForm.php?bRc=405994c1adade29d&fOpt=8e614f58c0d670e4&op=69ae9aa7bfc04392';
const CREDIT_REPORT_URL = 'https://www.smartcredit.com/?PID=87772';

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { name, email, language } = JSON.parse(event.body);

    if (!name || !email) {
      return { statusCode: 400, body: 'Missing name or email' };
    }

    const isSpanish = language === 'es';
    const firstName = name.split(' ')[0];

    const subject = isSpanish
      ? '¡Bienvenido a Duke Allen & Co.! Comencemos a financiar tu próxima inversión 🏡💼'
      : 'Welcome to Duke Allen & Co! Let\'s Get You Funded for Your Next Investment 🏡💼';

    const html = isSpanish
      ? buildSpanishEmail(firstName)
      : buildEnglishEmail(firstName);

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM_EMAIL,
        to: email,
        subject,
        html
      })
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Resend error:', err);
      return { statusCode: 500, body: 'Email send failed' };
    }

    return { statusCode: 200, body: 'OK' };

  } catch (err) {
    console.error('Function error:', err);
    return { statusCode: 500, body: 'Server error' };
  }
};

/* ── English Email Template ────────────────────────────────────── */
function buildEnglishEmail(firstName) {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Welcome to Duke Allen & Co</title></head>
<body style="margin:0;padding:0;background:#f4f7f9;font-family:Arial,Helvetica,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f7f9;padding:32px 16px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;max-width:600px;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

  <!-- Header -->
  <tr>
    <td style="background:#0E1C2F;padding:32px 40px;text-align:center;">
      <h1 style="color:#0AA5AD;font-size:26px;margin:0 0 6px;font-weight:700;letter-spacing:-0.5px;">Duke Allen & Co</h1>
      <p style="color:rgba(255,255,255,0.6);font-size:13px;margin:0;">Nationwide Hard Money Lenders</p>
    </td>
  </tr>

  <!-- Greeting -->
  <tr>
    <td style="padding:40px 40px 0;">
      <p style="color:#0E1C2F;font-size:17px;margin:0 0 6px;"><strong>Hi ${firstName},</strong></p>
      <p style="color:#0E1C2F;font-size:15px;margin:0 0 14px;">Welcome to <strong>Duke Allen &amp; Co!</strong></p>
      <p style="color:#5a6a7e;font-size:14px;line-height:1.75;margin:0 0 14px;">We're excited to be part of your real estate investing journey. Whether you're flipping, building, or refinancing into a long-term rental, our programs are built for <strong>speed, flexibility, and investor success.</strong></p>
      <p style="color:#5a6a7e;font-size:14px;line-height:1.75;margin:0 0 32px;">Below you'll find an overview of our loan programs, pre-approval process, and the steps to get your application started.</p>
      <hr style="border:none;border-top:1px solid #e8edf3;margin:0 0 32px;">
    </td>
  </tr>

  <!-- Step 1 -->
  <tr>
    <td style="padding:0 40px 32px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="border-left:4px solid #0AA5AD;padding-left:20px;">
            <h2 style="color:#0E1C2F;font-size:17px;margin:0 0 12px;">💳 Step 1: Pre-Approval &amp; Proof of Funds (POF)</h2>
            <p style="color:#5a6a7e;font-size:14px;line-height:1.75;margin:0 0 12px;">Before submitting a full loan application, we recommend starting with a <strong>pre-approval</strong>.</p>
            <p style="color:#0E1C2F;font-size:14px;font-weight:700;margin:0 0 8px;">Pre-Approval Benefits:</p>
            <ul style="color:#5a6a7e;font-size:14px;line-height:1.8;margin:0 0 16px;padding-left:18px;">
              <li>Establishes your lending capacity (up to <strong>5× your total available liquidity</strong>). Example: $50,000 cash = $250,000 pre-approval</li>
              <li>Strengthens your offers when negotiating with sellers or agents</li>
              <li>Speeds up funding once under contract</li>
            </ul>
            <p style="color:#5a6a7e;font-size:14px;line-height:1.75;margin:0 0 14px;">If you're ready to submit offers, we can issue a <strong>Proof of Funds (POF) Letter</strong> within <strong>24–48 hours.</strong></p>
            <p style="color:#0E1C2F;font-size:14px;font-weight:700;margin:0 0 8px;">📧 To Request Your POF Letter, please include:</p>
            <ul style="color:#5a6a7e;font-size:14px;line-height:1.8;margin:0 0 20px;padding-left:18px;">
              <li>Full Legal Name</li>
              <li>Business Entity Name (if applicable)</li>
              <li>Total Available Liquidity</li>
              <li>Type of Loan Requested</li>
            </ul>
            <a href="${LENDINGWISE_URL}" style="display:inline-block;background:#0AA5AD;color:#ffffff;text-decoration:none;padding:13px 26px;border-radius:8px;font-size:14px;font-weight:700;">👉 Start Your Proof of Funds Request Here</a>
          </td>
        </tr>
      </table>
      <hr style="border:none;border-top:1px solid #e8edf3;margin:32px 0 0;">
    </td>
  </tr>

  <!-- Step 2 -->
  <tr>
    <td style="padding:0 40px 32px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="border-left:4px solid #F59E0B;padding-left:20px;">
            <h2 style="color:#0E1C2F;font-size:17px;margin:0 0 12px;">🏁 Step 2: Complete Your Loan Application</h2>
            <p style="color:#5a6a7e;font-size:14px;line-height:1.75;margin:0 0 20px;">When you're ready to move forward, start your application through our secure borrower portal:</p>
            <a href="${LENDINGWISE_URL}" style="display:inline-block;background:#0AA5AD;color:#ffffff;text-decoration:none;padding:13px 26px;border-radius:8px;font-size:14px;font-weight:700;margin-bottom:16px;">🔗 Start Loan Application Here</a>
            <br>
            <a href="${CREDIT_REPORT_URL}" style="color:#0AA5AD;font-size:13px;text-decoration:underline;">📄 Also download your Credit Report here (Soft Pull — no impact to your score)</a>
            <p style="color:#5a6a7e;font-size:14px;line-height:1.75;margin:16px 0 0;">Once your portal is active, you can complete your application, upload your documents, and track progress in real time.</p>
          </td>
        </tr>
      </table>
      <hr style="border:none;border-top:1px solid #e8edf3;margin:32px 0 0;">
    </td>
  </tr>

  <!-- Step 3 -->
  <tr>
    <td style="padding:0 40px 32px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="border-left:4px solid #0E1C2F;padding-left:20px;">
            <h2 style="color:#0E1C2F;font-size:17px;margin:0 0 12px;">📋 Step 3: Required Documents for Submission</h2>
            <p style="color:#5a6a7e;font-size:14px;line-height:1.75;margin:0 0 12px;"><strong>To expedite processing and approval, please upload all documents listed in the checklist attached.</strong></p>
            <p style="color:#0E1C2F;font-size:14px;font-weight:700;margin:0 0 8px;">📌 Important Notes:</p>
            <ul style="color:#5a6a7e;font-size:14px;line-height:1.8;margin:0;padding-left:18px;">
              <li>All documents must be uploaded directly to your <strong>secure borrower portal</strong></li>
              <li>Missing or incomplete documents may delay approval or funding</li>
              <li><strong>Builder's Risk Insurance</strong> is required for all rehab and new construction projects</li>
              <li><strong>Appraisals</strong> are paid by the borrower prior to closing</li>
            </ul>
          </td>
        </tr>
      </table>
      <hr style="border:none;border-top:1px solid #e8edf3;margin:32px 0 0;">
    </td>
  </tr>

  <!-- Why Duke Allen -->
  <tr>
    <td style="padding:0 40px 32px;">
      <div style="background:#f8fafc;border-radius:10px;padding:24px;">
        <h2 style="color:#0E1C2F;font-size:17px;margin:0 0 12px;">🤝 Why Borrowers Choose Duke Allen &amp; Co.</h2>
        <ul style="color:#5a6a7e;font-size:14px;line-height:1.8;margin:0 0 14px;padding-left:18px;">
          <li>Fast, reliable closings</li>
          <li>Flexible underwriting — we focus on the deal, not red tape</li>
          <li>Transparent communication from start to finish</li>
          <li>In-house insurance and processing for a seamless experience</li>
        </ul>
        <p style="color:#5a6a7e;font-size:14px;line-height:1.75;margin:0;">Whether you're a new investor or scaling your portfolio, we're here to make the lending process smooth and strategic every step of the way.</p>
      </div>
    </td>
  </tr>

  <!-- Signature -->
  <tr>
    <td style="padding:0 40px 40px;">
      <hr style="border:none;border-top:1px solid #e8edf3;margin:0 0 24px;">
      <p style="color:#0E1C2F;font-size:14px;margin:0 0 2px;"><strong>Best regards,</strong></p>
      <p style="color:#0E1C2F;font-size:16px;font-weight:700;margin:0 0 2px;">Joseph Castaneda</p>
      <p style="color:#5a6a7e;font-size:13px;margin:0 0 12px;">Managing Partner | Duke Allen &amp; Co</p>
      <p style="color:#5a6a7e;font-size:13px;margin:0 0 4px;">📧 <a href="mailto:JCastaneda@DukeAllenCo.com" style="color:#0AA5AD;text-decoration:none;">JCastaneda@DukeAllenCo.com</a></p>
      <p style="color:#5a6a7e;font-size:13px;margin:0 0 4px;">📞 <a href="tel:13055226126" style="color:#0AA5AD;text-decoration:none;">(305) 522-6126</a></p>
      <p style="color:#5a6a7e;font-size:13px;margin:0;">🌐 <a href="https://www.dukeallenco.com" style="color:#0AA5AD;text-decoration:none;">www.dukeallenco.com</a></p>
    </td>
  </tr>

  <!-- Footer -->
  <tr>
    <td style="background:#0E1C2F;padding:20px 40px;text-align:center;">
      <p style="color:rgba(255,255,255,0.4);font-size:12px;margin:0;">© 2024 Duke Allen &amp; Co. All rights reserved. | Norcross, GA &amp; Dallas, TX</p>
    </td>
  </tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}

/* ── Spanish Email Template ─────────────────────────────────────── */
function buildSpanishEmail(firstName) {
  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Bienvenido a Duke Allen & Co</title></head>
<body style="margin:0;padding:0;background:#f4f7f9;font-family:Arial,Helvetica,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f7f9;padding:32px 16px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;max-width:600px;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

  <!-- Header -->
  <tr>
    <td style="background:#0E1C2F;padding:32px 40px;text-align:center;">
      <h1 style="color:#0AA5AD;font-size:26px;margin:0 0 6px;font-weight:700;letter-spacing:-0.5px;">Duke Allen & Co</h1>
      <p style="color:rgba(255,255,255,0.6);font-size:13px;margin:0;">Prestamistas de Dinero Privado a Nivel Nacional</p>
    </td>
  </tr>

  <!-- Greeting -->
  <tr>
    <td style="padding:40px 40px 0;">
      <p style="color:#0E1C2F;font-size:17px;margin:0 0 6px;"><strong>Hola ${firstName},</strong></p>
      <p style="color:#0E1C2F;font-size:15px;margin:0 0 14px;">¡Bienvenido a <strong>Duke Allen &amp; Co!</strong></p>
      <p style="color:#5a6a7e;font-size:14px;line-height:1.75;margin:0 0 14px;">Nos emociona ser parte de tu camino como inversionista en bienes raíces. Ya sea que estés comprando para renovar y revender, construyendo desde cero o refinanciando una propiedad de renta, nuestros programas están diseñados para ofrecerte <strong>rapidez, flexibilidad y éxito como inversionista.</strong></p>
      <p style="color:#5a6a7e;font-size:14px;line-height:1.75;margin:0 0 32px;">A continuación encontrarás un resumen de nuestros programas de préstamos, el proceso de preaprobación y los pasos para iniciar tu solicitud.</p>
      <hr style="border:none;border-top:1px solid #e8edf3;margin:0 0 32px;">
    </td>
  </tr>

  <!-- Paso 1 -->
  <tr>
    <td style="padding:0 40px 32px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="border-left:4px solid #0AA5AD;padding-left:20px;">
            <h2 style="color:#0E1C2F;font-size:17px;margin:0 0 12px;">💳 Paso 1: Preaprobación y Carta de Fondos Disponibles (POF)</h2>
            <p style="color:#5a6a7e;font-size:14px;line-height:1.75;margin:0 0 12px;">Antes de enviar tu solicitud completa, te recomendamos iniciar con una <strong>preaprobación.</strong></p>
            <p style="color:#0E1C2F;font-size:14px;font-weight:700;margin:0 0 8px;">Ventajas de la Preaprobación:</p>
            <ul style="color:#5a6a7e;font-size:14px;line-height:1.8;margin:0 0 16px;padding-left:18px;">
              <li>Determina tu capacidad de financiamiento (hasta <strong>5× tu liquidez disponible total</strong>). Ejemplo: $50,000 en efectivo = $250,000 de preaprobación</li>
              <li>Fortalece tus ofertas frente a vendedores y agentes</li>
              <li>Acelera el financiamiento una vez estés bajo contrato</li>
            </ul>
            <p style="color:#5a6a7e;font-size:14px;line-height:1.75;margin:0 0 14px;">Si estás presentando ofertas, podemos emitir una <strong>carta de fondos disponibles (POF)</strong> en <strong>24 a 48 horas.</strong></p>
            <p style="color:#0E1C2F;font-size:14px;font-weight:700;margin:0 0 8px;">📧 Para solicitar tu carta POF, por favor incluye:</p>
            <ul style="color:#5a6a7e;font-size:14px;line-height:1.8;margin:0 0 20px;padding-left:18px;">
              <li>Nombre completo</li>
              <li>Nombre de la entidad o empresa (si aplica)</li>
              <li>Total de liquidez disponible</li>
              <li>Tipo de préstamo que estás solicitando</li>
            </ul>
            <a href="${LENDINGWISE_URL}" style="display:inline-block;background:#0AA5AD;color:#ffffff;text-decoration:none;padding:13px 26px;border-radius:8px;font-size:14px;font-weight:700;">👉 Envía tu Solicitud de POF Aquí</a>
          </td>
        </tr>
      </table>
      <hr style="border:none;border-top:1px solid #e8edf3;margin:32px 0 0;">
    </td>
  </tr>

  <!-- Paso 2 -->
  <tr>
    <td style="padding:0 40px 32px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="border-left:4px solid #F59E0B;padding-left:20px;">
            <h2 style="color:#0E1C2F;font-size:17px;margin:0 0 12px;">🏁 Paso 2: Completa Tu Solicitud de Préstamo</h2>
            <p style="color:#5a6a7e;font-size:14px;line-height:1.75;margin:0 0 20px;">Cuando estés listo para avanzar, completa tu solicitud a través de nuestro portal seguro:</p>
            <a href="${LENDINGWISE_URL}" style="display:inline-block;background:#0AA5AD;color:#ffffff;text-decoration:none;padding:13px 26px;border-radius:8px;font-size:14px;font-weight:700;margin-bottom:16px;">🔗 Haz Clic Aquí para Iniciar tu Solicitud</a>
            <br>
            <a href="${CREDIT_REPORT_URL}" style="color:#0AA5AD;font-size:13px;text-decoration:underline;">📄 Descarga tu Reporte Crediticio aquí (Sin perjudicar tu crédito)</a>
            <p style="color:#5a6a7e;font-size:14px;line-height:1.75;margin:16px 0 0;">Una vez activado tu portal, podrás completar tu aplicación en línea, subir todos tus documentos y seguir el progreso en tiempo real hasta el cierre.</p>
          </td>
        </tr>
      </table>
      <hr style="border:none;border-top:1px solid #e8edf3;margin:32px 0 0;">
    </td>
  </tr>

  <!-- Paso 3 -->
  <tr>
    <td style="padding:0 40px 32px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="border-left:4px solid #0E1C2F;padding-left:20px;">
            <h2 style="color:#0E1C2F;font-size:17px;margin:0 0 12px;">📋 Paso 3: Documentos Requeridos para el Proceso</h2>
            <p style="color:#5a6a7e;font-size:14px;line-height:1.75;margin:0 0 12px;"><strong>Para agilizar la aprobación y el cierre, por favor sube todos los documentos de la lista adjunta para tu tipo de préstamo específico.</strong></p>
            <p style="color:#0E1C2F;font-size:14px;font-weight:700;margin:0 0 8px;">📌 Notas Importantes:</p>
            <ul style="color:#5a6a7e;font-size:14px;line-height:1.8;margin:0;padding-left:18px;">
              <li>Todos los documentos deben subirse directamente a tu <strong>portal seguro</strong></li>
              <li>Documentos faltantes o incompletos pueden retrasar la aprobación o el cierre</li>
              <li>El <strong>seguro de construcción</strong> es obligatorio para proyectos de remodelación o nueva construcción</li>
              <li>Los <strong>avalúos</strong> deben ser pagados por el prestatario antes del cierre</li>
            </ul>
          </td>
        </tr>
      </table>
      <hr style="border:none;border-top:1px solid #e8edf3;margin:32px 0 0;">
    </td>
  </tr>

  <!-- Por qué Duke Allen -->
  <tr>
    <td style="padding:0 40px 32px;">
      <div style="background:#f8fafc;border-radius:10px;padding:24px;">
        <h2 style="color:#0E1C2F;font-size:17px;margin:0 0 12px;">🤝 Por Qué los Inversionistas Eligen Duke Allen &amp; Co.</h2>
        <ul style="color:#5a6a7e;font-size:14px;line-height:1.8;margin:0 0 14px;padding-left:18px;">
          <li>Cierres rápidos y confiables</li>
          <li>Requisitos flexibles — nos enfocamos en la propiedad y el potencial del trato</li>
          <li>Comunicación clara y transparente de inicio a fin</li>
          <li>Aseguradora y procesamiento interno para una experiencia sin contratiempos</li>
        </ul>
        <p style="color:#5a6a7e;font-size:14px;line-height:1.75;margin:0 0 16px;">Ya sea que estés comenzando o escalando tu portafolio de inversiones, nuestro equipo está aquí para ayudarte a financiar tus metas de forma <strong>eficiente, estratégica y segura.</strong></p>
      </div>
    </td>
  </tr>

  <!-- Mensaje para Inversionistas -->
  <tr>
    <td style="padding:0 40px 32px;">
      <div style="background:#fff8ed;border:1px solid #F59E0B;border-radius:10px;padding:24px;">
        <p style="color:#0E1C2F;font-size:14px;font-weight:700;margin:0 0 10px;">💡 Mensaje para Inversionistas</p>
        <p style="color:#5a6a7e;font-size:14px;line-height:1.75;margin:0 0 10px;">No dejes que las barreras te detengan. Si no cuentas con todo el crédito, capital o número de seguro social (SSN), <strong>ponte creativo(a).</strong> Considera socios estratégicos — familia, amigos o aliados — que puedan aportar crédito, capital o experiencia.</p>
        <p style="color:#5a6a7e;font-size:14px;line-height:1.75;font-style:italic;margin:0;">El negocio inmobiliario es trabajo en equipo. Cuando se construye con estrategia y colaboración, los resultados se multiplican.</p>
      </div>
    </td>
  </tr>

  <!-- Cierre -->
  <tr>
    <td style="padding:0 40px 32px;">
      <p style="color:#5a6a7e;font-size:14px;line-height:1.75;margin:0;">Quedo pendiente y con gusto puedo revisar tu escenario, números o resolver cualquier duda. Puedes responder este correo o iniciar directamente tu preaprobación.</p>
    </td>
  </tr>

  <!-- Signature -->
  <tr>
    <td style="padding:0 40px 40px;">
      <hr style="border:none;border-top:1px solid #e8edf3;margin:0 0 24px;">
      <p style="color:#0E1C2F;font-size:14px;margin:0 0 2px;"><strong>Atentamente,</strong></p>
      <p style="color:#0E1C2F;font-size:16px;font-weight:700;margin:0 0 2px;">Joseph Castaneda</p>
      <p style="color:#5a6a7e;font-size:13px;margin:0 0 12px;">Managing Partner | Duke Allen &amp; Co</p>
      <p style="color:#5a6a7e;font-size:13px;margin:0 0 4px;">📧 <a href="mailto:JCastaneda@DukeAllenCo.com" style="color:#0AA5AD;text-decoration:none;">JCastaneda@DukeAllenCo.com</a></p>
      <p style="color:#5a6a7e;font-size:13px;margin:0 0 4px;">📞 <a href="tel:13055226126" style="color:#0AA5AD;text-decoration:none;">(305) 522-6126</a></p>
      <p style="color:#5a6a7e;font-size:13px;margin:0;">🌐 <a href="https://www.dukeallenco.com" style="color:#0AA5AD;text-decoration:none;">www.dukeallenco.com</a></p>
    </td>
  </tr>

  <!-- Footer -->
  <tr>
    <td style="background:#0E1C2F;padding:20px 40px;text-align:center;">
      <p style="color:rgba(255,255,255,0.4);font-size:12px;margin:0;">© 2024 Duke Allen &amp; Co. Todos los derechos reservados. | Norcross, GA &amp; Dallas, TX</p>
    </td>
  </tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}
