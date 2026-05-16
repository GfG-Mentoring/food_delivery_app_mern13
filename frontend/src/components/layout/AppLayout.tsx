import { ChefHat, MapPin } from 'lucide-react'
import { Link, Outlet } from 'react-router-dom'

import { logout, selectAuthUser } from '../../features/auth/authSlice.ts'
import { cn } from '../../lib/utils.ts'
import { useAppDispatch, useAppSelector } from '../../store/hooks.ts'

export function AppLayout() {
  const dispatch = useAppDispatch()
  const user = useAppSelector(selectAuthUser)
  return (
    <div className="flex min-h-svh flex-col bg-background">
      <header className="sticky top-0 z-50 border-b border-border/80 bg-[var(--header-bg)]/90 backdrop-blur-xl supports-[backdrop-filter]:bg-[var(--header-bg)]/75">
        <div className="mx-auto flex h-[4.25rem] max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="group flex items-center gap-2 font-heading text-lg font-semibold tracking-tight text-heading"
          >
            <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md transition group-hover:scale-[1.03]">
              <ChefHat className="size-5" strokeWidth={2} aria-hidden />
            </span>
            <span className="hidden sm:inline">Feastlane</span>
          </Link>

          <nav
            className="flex items-center gap-1 sm:gap-2"
            aria-label="Main"
          >
            <Link
              to="/"
              className={cn(
                'rounded-xl px-3 py-2 font-sans text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground',
              )}
            >
              Discover
            </Link>
            <span
              className="hidden items-center gap-1 rounded-xl px-3 py-2 font-sans text-sm text-muted-foreground sm:flex"
              title="Your area"
            >
              <MapPin className="size-3.5 shrink-0" aria-hidden />
              Midtown
            </span>
            {user ? (
              <>
                <span
                  className="hidden max-w-[14rem] truncate rounded-xl px-3 py-2 font-sans text-sm text-foreground sm:inline"
                  title={user.email}
                >
                  {user.email}
                </span>
                <button
                  type="button"
                  onClick={() => dispatch(logout())}
                  className="rounded-xl px-3 py-2 font-sans text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/sign-in"
                  className="rounded-xl px-3 py-2 font-sans text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
                >
                  Sign in
                </Link>
                <Link
                  to="/sign-up"
                  className="ml-1 rounded-xl bg-primary px-4 py-2 font-sans text-sm font-semibold text-primary-foreground shadow-sm transition hover:brightness-110"
                >
                  Join
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <Outlet />

      <footer className="mt-auto border-t border-border/70 bg-card/40 py-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p className="font-sans text-sm text-muted-foreground">
            Feastlane — curated delivery, local kitchens.
          </p>
          <div className="flex gap-4 font-sans text-sm">
            <a href="#" className="text-muted-foreground hover:text-foreground">
              Help
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground">
              Terms
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
