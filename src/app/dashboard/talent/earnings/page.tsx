import { Wallet } from "lucide-react";
import { ComingSoon } from "@/components/dashboard/empty-state";

export default function EarningsPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <ComingSoon icon={Wallet} title="Earnings" />
    </div>
  );
}
