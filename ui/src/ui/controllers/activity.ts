import type { GatewayBrowserClient } from "../gateway.ts";
import type { ActivityEntry, ActivityFilter } from "../types/activity.ts";
import type { EventLogEntry } from "../app-events.ts";

export type ActivityState = {
  client: GatewayBrowserClient | null;
  connected: boolean;
  activityLoading: boolean;
  activityError: string | null;
  activityEntries: ActivityEntry[];
  activityFilter: ActivityFilter;
  eventLog: EventLogEntry[];
};

function eventToType(event: EventLogEntry): ActivityEntry["type"] {
  const kind = (event as Record<string, unknown>).kind as string | undefined;
  const method = (event as Record<string, unknown>).method as string | undefined;
  const label = kind ?? method ?? "";
  if (label.startsWith("task") || label.includes("task")) return "task";
  if (label.startsWith("memory") || label.includes("memory")) return "memory";
  if (label.startsWith("session") || label.includes("session")) return "session";
  if (label.startsWith("config") || label.includes("config")) return "config";
  if (label.startsWith("channel") || label.includes("channel")) return "channel";
  if (label.startsWith("cron") || label.includes("cron")) return "cron";
  return "system";
}

export async function loadActivity(state: ActivityState) {
  if (!state.client || !state.connected) return;
  if (state.activityLoading) return;
  state.activityLoading = true;
  state.activityError = null;
  try {
    // Build entries from the event log that is already available
    const entries: ActivityEntry[] = state.eventLog.map((event, idx) => {
      const ts =
        (event as Record<string, unknown>).ts ??
        (event as Record<string, unknown>).timestamp ??
        Date.now();
      const message =
        ((event as Record<string, unknown>).summary as string) ??
        ((event as Record<string, unknown>).message as string) ??
        ((event as Record<string, unknown>).kind as string) ??
        "Event";
      const detail =
        ((event as Record<string, unknown>).detail as string) ??
        ((event as Record<string, unknown>).data
          ? JSON.stringify((event as Record<string, unknown>).data)
          : undefined);
      return {
        id: `ev-${idx}-${ts}`,
        type: eventToType(event),
        message,
        detail,
        timestamp: new Date(ts as number).toISOString(),
        source: (event as Record<string, unknown>).source as string | undefined,
      };
    });
    // Sort newest first
    entries.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    state.activityEntries = entries;
  } catch (err) {
    state.activityError = String(err);
  } finally {
    state.activityLoading = false;
  }
}
