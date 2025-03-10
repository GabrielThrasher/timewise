import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected")({
  beforeLoad: async ({ context }) => {
    const auth = await context.auth.promise;

    if (!auth.user) {
      throw redirect({
        to: "/",
      });
    }
  },
});
