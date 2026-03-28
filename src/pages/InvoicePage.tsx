import { useParams, Link } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { ArrowLeft, Printer, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const InvoicePage = () => {
  const { billId } = useParams();
  const { bills } = useCart();
  const bill = bills.find(b => b.id === billId);

  if (!bill) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <p className="text-muted-foreground mb-4 font-medium">Invoice not found</p>
        <Link to="/"><Button variant="outline">Back to Home</Button></Link>
      </div>
    );
  }

  const handlePrint = () => window.print();

  const handleWhatsAppShare = () => {
    const message = `*VoltCare Electrical Solutions*%0A%0AHi ${bill.customer.name}, here is your bill (No: ${bill.billNumber}).%0ATotal: ₹${bill.total.toFixed(2)}%0A%0AView online: ${window.location.href}`;
    window.open(`https://wa.me/91${bill.customer.phone}?text=${message}`, '_blank');
  };

  return (
    <div className="container py-6 sm:py-10 max-w-3xl">
      {/* Navigation - Hidden on Print */}
      <div className="flex items-center justify-between mb-8 print:hidden">
        <Link to="/dashboard" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm font-medium">Dashboard</span>
        </Link>
        <div className="flex gap-3">
          <Button onClick={handleWhatsAppShare} variant="outline" size="sm" className="border-green-200 text-green-700 hover:bg-green-50">
            <Share2 className="mr-2 h-4 w-4" /> Share
          </Button>
          <Button onClick={handlePrint} size="sm" className="bg-slate-900">
            <Printer className="mr-2 h-4 w-4" /> Print Invoice
          </Button>
        </div>
      </div>

      {/* Invoice Card */}
      <div className="bg-white p-8 sm:p-12 shadow-sm border border-slate-100 print:border-0 print:shadow-none text-slate-900 font-sans">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between border-b pb-8 mb-8 border-slate-100">
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-1">
              <span className="text-[#e11d48]">V </span>O L T <span className="text-[#fbbf24]">C </span>A R <span className="text-[#2563eb]">E</span>
            </h2>
            <p className="text-xs font-bold text-black uppercase tracking-[0.2em]">
                  &emsp;Electrical Solutions
            </p>
          </div>
          <div className="mt-6 sm:mt-0 text-left sm:text-right">
            <h3 className="text-sm font-bold text-black">Founder: Tejesh Bhagat</h3>
            {/* Contact numbers now in solid Black */}
            <p className="text-xs text-black font-bold mt-1">+91 9970174508 / 8459718594</p>
            {/* Website is now a clickable link */}
            <a 
              href="https://voltcare-solutions-s81x.bolt.host/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs text-blue-600 hover:underline mt-0.5 block transition-all"
            >
              voltcare-solutions.bolt.host
            </a>
          </div>
        </div>

        {/* Client & Invoice Meta */}
        <div className="grid grid-cols-2 gap-12 mb-12">
          <div>
            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-widest block mb-3">Bill To</span>
            <p className="text-base font-bold text-slate-900">{bill.customer.name}</p>
            <p className="text-sm text-slate-500 mt-1">{bill.customer.phone}</p>
            {bill.customer.address && <p className="text-sm text-slate-500 leading-relaxed mt-1">{bill.customer.address}</p>}
          </div>
          <div className="text-right">
            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-widest block mb-3">Invoice Details</span>
            <p className="text-sm text-slate-600">No: <span className="font-bold text-slate-900">{bill.billNumber}</span></p>
            <p className="text-sm text-slate-600 mt-1">Date: {new Date(bill.createdAt).toLocaleDateString('en-IN')}</p>
          </div>
        </div>

        {/* Table */}
        <table className="w-full text-sm mb-10">
          <thead>
            <tr className="border-b-2 border-slate-900">
              <th className="text-left py-4 font-bold uppercase tracking-wider text-slate-900">Description</th>
              <th className="text-center py-4 font-bold uppercase tracking-wider text-slate-900">Qty</th>
              {bill.showPrices && <th className="text-right py-4 font-bold uppercase tracking-wider text-slate-900">Rate</th>}
              {bill.showPrices && <th className="text-right py-4 font-bold uppercase tracking-wider text-slate-900">Total</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {[...bill.items, ...bill.customItems].map((item, i) => {
              const isProduct = !!item.product;
              const name = isProduct ? item.product.name : item.description;
              const price = isProduct ? item.product.price : item.price;
              return (
                <tr key={i}>
                  <td className="py-5">
                    <p className="font-medium text-slate-800">{name}</p>
                    {isProduct && (item.selectedSize || item.selectedColor) && (
                      <p className="text-[10px] text-slate-400 mt-1">{item.selectedSize} {item.selectedColor}</p>
                    )}
                  </td>
                  <td className="py-5 text-center text-slate-600">{item.quantity}</td>
                  {bill.showPrices && <td className="py-5 text-right text-slate-600">₹{price}</td>}
                  {bill.showPrices && <td className="py-5 text-right font-semibold text-slate-900">₹{(price * item.quantity).toFixed(2)}</td>}
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Grand Total */}
        {bill.showPrices && (
          <div className="flex justify-end border-t-2 border-slate-100 pt-6">
            <div className="w-full sm:w-64">
              <div className="flex justify-between items-center px-2">
                <span className="text-sm font-bold uppercase text-slate-400">Grand Total</span>
                <span className="text-2xl font-bold text-slate-900">₹{bill.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-20 pt-8 border-t border-slate-50 text-center">
          <p className="text-sm font-medium text-slate-400 italic">
            "Powering your trust with quality service."
          </p>
          <div className="mt-6 flex flex-col items-center gap-1 text-[10px] text-slate-300 font-bold uppercase tracking-[0.3em]">
            <p>VoltCare Electrical Solutions</p>
            <p>Nagpur, Maharashtra</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePage;