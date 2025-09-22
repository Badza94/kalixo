"use client";

import { Avatar } from "@workspace/ui/components/avatar";
import { Badge } from "@workspace/ui/components/badge";
import {
  Mail,
  Play,
  Pause,
  StopCircle,
  Download,
  PlusCircle,
  Circle,
} from "@workspace/ui/lucide-react";
import Image from "next/image";
import clsx from "clsx";
import { formatDate } from "@workspace/ui/lib/date-fns";
import { ScrollArea } from "@workspace/ui/components/scroll-area";

const typeIconMap = {
  Email: Mail,
  Play: Play,
  Pause: Pause,
  Stop: StopCircle,
  Download: Download,
  Created: PlusCircle,
  Default: Circle,
};

const typeColorMap = {
  Email: "text-blue-500 bg-blue-100",
  Play: "text-green-500 bg-green-100",
  Pause: "text-yellow-500 bg-yellow-100",
  Stop: "text-red-500 bg-red-100",
  Download: "text-cyan-500 bg-cyan-100",
  Created: "text-purple-500 bg-purple-100",
  Default: "text-gray-500 bg-gray-100",
};

export interface TimelineEntry {
  type: keyof typeof typeIconMap;
  user: "system" | { firstName: string; lastName: string; image: string };
  description: string;
  date: string;
  details?: string;
}

export function Timeline({ entries }: { entries: TimelineEntry[] }) {
  return (
    <ScrollArea className="h-[500px]">
      <div className="space-y-8">
        {entries.map((entry, idx) => {
          const Icon = typeIconMap[entry.type] || typeIconMap.Default;
          const color = typeColorMap[entry.type] || typeColorMap.Default;
          const isSystem = entry.user === "system";
          const user: {
            firstName: string;
            lastName: string;
            image: string;
          } | null = isSystem
            ? null
            : (entry.user as {
                firstName: string;
                lastName: string;
                image: string;
              });
          return (
            <div key={idx} className="flex gap-4 group">
              <div className="flex flex-col items-center min-h-16">
                <div className={clsx("flex-shrink-0 rounded-full p-2", color)}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="w-[2px] flex-1 bg-input mt-2 group-last:hidden" />
              </div>

              <div className="flex flex-col flex-1">
                <div className="flex items-center gap-2">
                  {isSystem ? (
                    <Badge variant="secondary">System</Badge>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Avatar className="w-6 h-6 bg-foreground">
                        <Image
                          src={user!.image}
                          alt={user!.firstName}
                          width={24}
                          height={24}
                        />
                      </Avatar>
                      <span className="font-medium">
                        {user!.firstName} {user!.lastName}
                      </span>
                    </div>
                  )}
                  <span className="text-xs text-muted-foreground ml-2">
                    {formatDate(new Date(entry.date), "dd/MM/yyyy HH:mm")}
                  </span>
                </div>
                <div className="mt-1 text-sm">{entry.description}</div>
                {entry.details && (
                  <div className="mt-2 rounded bg-muted px-4 py-2 text-xs text-muted-foreground">
                    {entry.details}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
}
