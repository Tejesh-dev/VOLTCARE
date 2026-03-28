import React, { createContext, useContext, useState, useCallback } from 'react';
import { CartItem, Product, Customer, Bill, CustomBillItem } from '@/data/types';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, selectedSize?: string, selectedColor?: string) => void;
  removeFromCart: (productId: string, selectedSize?: string, selectedColor?: string) => void;
  updateQuantity: (productId: string, quantity: number, selectedSize?: string, selectedColor?: string) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
  bills: Bill[];
  generateBill: (customer: Customer, customNote: string, showPrices: boolean, customItems: CustomBillItem[]) => Bill;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const matchItem = (item: CartItem, productId: string, size?: string, color?: string) =>
  item.product.id === productId && item.selectedSize === size && item.selectedColor === color;

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);

  const addToCart = useCallback((product: Product, selectedSize?: string, selectedColor?: string) => {
    const variant = product.variants?.find(v => v.size === selectedSize && v.color === selectedColor);
    const effectiveProduct = variant
      ? { ...product, price: variant.price, stock: variant.stock, sku: variant.sku }
      : product;

    setItems(prev => {
      const existing = prev.find(item => matchItem(item, product.id, selectedSize, selectedColor));
      if (existing) {
        return prev.map(item =>
          matchItem(item, product.id, selectedSize, selectedColor)
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product: effectiveProduct, quantity: 1, selectedSize, selectedColor }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string, selectedSize?: string, selectedColor?: string) => {
    setItems(prev => prev.filter(item => !matchItem(item, productId, selectedSize, selectedColor)));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number, selectedSize?: string, selectedColor?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, selectedSize, selectedColor);
      return;
    }
    setItems(prev =>
      prev.map(item =>
        matchItem(item, productId, selectedSize, selectedColor) ? { ...item, quantity } : item
      )
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => setItems([]), []);

  const getTotal = useCallback(() =>
    items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [items]
  );

  const getItemCount = useCallback(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);

  const generateBill = useCallback((customer: Customer, customNote: string, showPrices: boolean, customItems: CustomBillItem[]): Bill => {
    const subtotal = getTotal();
    const customTotal = customItems.reduce((sum, ci) => sum + ci.price * ci.quantity, 0);
    const bill: Bill = {
      id: `BILL-${Date.now()}`,
      billNumber: `VC-${String(bills.length + 1).padStart(5, '0')}`,
      customer,
      items: [...items],
      customItems: [...customItems],
      subtotal,
      total: subtotal + customTotal,
      showPrices,
      customNote,
      createdAt: new Date().toISOString(),
    };
    setBills(prev => [bill, ...prev]);
    clearCart();
    return bill;
  }, [items, bills.length, getTotal, clearCart]);

  return (
    <CartContext.Provider value={{
      items, addToCart, removeFromCart, updateQuantity, clearCart,
      getTotal, getItemCount, bills, generateBill,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
