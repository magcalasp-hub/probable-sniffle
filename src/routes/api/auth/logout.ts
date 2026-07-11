import { json } from "@tanstack/react-start";
import { createAPIFileRoute } from "@tanstack/react-start/api";
import { createClearSessionCookie } from "~/lib/auth";

export const APIRoute = createAPIFileRoute("/api/auth/logout")({
  POST: async () => {
    const cookie = createClearSessionCookie();
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie": cookie,
      },
    });
  },
});