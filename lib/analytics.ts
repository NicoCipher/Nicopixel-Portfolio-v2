/**
 * Lightweight conversion-event tracking.
 *
 * Reuses the existing /api/track endpoint + page_views table instead of
 * requiring a new table/migration — events are logged as synthetic paths
 * prefixed with "/_event/", with the originating page passed via `from`.
 * They show up in the same visitor/device/referrer breakdown as regular
 * page views, just filterable by the "/_event/" prefix.
 *
 * Before this, only page views were tracked — there was no way to see
 * whether a contact-page visit ever became an actual lead (form
 * submission or booking). This closes that gap without needing DB access.
 */
export function trackEvent(name: string, from?: string) {
  try {
    const path = `/_event/${name}${from ? `?from=${encodeURIComponent(from)}` : ''}`
    let visitorId = 'unknown'
    try {
      visitorId = localStorage.getItem('np_visitor_id') || 'unknown'
    } catch { /* localStorage unavailable */ }

    // Fire-and-forget, never block the user's action on this.
    const body = JSON.stringify({
      path,
      referrer: document.referrer || null,
      visitor_id: visitorId,
    })

    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/track', new Blob([body], { type: 'application/json' }))
    } else {
      fetch('/api/track', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body, keepalive: true }).catch(() => {})
    }
  } catch { /* tracking should never break the UI */ }
}
