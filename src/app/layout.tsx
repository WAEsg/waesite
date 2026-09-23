import type { Metadata } from "next";
import { Nunito, Bricolage_Grotesque, B612_Mono } from "next/font/google";
import { getSiteUrl } from "@/lib/site-url";
import "./globals.css";

// Headline/display font — matches the prototype's exact font-family
// (Bricolage Grotesque, weight 800 for h1s), a free Google Font, no
// license concerns.
const display = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "variable",
  fallback: ["ui-rounded", "system-ui", "sans-serif"],
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

// Monospace font for route/code-style labels on illustrative mockup cards
// (e.g. "SIN ··· MNL", "DAY 0 ··· DAY 30") — matches the prototype's
// --font-mono exactly.
const mono = B612_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
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
      className={`${display.variable} ${nunito.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-paper-white text-ink-navy">
        {children}
      </body>
    </html>
  );
}
