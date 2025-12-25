import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function DMsLoading() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Skeleton className="h-9 w-32 mb-2" />
        <Skeleton className="h-5 w-64" />
      </div>

      <div className="space-y-4">
        <div className="flex gap-4">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-[180px]" />
        </div>

        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="p-4 text-left">
                      <Skeleton className="h-4 w-16" />
                    </th>
                    <th className="p-4 text-left">
                      <Skeleton className="h-4 w-20" />
                    </th>
                    <th className="p-4 text-left">
                      <Skeleton className="h-4 w-24" />
                    </th>
                    <th className="p-4 text-left">
                      <Skeleton className="h-4 w-28" />
                    </th>
                    <th className="p-4 text-left">
                      <Skeleton className="h-4 w-16" />
                    </th>
                    <th className="p-4 text-right">
                      <Skeleton className="h-4 w-20" />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3].map((i) => (
                    <tr key={i}>
                      <td className="p-4">
                        <Skeleton className="h-4 w-24" />
                      </td>
                      <td className="p-4">
                        <Skeleton className="h-4 w-16" />
                      </td>
                      <td className="p-4">
                        <Skeleton className="h-4 w-20" />
                      </td>
                      <td className="p-4">
                        <Skeleton className="h-4 w-20" />
                      </td>
                      <td className="p-4">
                        <Skeleton className="h-6 w-20" />
                      </td>
                      <td className="p-4 text-right">
                        <Skeleton className="h-8 w-24 ml-auto" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

