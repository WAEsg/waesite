// Hand-written to match supabase/migrations/0001..0006.
// Regenerate with `supabase gen types typescript` once convenient, and keep
// this file as the fallback/reference for local development.

export type UserRole = "hirer" | "talent" | "admin";

export type GigBudgetType = "fixed" | "hourly";
export type GigStatus = "draft" | "open" | "in_progress" | "completed" | "cancelled";
export type GigEngagementType = "ongoing" | "gig";

export type ApplicationStatus = "pending" | "shortlisted" | "accepted" | "rejected" | "withdrawn";

export type ContractType = "one_off" | "retainer";
export type ContractRateType = "fixed" | "hourly" | "monthly";
export type ContractStatus = "active" | "paused" | "completed" | "cancelled" | "terminated";

export type MilestoneStatus =
  | "pending"
  | "submitted"
  | "approved"
  | "rejected"
  | "paid"
  | "disputed";

export type VerificationStatus = "unverified" | "pending" | "passed" | "failed";
export type VerificationProvider = "stripe_identity" | "myinfo";

export type DisputeStatus = "open" | "resolved";

export type PaymentEventType = "escrow_hold" | "release" | "refund" | "credit_issued";

export type TerminationCause =
  | "talent_mia"
  | "talent_quit"
  | "client_no_cause"
  | "performance"
  | "mutual"
  | "other";
export type TerminationSettlementType = "cash_refund" | "credit";
export type TerminationStatus = "pending_settlement" | "settled";

export interface Database {
  public: {
    Tables: {
      users: {
        Relationships: [];
        Row: {
          id: string;
          email: string;
          role: UserRole | null;
          full_name: string | null;
          business_name: string | null;
          country: string | null;
          verification_status: VerificationStatus;
          stripe_account_id: string | null;
          stripe_customer_id: string | null;
          onboarding_dismissed_at: string | null;
          no_show_count: number;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          role?: UserRole | null;
          full_name?: string | null;
          business_name?: string | null;
          country?: string | null;
          verification_status?: VerificationStatus;
          stripe_account_id?: string | null;
          stripe_customer_id?: string | null;
          onboarding_dismissed_at?: string | null;
          no_show_count?: number;
          avatar_url?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["users"]["Insert"]>;
      };
      hirer_profiles: {
        Relationships: [];
        Row: {
          user_id: string;
          company_name: string | null;
          uen: string | null;
          company_size: string | null;
          industry: string | null;
          logo_url: string | null;
          description: string | null;
          website: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          company_name?: string | null;
          uen?: string | null;
          company_size?: string | null;
          industry?: string | null;
          logo_url?: string | null;
          description?: string | null;
          website?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["hirer_profiles"]["Insert"]>;
      };
      talent_profiles: {
        Relationships: [];
        Row: {
          user_id: string;
          headline: string | null;
          bio: string | null;
          skills: string[];
          rate_amount: number | null;
          rate_unit: "hourly" | "monthly" | null;
          years_experience: number | null;
          availability: string | null;
          resume_url: string | null;
          portfolio_links: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          headline?: string | null;
          bio?: string | null;
          skills?: string[];
          rate_amount?: number | null;
          rate_unit?: "hourly" | "monthly" | null;
          years_experience?: number | null;
          availability?: string | null;
          resume_url?: string | null;
          portfolio_links?: string[];
        };
        Update: Partial<Database["public"]["Tables"]["talent_profiles"]["Insert"]>;
      };
      verification_records: {
        Relationships: [];
        Row: {
          id: string;
          user_id: string;
          provider: VerificationProvider;
          provider_reference_id: string | null;
          status: VerificationStatus;
          raw_payload: Record<string, unknown> | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          provider: VerificationProvider;
          provider_reference_id?: string | null;
          status?: VerificationStatus;
          raw_payload?: Record<string, unknown> | null;
        };
        Update: Partial<Database["public"]["Tables"]["verification_records"]["Insert"]>;
      };
      gigs: {
        Relationships: [];
        Row: {
          id: string;
          hirer_id: string;
          title: string;
          description: string;
          category: string | null;
          budget_type: GigBudgetType;
          budget_amount: number;
          status: GigStatus;
          engagement_type: GigEngagementType;
          urgent: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          hirer_id: string;
          title: string;
          description: string;
          category?: string | null;
          budget_type: GigBudgetType;
          budget_amount: number;
          status?: GigStatus;
          engagement_type?: GigEngagementType;
          urgent?: boolean;
        };
        Update: Partial<Database["public"]["Tables"]["gigs"]["Insert"]>;
      };
      applications: {
        Relationships: [];
        Row: {
          id: string;
          gig_id: string;
          talent_id: string;
          cover_letter: string | null;
          proposed_rate: number | null;
          status: ApplicationStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          gig_id: string;
          talent_id: string;
          cover_letter?: string | null;
          proposed_rate?: number | null;
          status?: ApplicationStatus;
        };
        Update: Partial<Database["public"]["Tables"]["applications"]["Insert"]>;
      };
      interviews: {
        Relationships: [];
        Row: {
          id: string;
          application_id: string;
          hirer_id: string;
          talent_id: string;
          gig_id: string;
          status: "awaiting_talent" | "awaiting_hirer" | "confirmed" | "completed" | "cancelled";
          proposed_by: "hirer" | "talent";
          proposed_slots: string[];
          confirmed_slot: string | null;
          video_room_url: string | null;
          hirer_joined_at: string | null;
          talent_joined_at: string | null;
          completed_at: string | null;
          hirer_decision: "confirm" | "decline" | null;
          decision_reason: "fit" | "availability" | "communication" | "changed_requirements" | "other" | null;
          decision_notes: string | null;
          decided_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          application_id: string;
          hirer_id: string;
          talent_id: string;
          gig_id: string;
          status?: "awaiting_talent" | "awaiting_hirer" | "confirmed" | "completed" | "cancelled";
          proposed_by?: "hirer" | "talent";
          proposed_slots?: string[];
          confirmed_slot?: string | null;
          video_room_url?: string | null;
          hirer_joined_at?: string | null;
          talent_joined_at?: string | null;
          completed_at?: string | null;
          hirer_decision?: "confirm" | "decline" | null;
          decision_reason?: "fit" | "availability" | "communication" | "changed_requirements" | "other" | null;
          decision_notes?: string | null;
          decided_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["interviews"]["Insert"]>;
      };
      non_circumvention_acknowledgments: {
        Relationships: [];
        Row: {
          id: string;
          hirer_id: string;
          talent_id: string;
          gig_id: string;
          acknowledged_at: string;
        };
        Insert: {
          id?: string;
          hirer_id: string;
          talent_id: string;
          gig_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["non_circumvention_acknowledgments"]["Insert"]>;
      };
      waitlist_signups: {
        Relationships: [];
        Row: {
          id: string;
          full_name: string;
          email: string;
          skill_category: string | null;
          portfolio_link: string | null;
          availability: string | null;
          expected_rate: string | null;
          intro_text: string | null;
          status: "waitlisted" | "invited" | "signed_up" | "verified";
          invite_token: string | null;
          invite_sent_at: string | null;
          converted_at: string | null;
          converted_user_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          full_name: string;
          email: string;
          skill_category?: string | null;
          portfolio_link?: string | null;
          availability?: string | null;
          expected_rate?: string | null;
          intro_text?: string | null;
          status?: "waitlisted" | "invited" | "signed_up" | "verified";
          invite_token?: string | null;
          invite_sent_at?: string | null;
          converted_at?: string | null;
          converted_user_id?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["waitlist_signups"]["Insert"]>;
      };
      contracts: {
        Relationships: [];
        Row: {
          id: string;
          gig_id: string | null;
          hirer_id: string;
          talent_id: string;
          type: ContractType;
          rate_amount: number;
          rate_type: ContractRateType;
          status: ContractStatus;
          stripe_subscription_id: string | null;
          placement_fee_amount: number | null;
          monthly_pay: number | null;
          current_period_start: string | null;
          original_placement_date: string | null;
          start_date: string;
          end_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          gig_id?: string | null;
          hirer_id: string;
          talent_id: string;
          type: ContractType;
          rate_amount: number;
          rate_type: ContractRateType;
          status?: ContractStatus;
          stripe_subscription_id?: string | null;
          placement_fee_amount?: number | null;
          monthly_pay?: number | null;
          current_period_start?: string | null;
          original_placement_date?: string | null;
          start_date?: string;
          end_date?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["contracts"]["Insert"]>;
      };
      milestones: {
        Relationships: [];
        Row: {
          id: string;
          contract_id: string;
          title: string;
          description: string | null;
          amount: number;
          status: MilestoneStatus;
          sequence_order: number | null;
          submission_link: string | null;
          due_date: string | null;
          submitted_at: string | null;
          approved_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          contract_id: string;
          title: string;
          description?: string | null;
          amount: number;
          status?: MilestoneStatus;
          sequence_order?: number | null;
          submission_link?: string | null;
          due_date?: string | null;
          submitted_at?: string | null;
          approved_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["milestones"]["Insert"]>;
      };
      checkins: {
        Relationships: [];
        Row: {
          id: string;
          contract_id: string;
          day: number;
          submitted_by: string;
          talent_note: string;
          client_acknowledged: boolean;
          acknowledged_by: string | null;
          acknowledged_at: string | null;
          submitted_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          contract_id: string;
          day?: number;
          submitted_by: string;
          talent_note: string;
          client_acknowledged?: boolean;
          acknowledged_by?: string | null;
          acknowledged_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["checkins"]["Insert"]>;
      };
      disputes: {
        Relationships: [];
        Row: {
          id: string;
          contract_id: string;
          milestone_id: string | null;
          raised_by: string;
          reason: string;
          status: DisputeStatus;
          created_at: string;
          resolved_at: string | null;
        };
        Insert: {
          id?: string;
          contract_id: string;
          milestone_id?: string | null;
          raised_by: string;
          reason: string;
          status?: DisputeStatus;
          resolved_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["disputes"]["Insert"]>;
      };
      terminations: {
        Relationships: [];
        Row: {
          id: string;
          contract_id: string;
          initiated_by_user_id: string;
          cause: TerminationCause;
          settlement_type: TerminationSettlementType | null;
          released_amount: number | null;
          unearned_amount: number | null;
          placement_fee_refund_amount: number | null;
          bench_activation_requested_at: string | null;
          status: TerminationStatus;
          created_at: string;
          settled_at: string | null;
        };
        Insert: {
          id?: string;
          contract_id: string;
          initiated_by_user_id: string;
          cause: TerminationCause;
          settlement_type?: TerminationSettlementType | null;
          released_amount?: number | null;
          unearned_amount?: number | null;
          placement_fee_refund_amount?: number | null;
          bench_activation_requested_at?: string | null;
          status?: TerminationStatus;
          settled_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["terminations"]["Insert"]>;
      };
      payment_events: {
        Relationships: [];
        Row: {
          id: string;
          contract_id: string;
          milestone_id: string | null;
          termination_id: string | null;
          event_type: PaymentEventType;
          amount: number;
          fee_amount: number | null;
          pass_through_amount: number | null;
          currency: string;
          stripe_reference_id: string | null;
          is_simulated: boolean;
          metadata: Record<string, unknown> | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          contract_id: string;
          milestone_id?: string | null;
          termination_id?: string | null;
          event_type: PaymentEventType;
          amount: number;
          fee_amount?: number | null;
          pass_through_amount?: number | null;
          currency?: string;
          stripe_reference_id?: string | null;
          is_simulated?: boolean;
          metadata?: Record<string, unknown> | null;
        };
        Update: Partial<Database["public"]["Tables"]["payment_events"]["Insert"]>;
      };
      auth_rate_limits: {
        Relationships: [];
        Row: {
          key: string;
          count: number;
          window_start: string;
        };
        Insert: {
          key: string;
          count?: number;
          window_start?: string;
        };
        Update: Partial<Database["public"]["Tables"]["auth_rate_limits"]["Insert"]>;
      };
      terms_acceptances: {
        Relationships: [];
        Row: {
          id: string;
          user_id: string;
          document_type: "tos" | "privacy";
          version: string;
          accepted_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          document_type: "tos" | "privacy";
          version: string;
          accepted_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["terms_acceptances"]["Insert"]>;
      };
      admin_audit_log: {
        Relationships: [];
        Row: {
          id: string;
          admin_id: string;
          action: string;
          target_type: string;
          target_id: string;
          reason: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          admin_id: string;
          action: string;
          target_type: string;
          target_id: string;
          reason?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["admin_audit_log"]["Insert"]>;
      };
      ai_staffing_subscriptions: {
        Relationships: [];
        Row: {
          id: string;
          hirer_id: string;
          tier: "starter" | "growth" | "custom";
          status: "pending" | "active" | "cancelled" | "past_due";
          stripe_subscription_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          hirer_id: string;
          tier: "starter" | "growth" | "custom";
          status?: "pending" | "active" | "cancelled" | "past_due";
          stripe_subscription_id?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["ai_staffing_subscriptions"]["Insert"]>;
      };
      conversations: {
        Relationships: [];
        Row: {
          id: string;
          application_id: string;
          gig_id: string;
          hirer_id: string;
          talent_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          application_id: string;
          gig_id: string;
          hirer_id: string;
          talent_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["conversations"]["Insert"]>;
      };
      messages: {
        Relationships: [];
        Row: {
          id: string;
          conversation_id: string;
          sender_id: string;
          body: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          conversation_id: string;
          sender_id: string;
          body: string;
        };
        Update: Partial<Database["public"]["Tables"]["messages"]["Insert"]>;
      };
      reviews: {
        Relationships: [];
        Row: {
          id: string;
          contract_id: string;
          rater_id: string;
          ratee_id: string;
          score: number;
          comment: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          contract_id: string;
          rater_id: string;
          ratee_id: string;
          score: number;
          comment?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["reviews"]["Insert"]>;
      };
      account_deletion_requests: {
        Relationships: [];
        Row: {
          id: string;
          user_id: string;
          status: "requested" | "completed" | "cancelled";
          requested_at: string;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          status?: "requested" | "completed" | "cancelled";
          completed_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["account_deletion_requests"]["Insert"]>;
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: { Args: Record<string, never>; Returns: boolean };
      check_rate_limit: {
        Args: { p_key: string; p_max_attempts: number; p_window_seconds: number };
        Returns: boolean;
      };
    };
    Enums: {
      user_role: UserRole;
      gig_budget_type: GigBudgetType;
      gig_status: GigStatus;
      gig_engagement_type: GigEngagementType;
      application_status: ApplicationStatus;
      contract_type: ContractType;
      contract_rate_type: ContractRateType;
      contract_status: ContractStatus;
      milestone_status: MilestoneStatus;
      verification_status_type: VerificationStatus;
      verification_provider: VerificationProvider;
    };
    CompositeTypes: Record<string, never>;
  };
}
