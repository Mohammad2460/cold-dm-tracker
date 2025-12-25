"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { confirmTimezone } from "@/app/actions/user";
import { useRouter } from "next/navigation";

type User = {
  id: string;
  email: string;
  timezone: string;
};

type TimezoneConfirmationProps = {
  user: User;
};

// Common timezones
const timezones = [
  { value: "America/New_York", label: "Eastern Time (ET)" },
  { value: "America/Chicago", label: "Central Time (CT)" },
  { value: "America/Denver", label: "Mountain Time (MT)" },
  { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
  { value: "America/Phoenix", label: "Arizona (MST)" },
  { value: "America/Anchorage", label: "Alaska Time (AKT)" },
  { value: "Pacific/Honolulu", label: "Hawaii Time (HST)" },
  { value: "Europe/London", label: "London (GMT)" },
  { value: "Europe/Paris", label: "Paris (CET)" },
  { value: "Asia/Tokyo", label: "Tokyo (JST)" },
  { value: "Asia/Shanghai", label: "Shanghai (CST)" },
  { value: "Australia/Sydney", label: "Sydney (AEST)" },
];

function getTimezoneName(timezone: string): string {
  const tz = timezones.find((t) => t.value === timezone);
  return tz ? tz.label : timezone;
}

export function TimezoneConfirmation({ user }: TimezoneConfirmationProps) {
  const router = useRouter();
  const [showTimezoneSelect, setShowTimezoneSelect] = useState(false);
  const [selectedTimezone, setSelectedTimezone] = useState(user.timezone);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = async () => {
    setIsSubmitting(true);
    await confirmTimezone(user.timezone);
    // After confirming timezone, redirect to onboarding
    router.push("/onboarding");
  };

  const handleChangeTimezone = async () => {
    if (showTimezoneSelect) {
      setIsSubmitting(true);
      await confirmTimezone(selectedTimezone);
      // After confirming timezone, redirect to onboarding
      router.push("/onboarding");
    } else {
      setShowTimezoneSelect(true);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Confirm Your Timezone</CardTitle>
          <CardDescription>
            We detected you&apos;re in {getTimezoneName(user.timezone)}. Is this correct?
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!showTimezoneSelect ? (
            <div className="flex gap-4">
              <Button onClick={handleConfirm} disabled={isSubmitting} className="flex-1">
                Yes
              </Button>
              <Button
                variant="outline"
                onClick={handleChangeTimezone}
                disabled={isSubmitting}
                className="flex-1"
              >
                Change timezone
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="timezone">Select your timezone</Label>
                <Select value={selectedTimezone} onValueChange={setSelectedTimezone}>
                  <SelectTrigger id="timezone">
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    {timezones.map((tz) => (
                      <SelectItem key={tz.value} value={tz.value}>
                        {tz.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={handleChangeTimezone}
                disabled={isSubmitting}
                className="w-full"
              >
                {isSubmitting ? "Saving..." : "Confirm"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

