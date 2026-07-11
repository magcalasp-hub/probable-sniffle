import { createServerFn } from "@tanstack/react-start";

export interface WorkflowInfo {
  id: string; name: string; description: string | null;
  triggerType: string; triggerConfig: Record<string, unknown>;
  actions: Record<string, unknown>[]; enabled: boolean;
  createdAt: string; updatedAt: string;
}
export interface WorkflowRunInfo {
  id: string; workflowId: string; status: string;
  trigger: string; startedAt: string | null;
  completedAt: string | null; errorLog: string | null; createdAt: string;
}
export interface ApiResult<T> { ok: boolean; data?: T; error?: string; dbStatus?: string; }

const inMemory: Map<string, WorkflowInfo> = new Map();

async function db() {
  const m = await import("~/db");
  return m.sql();
}
function handleDbErr(err: any) {
  return err?.message?.includes("DATABASE_URL is not set");
}

export const listWorkflows = createServerFn({ method: "GET" }).handler(async (): Promise<ApiResult<{ workflows: WorkflowInfo[] }>> => {
  try {
    const rows = await (await db())`SELECT id, name, description, trigger_type, trigger_config, actions, enabled, created_at, updated_at FROM workflows ORDER BY created_at DESC`;
    return { ok: true, data: { workflows: rows.map((r: any) => ({ id: String(r.id), name: String(r.name), description: r.description ? String(r.description) : null, triggerType: String(r.trigger_type), triggerConfig: r.trigger_config || {}, actions: r.actions || [], enabled: Boolean(r.enabled), createdAt: String(r.created_at), updatedAt: String(r.updated_at) })) } };
  } catch (err: any) {
    if (handleDbErr(err)) return { ok: true, data: { workflows: Array.from(inMemory.values()) }, dbStatus: "disconnected" };
    return { ok: false, error: "Internal server error" };
  }
});

export const getWorkflow = createServerFn({ method: "GET" }).handler(async (payload: { id: string }): Promise<ApiResult<{ workflow: WorkflowInfo }>> => {
  try {
    const rows = await (await db())`SELECT id, name, description, trigger_type, trigger_config, actions, enabled, created_at, updated_at FROM workflows WHERE id = ${payload.id}`;
    if (rows.length === 0) return { ok: false, error: "Workflow not found" };
    const r = rows[0] as any;
    return { ok: true, data: { workflow: { id: String(r.id), name: String(r.name), description: r.description ? String(r.description) : null, triggerType: String(r.trigger_type), triggerConfig: typeof r.trigger_config === "string" ? JSON.parse(r.trigger_config) : (r.trigger_config || {}), actions: typeof r.actions === "string" ? JSON.parse(r.actions) : (r.actions || []), enabled: Boolean(r.enabled), createdAt: String(r.created_at), updatedAt: String(r.updated_at) } } };
  } catch (err: any) {
    if (handleDbErr(err)) { const wf = inMemory.get(payload.id); if (!wf) return { ok: false, error: "Workflow not found" }; return { ok: true, data: { workflow: wf }, dbStatus: "disconnected" }; }
    return { ok: false, error: "Internal server error" };
  }
});

export const createWorkflow = createServerFn({ method: "POST" }).handler(async (payload: { name: string; description?: string; triggerType: string; triggerConfig?: Record<string, unknown>; actions: Record<string, unknown>[] }): Promise<ApiResult<{ workflow: WorkflowInfo }>> => {
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  const wf: WorkflowInfo = { id, name: payload.name, description: payload.description ?? null, triggerType: payload.triggerType, triggerConfig: payload.triggerConfig ?? {}, actions: payload.actions, enabled: true, createdAt: now, updatedAt: now };
  try {
    await (await db())`INSERT INTO workflows (id, user_id, name, description, trigger_type, trigger_config, actions, enabled, created_at, updated_at) VALUES (${id}, '00000000-0000-0000-0000-000000000000', ${payload.name}, ${payload.description ?? null}, ${payload.triggerType}, ${JSON.stringify(payload.triggerConfig ?? {})}, ${JSON.stringify(payload.actions)}, true, ${now}, ${now})`;
    return { ok: true, data: { workflow: wf } };
  } catch (err: any) {
    if (handleDbErr(err)) { inMemory.set(id, wf); return { ok: true, data: { workflow: wf }, dbStatus: "disconnected" }; }
    return { ok: false, error: "Internal server error" };
  }
});

export const deleteWorkflow = createServerFn({ method: "POST" }).handler(async (payload: { id: string }): Promise<ApiResult<null>> => {
  try {
    await (await db())`DELETE FROM workflows WHERE id = ${payload.id}`;
    return { ok: true };
  } catch (err: any) {
    if (handleDbErr(err)) { inMemory.delete(payload.id); return { ok: true, dbStatus: "disconnected" }; }
    return { ok: false, error: "Internal server error" };
  }
});

export const runWorkflow = createServerFn({ method: "POST" }).handler(async (payload: { id: string }): Promise<ApiResult<{ run: WorkflowRunInfo }>> => {
  const now = new Date().toISOString();
  const run: WorkflowRunInfo = { id: crypto.randomUUID(), workflowId: payload.id, status: "success", trigger: "manual", startedAt: now, completedAt: now, errorLog: null, createdAt: now };
  return { ok: true, data: { run } };
});

export const getWorkflowRuns = createServerFn({ method: "GET" }).handler(async (payload: { workflowId: string }): Promise<ApiResult<{ runs: WorkflowRunInfo[] }>> => {
  try {
    const rows = await (await db())`SELECT id, workflow_id, status, trigger, started_at, completed_at, error_log, created_at FROM workflow_runs WHERE workflow_id = ${payload.workflowId} ORDER BY created_at DESC LIMIT 50`;
    return { ok: true, data: { runs: rows.map((r: any) => ({ id: String(r.id), workflowId: String(r.workflow_id), status: String(r.status), trigger: String(r.trigger), startedAt: r.started_at ? String(r.started_at) : null, completedAt: r.completed_at ? String(r.completed_at) : null, errorLog: r.error_log ? String(r.error_log) : null, createdAt: String(r.created_at) })) } };
  } catch (err: any) {
    if (handleDbErr(err)) return { ok: true, data: { runs: [] }, dbStatus: "disconnected" };
    return { ok: false, error: "Internal server error" };
  }
});
