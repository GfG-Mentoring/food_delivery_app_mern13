import { ArrowRight, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'

import { RestaurantCard } from '../components/RestaurantCard.tsx'
import { buttonVariants } from '../components/ui/button-variants.ts'
import { selectAllRestaurants } from '../features/restaurants/restaurantsSlice.ts'
import { cn } from '../lib/utils.ts'
import { useAppSelector } from '../store/hooks.ts'

export function LandingPage() {
  const restaurants = useAppSelector(selectAllRestaurants)

  return (
    <main className="flex flex-1 flex-col">
      <section className="relative overflow-hidden border-b border-border/60 bg-[var(--hero-bg)]">
        <div
          className="pointer-events-none absolute -left-32 top-1/2 size-[28rem] -translate-y-1/2 rounded-full bg-[var(--hero-bloom)] blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -right-24 top-0 size-[22rem] rounded-full bg-[var(--hero-bloom-2)] blur-3xl"
          aria-hidden
        />
        <div className="grain-overlay pointer-events-none absolute inset-0 opacity-[0.22] dark:opacity-[0.12]" />

        <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-12 lg:py-20 lg:pl-8 lg:pr-10">
          <div className="space-y-7">
            <p className="animate-rise inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.22em] text-primary [animation-delay:40ms]">
              <Sparkles className="size-3.5" aria-hidden />
              Tonight’s craving, sorted
            </p>
            <h1 className="animate-rise max-w-xl font-heading text-4xl font-semibold leading-[1.08] tracking-tight text-heading [animation-delay:120ms] sm:text-5xl lg:text-[3.35rem]">
              Food from kitchens that actually have a point of view.
            </h1>
            <p className="animate-rise max-w-lg font-sans text-lg leading-relaxed text-body [animation-delay:200ms]">
              Browse hand-picked spots near you. Clear ETAs, honest ratings,
              and menus that read like someone cared.
            </p>
            <div className="animate-rise flex flex-wrap items-center gap-3 [animation-delay:280ms]">
              <a
                href="#near-you"
                className={cn(
                  buttonVariants({ size: 'lg' }),
                  'inline-flex items-center gap-2 no-underline',
                )}
              >
                Explore nearby
                <ArrowRight className="size-4" aria-hidden />
              </a>
              <Link
                to="/sign-up"
                className="rounded-xl px-4 py-3 font-sans text-sm font-semibold text-muted-foreground underline-offset-4 transition hover:bg-muted hover:text-foreground hover:no-underline"
              >
                Create an account
              </Link>
            </div>
          </div>

          <div className="animate-rise relative hidden lg:block [animation-delay:360ms]">
            <div className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-primary/25 via-transparent to-transparent blur-2xl" />
            <div className="relative overflow-hidden rounded-[1.75rem] border border-border/60 bg-card shadow-[0_40px_90px_-40px_oklch(0.35_0.1_40_/_0.5)]">
              <img
                src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80"
                alt=""
                className="aspect-[4/5] w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.2_0.05_50_/_0.75)] via-transparent to-transparent" />
              <p className="absolute bottom-5 left-5 right-5 font-heading text-xl font-semibold text-white drop-shadow-md">
                The spread is better shared.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        id="near-you"
        className="mx-auto w-full max-w-6xl flex-1 px-4 py-14 sm:px-6 lg:px-8"
      >
        <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-heading text-2xl font-semibold tracking-tight text-heading sm:text-3xl">
              Near you
            </h2>
            <p className="mt-1 max-w-lg font-sans text-body">
              Three standouts to start — tap through for the full menu.
            </p>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {restaurants.map((r, i) => (
            <RestaurantCard
              key={r.id}
              restaurant={r}
              style={{ animationDelay: `${80 + i * 90}ms` }}
            />
          ))}
        </div>
      </section>
    </main>
  )
}
