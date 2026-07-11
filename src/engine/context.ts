/**
 * Execution Context
 *
 * Manages the in-memory context passed between workflow action steps.
 * Stores trigger input, step outputs, and workflow variables.
 */
import type { ExecutionContext } from "./types";

/** Create a new execution context with initial trigger data */
export function createContext(
  trigger: Record<string, unknown>,
): ExecutionContext {
  return {
    trigger,
    outputs: {},
    variables: {},
  };
}

/** Store the output of a step in the context */
export function setStepOutput(
  ctx: ExecutionContext,
  stepName: string,
  output: Record<string, unknown>,
): void {
  ctx.outputs[stepName] = output;
}

/** Get a previous step's output by its variable name */
export function getStepOutput(
  ctx: ExecutionContext,
  stepName: string,
): Record<string, unknown> | undefined {
  return ctx.outputs[stepName];
}

/** Set a workflow-level variable */
export function setVariable(
  ctx: ExecutionContext,
  key: string,
  value: unknown,
): void {
  ctx.variables[key] = value;
}

/** Get a workflow-level variable */
export function getVariable(
  ctx: ExecutionContext,
  key: string,
): unknown {
  return ctx.variables[key];
}

/** Get the full context as a flat map for template resolution */
export function getTemplateContext(
  ctx: ExecutionContext,
): Record<string, unknown> {
  return {
    trigger: ctx.trigger,
    ...ctx.outputs,
    ...ctx.variables,
  };
}