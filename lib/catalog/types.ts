export type Category = {
  id: string;
  name: string;
  slug: string;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  priceCents: number;
  currency: string;
  imageUrl: string | null;
  categoryId: string | null;
  externalProductUrl: string | null;
  externalSku: string | null;
  isAvailable: boolean;
  availabilityNote: string | null;
  isActive: boolean;
  category?: Category | null;
};
