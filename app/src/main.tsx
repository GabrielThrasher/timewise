import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";

import { router } from "./router";
import { useAuth } from "./hooks/useAuth";
import "./App.css";

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// https://github.com/TanStack/router/discussions/1668#discussioncomment-10634735
// we can use this to "await" for the auth state to be fulfilled (finished loading) so that the user don't see
// a flash of the login page when they are already logged in
const authPromise = Promise.withResolvers<ReturnType<typeof useAuth>>();

function App() {
  const auth = useAuth();

  useEffect(() => {
    if (auth.loading) return;

    authPromise.resolve(auth);
  }, [auth, auth.loading]);

  return <RouterProvider router={router} context={{ auth: authPromise }} />;
}

createRoot(document.getElementById("timewise-app")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
