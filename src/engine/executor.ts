/**
 * Workflow Executor
 *
 * Runs a workflow's action chain: resolves templates between steps,
 * calls connector operations via the registry, tracks context, and
 * records results.
 */
import type { Workflow, ActionStep, StepResult } from "./types";
import { createContext, setStepOutput, getTemplateContext } from "./context";
import { resolveParams } from "./template";
import { get as getConnector } from "~/connectors";

export interface RunResult {
  success: boolean;
  steps: StepResult[];
  finalOutput: Record<string, unknown> | null;
  error: string | null;
}

/**
 * Execute a workflow from a trigger input.
 * Returns the run result with per-step details.
 */
export async function executeWorkflow(
  workflow: Workflow,
  triggerInput: Record<string, unknown> = {},
): Promise<RunResult> {
  const ctx = createContext(triggerInput);
  const stepResults: StepResult[] = [];
  let finalOutput: Record<string, unknown> | null = null;

  for (const step of workflow.actions) {
    const startTime = Date.now();
    const stepResult: StepResult = {
      stepId: step.id,
      status: "success",
      output: null,
      error: null,
      durationMs: 0,
    };

    try {
      // Resolve template variables in params
      const templateCtx = getTemplateContext(ctx);
      const resolvedParams = resolveParams(step.params, templateCtx);

      // Get the connector and operation
      const connector = getConnector(step.providerId);
      if (!connector) {
        throw new Error(`Unknown connector: ${step.providerId}`);
      }

      const operation = connector.operations.find(
        (op) => op.id === step.operationId,
      );
      if (!operation) {
        throw new Error(
          `Unknown operation "${step.operationId}" on ${connector.name}`,
        );
      }

      // For now, the connector config is empty (no real credentials)
      // In production, we'd look up the user's stored integration config
      const mockConfig: Record<string, string> = {};

      // Execute the operation
      const output = await operation.execute(mockConfig, resolvedParams);
      stepResult.output = output as Record<string, unknown>;

      // Store output in context if an output variable is specified
      if (step.outputVar) {
        setStepOutput(ctx, step.outputVar, stepResult.output);
      }

      finalOutput = stepResult.output;
    } catch (err: any) {
      stepResult.status = "failed";
      stepResult.error = err.message || String(err);
    }

    stepResult.durationMs = Date.now() - startTime;
    stepResults.push(stepResult);

    // Stop execution on failure
    if (stepResult.status === "failed") {
      return {
        success: false,
        steps: stepResults,
        finalOutput: null,
        error: stepResult.error,
      };
    }
  }

  return {
    success: true,
    steps: stepResults,
    finalOutput,
    error: null,
  };
}

/**
 * Validate a workflow definition before saving.
 * Checks that all referenced connectors and operations exist.
 */
export function validateWorkflow(
  workflow: Pick<Workflow, "actions">,
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  for (const step of workflow.actions) {
    const connector = getConnector(step.providerId);
    if (!connector) {
      errors.push(
        `Step "${step.id}": Unknown connector "${step.providerId}"`,
      );
      continue;
    }

    const operation = connector.operations.find(
      (op) => op.id === step.operationId,
    );
    if (!operation) {
      errors.push(
        `Step "${step.id}": Unknown operation "${step.operationId}" on ${connector.name}`,
      );
    }
  }

  return { valid: errors.length === 0, errors };
}