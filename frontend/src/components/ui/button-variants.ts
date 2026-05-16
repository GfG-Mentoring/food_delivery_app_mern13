import { cva } from 'class-variance-authority'

export const buttonVariants = cva(
  'inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl font-semibold tracking-tight transition-[transform,box-shadow,background-color,color] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] disabled:pointer-events-none disabled:opacity-45 active:scale-[0.98]',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground shadow-[0_2px_12px_-2px_oklch(0.45_0.14_35_/_0.35)] hover:brightness-[1.06]',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/85',
        outline:
          'border border-border bg-card/40 text-foreground backdrop-blur-sm hover:bg-muted/80',
        ghost: 'text-foreground hover:bg-muted/70',
      },
      size: {
        default: 'h-11 px-5 text-base',
        sm: 'h-9 rounded-lg px-3.5 text-sm',
        lg: 'h-12 rounded-2xl px-8 text-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)
