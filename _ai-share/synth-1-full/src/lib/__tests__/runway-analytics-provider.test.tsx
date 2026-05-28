/**
 * RunwayAnalyticsProvider — загрузка GA4/PostHog SDK по NEXT_PUBLIC_*.
 */
import { render } from '@testing-library/react';

jest.mock('next/script', () => ({
  __esModule: true,
  default: ({ id, src, children }: { id?: string; src?: string; children?: string }) => (
    <div id={id} data-src={src} data-testid="next-script-mock">
      {children}
    </div>
  ),
}));
import {
  RunwayAnalyticsProvider,
  getRunwayAnalyticsSdkConfig,
} from '@/components/providers/RunwayAnalyticsProvider';

describe('RunwayAnalyticsProvider', () => {
  const prevGa4 = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID;
  const prevPh = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const prevHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;

  afterEach(() => {
    process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID = prevGa4;
    process.env.NEXT_PUBLIC_POSTHOG_KEY = prevPh;
    process.env.NEXT_PUBLIC_POSTHOG_HOST = prevHost;
  });

  it('getRunwayAnalyticsSdkConfig returns null ids when env unset', () => {
    delete process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID;
    delete process.env.NEXT_PUBLIC_POSTHOG_KEY;
    expect(getRunwayAnalyticsSdkConfig()).toEqual({
      ga4Id: null,
      posthogKey: null,
      posthogHost: 'https://us.i.posthog.com',
    });
  });

  it('renders nothing without analytics env', () => {
    delete process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID;
    delete process.env.NEXT_PUBLIC_POSTHOG_KEY;
    const { container } = render(<RunwayAnalyticsProvider />);
    expect(container.innerHTML).toBe('');
  });

  it('includes gtag script when GA4 id set', () => {
    process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID = 'G-TEST123';
    delete process.env.NEXT_PUBLIC_POSTHOG_KEY;
    const { container } = render(<RunwayAnalyticsProvider />);
    expect(container.innerHTML).toContain('googletagmanager.com/gtag/js?id=G-TEST123');
    expect(container.innerHTML).toContain('runway-ga4-init');
  });

  it('includes posthog init when key set', () => {
    delete process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID;
    process.env.NEXT_PUBLIC_POSTHOG_KEY = 'phc_test_key';
    process.env.NEXT_PUBLIC_POSTHOG_HOST = 'https://eu.i.posthog.com';
    const { container } = render(<RunwayAnalyticsProvider />);
    expect(container.innerHTML).toContain('runway-posthog-init');
    expect(container.innerHTML).toContain('phc_test_key');
    expect(container.innerHTML).toContain('https://eu.i.posthog.com');
  });
});
