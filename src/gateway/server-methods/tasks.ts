import type { CronJob, CronSchedule } from "../../cron/types.js";
import type { CronRunLogEntry } from "../../cron/run-log.js";
import type { GatewayRequestHandlers } from "./types.js";
import { readCronRunLogEntries, resolveCronRunLogPath } from "../../cron/run-log.js";
import { ErrorCodes, errorShape } from "../protocol/index.js";

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function formatScheduleDescription(schedule: CronSchedule): string {
  if (schedule.kind === "at") {
    const d = new Date(schedule.at);
    return `Scheduled at ${d.toISOString().slice(0, 16).replace("T", " ")} UTC`;
  }
  if (schedule.kind === "every") {
    const ms = schedule.everyMs;
    if (ms < 60_000) return `Every ${Math.round(ms / 1000)}s`;
    if (ms < 3_600_000) return `Every ${Math.round(ms / 60_000)}m`;
    if (ms < 86_400_000) return `Every ${Math.round(ms / 3_600_000)}h`;
    return `Every ${Math.round(ms / 86_400_000)}d`;
  }
  const tz = schedule.tz ? ` (${schedule.tz})` : "";
  return `Cron: ${schedule.expr}${tz}`;
}

function formatRunLogNote(entry: CronRunLogEntry): string {
  const tag =
    entry.status === "ok" ? "OK" : entry.status === "error" ? "ERROR" : "SKIPPED";
  const duration =
    entry.durationMs != null ? ` (${(entry.durationMs / 1000).toFixed(1)}s)` : "";
  const summary = entry.summary ? ` -- ${entry.summary}` : "";
  const error = entry.error ? ` -- ${entry.error}` : "";
  return `[${tag}]${duration}${summary}${error}`;
}

function cronJobToTask(job: CronJob, entries: CronRunLogEntry[]) {
  // Derive status from cron execution state
  let status: "new" | "in-progress" | "done" | "failed";
  if (job.state.runningAtMs) {
    status = "in-progress";
  } else if (job.state.lastStatus === "ok") {
    status = "done";
  } else if (job.state.lastStatus === "error" || job.state.lastStatus === "skipped") {
    status = "failed";
  } else {
    status = "new";
  }

  const content =
    job.payload.kind === "agentTurn" ? job.payload.message : job.payload.text;

  const scheduleDesc = formatScheduleDescription(job.schedule);
  const description = job.description
    ? `${scheduleDesc} -- ${job.description}`
    : scheduleDesc;

  const notes = entries.map((e, i) => ({
    id: `run-${e.ts}-${i}`,
    text: formatRunLogNote(e),
    createdAt: new Date(e.ts).toISOString(),
    kind: "output" as const,
  }));

  const latest = entries.length > 0 ? entries[entries.length - 1] : undefined;
  const updatedAtMs = latest?.ts ?? job.updatedAtMs;

  return {
    id: job.id,
    title: job.name,
    description,
    content,
    status,
    priority: "medium" as const,
    assignee: job.agentId ?? "main",
    agentId: job.agentId,
    sessionKey: latest?.sessionKey,
    createdAt: new Date(job.createdAtMs).toISOString(),
    updatedAt: new Date(updatedAtMs).toISOString(),
    notes,
    attachments: [] as never[],
    output: latest?.summary ?? latest?.error ?? undefined,
  };
}

/* ------------------------------------------------------------------ */
/*  Handlers                                                           */
/* ------------------------------------------------------------------ */

export const tasksHandlers: GatewayRequestHandlers = {
  "tasks.list": async ({ respond, context }) => {
    try {
      const jobs = await context.cron.list({ includeDisabled: false });
      const tasks = await Promise.all(
        jobs.map(async (job) => {
          const logPath = resolveCronRunLogPath({
            storePath: context.cronStorePath,
            jobId: job.id,
          });
          const entries = await readCronRunLogEntries(logPath, {
            limit: 20,
            jobId: job.id,
          });
          return cronJobToTask(job, entries);
        }),
      );
      respond(true, { tasks }, undefined);
    } catch (err) {
      respond(
        false,
        undefined,
        errorShape(ErrorCodes.UNAVAILABLE, `tasks.list failed: ${err}`),
      );
    }
  },

  "tasks.spawn": async ({ params, respond, context }) => {
    const id = (params as { id?: string }).id;
    if (!id) {
      respond(
        false,
        undefined,
        errorShape(ErrorCodes.INVALID_REQUEST, "tasks.spawn requires id"),
      );
      return;
    }
    try {
      const result = await context.cron.run(id, "force");
      respond(true, result, undefined);
    } catch (err) {
      respond(
        false,
        undefined,
        errorShape(ErrorCodes.UNAVAILABLE, `tasks.spawn failed: ${err}`),
      );
    }
  },

  "tasks.create": ({ respond }) => {
    respond(
      false,
      undefined,
      errorShape(
        ErrorCodes.INVALID_REQUEST,
        "Tasks are derived from cron jobs. Use cron.add to create new scheduled tasks.",
      ),
    );
  },

  "tasks.update": ({ respond }) => {
    respond(
      false,
      undefined,
      errorShape(
        ErrorCodes.INVALID_REQUEST,
        "Task status is derived from cron execution state and cannot be manually changed.",
      ),
    );
  },

  "tasks.delete": ({ respond }) => {
    respond(
      false,
      undefined,
      errorShape(
        ErrorCodes.INVALID_REQUEST,
        "Tasks are derived from cron jobs. Use cron.remove to delete a scheduled task.",
      ),
    );
  },

  "tasks.addNote": ({ respond }) => {
    respond(
      false,
      undefined,
      errorShape(
        ErrorCodes.INVALID_REQUEST,
        "Notes are derived from cron run history and cannot be manually added.",
      ),
    );
  },
};
