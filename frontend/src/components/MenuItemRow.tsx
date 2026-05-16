import { Star } from 'lucide-react'

import type { FoodItem, FoodItemCategory } from '../features/restaurants/types.ts'
import { formatUsd } from '../lib/format.ts'
import { cn } from '../lib/utils.ts'

function categoryLabel(c?: FoodItemCategory): string | null {
  if (c === undefined) {
    return null
  }
  switch (c) {
    case 'veg':
      return 'Veg'
    case 'non-veg':
      return 'Non-veg'
    case 'contains-egg':
      return 'Egg'
    default:
      return null
  }
}

function categoryStyles(c?: FoodItemCategory): string {
  switch (c) {
    case 'veg':
      return 'bg-[var(--badge-veg-bg)] text-[var(--badge-veg-fg)]'
    case 'non-veg':
      return 'bg-[var(--badge-meat-bg)] text-[var(--badge-meat-fg)]'
    case 'contains-egg':
      return 'bg-[var(--badge-egg-bg)] text-[var(--badge-egg-fg)]'
    default:
      return 'bg-muted text-muted-foreground'
  }
}

type MenuItemRowProps = {
  item: FoodItem
  className?: string
}

export function MenuItemRow({ item, className }: MenuItemRowProps) {
  const label = categoryLabel(item.category)
  const priceLabel = formatUsd(item.unitPrice)

  return (
    <article
      className={cn(
        'flex gap-4 rounded-2xl border border-border/70 bg-card/60 p-3 shadow-sm backdrop-blur-sm transition hover:border-primary/20 hover:bg-card',
        className,
      )}
    >
      {item.imageUrl !== undefined && item.imageUrl.length > 0 ? (
        <img
          src={item.imageUrl}
          alt=""
          className="size-[4.75rem] shrink-0 rounded-xl object-cover"
        />
      ) : (
        <div
          className="flex size-[4.75rem] shrink-0 items-center justify-center rounded-xl bg-muted font-heading text-lg font-bold text-muted-foreground"
          aria-hidden
        >
          {(item.name.at(0) ?? '?').toUpperCase()}
        </div>
      )}
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex flex-wrap items-center gap-2">
          <h4 className="font-heading text-base font-semibold tracking-tight text-heading">
            {item.name}
          </h4>
          {label !== null ? (
            <span
              className={cn(
                'rounded-md px-1.5 py-0.5 font-sans text-[10px] font-semibold uppercase tracking-wider',
                categoryStyles(item.category),
              )}
            >
              {label}
            </span>
          ) : null}
        </div>
        {item.description !== undefined && item.description.length > 0 ? (
          <p className="font-sans text-sm leading-relaxed text-body">
            {item.description}
          </p>
        ) : null}
        <div className="mt-1 flex flex-wrap items-center gap-3 font-sans text-sm">
          <span className="font-semibold text-primary">{priceLabel}</span>
          <span className="flex items-center gap-1 text-muted-foreground">
            <Star className="size-3.5 fill-[var(--accent-warm)] text-[var(--accent-warm)]" />
            {item.avg_rating.toFixed(1)}
          </span>
        </div>
      </div>
    </article>
  )
}
