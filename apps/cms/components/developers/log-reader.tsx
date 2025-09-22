/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { format, startOfDay, endOfDay } from "@workspace/ui/lib/date-fns";
import React, { useEffect, useRef, useState } from "react";

export type EventType = "info" | "success" | "error" | "warn" | "api";

type LogEntry = {
  type: EventType;
  message: string;
  timestamp: string;
};

interface LogReaderProps {
  initialDateFrom: Date;
  initialDateTo: Date;
  initialTypes: string[];
  initialSearchQuery: string;
}

export default function LogReader({
  initialDateFrom,
  initialDateTo,
  initialTypes,
  initialSearchQuery,
}: LogReaderProps) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const terminalRef = useRef<HTMLDivElement>(null);

  // ✅ Clear logs when filters change
  useEffect(() => {
    setLogs([]);
  }, [
    initialDateFrom.toISOString(),
    initialDateTo.toISOString(),
    JSON.stringify(initialTypes),
    initialSearchQuery,
  ]);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:3001");

    const dateFrom = startOfDay(initialDateFrom);
    const dateTo = endOfDay(initialDateTo);

    socket.onmessage = (event) => {
      try {
        const data: LogEntry = JSON.parse(event.data);

        const logDate = new Date(data.timestamp);
        const matchesDate = logDate >= dateFrom && logDate <= dateTo;

        const matchesType =
          initialTypes.length === 0 || initialTypes.includes(data.type);

        const matchesSearch =
          !initialSearchQuery ||
          data.message.toLowerCase().includes(initialSearchQuery.toLowerCase());

        if (matchesDate && matchesType && matchesSearch) {
          setLogs((prev) => {
            const key = `${data.timestamp}-${data.message}`;
            if (prev.some((log) => `${log.timestamp}-${log.message}` === key)) {
              return prev;
            }
            return [...prev, data];
          });
        }
      } catch (e) {
        console.error("Invalid log format", e);
      }
    };

    return () => socket.close();
  }, [
    initialDateFrom.getTime(),
    initialDateTo.getTime(),
    JSON.stringify(initialTypes),
    initialSearchQuery,
  ]);

  useEffect(() => {
    terminalRef.current?.scrollTo({
      top: terminalRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [logs]);

  const getColorClass = (type: EventType) => {
    switch (type) {
      case "info":
        return "text-blue-400";
      case "success":
        return "text-green-400";
      case "error":
        return "text-red-400";
      case "warn":
        return "text-yellow-300";
      case "api":
        return "text-purple-400";
      default:
        return "text-white";
    }
  };

  return (
    <div
      ref={terminalRef}
      className="bg-black text-white font-mono text-sm rounded-lg p-4 h-[500px] overflow-y-auto border border-neutral-800"
    >
      {logs.map((log, idx) => (
        <div
          key={`${log.timestamp}-${idx}`}
          className={getColorClass(log.type)}
        >
          <span className="text-neutral-500">
            {format(log.timestamp, "yyyy-MM-dd HH:mm:ss.SSS")}{" "}
          </span>
          [{log.type.toUpperCase()}]: {log.message}
        </div>
      ))}
    </div>
  );
}
