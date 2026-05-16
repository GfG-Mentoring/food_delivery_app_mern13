import type { InputHTMLAttributes } from 'react'

import { cn } from '../../lib/utils.ts'

export type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string
  error?: string
  hint?: string
}

export function TextField({
  id,
  label,
  error,
  hint,
  className,
  ...props
}: TextFieldProps) {
  const inputId = id ?? label.replace(/\s+/g, '-').toLowerCase()

  return (
    <div className="flex w-full flex-col gap-1.5">
      <label
        htmlFor={inputId}
        className="font-heading text-sm font-medium tracking-tight text-heading"
      >
        {label}
      </label>
      <input
        id={inputId}
        aria-invalid={error !== undefined && error.length > 0}
        aria-describedby={
          error !== undefined && error.length > 0
            ? `${inputId}-error`
            : hint !== undefined && hint.length > 0
              ? `${inputId}-hint`
              : undefined
        }
        className={cn(
          'h-11 w-full rounded-xl border border-input bg-card px-4 py-2 font-sans text-base text-foreground shadow-inner shadow-black/[0.03] transition-[border-color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 dark:shadow-black/20',
          error !== undefined && error.length > 0 && 'border-destructive',
          className,
        )}
        {...props}
      />
      {hint !== undefined && hint.length > 0 && error === undefined ? (
        <p id={`${inputId}-hint`} className="text-xs text-muted-foreground">
          {hint}
        </p>
      ) : null}
      {error !== undefined && error.length > 0 ? (
        <p id={`${inputId}-error`} className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  )
}
