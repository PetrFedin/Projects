import {
  defaultHubViews,
  hubViewsToSearchParams,
  parseHubViewsFromUrl,
  toggleHubView,
} from '@/lib/platform-core-hub-view';

describe('platform-core-hub-view', () => {
  it('default is product only', () => {
    expect(defaultHubViews()).toEqual({ business: true, audit: false, planner: false });
  });

  it('toggle adds and removes panels', () => {
    let views = defaultHubViews();
    views = toggleHubView(views, 'audit');
    expect(views).toEqual({ business: true, audit: true, planner: false });
    views = toggleHubView(views, 'business');
    expect(views).toEqual({ business: false, audit: true, planner: false });
  });

  it('cannot turn off the last active panel', () => {
    const views = { business: false, audit: true, planner: false };
    expect(toggleHubView(views, 'audit')).toEqual({ business: false, audit: true, planner: false });
  });

  it('parses views= comma list', () => {
    const params = new URLSearchParams('views=business,planner');
    expect(parseHubViewsFromUrl(params)).toEqual({
      business: true,
      audit: false,
      planner: true,
    });
  });

  it('legacy view= single panel', () => {
    expect(parseHubViewsFromUrl(new URLSearchParams('view=audit'))).toEqual({
      business: false,
      audit: true,
      planner: false,
    });
  });

  it('serializes active views to search params', () => {
    const params = hubViewsToSearchParams({ business: true, audit: true, planner: false });
    expect(params.get('views')).toBe('business,audit');
  });
});
