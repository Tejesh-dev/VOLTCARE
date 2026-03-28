import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { Minus, Plus, Trash2, ArrowLeft, Receipt, PlusCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Link, useNavigate } from 'react-router-dom';
import { Customer, CustomBillItem } from '@/data/types';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';

const CartPage = () => {
  const { items, updateQuantity, removeFromCart, getTotal, generateBill } = useCart();
  const navigate = useNavigate();
  const [showCheckout, setShowCheckout] = useState(false);
  const [showPrices, setShowPrices] = useState(true);
  const [customNote, setCustomNote] = useState('');
  const [customItems, setCustomItems] = useState<CustomBillItem[]>([]);
  const [customer, setCustomer] = useState<Customer>({
    id: '', name: '', phone: '', email: '', address: '',
  });

  const addCustomItem = () => {
    setCustomItems(prev => [...prev, { id: `ci-${Date.now()}`, description: '', quantity: 1, price: 0 }]);
  };

  const updateCustomItem = (id: string, updates: Partial<CustomBillItem>) => {
    setCustomItems(prev => prev.map(ci => ci.id === id ? { ...ci, ...updates } : ci));
  };

  const removeCustomItem = (id: string) => {
    setCustomItems(prev => prev.filter(ci => ci.id !== id));
  };

  const customTotal = customItems.reduce((sum, ci) => sum + ci.price * ci.quantity, 0);

  const handleGenerateBill = () => {
    if (!customer.name || !customer.phone) {
      toast.error('Please enter customer name and phone');
      return;
    }
    const bill = generateBill(
      { ...customer, id: `CUST-${Date.now()}` },
      customNote,
      showPrices,
      customItems.filter(ci => ci.description.trim()),
    );
    toast.success(`Bill ${bill.billNumber} generated!`);
    navigate(`/bill/${bill.id}`);
  };

  if (items.length === 0 && customItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
        <span className="text-5xl sm:text-6xl mb-4">🧾</span>
        <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground mb-2">No Items Added</h2>
        <p className="text-muted-foreground mb-6 text-sm">Add products to generate a bill</p>
        <Link to="/">
          <Button className="bg-primary text-primary-foreground">Browse Products</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-3 sm:py-4 max-w-3xl">
      <div className="flex items-center gap-3 mb-4 sm:mb-6">
        <Link to="/">
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </Link>
        <h1 className="font-heading text-xl sm:text-2xl font-bold text-foreground">Bill Items ({items.length})</h1>
      </div>

      {/* Items */}
      <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
        {items.map((item, idx) => (
          <div key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}-${idx}`} className="bg-card rounded-xl border border-border p-3 sm:p-4 flex items-center gap-3 sm:gap-4">
            <span className="text-2xl sm:text-3xl shrink-0">
              {item.product.image.startsWith('data:') || item.product.image.startsWith('http') ? (
                <img src={item.product.image} alt="" className="h-8 w-8 sm:h-10 sm:w-10 object-contain" />
              ) : item.product.image}
            </span>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-xs sm:text-sm text-foreground truncate">{item.product.name}</h3>
              {(item.selectedSize || item.selectedColor) && (
                <p className="text-[10px] sm:text-xs text-primary font-medium">{item.selectedSize}{item.selectedColor ? ` · ${item.selectedColor}` : ''}</p>
              )}
              <p className="text-[10px] sm:text-xs text-muted-foreground">{item.product.unit}</p>
              <p className="font-bold text-sm text-foreground mt-0.5">₹{item.product.price * item.quantity}</p>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.selectedSize, item.selectedColor)} className="p-1 sm:p-1.5 rounded-lg bg-secondary hover:bg-muted">
                <Minus className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              </button>
              <span className="w-6 sm:w-8 text-center font-bold text-xs sm:text-sm">{item.quantity}</span>
              <button onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.selectedSize, item.selectedColor)} className="p-1 sm:p-1.5 rounded-lg bg-secondary hover:bg-muted">
                <Plus className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              </button>
              <button onClick={() => removeFromCart(item.product.id, item.selectedSize, item.selectedColor)} className="p-1 sm:p-1.5 ml-1 rounded-lg hover:bg-destructive/10 text-destructive">
                <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Custom Items */}
      {customItems.length > 0 && (
        <div className="mb-4 sm:mb-6">
          <h3 className="font-heading font-bold text-foreground mb-2 text-sm sm:text-base">Custom Items</h3>
          <div className="space-y-2">
            {customItems.map(ci => (
              <div key={ci.id} className="bg-card rounded-xl border border-border p-3 flex items-center gap-2">
                <Input
                  value={ci.description}
                  onChange={e => updateCustomItem(ci.id, { description: e.target.value })}
                  placeholder="Item description"
                  className="flex-1 text-xs sm:text-sm h-8 sm:h-9"
                />
                <Input
                  type="number"
                  value={ci.quantity || ''}
                  onChange={e => updateCustomItem(ci.id, { quantity: Number(e.target.value) })}
                  placeholder="Qty"
                  className="w-14 sm:w-16 text-xs sm:text-sm h-8 sm:h-9"
                />
                <Input
                  type="number"
                  value={ci.price || ''}
                  onChange={e => updateCustomItem(ci.id, { price: Number(e.target.value) })}
                  placeholder="₹"
                  className="w-20 sm:w-24 text-xs sm:text-sm h-8 sm:h-9"
                />
                <button onClick={() => removeCustomItem(ci.id)} className="p-1 text-destructive hover:bg-destructive/10 rounded">
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <Button variant="outline" onClick={addCustomItem} className="w-full mb-4 sm:mb-6 text-xs sm:text-sm h-9 sm:h-10">
        <PlusCircle className="mr-2 h-4 w-4" /> Add Custom Item (not in inventory)
      </Button>

      {/* Bill Summary */}
      <div className="bg-card rounded-xl border border-border p-3 sm:p-4 mb-4">
        <h3 className="font-heading font-bold text-foreground mb-3 text-sm sm:text-base">Bill Summary</h3>
        <div className="space-y-2 text-xs sm:text-sm">
          <div className="flex justify-between"><span className="text-muted-foreground">Products Total</span><span className="text-foreground">₹{getTotal().toFixed(2)}</span></div>
          {customTotal > 0 && <div className="flex justify-between"><span className="text-muted-foreground">Custom Items</span><span className="text-foreground">₹{customTotal.toFixed(2)}</span></div>}
          <div className="border-t border-border pt-2 flex justify-between font-bold text-sm sm:text-base">
            <span>Total</span><span>₹{(getTotal() + customTotal).toFixed(2)}</span>
          </div>
        </div>
      </div>

      {!showCheckout ? (
        <Button onClick={() => setShowCheckout(true)} className="w-full h-10 sm:h-12 text-sm sm:text-base font-bold bg-primary text-primary-foreground">
          <Receipt className="mr-2 h-4 w-4 sm:h-5 sm:w-5" /> Generate Bill
        </Button>
      ) : (
        <div className="bg-card rounded-xl border border-border p-3 sm:p-4 space-y-3 sm:space-y-4 animate-fade-in">
          <h3 className="font-heading font-bold text-foreground text-sm sm:text-base">Customer Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
            <div>
              <Label className="text-foreground text-xs sm:text-sm">Name *</Label>
              <Input value={customer.name} onChange={e => setCustomer(p => ({ ...p, name: e.target.value }))} placeholder="Customer name" className="text-sm" />
            </div>
            <div>
              <Label className="text-foreground text-xs sm:text-sm">Phone *</Label>
              <Input value={customer.phone} onChange={e => setCustomer(p => ({ ...p, phone: e.target.value }))} placeholder="Phone number" className="text-sm" />
            </div>
            <div className="sm:col-span-2">
              <Label className="text-foreground text-xs sm:text-sm">Address</Label>
              <Input value={customer.address || ''} onChange={e => setCustomer(p => ({ ...p, address: e.target.value }))} placeholder="Address (optional)" className="text-sm" />
            </div>
          </div>

          {/* Custom Note */}
          <div>
            <Label className="text-foreground text-xs sm:text-sm">Custom Note (will appear on bill)</Label>
            <Textarea
              value={customNote}
              onChange={e => setCustomNote(e.target.value)}
              placeholder="Add any custom notes, terms, or extra items for the customer..."
              className="text-sm min-h-[60px] sm:min-h-[80px]"
            />
          </div>

          {/* Show/Hide Prices Toggle */}
          <div className="flex items-center justify-between bg-secondary rounded-lg px-3 py-2 sm:px-4 sm:py-3">
            <Label className="text-foreground text-xs sm:text-sm font-medium">Show prices on bill</Label>
            <Switch checked={showPrices} onCheckedChange={setShowPrices} />
          </div>

          <Button onClick={handleGenerateBill} className="w-full h-10 sm:h-12 text-sm sm:text-base font-bold bg-primary text-primary-foreground">
            Generate Bill
          </Button>
        </div>
      )}
    </div>
  );
};

export default CartPage;
