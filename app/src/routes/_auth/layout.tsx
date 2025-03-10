import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth")({
  beforeLoad: async ({ context }) => {
    const auth = await context.auth.promise;

    if (auth.user) {
      throw redirect({
        to: "/home",
      });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex justify-center align-middle h-full">
      <main className="flex flex-col justify-center">
        <section className="mb-10 min-w-80">
          <h1 className="font-medium text-xl text-center ">⏰ Timewise</h1>
          <h2 className="text-lg italic text-center py-2">
            Plan smart. Stress less.
          </h2>
          <Outlet />
        </section>
      </main>
    </div>
  );
}
