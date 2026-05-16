/** Bangalore centroid — used when geo is unavailable and for seeded dev data. */
export const FALLBACK_LAT = 12.9716
export const FALLBACK_LNG = 77.5946

export type LatLng = {
  lat: number
  lng: number
}

/**
 * Reads the device's location when permitted; resolves to {@link FALLBACK_LAT}/{@link FALLBACK_LNG}
 * if unsupported, denied, errors, or after `timeoutMs`.
 */
export function getUserLatLngOrFallback(
  timeoutMs: number = 12_000,
): Promise<LatLng> {
  const fallback: LatLng = { lat: FALLBACK_LAT, lng: FALLBACK_LNG }

  if (typeof navigator === 'undefined' || !navigator.geolocation) {
    return Promise.resolve(fallback)
  }

  return new Promise((resolve) => {
    const timer = window.setTimeout(() => resolve(fallback), timeoutMs)

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        window.clearTimeout(timer)
        resolve({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        })
      },
      () => {
        window.clearTimeout(timer)
        resolve(fallback)
      },
      {
        enableHighAccuracy: false,
        maximumAge: 5 * 60 * 1000,
        timeout: timeoutMs,
      },
    )
  })
}
