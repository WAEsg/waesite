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

// Brand tokens (see BRAND.md) — kept as literal hex here rather than
// imported, since this HTML is handed to Resend as a plain string with
// inline styles (email clients don't load Tailwind/CSS variables).
const BRAND = {
  voyageBlue: "#1E4FA3",
  inkNavy: "#172B4D",
  slate: "#4B5C7B",
  line: "#DCE7F7",
  frost: "#F2F6FD",
  paperWhite: "#FBFCFE",
};

function renderEmail(params: {
  heading: string;
  body: string;
  ctaLabel?: string;
  ctaUrl?: string;
}) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://waework.com";
  const siteHost = siteUrl.replace(/^https?:\/\//, "");
  const font = "Arial, Helvetica, sans-serif";

  return `
<!DOCTYPE html>
<html>
  <body style="margin:0;padding:0;background:${BRAND.frost};font-family:${font};">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.frost};padding:40px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="background:${BRAND.paperWhite};border:1px solid ${BRAND.line};border-radius:20px;overflow:hidden;">
            <tr>
              <td style="background:${BRAND.voyageBlue};padding:28px 32px;">
                <span style="font-family:${font};font-size:21px;font-weight:800;letter-spacing:-0.02em;color:#ffffff;">
                  Wae<span style="color:#9CC2FF;">Work</span>
                </span>
              </td>
            </tr>
            <tr>
              <td style="padding:36px 32px 32px;">
                <h1 style="margin:0 0 16px;font-family:${font};font-size:22px;font-weight:800;letter-spacing:-0.01em;color:${BRAND.inkNavy};">${params.heading}</h1>
                <p style="margin:0 0 28px;font-family:${font};font-size:15px;line-height:1.6;color:${BRAND.slate};">${params.body}</p>
                ${
                  params.ctaLabel && params.ctaUrl
                    ? `<table role="presentation" cellpadding="0" cellspacing="0"><tr><td style="border-radius:999px;background:${BRAND.voyageBlue};">
                        <a href="${params.ctaUrl}" style="display:inline-block;padding:13px 28px;font-family:${font};font-size:14px;font-weight:800;color:#ffffff;text-decoration:none;border-radius:999px;">${params.ctaLabel}</a>
                      </td></tr></table>`
                    : ""
                }
              </td>
            </tr>
            <tr>
              <td style="padding:18px 32px;background:${BRAND.frost};border-top:1px solid ${BRAND.line};">
                <p style="margin:0;font-family:${font};font-size:12px;line-height:1.6;color:${BRAND.slate};">
                  WaeWork · A WAE (We Are Everywhere) company ·
                  <a href="${siteUrl}" style="color:${BRAND.voyageBlue};font-weight:700;text-decoration:none;">${siteHost}</a>
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
