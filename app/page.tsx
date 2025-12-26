export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getOrCreateUser } from "@/lib/auth";

export default async function Home() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/sign-in");
  }

  const user = await getOrCreateUser();
  
  // New users go to settings for timezone confirmation first
  if (!user.onboarded) {
    redirect("/settings");
  }
  
  // Existing onboarded users go to dashboard
  redirect("/dashboard");
}
