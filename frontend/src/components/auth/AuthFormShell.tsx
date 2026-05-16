import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

import { cn } from '../../lib/utils.ts'

type AuthFormShellProps = {
  title: string
  subtitle: string
  children: ReactNode
  footer: ReactNode
  asideEyebrow: string
  asideTitle: string
  asideBody: string
}

export function AuthFormShell({
  title,
  subtitle,
  children,
  footer,
  asideEyebrow,
  asideTitle,
  asideBody,
}: AuthFormShellProps) {
  return (
    <div className="relative flex min-h-[calc(100svh-4.25rem)] flex-col overflow-hidden lg:min-h-[calc(100svh-5.25rem)] lg:flex-row">
      <aside
        className={cn(
          'relative flex flex-1 flex-col justify-end p-8 pb-10 lg:max-w-md lg:justify-center lg:p-12 lg:pb-12 xl:max-w-lg',
          'bg-[var(--auth-aside-bg)] text-[var(--auth-aside-fg)]',
        )}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cg fill='%23ffffff' fill-opacity='0.07'%3E%3Cpath d='M0 0h20v20H0z'/%3E%3Cpath d='M20 20h20v20H20z'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
          aria-hidden
        />
        <div className="relative z-[1] space-y-4">
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-[var(--auth-aside-muted)]">
            {asideEyebrow}
          </p>
          <h2 className="font-heading text-3xl font-semibold leading-tight tracking-tight lg:text-4xl">
            {asideTitle}
          </h2>
          <p className="max-w-sm font-sans text-base leading-relaxed text-[var(--auth-aside-muted)]">
            {asideBody}
          </p>
          <Link
            to="/"
            className="inline-flex font-sans text-sm font-medium underline-offset-4 hover:underline"
          >
            Back to discovery
          </Link>
        </div>
      </aside>

      <section className="flex flex-1 flex-col justify-center px-6 py-10 sm:px-10 lg:px-16 xl:px-24">
        <div className="mx-auto w-full max-w-md">
          <h1 className="font-heading text-3xl font-semibold tracking-tight text-heading">
            {title}
          </h1>
          <p className="mt-2 font-sans text-body">{subtitle}</p>
          <div className="mt-8 flex flex-col gap-5">{children}</div>
          <div className="mt-8 border-t border-border pt-6 font-sans text-sm text-body">
            {footer}
          </div>
        </div>
      </section>
    </div>
  )
}
