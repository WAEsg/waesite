import { Bell } from "lucide-react";
import { ComingSoon } from "@/components/dashboard/empty-state";

export default function NotificationsPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <ComingSoon icon={Bell} title="Notifications" />
    </div>
  );
}
