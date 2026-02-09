export type ActivityEntryType = "task" | "memory" | "session" | "config" | "channel" | "cron" | "system";

export interface ActivityEntry {
  id: string;
  type: ActivityEntryType;
  message: string;
  detail?: string;
  timestamp: string;
  source?: string;
}

export type ActivityFilter = "all" | ActivityEntryType;
