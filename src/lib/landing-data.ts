export const navLinks = [
  { label: "How it works", href: "/how-it-works" },
  { label: "For hirers", href: "/for-hirers" },
  { label: "For talent", href: "/for-talent" },
  { label: "AI Staffing", href: "/#ai-staffing", badge: "Early Access" },
  { label: "Pricing", href: "/pricing" },
  { label: "FAQ", href: "/faq" },
];

export const footerLinks = [
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
  { label: "About", href: "/about" },
];

export const footerHireAtScale = {
  heading: "Hiring at scale?",
  blurb: "Building a whole team, not one role? We'll set it up with you.",
  label: "Get in touch",
  href: "/contact?topic=scale",
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
  email: "hello@waework.com",
  location: "Headquartered in Singapore",
};

// "Meet Your AI Workforce" — a complementary, early-access offering
// alongside human Talent Partners. Deliberately routed to a lightweight
// interest form rather than the full hiring flow used for human roles.
export const aiWorkforceHeading = "Meet your AI workforce";

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
