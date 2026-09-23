import { Sparkles } from "lucide-react";
import { ComingSoon } from "@/components/dashboard/empty-state";

export default function AiStaffingPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <ComingSoon icon={Sparkles} title="AI Staffing subscription management" />
    </div>
  );
}
