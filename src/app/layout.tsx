import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import localFont from "next/font/local";
import { getSiteUrl } from "@/lib/site-url";
import "./globals.css";

// Sofia Pro is the intended heading font but is commercial (Adobe Fonts /
// purchased kit only) — no license file has been provided, so per
// instruction we fall back to General Sans (open-source, Fontshare),
// self-hosted here rather than silently using a mismatched system font.
// Swap this loader for Sofia Pro's own @font-face files if a licensed kit
// is added later.
const display = localFont({
  variable: "--font-display",
  src: [
    { path: "../fonts/general-sans-500.woff2", weight: "500", style: "normal" },
    { path: "../fonts/general-sans-600.woff2", weight: "600", style: "normal" },
    { path: "../fonts/general-sans-700.woff2", weight: "700", style: "normal" },
  ],
  fallback: ["ui-rounded", "system-ui", "sans-serif"],
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "WaeWork — Hire Verified Remote Talent, Worldwide",
    template: "%s",
  },
  description:
    "WaeWork is a global marketplace connecting hirers with identity-verified remote talent worldwide, with payment protection built into every engagement.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${nunito.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-paper-white text-ink-navy">
        {children}
      </body>
    </html>
  );
}
