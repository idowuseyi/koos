"use client";

import { useState } from "react";

/**
 * Wraps the logout `<form>` (native POST to /api/auth/logout) and tracks a
 * `pending` flag so the trigger can show a loading state while the request
 * round-trips. The trigger markup differs between the sidebar (plain button)
 * and the header (dropdown item), so it's supplied via a render-prop.
 */
export function LogoutForm({
  children,
}: {
  children: (pending: boolean) => React.ReactNode;
}) {
  const [pending, setPending] = useState(false);
  return (
    <form
      action="/api/auth/logout"
      method="POST"
      onSubmit={() => setPending(true)}
    >
      {children(pending)}
    </form>
  );
}
