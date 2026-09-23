import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const PROTECTED_PREFIXES = ["/dashboard", "/onboarding"];
const AUTH_PAGES = ["/login", "/signup"];
const VERIFY_PATH = "/onboarding/verify";

// Called from src/proxy.ts (Next.js 16 renamed middleware.ts -> proxy.ts).
// Refreshes the Supabase session cookie on every request and gates
// protected routes / onboarding / verification based on auth + role +
// verification state.
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isProtected = PROTECTED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );
  const isAuthPage = AUTH_PAGES.some((prefix) => pathname.startsWith(prefix));

  if (!user && isProtected) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect_to", pathname);
    return NextResponse.redirect(url);
  }

  if (user && isAuthPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/onboarding";
    return NextResponse.redirect(url);
  }

  // Role/verification gating only applies to /dashboard — /onboarding and
  // /onboarding/verify are the pages that GET you past these checks, so
  // gating them here would redirect a page to itself (infinite loop).
  // Each of those pages already redirects away on its own once it's no
  // longer needed (role already set / already verified).
  if (user && pathname.startsWith("/dashboard")) {
    const { data: profile } = await supabase
      .from("users")
      .select("role, verification_status")
      .eq("id", user.id)
      .single();

    if (!profile?.role) {
      const url = request.nextUrl.clone();
      url.pathname = "/onboarding";
      return NextResponse.redirect(url);
    }

    // Admins are exempt — an internally-promoted team member isn't going
    // through the same Stripe Identity flow a hirer/talent account uses.
    if (profile.role !== "admin" && profile.verification_status !== "passed") {
      const url = request.nextUrl.clone();
      url.pathname = VERIFY_PATH;
      return NextResponse.redirect(url);
    }
  }

  return response;
}
