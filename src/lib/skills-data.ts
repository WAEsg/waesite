// Backs the "Browse by skill" section on the homepage and For Talent page,
// and the long-tail SEO landing pages at /hire/[slug]. Skill-based, not
// country-based, and open-ended within each cluster — the taxonomy below
// is a browsing aid, not a hard limit on what WaeWork can source.

export interface LongTailRole {
  slug: string;
  title: string;
  clusterSlug: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  commonTasks: string[];
}

export interface SkillCluster {
  slug: string;
  label: string;
  icon: "admin" | "creative" | "tech" | "finance" | "sales" | "specialized";
  description: string;
  roles: LongTailRole[];
}

export const skillClusters: SkillCluster[] = [
  {
    slug: "admin-support",
    label: "Admin & Support",
    icon: "admin",
    description:
      "Inbox management, scheduling, and customer-facing support so you can focus on the work only you can do.",
    roles: [
      {
        slug: "virtual-assistant",
        title: "Virtual Assistant",
        clusterSlug: "admin-support",
        metaTitle: "Hire a Virtual Assistant Remotely | WaeWork",
        metaDescription:
          "Hire an identity-verified virtual assistant, with payment protection built into every engagement. Browse verified VA talent on WaeWork.",
        intro:
          "A Talent Partner in this role handles the recurring admin work that quietly eats a founder's or manager's week — so you get that time back.",
        commonTasks: [
          "Inbox and calendar management",
          "Meeting scheduling across time zones",
          "Travel and expense coordination",
          "Light research and data entry",
        ],
      },
      {
        slug: "executive-assistant",
        title: "Executive Assistant",
        clusterSlug: "admin-support",
        metaTitle: "Hire a Remote Executive Assistant | WaeWork",
        metaDescription:
          "Hire a verified remote executive assistant through WaeWork, with phased payment protection for long-term roles.",
        intro:
          "An Executive Assistant partnership works closely with founders and leadership, handling higher-trust coordination and communication.",
        commonTasks: [
          "Executive calendar and inbox triage",
          "Board and investor meeting prep",
          "Cross-team coordination",
          "Confidential document handling",
        ],
      },
      {
        slug: "customer-support-rep",
        title: "Customer Support Representative",
        clusterSlug: "admin-support",
        metaTitle: "Hire a Remote Customer Support Rep | WaeWork",
        metaDescription:
          "Hire a verified remote customer support representative for chat, email, or ticket support — with payment protection built in.",
        intro:
          "A dedicated support Talent Partner handles your customer conversations across chat, email, or helpdesk tools, on the hours your business needs.",
        commonTasks: [
          "Live chat and email support",
          "Helpdesk ticket triage (Zendesk, Intercom, etc.)",
          "Order and account issue resolution",
          "Escalation handling",
        ],
      },
      {
        slug: "technical-support-specialist",
        title: "Technical Support Specialist",
        clusterSlug: "admin-support",
        metaTitle: "Hire a Remote Technical Support Specialist | WaeWork",
        metaDescription:
          "Hire a verified remote technical support specialist through WaeWork, with identity verification and payment protection built in.",
        intro:
          "A Technical Support Specialist troubleshoots product issues directly with customers, reducing escalations to your engineering team.",
        commonTasks: [
          "First-line technical troubleshooting",
          "Bug reproduction and reporting",
          "Knowledge base article writing",
          "Escalation to engineering",
        ],
      },
      {
        slug: "data-entry-specialist",
        title: "Data Entry Specialist",
        clusterSlug: "admin-support",
        metaTitle: "Hire a Remote Data Entry Specialist | WaeWork",
        metaDescription:
          "Hire a verified remote data entry specialist through WaeWork, with payment protection built into every engagement.",
        intro:
          "A Data Entry Specialist keeps your records, spreadsheets, and systems accurate and up to date.",
        commonTasks: [
          "CRM and database upkeep",
          "Spreadsheet cleanup and formatting",
          "Document digitization",
          "Data validation and QA",
        ],
      },
      {
        slug: "scheduling-coordinator",
        title: "Scheduling Coordinator",
        clusterSlug: "admin-support",
        metaTitle: "Hire a Remote Scheduling Coordinator | WaeWork",
        metaDescription:
          "Hire a verified remote scheduling coordinator through WaeWork, with payment protection built into every engagement.",
        intro:
          "A Scheduling Coordinator keeps calendars, bookings, and logistics running smoothly across your team.",
        commonTasks: [
          "Multi-calendar coordination",
          "Client or patient booking management",
          "Reminder and follow-up workflows",
          "Meeting and event logistics",
        ],
      },
    ],
  },
  {
    slug: "creative-marketing",
    label: "Creative & Marketing",
    icon: "creative",
    description:
      "Design, video, and marketing work to keep your brand sharp and your growth engine running.",
    roles: [
      {
        slug: "graphic-designer",
        title: "Graphic Designer",
        clusterSlug: "creative-marketing",
        metaTitle: "Hire a Remote Graphic Designer | WaeWork",
        metaDescription:
          "Hire a verified remote graphic designer for social, brand, and marketing assets through WaeWork, with milestone-based payment protection.",
        intro:
          "A Graphic Designer Talent Partner produces the social, brand, and marketing assets that keep your business looking consistent and professional.",
        commonTasks: [
          "Social media graphics and templates",
          "Brand and marketing collateral",
          "Presentation and pitch deck design",
          "Basic motion graphics",
        ],
      },
      {
        slug: "video-editor",
        title: "Video Editor",
        clusterSlug: "creative-marketing",
        metaTitle: "Hire a Remote Video Editor | WaeWork",
        metaDescription:
          "Hire a verified remote video editor for short-form and long-form content through WaeWork, with milestone-based payment protection.",
        intro:
          "A Video Editor turns raw footage into polished short-form and long-form content for social, ads, or internal use.",
        commonTasks: [
          "Short-form edits for TikTok/Reels/Shorts",
          "Long-form YouTube or webinar editing",
          "Captioning and subtitles",
          "Basic motion titles and transitions",
        ],
      },
      {
        slug: "ui-ux-designer",
        title: "UI/UX Designer",
        clusterSlug: "creative-marketing",
        metaTitle: "Hire a Remote UI/UX Designer | WaeWork",
        metaDescription:
          "Hire a verified remote UI/UX designer for web and mobile products through WaeWork, with milestone-based payment protection.",
        intro:
          "A UI/UX Designer takes your product from wireframe to polished interface, ready for engineering handoff.",
        commonTasks: [
          "Wireframes and user flows",
          "High-fidelity UI design",
          "Interactive prototypes",
          "Design system components",
        ],
      },
      {
        slug: "social-media-manager",
        title: "Social Media Manager",
        clusterSlug: "creative-marketing",
        metaTitle: "Hire a Remote Social Media Manager | WaeWork",
        metaDescription:
          "Hire a verified remote social media manager through WaeWork, with phased payment protection for long-term roles.",
        intro:
          "A Social Media Manager plans, posts, and grows your presence across the platforms that matter to your audience.",
        commonTasks: [
          "Content calendar planning",
          "Scheduling and posting",
          "Community management and replies",
          "Performance reporting",
        ],
      },
      {
        slug: "content-writer",
        title: "Content Writer / Copywriter",
        clusterSlug: "creative-marketing",
        metaTitle: "Hire a Remote Content Writer | WaeWork",
        metaDescription:
          "Hire a verified remote content writer or copywriter through WaeWork, with milestone-based payment protection.",
        intro:
          "A Content Writer produces the blog posts, web copy, and marketing content that move your audience to act.",
        commonTasks: [
          "Blog and article writing",
          "Website and landing page copy",
          "Email and ad copy",
          "SEO-aware content briefs",
        ],
      },
      {
        slug: "seo-specialist",
        title: "SEO Specialist",
        clusterSlug: "creative-marketing",
        metaTitle: "Hire a Remote SEO Specialist | WaeWork",
        metaDescription:
          "Hire a verified remote SEO specialist through WaeWork, with phased payment protection for ongoing engagements.",
        intro:
          "An SEO Specialist grows your organic search visibility through technical, on-page, and content-driven work.",
        commonTasks: [
          "Keyword research and content strategy",
          "On-page and technical SEO audits",
          "Link building outreach",
          "Search performance reporting",
        ],
      },
    ],
  },
  {
    slug: "tech-development",
    label: "Tech & Development",
    icon: "tech",
    description:
      "Web, mobile, and product engineering — from a one-off build to an ongoing development retainer.",
    roles: [
      {
        slug: "web-developer",
        title: "Web Developer",
        clusterSlug: "tech-development",
        metaTitle: "Hire a Remote Web Developer | WaeWork",
        metaDescription:
          "Hire a verified remote web developer through WaeWork, with milestone-based payment protection for one-off projects and retainers.",
        intro:
          "A Web Developer builds and maintains your marketing site or web app, from a one-off project to an ongoing retainer.",
        commonTasks: [
          "Marketing site builds and refreshes",
          "Front-end feature development",
          "Bug fixes and maintenance",
          "Performance and SEO improvements",
        ],
      },
      {
        slug: "mobile-app-developer",
        title: "Mobile App Developer",
        clusterSlug: "tech-development",
        metaTitle: "Hire a Remote Mobile App Developer | WaeWork",
        metaDescription:
          "Hire a verified remote mobile app developer through WaeWork, with milestone-based payment protection for your iOS or Android project.",
        intro:
          "A Mobile App Developer builds and ships features for your iOS or Android app, working against agreed milestones.",
        commonTasks: [
          "Native or cross-platform feature builds",
          "Bug fixes and app store releases",
          "API integration",
          "Performance optimization",
        ],
      },
      {
        slug: "backend-engineer",
        title: "Backend Engineer",
        clusterSlug: "tech-development",
        metaTitle: "Hire a Remote Backend Engineer | WaeWork",
        metaDescription:
          "Hire a verified remote backend engineer through WaeWork, with milestone-based payment protection for projects and retainers.",
        intro:
          "A Backend Engineer builds the APIs, data models, and infrastructure that power your product behind the scenes.",
        commonTasks: [
          "API design and development",
          "Database schema and query work",
          "Third-party integrations",
          "Performance and scaling improvements",
        ],
      },
      {
        slug: "qa-tester",
        title: "QA Tester",
        clusterSlug: "tech-development",
        metaTitle: "Hire a Remote QA Tester | WaeWork",
        metaDescription:
          "Hire a verified remote QA tester through WaeWork, with milestone-based payment protection.",
        intro:
          "A QA Tester catches the bugs before your customers do, across web, mobile, or API surfaces.",
        commonTasks: [
          "Manual and exploratory testing",
          "Test case and bug report writing",
          "Regression testing before releases",
          "Basic automated test scripts",
        ],
      },
      {
        slug: "data-analyst",
        title: "Data Analyst",
        clusterSlug: "tech-development",
        metaTitle: "Hire a Remote Data Analyst | WaeWork",
        metaDescription:
          "Hire a verified remote data analyst through WaeWork, with phased payment protection for ongoing engagements.",
        intro:
          "A Data Analyst turns your raw data into dashboards and insights leadership can actually act on.",
        commonTasks: [
          "Dashboard and reporting builds",
          "SQL querying and data cleaning",
          "Trend and cohort analysis",
          "Ad hoc analysis for decisions",
        ],
      },
    ],
  },
  {
    slug: "finance-ops",
    label: "Finance & Ops",
    icon: "finance",
    description:
      "Bookkeeping, financial admin, and operations support to keep the business side running smoothly.",
    roles: [
      {
        slug: "bookkeeper",
        title: "Bookkeeper",
        clusterSlug: "finance-ops",
        metaTitle: "Hire a Remote Bookkeeper | WaeWork",
        metaDescription:
          "Hire a verified remote bookkeeper through WaeWork, with phased payment protection for ongoing engagements.",
        intro:
          "A Bookkeeper Talent Partner keeps your day-to-day books accurate — reconciliation, categorization, and reporting, on a schedule that fits your business.",
        commonTasks: [
          "Bank and credit card reconciliation",
          "Accounts payable/receivable tracking",
          "Monthly close support",
          "Xero, QuickBooks, or Wave upkeep",
        ],
      },
      {
        slug: "accountant",
        title: "Accountant",
        clusterSlug: "finance-ops",
        metaTitle: "Hire a Remote Accountant | WaeWork",
        metaDescription:
          "Hire a verified remote accountant through WaeWork, with identity verification and payment protection built into every engagement.",
        intro:
          "A remote Accountant handles higher-level reporting and compliance work beyond day-to-day bookkeeping.",
        commonTasks: [
          "Monthly and quarterly financial statements",
          "Budget vs. actual reporting",
          "Tax filing support",
          "Payroll oversight",
        ],
      },
      {
        slug: "operations-coordinator",
        title: "Operations Coordinator",
        clusterSlug: "finance-ops",
        metaTitle: "Hire a Remote Operations Coordinator | WaeWork",
        metaDescription:
          "Hire a verified remote operations coordinator through WaeWork, with phased payment protection for long-term roles.",
        intro:
          "An Operations Coordinator keeps day-to-day processes, vendors, and internal systems on track.",
        commonTasks: [
          "Process documentation and SOPs",
          "Vendor and supplier coordination",
          "Internal tool and workflow admin",
          "Cross-team logistics",
        ],
      },
      {
        slug: "project-manager",
        title: "Project Manager",
        clusterSlug: "finance-ops",
        metaTitle: "Hire a Remote Project Manager | WaeWork",
        metaDescription:
          "Hire a verified remote project manager through WaeWork, with phased payment protection for long-term roles.",
        intro:
          "A Project Manager keeps cross-functional work on track — timelines, dependencies, and communication.",
        commonTasks: [
          "Project planning and timelines",
          "Sprint or milestone tracking",
          "Stakeholder communication",
          "Risk and blocker management",
        ],
      },
    ],
  },
  {
    slug: "sales-growth",
    label: "Sales & Growth",
    icon: "sales",
    description:
      "Pipeline, outreach, and growth work to help you find and close your next customer.",
    roles: [
      {
        slug: "sales-development-rep",
        title: "Sales Development Rep",
        clusterSlug: "sales-growth",
        metaTitle: "Hire a Remote Sales Development Rep | WaeWork",
        metaDescription:
          "Hire a verified remote sales development rep through WaeWork, with phased payment protection for long-term roles.",
        intro:
          "A Sales Development Rep fills your pipeline — prospecting, outreach, and qualifying leads for your closers.",
        commonTasks: [
          "Outbound prospecting and outreach",
          "Lead qualification calls",
          "CRM pipeline management",
          "Meeting booking for sales reps",
        ],
      },
      {
        slug: "business-development-manager",
        title: "Business Development Manager",
        clusterSlug: "sales-growth",
        metaTitle: "Hire a Remote Business Development Manager | WaeWork",
        metaDescription:
          "Hire a verified remote business development manager through WaeWork, with phased payment protection for long-term roles.",
        intro:
          "A Business Development Manager builds partnerships and deal pipelines to grow revenue beyond your core sales motion.",
        commonTasks: [
          "Partnership and channel development",
          "Deal negotiation support",
          "Market and competitor research",
          "Pipeline and forecast reporting",
        ],
      },
      {
        slug: "growth-marketer",
        title: "Growth Marketer",
        clusterSlug: "sales-growth",
        metaTitle: "Hire a Remote Growth Marketer | WaeWork",
        metaDescription:
          "Hire a verified remote growth marketer through WaeWork, with milestone-based payment protection.",
        intro:
          "A Growth Marketer runs the experiments that find your next acquisition channel.",
        commonTasks: [
          "Paid and organic channel testing",
          "Landing page and funnel optimization",
          "A/B testing and analytics review",
          "Campaign reporting",
        ],
      },
      {
        slug: "lead-generation-specialist",
        title: "Lead Generation Specialist",
        clusterSlug: "sales-growth",
        metaTitle: "Hire a Remote Lead Generation Specialist | WaeWork",
        metaDescription:
          "Hire a verified remote lead generation specialist through WaeWork, with milestone-based payment protection.",
        intro:
          "A Lead Generation Specialist builds targeted prospect lists and outreach sequences to keep your funnel full.",
        commonTasks: [
          "Prospect list building and enrichment",
          "Cold email sequence setup",
          "LinkedIn outreach campaigns",
          "Lead scoring and handoff",
        ],
      },
    ],
  },
  {
    slug: "specialized-other",
    label: "Specialized & Other",
    icon: "specialized",
    description:
      "Roles that don't fit neatly elsewhere — if it's not listed, tell us and we'll source it.",
    roles: [
      {
        slug: "hr-recruiting-coordinator",
        title: "HR & Recruiting Coordinator",
        clusterSlug: "specialized-other",
        metaTitle: "Hire a Remote HR & Recruiting Coordinator | WaeWork",
        metaDescription:
          "Hire a verified remote HR and recruiting coordinator through WaeWork, with phased payment protection for long-term roles.",
        intro:
          "An HR & Recruiting Coordinator helps you source, screen, and onboard your own team as you grow.",
        commonTasks: [
          "Candidate sourcing and screening",
          "Interview scheduling",
          "Onboarding coordination",
          "HR documentation support",
        ],
      },
      {
        slug: "legal-assistant",
        title: "Legal Assistant",
        clusterSlug: "specialized-other",
        metaTitle: "Hire a Remote Legal Assistant | WaeWork",
        metaDescription:
          "Hire a verified remote legal assistant through WaeWork, with phased payment protection for long-term roles.",
        intro:
          "A Legal Assistant supports contract admin and document prep — not a substitute for licensed legal advice.",
        commonTasks: [
          "Contract drafting support and redlines",
          "Document organization and filing",
          "Basic legal research",
          "Compliance checklist tracking",
        ],
      },
      {
        slug: "translator-localization-specialist",
        title: "Translator / Localization Specialist",
        clusterSlug: "specialized-other",
        metaTitle: "Hire a Remote Translator or Localization Specialist | WaeWork",
        metaDescription:
          "Hire a verified remote translator or localization specialist through WaeWork, with milestone-based payment protection.",
        intro:
          "A Translator or Localization Specialist adapts your content and product for a new language or market.",
        commonTasks: [
          "Document and content translation",
          "Product and app localization",
          "Transcreation for marketing copy",
          "Quality review of localized content",
        ],
      },
      {
        slug: "research-analyst",
        title: "Research Analyst",
        clusterSlug: "specialized-other",
        metaTitle: "Hire a Remote Research Analyst | WaeWork",
        metaDescription:
          "Hire a verified remote research analyst through WaeWork, with milestone-based payment protection.",
        intro:
          "A Research Analyst digs into markets, competitors, or topics and turns findings into a clear brief.",
        commonTasks: [
          "Market and competitor research",
          "Survey design and analysis",
          "Report and brief writing",
          "Source verification and citation",
        ],
      },
    ],
  },
];

export const allLongTailRoles: LongTailRole[] = skillClusters.flatMap(
  (c) => c.roles
);

export function getRoleBySlug(slug: string): LongTailRole | undefined {
  return allLongTailRoles.find((r) => r.slug === slug);
}

export function getClusterBySlug(slug: string): SkillCluster | undefined {
  return skillClusters.find((c) => c.slug === slug);
}
