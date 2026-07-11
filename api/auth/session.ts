import { json } from "@tanstack/react-start";
import { createAPIFileRoute } from "@tanstack/react-start/api";
import { getCurrentUser } from "~/lib/auth";

export const APIRoute = createAPIFileRoute("/api/auth/session")({
  GET: async ({ request }: { request: Request }) => {
    const user = await getCurrentUser(request);
    return json({ user });
  },
});