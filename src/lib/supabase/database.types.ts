// Hand-written to match supabase/migrations/0001_init_schema.sql.
// Regenerate with `supabase gen types typescript` once the project is linked,
// and keep this file as the fallback/reference for local development.

export type UserRole = "hirer" | "talent" | "admin";

export type GigBudgetType = "fixed" | "hourly";
export type GigStatus = "draft" | "open" | "in_progress" | "completed" | "cancelled";

export type ApplicationStatus = "pending" | "accepted" | "rejected" | "withdrawn";

export type ContractType = "one_off" | "retainer";
export type ContractRateType = "fixed" | "hourly" | "monthly";
export type ContractStatus = "active" | "paused" | "completed" | "cancelled";

export type MilestoneStatus = "pending" | "submitted" | "approved" | "rejected" | "paid";

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
          verified: boolean;
          stripe_account_id: string | null;
          stripe_customer_id: string | null;
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
          verified?: boolean;
          stripe_account_id?: string | null;
          stripe_customer_id?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["users"]["Insert"]>;
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
          due_date?: string | null;
          submitted_at?: string | null;
          approved_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["milestones"]["Insert"]>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      user_role: UserRole;
      gig_budget_type: GigBudgetType;
      gig_status: GigStatus;
      application_status: ApplicationStatus;
      contract_type: ContractType;
      contract_rate_type: ContractRateType;
      contract_status: ContractStatus;
      milestone_status: MilestoneStatus;
    };
    CompositeTypes: Record<string, never>;
  };
}
