import { getOrCreateUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DashboardContent } from "@/components/dashboard-content";

/**
 * Dashboard Page (Server Component)
 *
 * Handles authentication and redirects, then renders the client component
 * that fetches data using TanStack Query.
 *
 * This approach keeps auth on the server while enabling client-side caching.
 */
export default async function DashboardPage() {
  // Authenticate user on the server
  const user = await getOrCreateUser();

  // Check if user needs onboarding (which happens after timezone confirmation)
  if (!user.onboarded) {
    redirect("/onboarding");
  }

  // Render client component that fetches data with TanStack Query
  return <DashboardContent />;
}
