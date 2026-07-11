/**
 * Cron-based Scheduler
 *
 * Checks for workflows with schedule triggers every 60 seconds
 * and queues them for execution when their cron expression matches.
 * Runs inside the Bun server process.
 */
import type { Workflow, ScheduleConfig } from "./types";

interface ScheduledWorkflow {
  workflow: Workflow;
  lastRunAt: number | null;
}

const scheduled: Map<string, ScheduledWorkflow> = new Map();
let intervalId: ReturnType<typeof setInterval> | null = null;

/**
 * Parse a simple cron expression and check if it matches the current time.
 * Supports: "*/N * * * *" (every N minutes), "0 */H * * *" (every H hours)
 * Full cron parsing is complex; this is a simplified version for MVP.
 */
function matchesCron(cron: string, now: Date): boolean {
  const parts = cron.trim().split(/\s+/);
  if (parts.length < 5) return false;

  const minute = now.getUTCMinutes();
  const hour = now.getUTCHours();
  const dayOfMonth = now.getUTCDate();
  const month = now.getUTCMonth() + 1;
  const dayOfWeek = now.getUTCDay();

  return (
    matchesField(parts[0], minute, 0, 59) &&
    matchesField(parts[1], hour, 0, 23) &&
    matchesField(parts[2], dayOfMonth, 1, 31) &&
    matchesField(parts[3], month, 1, 12) &&
    matchesField(parts[4], dayOfWeek, 0, 6)
  );
}

function matchesField(
  field: string,
  value: number,
  min: number,
  max: number,
): boolean {
  if (field === "*") return true;

  // "*/N" — every N
  if (field.startsWith("*/")) {
    const interval = parseInt(field.slice(2), 10);
    if (isNaN(interval) || interval === 0) return false;
    return value % interval === 0;
  }

  // Comma-separated list
  if (field.includes(",")) {
    return field.split(",").some((f) => matchesField(f.trim(), value, min, max));
  }

  // Single number
  const num = parseInt(field, 10);
  return num === value;
}

/** Register a workflow with the scheduler */
export function scheduleWorkflow(workflow: Workflow): void {
  if (workflow.triggerType !== "schedule") return;
  scheduled.set(workflow.id, {
    workflow,
    lastRunAt: null,
  });
}

/** Unregister a workflow from the scheduler */
export function unscheduleWorkflow(workflowId: string): void {
  scheduled.delete(workflowId);
}

/** Start the scheduler. Checks every 60 seconds. */
export function startScheduler(
  onTrigger: (workflow: Workflow) => void,
): void {
  if (intervalId) return;

  intervalId = setInterval(() => {
    const now = new Date();
    for (const [, entry] of scheduled) {
      const cfg = entry.workflow.triggerConfig as ScheduleConfig;
      if (!cfg.cron) continue;

      // Simple dedup: only trigger once per minute
      const minuteKey = `${now.getUTCFullYear()}-${now.getUTCMonth()}-${now.getUTCDate()} ${now.getUTCHours()}:${now.getUTCMinutes()}`;
      const lastKey = entry.lastRunAt
        ? new Date(entry.lastRunAt).toISOString().slice(0, 16)
        : "";

      if (matchesCron(cfg.cron, now) && minuteKey !== lastKey) {
        entry.lastRunAt = now.getTime();
        try {
          onTrigger(entry.workflow);
        } catch {
          // Silently handle trigger errors
        }
      }
    }
  }, 60_000);

  console.log("[scheduler] Started — checking every 60s");
}

/** Stop the scheduler */
export function stopScheduler(): void {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
    console.log("[scheduler] Stopped");
  }
}