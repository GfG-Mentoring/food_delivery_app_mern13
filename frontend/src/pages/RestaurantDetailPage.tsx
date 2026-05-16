import {
  ArrowLeft,
  Clock,
  MapPin,
  Star,
  UtensilsCrossed,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { MenuItemRow } from '../components/MenuItemRow.tsx'
import {
  selectFoodItemsByRestaurantId,
  selectRestaurantById,
  upsertOne,
} from '../features/restaurants/restaurantsSlice.ts'
import { fetchRestaurantById } from '../lib/api.ts'
import { useAppDispatch, useAppSelector } from '../store/hooks.ts'

function priceLevelLabel(level?: 1 | 2 | 3 | 4) {
  if (level === undefined) {
    return null
  }
  return (
    <span className="font-sans text-sm text-muted-foreground">
      {'$'.repeat(level)}
    </span>
  )
}

export function RestaurantDetailPage() {
  const dispatch = useAppDispatch()
  const { restaurantId } = useParams<{ restaurantId: string }>()
  const rid = restaurantId ?? ''
  const restaurant = useAppSelector((s) => selectRestaurantById(s, rid))
  const items = useAppSelector((s) => selectFoodItemsByRestaurantId(s, rid))
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (rid === '' || restaurant !== undefined) {
      return
    }
    let cancelled = false
    setLoading(true)
    void fetchRestaurantById(rid)
      .then((r) => {
        if (cancelled) {
          return
        }
        dispatch(upsertOne(r))
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false)
        }
      })
    return () => {
      cancelled = true
    }
  }, [rid, restaurant, dispatch])

  if (loading && restaurant === undefined) {
    return (
      <main className="mx-auto flex max-w-lg flex-1 flex-col items-center justify-center px-6 py-24">
        <p className="font-sans text-sm text-muted-foreground">
          Loading restaurant…
        </p>
      </main>
    )
  }

  if (restaurant === undefined) {
    return (
      <main className="mx-auto flex max-w-lg flex-1 flex-col items-center justify-center px-6 py-24 text-center">
        <UtensilsCrossed
          className="mb-4 size-12 text-muted-foreground"
          strokeWidth={1.25}
          aria-hidden
        />
        <h1 className="font-heading text-2xl font-semibold text-heading">
          Restaurant not found
        </h1>
        <p className="mt-2 font-sans text-body">
          That link may be outdated. Head back and pick another spot.
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 font-sans text-sm font-semibold text-primary-foreground transition hover:brightness-110"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Back to discovery
        </Link>
      </main>
    )
  }

  const {
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
    <main className="flex flex-1 flex-col pb-16">
      <div className="relative h-[min(22rem,52svh)] w-full overflow-hidden sm:h-[min(26rem,55svh)]">
        {imageUrl !== undefined && imageUrl.length > 0 ? (
          <img
            src={imageUrl}
            alt=""
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full bg-muted" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/55 to-transparent" />
        <div className="absolute left-0 right-0 top-0 z-[1] mx-auto flex max-w-6xl items-start justify-between px-4 pt-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full bg-[var(--header-bg)]/85 px-3 py-2 font-sans text-sm font-medium text-heading shadow-md backdrop-blur-md hover:bg-card"
          >
            <ArrowLeft className="size-4" aria-hidden />
            Back
          </Link>
        </div>
        <div className="absolute bottom-0 left-0 right-0 z-[1] mx-auto max-w-6xl px-4 pb-8 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="font-heading text-3xl font-semibold tracking-tight text-heading sm:text-4xl">
                {name}
              </h1>
              {cuisine !== undefined && cuisine.length > 0 ? (
                <p className="mt-1 font-sans text-lg text-muted-foreground">
                  {cuisine}
                </p>
              ) : null}
              {tagline !== undefined && tagline.length > 0 ? (
                <p className="mt-3 max-w-xl font-sans text-body">{tagline}</p>
              ) : null}
            </div>
            {rating !== undefined ? (
              <div className="flex items-center gap-2 rounded-2xl border border-border/80 bg-card/90 px-4 py-2 shadow-sm backdrop-blur-md">
                <Star
                  className="size-5 fill-[var(--accent-warm)] text-[var(--accent-warm)]"
                  aria-hidden
                />
                <span className="font-heading text-xl font-semibold">
                  {rating.toFixed(1)}
                </span>
              </div>
            ) : null}
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 font-sans text-sm text-muted-foreground">
            {distanceInKm !== undefined ? (
              <span className="flex items-center gap-1.5">
                <MapPin className="size-4 text-primary" aria-hidden />
                {distanceInKm.toFixed(1)} km away
              </span>
            ) : null}
            {deliveryMinutes !== undefined ? (
              <span className="flex items-center gap-1.5">
                <Clock className="size-4 text-primary" aria-hidden />
                ~{deliveryMinutes} min delivery
              </span>
            ) : null}
            {priceLevelLabel(priceLevel)}
          </div>
          {tags.length > 0 ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-secondary px-3 py-1 font-sans text-xs font-medium text-secondary-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      <section className="mx-auto w-full max-w-3xl flex-1 px-4 pt-10 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-baseline justify-between gap-4">
          <h2 className="font-heading text-xl font-semibold text-heading">
            Menu
          </h2>
          <span className="font-sans text-sm text-muted-foreground">
            {items.length} items
          </span>
        </div>
        <ul className="flex flex-col gap-3">
          {items.map((item) => (
            <li key={item.id}>
              <MenuItemRow item={item} />
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}
