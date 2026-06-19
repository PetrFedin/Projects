import { workshop2DevBypassAuthEnabled } from '@/lib/server/workshop2-dev-env';

export function shouldRequireShopB2bCheckoutJwt(): boolean {
  const flag = process.env.WORKSHOP2_B2B_CHECKOUT_REQUIRE_JWT?.trim();
  if (flag === '0' || flag === 'false') return false;
  if (workshop2DevBypassAuthEnabled()) return false;
  if (flag === '1' || flag === 'true') return true;
  return process.env.NODE_ENV === 'production';
}
