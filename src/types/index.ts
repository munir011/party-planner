export interface Tenant {
  id: string;
  slug: string;
  name: string;
  logoUrl: string;
  theme: {
    primary: string;
    background: string;
    text: string;
  };
}

export interface InventoryItem {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  images: string[];
  qtyAvailable: number;
  pricePerDay: number;
  deposit?: {
    type: 'flat' | 'percent';
    value: number;
  };
}

export interface Reservation {
  id: string;
  itemId: string;
  qty: number;
  startDate: string;
  endDate: string;
  status: 'confirmed' | 'canceled';
}

export interface CartItem {
  id: string;
  itemId: string;
  name: string;
  qty: number;
  startDate: string;
  endDate: string;
  unitPrice: number;
  image: string;
}

export interface Customer {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface Order {
  id: string;
  number: string;
  customer: Customer;
  lineItems: Array<{
    itemId: string;
    name: string;
    qty: number;
    startDate: string;
    endDate: string;
    unitPrice: number;
  }>;
  totals: {
    subtotal: number;
    depositEstimate: number;
    tax: number;
    total: number;
  };
  status: 'confirmed';
  createdAt: string;
}

export interface Settings {
  cancellationPolicy: string;
  taxRate: number;
  deliveryEnabled: boolean;
  pickupEnabled: boolean;
  buffers: {
    preDays: number;
    postDays: number;
  };
}

export interface AvailabilityCheck {
  available: boolean;
  availableQty: number;
  disabledDates: string[];
}