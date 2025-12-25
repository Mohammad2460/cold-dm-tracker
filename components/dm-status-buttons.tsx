"use client";

import { Button } from "@/components/ui/button";
import { updateDMStatus } from "@/app/actions/dms";
import { useRouter } from "next/navigation";

export function DMStatusButtons({ dmId }: { dmId: string }) {
  const router = useRouter();

  const handleStatusUpdate = async (status: string, days?: number) => {
    await updateDMStatus(dmId, status, days);
    router.refresh();
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleStatusUpdate("In Conversation")}
        className="text-xs sm:text-sm"
      >
        <span className="hidden sm:inline">In Conversation</span>
        <span className="sm:hidden">In Convo</span>
      </Button>
      <Button variant="outline" size="sm" onClick={() => handleStatusUpdate("Won")}>
        Won
      </Button>
      <Button variant="outline" size="sm" onClick={() => handleStatusUpdate("Lost")}>
        Lost
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleStatusUpdate("Waiting", 3)}
        className="text-xs sm:text-sm"
      >
        <span className="hidden sm:inline">Remind in 3 days</span>
        <span className="sm:hidden">+3 days</span>
      </Button>
    </>
  );
}

