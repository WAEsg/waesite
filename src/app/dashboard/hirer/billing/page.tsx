import { CreditCard } from "lucide-react";
import { ComingSoon } from "@/components/dashboard/empty-state";

export default function BillingPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <ComingSoon icon={CreditCard} title="Billing" />
    </div>
  );
}
