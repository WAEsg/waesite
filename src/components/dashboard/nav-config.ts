import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  PlusCircle,
  Briefcase,
  Users,
  FileSignature,
  Sparkles,
  MessageSquare,
  CreditCard,
  Building2,
  BadgeCheck,
  Bell,
  LifeBuoy,
  Settings,
  Search,
  ClipboardList,
  FolderOpen,
  Wallet,
  User,
  Star,
  AlertTriangle,
  UserCog,
  FileText,
  ListChecks,
} from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  comingSoon?: boolean;
};

export const hirerNav: NavItem[] = [
  { label: "Dashboard", href: "/dashboard/hirer", icon: LayoutDashboard },
  { label: "Post a Job", href: "/dashboard/hirer/jobs/new", icon: PlusCircle },
  { label: "My Job Posts", href: "/dashboard/hirer/jobs", icon: Briefcase },
  { label: "Applicants", href: "/dashboard/hirer/applicants", icon: Users },
  { label: "Active Contracts", href: "/dashboard/hirer/contracts", icon: FileSignature },
  { label: "AI Staffing", href: "/dashboard/hirer/ai-staffing", icon: Sparkles, comingSoon: true },
  { label: "Messages", href: "/dashboard/hirer/messages", icon: MessageSquare },
  { label: "Billing", href: "/dashboard/hirer/billing", icon: CreditCard, comingSoon: true },
  { label: "Company Profile", href: "/dashboard/hirer/company-profile", icon: Building2 },
  { label: "Verification", href: "/dashboard/hirer/verification", icon: BadgeCheck },
  { label: "Notifications", href: "/dashboard/hirer/notifications", icon: Bell, comingSoon: true },
  { label: "Help & Support", href: "/dashboard/hirer/help", icon: LifeBuoy, comingSoon: true },
  { label: "Settings", href: "/dashboard/hirer/settings", icon: Settings },
];

export const talentNav: NavItem[] = [
  { label: "Dashboard", href: "/dashboard/talent", icon: LayoutDashboard },
  { label: "Available Jobs", href: "/dashboard/talent/jobs", icon: Search },
  { label: "My Applications", href: "/dashboard/talent/applications", icon: ClipboardList },
  { label: "Current Jobs", href: "/dashboard/talent/contracts", icon: FileSignature },
  { label: "Earnings", href: "/dashboard/talent/earnings", icon: Wallet, comingSoon: true },
  { label: "Messages", href: "/dashboard/talent/messages", icon: MessageSquare },
  { label: "My Profile", href: "/dashboard/talent/profile", icon: User },
  { label: "Portfolio", href: "/dashboard/talent/portfolio", icon: FolderOpen, comingSoon: true },
  { label: "Reviews", href: "/dashboard/talent/reviews", icon: Star },
  { label: "Verification", href: "/dashboard/talent/verification", icon: BadgeCheck },
  { label: "Notifications", href: "/dashboard/talent/notifications", icon: Bell, comingSoon: true },
  { label: "Help & Support", href: "/dashboard/talent/help", icon: LifeBuoy, comingSoon: true },
  { label: "Settings", href: "/dashboard/talent/settings", icon: Settings },
];

export const adminNav: NavItem[] = [
  { label: "Overview", href: "/dashboard/admin", icon: LayoutDashboard },
  { label: "Users", href: "/dashboard/admin/users", icon: Users },
  { label: "Contracts", href: "/dashboard/admin/contracts", icon: FileSignature },
  { label: "Disputes & MIA", href: "/dashboard/admin/disputes", icon: AlertTriangle },
  { label: "AI Staffing", href: "/dashboard/admin/ai-staffing", icon: Sparkles },
  { label: "Waitlist", href: "/dashboard/admin/waitlist", icon: ListChecks },
  { label: "Team", href: "/dashboard/admin/team", icon: UserCog },
  { label: "Revenue", href: "/dashboard/admin/revenue", icon: FileText },
];
