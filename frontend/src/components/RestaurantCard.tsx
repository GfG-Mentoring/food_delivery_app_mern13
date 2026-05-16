import { Clock, MapPin, Star } from 'lucide-react'
import { Link } from 'react-router-dom'

import type { Restaurant } from '../features/restaurants/types.ts'
import { cn } from '../lib/utils.ts'

type RestaurantCardProps = {
  restaurant: Restaurant
  className?: string
  style?: { animationDelay?: string }
}

function priceDots(level?: 1 | 2 | 3 | 4) {
  if (level === undefined) {
    return null
  }
  return (
    <span className="text-muted-foreground" aria-label={`Price level ${level} of 4`}>
      {'$'.repeat(level)}
    </span>
  )
}

export function RestaurantCard({
  restaurant,
  className,
  style,
}: RestaurantCardProps) {
  const {
    id,
    name,
    cuisine,
    rating,
    distanceInKm,
    deliveryMinutes,
    priceLevel,
    imageUrl,
    tags,
    tagline,
  } = restaurant

  return (
    <Link
      to={`/r/${id}`}
      className={cn(
        'group animate-rise relative flex flex-col overflow-hidden rounded-[1.35rem] border border-border/80 bg-card shadow-[0_22px_50px_-26px_oklch(0.25_0.06_55_/_0.45)] transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-[0_28px_60px_-24px_oklch(0.4_0.12_35_/_0.35)] dark:shadow-[0_22px_50px_-26px_oklch(0.08_0.02_55_/_0.8)]',
        className,
      )}
      style={style}
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        {imageUrl !== undefined && imageUrl.length > 0 ? (
          <img
            src={imageUrl}
            alt=""
            className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
            No photo
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[oklch(0.2_0.04_55_/_0.85)] via-transparent to-transparent dark:from-[oklch(0.12_0.03_55_/_0.9)]" />
        <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center gap-2">
          {tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-[var(--tag-bg)] px-2.5 py-0.5 font-sans text-xs font-medium text-[var(--tag-fg)] backdrop-blur-md"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4 pt-3.5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-heading text-lg font-semibold leading-snug tracking-tight text-heading group-hover:text-primary">
              {name}
            </h3>
            {cuisine !== undefined && cuisine.length > 0 ? (
              <p className="mt-0.5 font-sans text-sm text-muted-foreground">
                {cuisine}
              </p>
            ) : null}
            {tagline !== undefined && tagline.length > 0 ? (
              <p className="mt-1 line-clamp-2 font-sans text-sm leading-relaxed text-body">
                {tagline}
              </p>
            ) : null}
          </div>
          {rating !== undefined ? (
            <span className="flex shrink-0 items-center gap-1 rounded-lg bg-secondary/90 px-2 py-1 font-sans text-sm font-semibold text-secondary-foreground">
              <Star
                className="size-3.5 fill-[var(--accent-warm)] text-[var(--accent-warm)]"
                aria-hidden
              />
              {rating.toFixed(1)}
            </span>
          ) : null}
        </div>
        <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-border/60 pt-3 font-sans text-xs text-muted-foreground">
          {distanceInKm !== undefined ? (
            <span className="flex items-center gap-1">
              <MapPin className="size-3.5 text-primary" aria-hidden />
              {distanceInKm.toFixed(1)} km
            </span>
          ) : null}
          {deliveryMinutes !== undefined ? (
            <span className="flex items-center gap-1">
              <Clock className="size-3.5 text-primary" aria-hidden />
              ~{deliveryMinutes} min
            </span>
          ) : null}
          {priceDots(priceLevel)}
        </div>
      </div>
    </Link>
  )
}
