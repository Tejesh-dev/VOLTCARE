export interface ProductVariant {
  size?: string;
  color?: string;
  label: string;
  price: number;
  stock: number;
  sku: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  price: number;
  unit: string;
  stock: number;
  image: string; // emoji or base64/data URL
  description: string;
  brand?: string;
  sku: string;
  variants?: ProductVariant[];
  availableSizes?: string[];
  availableColors?: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  subcategories: Subcategory[];
}

export interface Subcategory {
  id: string;
  name: string;
  categoryId: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  notes?: string;
  whatsapp?: string;
  createdAt?: string;
}

export interface Bill {
  id: string;
  billNumber: string;
  customer: Customer;
  items: CartItem[];
  customItems: CustomBillItem[];
  subtotal: number;
  total: number;
  showPrices: boolean;
  customNote: string;
  createdAt: string;
}

export interface CustomBillItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
}

export interface Contact {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  source: string; // e.g. 'Google Maps', 'Walk-in', 'Referral'
  notes?: string;
  whatsapp?: string;
  createdAt: string;
}
