export const navLinks = [
  { label: "How It Works", href: "/how-it-works" },
  { label: "For Hirers", href: "/for-hirers" },
  { label: "For Talent", href: "/for-talent" },
  { label: "AI Staffing", href: "/#ai-staffing", badge: "Early Access" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
];

export const footerLinks = [
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

export const footerHireAtScale = {
  label: "Looking to hire at scale? Get in touch",
  href: "/contact",
};

// The five value props behind every headline on the site — speed, elastic
// scaling, low-risk entry, access, and protection. Rewritten per-section
// rather than reused verbatim.
export const valueProps = [
  {
    title: "Hire in days, not months",
    description:
      "Skip the weeks-long hiring slog. Get matched with a vetted Talent Partner fast enough to actually solve the problem you have right now.",
  },
  {
    title: "Scale the way your business actually grows",
    description:
      "Add a Talent Partner for a busy quarter, extend the partnership when it's working, or scale back down — no long, awkward offboarding.",
  },
  {
    title: "Skilled talent, ready this week",
    description:
      "Every Talent Partner is vetted before they ever reach your shortlist, so you're choosing between people who can already do the job.",
  },
  {
    title: "Every hire verified. Every payment protected.",
    description:
      "Identity verification on both sides, and payment held and released on a schedule that matches how the work actually happens.",
  },
];

export const audienceLine =
  "Built for growing teams — from solo founders to established companies.";

export const howItWorksSteps = [
  {
    number: 1,
    title: "Tell us what you need",
    description:
      "Post a project or an ongoing role in minutes — describe the work, budget, and timeline.",
  },
  {
    number: 2,
    title: "We vet and match talent",
    description:
      "Every profile is identity-verified with Stripe Identity, and we surface the best-fit Talent Partners from a global pool.",
  },
  {
    number: 3,
    title: "Start small, scale once it's working",
    description:
      "Begin with a single project — funds are held via Stripe Connect and released on a schedule that matches the work. Once it's working, extend it into an ongoing Team Extension.",
  },
];

export const trustPillars = [
  {
    title: "Identity verification, both sides",
    description:
      "Every hirer and every Talent Partner is verified through Stripe Identity before they can post a role or apply to one — so you always know who you're working with.",
  },
  {
    title: "Payment protection that matches the work",
    description:
      "For an ongoing Team Extension, funds are held and released every 15 days — partial at day 15, the rest at day 30 — so neither side is exposed to a full month of risk. For project-based work, release is tied to agreed milestones instead.",
  },
  {
    title: "A backup bench, just in case",
    description:
      "For every placement, we keep a shortlisted backup candidate on file for the first 90 days — so if something falls through early on, you're not starting the search from zero.",
  },
  {
    title: "Replacement guarantee & a clear MIA protocol",
    description:
      "If a Talent Partner goes unresponsive, a defined response window kicks in automatically — no ambiguity about what happens next. If it doesn't work out early on, we'll help place a replacement.",
  },
  {
    title: "Neutral dispute resolution",
    description:
      "If a hirer and Talent Partner disagree on delivered work, our support team mediates fairly for both sides — this is a service everyone on WaeWork is covered by, not a deduction against either party.",
  },
];

// Applies to an ongoing Team Extension only — project-based work uses
// pricingGigFee below instead, with no separate placement fee.
export const pricingPlacementFee = {
  title: "Placement fee",
  amount: "One month's pay",
  description:
    "Charged to the client only, upon successful match. Talent pays nothing.",
};

export const pricingTiers = [
  { period: "Months 2–6", clientShare: "8%", talentShare: "4%", combined: "12%" },
  { period: "Months 7–12", clientShare: "5.5%", talentShare: "2.5%", combined: "8%" },
  { period: "Month 13+", clientShare: "4%", talentShare: "2%", combined: "6%" },
];

export const pricingFeeFloor =
  "The above percentage, or S$45/month combined, whichever is greater.";

export const pricingBuyout =
  "Buy-out option available after month 12 for a fully direct relationship with your Talent Partner — no ongoing platform fee.";

export const pricingTalentPromise =
  "Talent never pays to join or apply — only a small service fee once work is underway, which funds verification, backup coverage, and dispute support.";

// Project-based work has no placement fee — the platform fee is a flat
// cut of the project, taken from milestone releases as they happen.
export const pricingGigFee = {
  title: "Project & gig fee",
  rate: "15%",
  clientShare: "10%",
  talentShare: "5%",
  description:
    "Of total project value, split between client and talent and taken from milestone releases. No separate placement fee for project-based work.",
};

export const pricingSubscriptionTiers = [
  {
    name: "Starter",
    price: "S$79/month",
    description: "Limited postings, standard matching.",
  },
  {
    name: "Growth",
    price: "S$149/month",
    description: "Unlimited postings, priority matching, dedicated support.",
  },
];

export const pricingUrgentAddon = {
  title: "Urgent priority",
  price: "S$50–100",
  description: "Flat rush fee for expedited (24–48hr) matching.",
  disclaimer:
    "*Urgent priority is subject to available talent. If we're unable to find a suitable match, we'll let you know.",
};

export const faqItems = [
  {
    question: "How does WaeWork verify hirers and talent?",
    answer:
      "Every hirer and every Talent Partner completes identity verification through Stripe Identity before they can post a role or apply to one, so both sides know who they're working with.",
  },
  {
    question: "How does payment protection work?",
    answer:
      "Funds are held via Stripe Connect rather than paid out upfront. For an ongoing Team Extension, payment releases every 15 days. For project-based work, it releases on milestones agreed between hirer and talent.",
  },
  {
    question: "What happens if a Talent Partner becomes unresponsive?",
    answer:
      "A defined MIA (missing-in-action) response window kicks in automatically. If it isn't resolved, WaeWork's replacement guarantee and 90-day backup bench help you get a replacement in place quickly.",
  },
  {
    question: "How much does WaeWork cost?",
    answer:
      "For an ongoing Team Extension: a one-time placement fee equal to one month's pay (client only), then a platform fee that tapers from 12% combined in months 2–6 down to 6% combined from month 13 onward, split between client and talent. For project-based work, it's a flat 15% of project value instead, split 10% client / 5% talent, with no placement fee. See the Pricing page for the full breakdown, including subscription plans and the urgent priority add-on.",
  },
  {
    question: "Is WaeWork limited to specific countries?",
    answer:
      "No. WaeWork is a global marketplace — hirers and talent can both be located anywhere in the world.",
  },
  {
    question: "What happens if there's a dispute?",
    answer:
      "WaeWork's support team mediates disputes neutrally for both the hirer and Talent Partner — this is a service both sides are covered by, not a one-sided deduction process.",
  },
  {
    question: "Can I browse individual talent profiles before signing up?",
    answer:
      "Not directly — WaeWork organizes talent by skill category rather than a public, searchable directory, to protect the people in our vetted pool from being scraped or poached. You'll see full profiles once you're matched to a role.",
  },
  {
    question: "Is WaeWork only for small businesses?",
    answer:
      "WaeWork is built primarily for SMEs, startups, and independent founders who need to move fast without a big HR department — but larger companies are welcome too. If you're looking to hire at scale, get in touch and we'll work out what that looks like.",
  },
];

export const footerContact = {
  email: "hello@waework.co",
  location: "Headquartered in Singapore",
};

// "Meet Your AI Workforce" — a complementary, early-access offering
// alongside human Talent Partners. Deliberately routed to a lightweight
// interest form rather than the full hiring flow used for human roles.
export const aiWorkforceHeading = "Meet Your AI Workforce";

export const aiWorkforceIntro =
  "Some work doesn't need a human — it just needs to get done, instantly, every time. WaeWork now offers AI-powered staff alongside your human team, ready to work around the clock at a fraction of the cost.";

export const aiWorkforceWaitlistNote =
  "We're onboarding early access clients now — join the waitlist and we'll be in touch as capacity opens up.";

export interface AiWorkforceRole {
  slug: string;
  icon: "support" | "schedule" | "sales" | "content" | "data";
  title: string;
  description: string;
}

export const aiWorkforceRoles: AiWorkforceRole[] = [
  {
    slug: "ai-customer-support-agent",
    icon: "support",
    title: "AI Customer Support Agent",
    description:
      "Handles tier-1 inquiries, FAQs, and order status around the clock.",
  },
  {
    slug: "ai-executive-assistant",
    icon: "schedule",
    title: "AI Executive Assistant",
    description: "Manages scheduling, inbox triage, and follow-ups.",
  },
  {
    slug: "ai-sales-lead-qualifier",
    icon: "sales",
    title: "AI Sales & Lead Qualifier",
    description: "Engages inbound leads instantly and books qualified calls.",
  },
  {
    slug: "ai-content-social-assistant",
    icon: "content",
    title: "AI Content & Social Assistant",
    description: "Drafts posts, captions, and replies in your brand voice.",
  },
  {
    slug: "ai-data-admin-assistant",
    icon: "data",
    title: "AI Data & Admin Assistant",
    description: "Handles data entry, reporting, and repetitive admin tasks.",
  },
];

export const aiWorkforceFallback = {
  heading: "Don't see what you need?",
  body: "Every business runs differently. Tell us what's eating up your time, and we'll help design the right AI teammate for it.",
  button: "Tell Us Your Needs",
};

// AI Staffing plans. Starter carries a limited-time Founding Member rate —
// this is the single source of truth for that copy, reused on the AI
// Workforce section, the dedicated Pricing page, and the waitlist
// confirmation message, so it can't drift out of sync between them.
export const aiStaffingFoundingMember = {
  badge: "Founding Member",
  label: "Founding Member pricing — limited to our first 50 hirers",
  subnote: "Rate rises to S$125/month once Founding Member spots are filled.",
};

export interface AiStaffingTier {
  name: string;
  price: string;
  description: string;
  founding?: boolean;
}

export const aiStaffingTiers: AiStaffingTier[] = [
  {
    name: "Starter",
    price: "S$99/month",
    description: "For businesses trying their first AI teammate.",
    founding: true,
  },
  {
    name: "Growth",
    price: "S$199/month",
    description: "For teams running multiple AI teammates day to day.",
  },
  {
    name: "Custom",
    price: "from S$349/month",
    description: "For larger teams — tell us what you need.",
  },
];
