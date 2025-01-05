interface OrderCountResult {
  status: string;
  count: number;
}

interface OrderCreatedByResult {
  createdById: number;
  order: number;
  count: number;
  totalValue: number;
  'createdBy.id': number;
  'createdBy.username': string;
  'createdBy.fullName': string;
}

interface OrderProcessByResult {
  processById: number;
  order: number;
  count: number;
  totalValue: number;
  'processBy.id': number;
  'processBy.username': string;
  'processBy.fullName': string;
}

interface ProductRatioResult {
  productId: number;
  count: number;
  'product.id': number;
  'product.name': string;
}