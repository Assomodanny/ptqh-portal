/**
 * Single guarded service-worker registration point.
 * Never registers in dev, inside an iframe, in Lovable preview hosts, or with ?sw=off.
 */
const SW_URL = "/sw.js";

async function unregisterAppServiceWorkers(): Promise<void> {
  if (!("serviceWorker" in navigator)) return;
  const registrations = await navigator.serviceWorker.getRegistrations();
  await Promise.allSettled(
    registrations
      .filter((registration) => (registration.active?.scriptURL ?? "").includes(SW_URL))
      .map((registration) => registration.unregister()),
  );
}

function isBlockedContext(): boolean {
  if (!import.meta.env.PROD) return true;
  if (window.self !== window.top) return true;
  if (new URL(window.location.href).searchParams.get("sw") === "off") return true;

  const host = window.location.hostname;
  if (host.startsWith("id-preview--") || host.startsWith("preview--")) return true;
  const blockedRoots = ["lovableproject.com", "lovableproject-dev.com", "beta.lovable.dev"];
  return blockedRoots.some((root) => host === root || host.endsWith(`.${root}`));
}

export function registerServiceWorker(): void {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

  if (isBlockedContext()) {
    void unregisterAppServiceWorkers();
    return;
  }

  void navigator.serviceWorker.register(SW_URL, { scope: "/" }).catch(() => {
    /* registration failures must never break the app */
  });
}
