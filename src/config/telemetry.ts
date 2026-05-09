import * as Sentry from "@sentry/react";
import posthog from "posthog-js";

/**
 * Centralised, lazy, no-op-by-default telemetry init.
 *
 * Both Sentry and PostHog are gated on env vars so the app keeps working
 * locally / on PR previews without any tokens. In production, set:
 *
 *   VITE_SENTRY_DSN=https://...@o0.ingest.sentry.io/...
 *   VITE_POSTHOG_KEY=phc_...
 *   VITE_POSTHOG_HOST=https://us.i.posthog.com   (or eu.i.posthog.com)
 *
 * Anything missing is silently skipped; nothing crashes.
 */

let initialised = false;

export function initTelemetry(): void {
    if (initialised) return;
    initialised = true;

    const sentryDsn = import.meta.env.VITE_SENTRY_DSN as string | undefined;
    if (sentryDsn) {
        Sentry.init({
            dsn: sentryDsn,
            environment: import.meta.env.MODE,
            release: import.meta.env.VITE_APP_VERSION as string | undefined,
            // Keep this conservative; bump after we have signal.
            tracesSampleRate: 0.1,
            replaysSessionSampleRate: 0,
            replaysOnErrorSampleRate: 1.0,
            integrations: [
                Sentry.browserTracingIntegration(),
                Sentry.replayIntegration({ maskAllText: false, blockAllMedia: false }),
            ],
        });
    }

    const phKey = import.meta.env.VITE_POSTHOG_KEY as string | undefined;
    const phHost =
        (import.meta.env.VITE_POSTHOG_HOST as string | undefined) ||
        "https://us.i.posthog.com";
    if (phKey) {
        posthog.init(phKey, {
            api_host: phHost,
            capture_pageview: true,
            capture_pageleave: true,
            person_profiles: "identified_only",
            // Don't autocapture every input — privacy + signal-to-noise.
            autocapture: { dom_event_allowlist: ["click", "submit"] },
        });
    }
}

/* ─── Identification helpers ─── */

export function identifyUser(uid: string, props?: Record<string, unknown>): void {
    if (import.meta.env.VITE_POSTHOG_KEY) {
        posthog.identify(uid, props);
    }
    if (import.meta.env.VITE_SENTRY_DSN) {
        Sentry.setUser({ id: uid, ...(props as object) });
    }
}

export function resetUser(): void {
    if (import.meta.env.VITE_POSTHOG_KEY) posthog.reset();
    if (import.meta.env.VITE_SENTRY_DSN) Sentry.setUser(null);
}

/* ─── Manual capture helpers (for ErrorBoundary, async catches) ─── */

export function captureException(
    error: unknown,
    context?: Record<string, unknown>,
): void {
    if (import.meta.env.VITE_SENTRY_DSN) {
        Sentry.captureException(error, { extra: context });
    } else if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.error("[telemetry] captureException", error, context);
    }
}

export function captureEvent(name: string, props?: Record<string, unknown>): void {
    if (import.meta.env.VITE_POSTHOG_KEY) {
        posthog.capture(name, props);
    }
}
