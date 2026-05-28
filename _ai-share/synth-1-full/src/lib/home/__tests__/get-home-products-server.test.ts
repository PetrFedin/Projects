import fs from 'node:fs';
import path from 'node:path';
import { getHomeProductsServerBaseline } from '@/lib/home/get-home-products-server';

jest.mock('node:fs', () => ({
  readFileSync: jest.fn(),
}));

describe('getHomeProductsServerBaseline', () => {
  const readFileSync = fs.readFileSync as jest.MockedFunction<typeof fs.readFileSync>;

  beforeEach(() => {
    readFileSync.mockReset();
  });

  it('reads public/data/products.json as Product[]', () => {
    readFileSync.mockReturnValue('[{"id":"p1","slug":"coat"}]');
    const products = getHomeProductsServerBaseline();
    expect(products).toEqual([{ id: 'p1', slug: 'coat' }]);
    expect(readFileSync).toHaveBeenCalledWith(
      path.join(process.cwd(), 'public/data/products.json'),
      'utf8'
    );
  });

  it('returns [] on missing file or invalid JSON shape', () => {
    readFileSync.mockImplementation(() => {
      throw new Error('ENOENT');
    });
    expect(getHomeProductsServerBaseline()).toEqual([]);

    readFileSync.mockReturnValue('{"not":"array"}');
    expect(getHomeProductsServerBaseline()).toEqual([]);
  });
});
