import { Audience, Product } from "./products.mock";

export type WardrobeItem = {
  id: string;
  title: string;
  brand: string;
  category: Product["category"];
  color: string;
  image: string;
  tags: string[];
};

export const MOCK_WARDROBE: WardrobeItem[] = [
  {
    id: "w1",
    title: "Vintage Denim Jacket",
    brand: "Syntha Archive",
    category: "Outerwear",
    color: "Blue",
    image: "https://images.unsplash.com/photo-1576905341939-402d242748d1?q=80&w=400&h=400&fit=crop",
    tags: ["denim", "vintage", "casual"]
  },
  {
    id: "w2",
    title: "White Cotton Shirt",
    brand: "Syntha Basics",
    category: "Tops",
    color: "White",
    image: "https://images.unsplash.com/photo-1598033129183-c4f50c717658?q=80&w=400&h=400&fit=crop",
    tags: ["minimal", "basic", "cotton"]
  },
  {
    id: "w3",
    title: "Black Slim Trousers",
    brand: "Syntha Studio",
    category: "Bottoms",
    color: "Black",
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=400&h=400&fit=crop",
    tags: ["formal", "slim-fit", "essential"]
  }
];
