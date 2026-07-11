/**
 * Template Variable Resolver
 *
 * Replaces {{variable}} placeholders in parameter values with actual data
 * from the execution context (trigger input and previous step outputs).
 */

export type VariableSource = Record<string, unknown>;

/**
 * Resolve template variables in a string value.
 *
 * Supports:
 *   - {{trigger.field}}      — Access trigger input data
 *   - {{step_name.field}}    — Access a previous step's output
 *   - {{trigger}}            — The full trigger object (JSON)
 *
 * @param template - The string potentially containing {{variable}} references
 * @param context - Object mapping variable names to their values
 * @returns The resolved string with variables replaced
 */
export function resolveTemplate(
  template: string,
  context: Record<string, unknown>,
): string {
  return template.replace(/\{\{([^}]+)\}\}/g, (match, path: string) => {
    const trimmed = path.trim();
    const value = resolvePath(trimmed, context);
    if (value === undefined || value === null) {
      return match; // Leave unresolved if not found
    }
    if (typeof value === "object") {
      return JSON.stringify(value);
    }
    return String(value);
  });
}

/**
 * Recursively resolve a dotted path against a context object.
 * e.g. resolvePath("trigger.amount", { trigger: { amount: 100 } }) => 100
 */
function resolvePath(
  path: string,
  context: Record<string, unknown>,
): unknown {
  if (path === "") return undefined;

  const parts = path.split(".");
  let current: unknown = context;

  for (const part of parts) {
    if (current === null || current === undefined) return undefined;
    if (typeof current !== "object") return undefined;
    current = (current as Record<string, unknown>)[part];
  }

  return current;
}

/**
 * Resolve all template variables in a parameters object.
 * Mutates the params in-place and returns them.
 */
export function resolveParams(
  params: Record<string, unknown>,
  context: Record<string, unknown>,
): Record<string, unknown> {
  const resolved: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(params)) {
    if (typeof value === "string") {
      resolved[key] = resolveTemplate(value, context);
    } else if (typeof value === "object" && value !== null) {
      resolved[key] = resolveParams(
        value as Record<string, unknown>,
        context,
      );
    } else {
      resolved[key] = value;
    }
  }
  return resolved;
}