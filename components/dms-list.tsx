"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { updateDMStatus } from "@/app/actions/dms";
import Link from "next/link";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

type DM = {
  id: string;
  name: string;
  platform: string;
  sent_date: Date;
  followup_date: Date;
  status: string;
  note: string | null;
};

type DMsListProps = {
  initialDMs: DM[];
};

export function DMsList({ initialDMs }: DMsListProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Debounced search and filter
  const filteredDMs = useMemo(() => {
    let filtered = [...initialDMs];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (dm) =>
          dm.name.toLowerCase().includes(query) ||
          dm.platform.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((dm) => dm.status === statusFilter);
    }

    return filtered;
  }, [initialDMs, searchQuery, statusFilter]);

  const handleStatusUpdate = async (dmId: string, status: string, days?: number) => {
    await updateDMStatus(dmId, status, days);
    router.refresh();
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Waiting":
        return "default";
      case "In Conversation":
        return "secondary";
      case "Won":
        return "default";
      case "Lost":
        return "destructive";
      default:
        return "default";
    }
  };

  if (initialDMs.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <p className="text-muted-foreground mb-2 text-lg">No DMs yet</p>
          <p className="text-muted-foreground mb-6">
            Start tracking your cold DMs to never miss a follow-up
          </p>
          <Button asChild>
            <Link href="/dms/add">Add Your First DM</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="Search by name or platform..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Waiting">Waiting</SelectItem>
            <SelectItem value="In Conversation">In Conversation</SelectItem>
            <SelectItem value="Won">Won</SelectItem>
            <SelectItem value="Lost">Lost</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredDMs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-2">No DMs found</p>
          <p className="text-sm text-muted-foreground">
            Try adjusting your search or filter criteria
          </p>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Platform</TableHead>
                  <TableHead>Sent Date</TableHead>
                  <TableHead>Follow-up Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDMs.map((dm) => (
                  <TableRow key={dm.id}>
                    <TableCell className="font-medium">{dm.name}</TableCell>
                    <TableCell>{dm.platform}</TableCell>
                    <TableCell>{format(new Date(dm.sent_date), "MMM d, yyyy")}</TableCell>
                    <TableCell>{format(new Date(dm.followup_date), "MMM d, yyyy")}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(dm.status)}>
                        {dm.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex flex-col sm:flex-row justify-end gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/dms/${dm.id}`}>Edit</Link>
                        </Button>
                        <div className="flex flex-wrap gap-1 justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStatusUpdate(dm.id, "In Conversation")}
                            className="text-xs"
                          >
                            In Conversation
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStatusUpdate(dm.id, "Won")}
                          >
                            Won
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStatusUpdate(dm.id, "Lost")}
                          >
                            Lost
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStatusUpdate(dm.id, "Waiting", 3)}
                            className="text-xs"
                          >
                            +3 days
                          </Button>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
}

