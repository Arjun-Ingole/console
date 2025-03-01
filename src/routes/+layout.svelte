<script lang="ts">
    import { afterNavigate, goto } from '$app/navigation';
    import { page } from '$app/stores';
    import { user } from '$lib/stores/user';
    import { onCLS, onFID, onLCP, onFCP, onINP, onTTFB } from 'web-vitals';
    import { reportWebVitals } from '$lib/helpers/vitals';
    import { onMount } from 'svelte';
    import { base } from '$app/paths';
    import { browser, dev } from '$app/environment';
    import { app } from '$lib/stores/app';
    import { Progress, Notifications } from '$lib/layout';
    import { loading } from './store';
    import Loading from './loading.svelte';
    import { trackPageView } from '$lib/actions/analytics';
    import * as Sentry from '@sentry/svelte';
    import { BrowserTracing } from '@sentry/tracing';

    if (browser) {
        window.VERCEL_ANALYTICS_ID = import.meta.env.VERCEL_ANALYTICS_ID?.toString() ?? false;
    }

    onMount(async () => {
        /**
         * Reporting Web Vitals.
         */
        if (!dev && window.VERCEL_ANALYTICS_ID) {
            onCLS(reportWebVitals);
            onFID(reportWebVitals);
            onLCP(reportWebVitals);
            onFCP(reportWebVitals);
            onINP(reportWebVitals);
            onTTFB(reportWebVitals);
        }

        /**
         * Sentry Error Logging
         */
        if (!dev) {
            Sentry.init({
                dsn: 'https://c7ce178bdedd486480317b72f282fd39@o1063647.ingest.sentry.io/4504158071422976',
                integrations: [new BrowserTracing()],
                tracesSampleRate: 1.0
            });
        }

        /**
         * Handle initial load.
         */
        if (!$page.url.pathname.startsWith('/auth')) {
            const acceptedRoutes = ['/login', '/register', '/recover', '/invite'];
            if ($user) {
                if (!$page.url.pathname.startsWith('/console')) {
                    await goto(`${base}/console`, {
                        replaceState: true
                    });
                }
            } else {
                if (acceptedRoutes.includes($page.url.pathname)) {
                    await goto(`${base}${$page.url.pathname}${$page.url.search}`);
                } else {
                    await goto(`${base}/login`, {
                        replaceState: true
                    });
                }
                loading.set(false);
            }
        }
    });

    afterNavigate((navigation) => {
        trackPageView(navigation.to.routeId);
    });

    $: {
        if (browser) {
            if ($app.theme === 'auto') {
                const darkThemeMq = window.matchMedia('(prefers-color-scheme: dark)');
                if (darkThemeMq.matches) {
                    document.body.setAttribute('class', `theme-dark`);
                    $app.themeInUse = 'dark';
                } else {
                    document.body.setAttribute('class', `theme-light`);
                    $app.themeInUse = 'light';
                }
            } else {
                document.body.setAttribute('class', `theme-${$app.theme}`);
                $app.themeInUse = $app.theme;
            }
        }
    }
</script>

<Notifications />

<slot />

{#if $loading}
    <Loading />
{/if}

<Progress />

<style lang="scss" global>
    .tippy-box {
        --p-tooltip-text-color: var(--color-neutral-10);
        --p-tooltip--bg-color: var(--color-neutral-100);

        background-color: hsl(var(--p-tooltip--bg-color));
        color: hsl(var(--p-tooltip-text-color));
        font-size: var(--font-size-0);
        line-height: 1.5;

        &[data-placement^='top'] > .tippy-arrow::before {
            border-top-color: hsl(var(--p-tooltip--bg-color));
        }
        &[data-placement^='bottom'] > .tippy-arrow::before {
            border-bottom-color: hsl(var(--p-tooltip--bg-color));
        }
        &[data-placement^='left'] > .tippy-arrow::before {
            border-left-color: hsl(var(--p-tooltip--bg-color));
        }
        &[data-placement^='right'] > .tippy-arrow::before {
            border-right-color: hsl(var(--p-tooltip--bg-color));
        }
    }
</style>
