import { Product } from '../types';
import { CartItem } from '../types';

/**
 * Matrix Order Utilities
 * Обработка данных для оптового заказа (сетка Размеры x Цвета)
 */

export interface MatrixCell {
  size: string;
  color: string;
  quantity: number;
}

export interface MatrixTotals {
  totalUnits: number;
  totalAmount: number;
  bySize: Record<string, number>;
  byColor: Record<string, number>;
}

/**
 * Рассчитывает итоги по матрице ввода
 */
export function calculateMatrixTotals(cells: MatrixCell[], price: number): MatrixTotals {
  const totals: MatrixTotals = {
    totalUnits: 0,
    totalAmount: 0,
    bySize: {},
    byColor: {},
  };

  cells.forEach(cell => {
    if (cell.quantity <= 0) return;

    totals.totalUnits += cell.quantity;
    totals.totalAmount += cell.quantity * price;

    totals.bySize[cell.size] = (totals.bySize[cell.size] || 0) + cell.quantity;
    totals.byColor[cell.color] = (totals.byColor[cell.color] || 0) + cell.quantity;
  });

  return totals;
}

/**
 * Преобразует ячейки матрицы в формат элементов корзины
 */
export function convertMatrixToCartItems(
  product: Product, 
  cells: MatrixCell[], 
  deliveryDate: string = "Immediate"
): CartItem[] {
  return cells
    .filter(cell => cell.quantity > 0)
    .map(cell => ({
      ...product,
      quantity: cell.quantity,
      selectedSize: cell.size,
      deliveryDate,
      // Добавляем инфо о цвете, если продукт поддерживает вариации
      selectedColor: cell.color 
    }));
}
