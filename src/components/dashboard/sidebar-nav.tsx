"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { hirerNav, talentNav, adminNav } from "./nav-config";

// Takes just the role, not the nav item list itself — nav items carry
// Lucide icon component references, which can't cross the server/client
// boundary as props (React Server Components can only serialize plain
// data). Importing the config directly here, inside the client
// component, avoids that entirely.
export function SidebarNav({ role }: { role: "hirer" | "talent" | "admin" }) {
  const pathname = usePathname();
  const items = role === "hirer" ? hirerNav : role === "talent" ? talentNav : adminNav;

  return (
    <nav className="flex flex-col gap-1">
      {items.map((item) => {
        const isTopLevelDashboardLink =
          item.href === "/dashboard/hirer" ||
          item.href === "/dashboard/talent" ||
          item.href === "/dashboard/admin";
        const isActive =
          item.href === pathname || (!isTopLevelDashboardLink && pathname.startsWith(item.href));
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`group flex items-center justify-between rounded-full px-3.5 py-2.5 text-sm font-bold transition-colors ${
              isActive ? "bg-cloud-blue text-voyage-blue" : "text-slate hover:bg-frost hover:text-ink-navy"
            }`}
          >
            <span className="flex items-center gap-3">
              <Icon className={`h-4 w-4 ${isActive ? "text-voyage-blue" : "text-slate group-hover:text-voyage-blue"}`} />
              {item.label}
            </span>
            {item.comingSoon && (
              <span className="rounded-full bg-white px-2 py-0.5 font-mono text-[0.625rem] font-bold tracking-[0.06em] text-slate uppercase shadow-[inset_0_0_0_1px_#DCE7F7]">
                Soon
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
