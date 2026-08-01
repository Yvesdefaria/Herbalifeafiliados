export type FulfillmentOrderItem = {
  productId: string;
  name: string;
  quantity: number;
  unitPriceCents: number;
  externalProductUrl: string;
  externalSku?: string | null;
};

export type FulfillmentOrder = {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string | null;
  shippingAddress?: string | null;
  currency: "EUR";
  totalCents: number;
  items: FulfillmentOrderItem[];
  notes?: string | null;
};

export type FulfillmentResult = {
  ok: boolean;
  provider: string;
  message?: string;
  externalReference?: string;
};

export interface FulfillmentProvider {
  readonly name: string;
  submitOrder(order: FulfillmentOrder): Promise<FulfillmentResult>;
}
