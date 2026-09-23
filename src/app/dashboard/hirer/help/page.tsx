import { LifeBuoy } from "lucide-react";
import { ComingSoon } from "@/components/dashboard/empty-state";

export default function HelpPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <ComingSoon icon={LifeBuoy} title="Help & Support" />
    </div>
  );
}
