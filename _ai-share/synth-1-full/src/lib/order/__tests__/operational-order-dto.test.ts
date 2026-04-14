import { mockB2BOrders } from '@/lib/order-data';
import {
  operationalOrderListRowDtoToB2BOrder,
  toOperationalOrderListRowDto,
} from '@/lib/order/operational-order-dto';
import { operationalOrdersV1ListSuccessSchema } from '@/lib/order/operational-order-dto.schema';

describe('operational order DTO', () => {
  it('roundtrips list row through wholesaleOrderId', () => {
    const src = mockB2BOrders[0];
    const dto = toOperationalOrderListRowDto(src);
    expect(dto.wholesaleOrderId).toBe(src.order);
    const back = operationalOrderListRowDtoToB2BOrder(dto);
    expect(back.order).toBe(src.order);
    expect(back.paymentStatus).toBe(src.paymentStatus);
  });

  it('accepts v1 list envelope shape', () => {
    const orders = mockB2BOrders.slice(0, 2).map(toOperationalOrderListRowDto);
    const parsed = operationalOrdersV1ListSuccessSchema.safeParse({
      ok: true,
      data: { orders },
      meta: { requestId: 'r', mode: 'demo', apiVersion: 'v1' },
    });
    expect(parsed.success).toBe(true);
  });
});
