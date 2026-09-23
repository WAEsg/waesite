import "server-only";

// Scaffolded, not switched on: real Singpass/MyInfo integration needs a
// relying-party registration and security review with the Singapore
// government that this codebase can't complete on its own — see the
// plan's reconciliation notes. Stripe Identity (stripe-identity.ts) is
// the universal path at launch. This stays gracefully degraded the same
// way, ready to wire up once MYINFO_CLIENT_ID/MYINFO_CLIENT_SECRET exist.
export function isMyInfoConfigured(): boolean {
  return Boolean(process.env.MYINFO_CLIENT_ID && process.env.MYINFO_CLIENT_SECRET);
}

export function buildMyInfoAuthorizeUrl(params: {
  redirectUri: string;
  state: string;
}): string | null {
  if (!isMyInfoConfigured()) return null;

  const clientId = process.env.MYINFO_CLIENT_ID!;
  const authorizeBase =
    process.env.MYINFO_AUTHORIZE_URL ?? "https://api.myinfo.gov.sg/com/v4/authorize";

  const url = new URL(authorizeBase);
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", params.redirectUri);
  url.searchParams.set("scope", "name uinfin");
  url.searchParams.set("purpose_id", "waework-identity-verification");
  url.searchParams.set("state", params.state);

  return url.toString();
}
