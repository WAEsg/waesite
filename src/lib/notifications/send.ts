import "server-only";
import { Resend } from "resend";

// Same graceful-degrade idiom as the contact form's existing Resend
// usage: every call is safe to make regardless of configuration — it
// just no-ops (and logs to the server console so the event is at least
// visible during development) until RESEND_API_KEY is set.
export async function sendEmail(params: {
  to: string | string[];
  subject: string;
  heading: string;
  body: string;
  ctaLabel?: string;
  ctaUrl?: string;
}) {
  if (Array.isArray(params.to) && params.to.length === 0) return;

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log(`[notifications] (not configured) would send "${params.subject}" to`, params.to);
    return;
  }

  const resend = new Resend(apiKey);
  await resend.emails.send({
    from: "WaeWork <notifications@waework.com>",
    to: params.to,
    subject: params.subject,
    html: renderEmail(params),
  });
}

function renderEmail(params: {
  heading: string;
  body: string;
  ctaLabel?: string;
  ctaUrl?: string;
}) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://waework.com";

  return `
<!DOCTYPE html>
<html>
  <body style="margin:0;padding:0;background:#eaf3ff;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eaf3ff;padding:32px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="background:#fbfcfe;border-radius:16px;overflow:hidden;">
            <tr>
              <td style="background:linear-gradient(90deg,#1e4fa3,#4a90e2);padding:24px 32px;">
                <span style="font-size:22px;font-weight:800;color:#fbfcfe;">WaeWork</span>
              </td>
            </tr>
            <tr>
              <td style="padding:32px;">
                <h1 style="margin:0 0 16px;font-size:20px;color:#172b4d;">${params.heading}</h1>
                <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#172b4d;">${params.body}</p>
                ${
                  params.ctaLabel && params.ctaUrl
                    ? `<a href="${params.ctaUrl}" style="display:inline-block;background:#1e4fa3;color:#fbfcfe;text-decoration:none;padding:12px 24px;border-radius:10px;font-weight:600;font-size:14px;">${params.ctaLabel}</a>`
                    : ""
                }
              </td>
            </tr>
            <tr>
              <td style="padding:16px 32px;border-top:1px solid #eaf3ff;">
                <p style="margin:0;font-size:12px;color:#172b4d99;">
                  WaeWork · A WAE (We Are Everywhere) company ·
                  <a href="${siteUrl}" style="color:#1e4fa3;">${siteUrl.replace(/^https?:\/\//, "")}</a>
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}
