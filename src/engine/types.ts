/**
 * Workflow Engine Types
 *
 * Defines the core types for the workflow engine including
 * workflow definitions, triggers, actions, and run records.
 */
import type { ConnectorOperation } from "~/connectors";

/** How a workflow is triggered */
export type TriggerType = "webhook" | "schedule" | "manual";

/** Configuration for a schedule trigger */
export interface ScheduleConfig {
  /** Cron expression (e.g. "0 */6 * * *" for every 6 hours) */
  cron: string;
  /** Human-readable description of the schedule */
  description?: string;
}

/** A single action step in a workflow */
export interface ActionStep {
  /** Unique id within the workflow (e.g. "step_1") */
  id: string;
  /** The integration provider id (e.g. "stripe", "slack") */
  providerId: string;
  /** The operation id on that connector (e.g. "send_message") */
  operationId: string;
  /** Parameters for the operation, can contain {{variable}} templates */
  params: Record<string, unknown>;
  /** Optional: assign output to a variable name for use in later steps */
  outputVar?: string;
  /** Human-readable label for this step */
  label?: string;
}

/** A complete workflow definition */
export interface Workflow {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  triggerType: TriggerType;
  triggerConfig: ScheduleConfig | Record<string, never>;
  actions: ActionStep[];
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

/** Status of a workflow run */
export type RunStatus = "pending" | "running" | "success" | "failed";

/** A single execution run of a workflow */
export interface WorkflowRun {
  id: string;
  workflowId: string;
  userId: string;
  status: RunStatus;
  trigger: string;
  input: Record<string, unknown> | null;
  output: Record<string, unknown> | null;
  errorLog: string | null;
  startedAt: string | null;
  completedAt: string | null;
  createdAt: string;
}

/** Result from executing a single action step */
export interface StepResult {
  stepId: string;
  status: "success" | "failed";
  output: Record<string, unknown> | null;
  error: string | null;
  durationMs: number;
}

/** Context passed between steps during execution */
export interface ExecutionContext {
  /** Trigger input data */
  trigger: Record<string, unknown>;
  /** Outputs from previous steps, keyed by step outputVar */
  outputs: Record<string, Record<string, unknown>>;
  /** Workflow-level variables */
  variables: Record<string, unknown>;
}