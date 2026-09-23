import { FolderOpen } from "lucide-react";
import { ComingSoon } from "@/components/dashboard/empty-state";

export default function PortfolioPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <ComingSoon icon={FolderOpen} title="Portfolio" />
    </div>
  );
}
