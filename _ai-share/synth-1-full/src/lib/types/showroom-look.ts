/** Данные образа шоурума для диалога деталей на главной. */
export interface ShowroomLookDetails {
  type: string;
  author: string;
  title: string;
  price: number;
  originalPrice: number;
  items: number;
  bonus: number;
  imageUrl: string;
  gallery?: string[];
  products?: Array<{
    id: string;
    name: string;
    brand: string;
    image: string;
    price: number;
  }>;
}
