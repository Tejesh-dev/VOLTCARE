import React, { createContext, useContext, useState, useCallback } from 'react';
import { Product, Category, Subcategory, Contact } from '@/data/types';
import { products as initialProducts, categories as initialCategories } from '@/data/products';

interface AdminContextType {
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  categories: Category[];
  addCategory: (cat: Category) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  addSubcategory: (categoryId: string, sub: Subcategory) => void;
  deleteSubcategory: (categoryId: string, subId: string) => void;
  contacts: Contact[];
  addContact: (contact: Contact) => void;
  updateContact: (id: string, updates: Partial<Contact>) => void;
  deleteContact: (id: string) => void;
  isAdmin: boolean;
  login: (password: string) => boolean;
  logout: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);

  const addProduct = useCallback((product: Product) => {
    setProducts(prev => [...prev, product]);
  }, []);
  const updateProduct = useCallback((id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  }, []);
  const deleteProduct = useCallback((id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  }, []);

  const addCategory = useCallback((cat: Category) => {
    setCategories(prev => [...prev, cat]);
  }, []);
  const updateCategory = useCallback((id: string, updates: Partial<Category>) => {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  }, []);
  const deleteCategory = useCallback((id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
    setProducts(prev => prev.filter(p => p.category !== id));
  }, []);
  const addSubcategory = useCallback((categoryId: string, sub: Subcategory) => {
    setCategories(prev => prev.map(c =>
      c.id === categoryId ? { ...c, subcategories: [...c.subcategories, sub] } : c
    ));
  }, []);
  const deleteSubcategory = useCallback((categoryId: string, subId: string) => {
    setCategories(prev => prev.map(c =>
      c.id === categoryId ? { ...c, subcategories: c.subcategories.filter(s => s.id !== subId) } : c
    ));
  }, []);

  const addContact = useCallback((contact: Contact) => {
    setContacts(prev => [...prev, contact]);
  }, []);
  const updateContact = useCallback((id: string, updates: Partial<Contact>) => {
    setContacts(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  }, []);
  const deleteContact = useCallback((id: string) => {
    setContacts(prev => prev.filter(c => c.id !== id));
  }, []);

  const login = useCallback((password: string) => {
    if (password === 'voltcare2024') {
      setIsAdmin(true);
      return true;
    }
    return false;
  }, []);
  const logout = useCallback(() => setIsAdmin(false), []);

  return (
    <AdminContext.Provider value={{
      products, addProduct, updateProduct, deleteProduct,
      categories, addCategory, updateCategory, deleteCategory, addSubcategory, deleteSubcategory,
      contacts, addContact, updateContact, deleteContact,
      isAdmin, login, logout,
    }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider');
  return ctx;
};
