'use client';

interface UserInfo {
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl: string | null;
}

export function TopHeader({
  title,
  user,
  children,
}: {
  title: string;
  user: UserInfo;
  children?: React.ReactNode;
}) {
  const initials = (user.firstName[0] ?? '') + (user.lastName[0] ?? '');

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-outline-variant/30 bg-background/80 px-6 backdrop-blur-xl">
      {/* Left Side */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-on-surface-variant">
          <span className="material-symbols-outlined text-lg">apartment</span>
          <span>{user.firstName}&apos;s Workspace</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-on-surface-variant">/</span>
          <span className="font-medium text-on-surface">{title}</span>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-3">
        {children}

        {/* Notifications */}
        <button
          type="button"
          className="relative flex h-9 w-9 items-center justify-center rounded-lg text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-on-surface"
        >
          <span
            className="material-symbols-outlined text-xl"
            style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}
          >
            notifications
          </span>
        </button>

        {/* Help */}
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-on-surface"
        >
          <span
            className="material-symbols-outlined text-xl"
            style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}
          >
            help_outline
          </span>
        </button>

        {/* Avatar */}
        {user.avatarUrl ? (
          <img
            alt={user.firstName}
            className="h-9 w-9 rounded-full object-cover"
            src={user.avatarUrl}
          />
        ) : (
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/20 text-sm font-semibold text-primary">
            {initials}
          </div>
        )}
      </div>
    </header>
  );
}
