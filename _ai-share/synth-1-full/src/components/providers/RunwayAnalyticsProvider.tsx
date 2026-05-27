'use client';

import Script from 'next/script';

/** Публичные идентификаторы runway analytics SDK (build-time NEXT_PUBLIC_*). */
export function getRunwayAnalyticsSdkConfig(): {
  ga4Id: string | null;
  posthogKey: string | null;
  posthogHost: string;
} {
  const ga4Id = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID?.trim() || null;
  const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY?.trim() || null;
  const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST?.trim() || 'https://us.i.posthog.com';
  return { ga4Id, posthogKey, posthogHost };
}

/**
 * Загружает gtag (GA4) и PostHog loader, чтобы mirrorScrollAnalyticsToAdapters
 * мог вызывать window.gtag / window.posthog.capture на scroll-событиях.
 */
export function RunwayAnalyticsProvider() {
  const { ga4Id, posthogKey, posthogHost } = getRunwayAnalyticsSdkConfig();

  if (!ga4Id && !posthogKey) {
    return null;
  }

  return (
    <>
      {ga4Id ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${ga4Id}`}
            strategy="afterInteractive"
          />
          <Script id="runway-ga4-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              window.gtag = gtag;
              gtag('js', new Date());
              gtag('config', '${ga4Id}', { send_page_view: true });
            `}
          </Script>
        </>
      ) : null}
      {posthogKey ? (
        <Script id="runway-posthog-init" strategy="afterInteractive">
          {`
            !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="init capture register register_once register_for_session unregister unregister_for_session getFeatureFlag getFeatureFlagPayload isFeatureEnabled reloadFeatureFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSurveysLoaded onSessionId getSurveys getActiveMatchingSurveys renderSurvey canRenderSurvey getNextSurveyStep identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException loadToolbar get_property getSessionProperty createPersonProfile opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing clear_opt_in_out_capturing debug".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
            posthog.init('${posthogKey}', { api_host: '${posthogHost}', person_profiles: 'identified_only' });
          `}
        </Script>
      ) : null}
    </>
  );
}
