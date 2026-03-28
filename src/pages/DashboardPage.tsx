import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useAdmin } from '@/context/AdminContext';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, Users, FileText, Phone, Plus, Trash2, Pencil,
  MessageCircle, Search, UserPlus, MapPin
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Contact } from '@/data/types';
import { toast } from 'sonner';

const DashboardPage = () => {
  const { bills } = useCart();
  const { contacts, addContact, updateContact, deleteContact } = useAdmin();

  const [contactSearch, setContactSearch] = useState('');
  const [billSearch, setBillSearch] = useState('');
  const [showAddContact, setShowAddContact] = useState(false);
  const [editContact, setEditContact] = useState<Contact | null>(null);
  const [newContact, setNewContact] = useState<Partial<Contact>>({
    name: '', phone: '', email: '', address: '', source: 'Walk-in', notes: '', whatsapp: '',
  });

  const filteredContacts = contacts.filter(c =>
    c.name.toLowerCase().includes(contactSearch.toLowerCase()) ||
    c.phone.includes(contactSearch)
  );

  const filteredBills = bills.filter(b =>
    b.billNumber.toLowerCase().includes(billSearch.toLowerCase()) ||
    b.customer.name.toLowerCase().includes(billSearch.toLowerCase()) ||
    b.customer.phone.includes(billSearch)
  );

  const handleAddContact = () => {
    if (!newContact.name || !newContact.phone) {
      toast.error('Name and phone are required');
      return;
    }
    addContact({
      ...newContact,
      id: `CON-${Date.now()}`,
      createdAt: new Date().toISOString(),
    } as Contact);
    setShowAddContact(false);
    setNewContact({ name: '', phone: '', email: '', address: '', source: 'Walk-in', notes: '', whatsapp: '' });
    toast.success('Contact added!');
  };

  const handleSaveEditContact = () => {
    if (editContact) {
      updateContact(editContact.id, editContact);
      setEditContact(null);
      toast.success('Contact updated!');
    }
  };

  const openWhatsApp = (phone: string, name: string) => {
    const cleanPhone = phone.replace(/\D/g, '');
    const message = encodeURIComponent(`Hi ${name}, this is from VoltCare.`);
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
  };

  const totalRevenue = bills.reduce((sum, b) => sum + b.total, 0);

  return (
    <div className="container py-3 sm:py-4">
      <div className="flex items-center gap-3 mb-4 sm:mb-6">
        <Link to="/"><ArrowLeft className="h-5 w-5" /></Link>
        <h1 className="font-heading text-xl sm:text-2xl font-bold text-foreground">Dashboard</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 mb-4 sm:mb-6">
        {[
          { icon: <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />, label: 'Total Bills', value: bills.length },
          { icon: <span className="text-sm sm:text-base">₹</span>, label: 'Revenue', value: `₹${totalRevenue.toFixed(0)}` },
          { icon: <Users className="h-4 w-4 sm:h-5 sm:w-5 text-voltcare-blue" />, label: 'Contacts', value: contacts.length },
          { icon: <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-voltcare-gold" />, label: 'Leads', value: contacts.filter(c => c.source !== 'Walk-in').length },
        ].map((stat, i) => (
          <div key={i} className="bg-card rounded-xl border border-border p-3 sm:p-4">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-1">{stat.icon}<span className="text-[10px] sm:text-xs text-muted-foreground">{stat.label}</span></div>
            <p className="font-heading text-lg sm:text-2xl font-bold text-foreground">{stat.value}</p>
          </div>
        ))}
      </div>

      <Tabs defaultValue="bills" className="space-y-4">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="bills" className="text-xs sm:text-sm">Bills</TabsTrigger>
          <TabsTrigger value="contacts" className="text-xs sm:text-sm">Contacts & Leads</TabsTrigger>
        </TabsList>

        {/* Bills Tab */}
        <TabsContent value="bills">
          <div className="mb-3 sm:mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input value={billSearch} onChange={e => setBillSearch(e.target.value)} placeholder="Search bills..." className="pl-10 text-sm" />
            </div>
          </div>
          {filteredBills.length === 0 ? (
            <p className="text-center text-muted-foreground py-10 text-sm">No bills found</p>
          ) : (
            <div className="space-y-2 sm:space-y-3">
              {filteredBills.map(bill => (
                <Link
                  key={bill.id}
                  to={`/bill/${bill.id}`}
                  className="block bg-card rounded-xl border border-border p-3 sm:p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between">
                    <div>
                      <p className="font-bold text-foreground text-sm sm:text-base">{bill.billNumber}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">{bill.customer.name} • {bill.items.length + bill.customItems.length} items</p>
                    </div>
                    <div className="text-right">
                      {bill.showPrices && <p className="font-bold text-foreground text-sm sm:text-base">₹{bill.total.toFixed(2)}</p>}
                      <p className="text-[10px] sm:text-xs text-muted-foreground">{new Date(bill.createdAt).toLocaleDateString('en-IN')}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Contacts Tab */}
        <TabsContent value="contacts">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input value={contactSearch} onChange={e => setContactSearch(e.target.value)} placeholder="Search contacts..." className="pl-10 text-sm" />
            </div>
            <Dialog open={showAddContact} onOpenChange={setShowAddContact}>
              <DialogTrigger asChild>
                <Button className="bg-primary text-primary-foreground text-xs sm:text-sm h-9 sm:h-10">
                  <UserPlus className="mr-1 h-4 w-4" /> Add Contact
                </Button>
              </DialogTrigger>
              <DialogContent className="max-h-[90vh] overflow-y-auto max-w-md">
                <DialogHeader><DialogTitle>Add Contact</DialogTitle></DialogHeader>
                <div className="grid gap-3">
                  <div><Label>Name *</Label><Input value={newContact.name || ''} onChange={e => setNewContact(p => ({ ...p, name: e.target.value }))} /></div>
                  <div><Label>Phone *</Label><Input value={newContact.phone || ''} onChange={e => setNewContact(p => ({ ...p, phone: e.target.value }))} /></div>
                  <div><Label>WhatsApp</Label><Input value={newContact.whatsapp || ''} onChange={e => setNewContact(p => ({ ...p, whatsapp: e.target.value }))} placeholder="+91..." /></div>
                  <div><Label>Email</Label><Input value={newContact.email || ''} onChange={e => setNewContact(p => ({ ...p, email: e.target.value }))} /></div>
                  <div><Label>Address</Label><Input value={newContact.address || ''} onChange={e => setNewContact(p => ({ ...p, address: e.target.value }))} /></div>
                  <div>
                    <Label>Source</Label>
                    <Select value={newContact.source} onValueChange={v => setNewContact(p => ({ ...p, source: v }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Walk-in">Walk-in</SelectItem>
                        <SelectItem value="Google Maps">Google Maps</SelectItem>
                        <SelectItem value="Referral">Referral</SelectItem>
                        <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                        <SelectItem value="Phone Call">Phone Call</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div><Label>Notes</Label><Textarea value={newContact.notes || ''} onChange={e => setNewContact(p => ({ ...p, notes: e.target.value }))} placeholder="Any notes..." /></div>
                  <Button onClick={handleAddContact} className="bg-primary text-primary-foreground">Add Contact</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {filteredContacts.length === 0 ? (
            <p className="text-center text-muted-foreground py-10 text-sm">No contacts yet. Add your first contact!</p>
          ) : (
            <div className="space-y-2 sm:space-y-3">
              {filteredContacts.map(contact => (
                <div key={contact.id} className="bg-card rounded-xl border border-border p-3 sm:p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-foreground text-sm sm:text-base">{contact.name}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">{contact.phone}</p>
                      {contact.email && <p className="text-xs text-muted-foreground">{contact.email}</p>}
                      {contact.address && (
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                          <MapPin className="h-3 w-3" /> {contact.address}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] sm:text-xs bg-secondary text-muted-foreground px-2 py-0.5 rounded-full">{contact.source}</span>
                        {contact.notes && <span className="text-[10px] sm:text-xs text-muted-foreground truncate max-w-[150px]">{contact.notes}</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => openWhatsApp(contact.whatsapp || contact.phone, contact.name)}
                        className="p-1.5 sm:p-2 rounded-lg hover:bg-primary/10 text-primary"
                        title="WhatsApp"
                      >
                        <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                      </button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <button onClick={() => setEditContact({ ...contact })} className="p-1.5 sm:p-2 rounded-lg hover:bg-secondary">
                            <Pencil className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                          </button>
                        </DialogTrigger>
                        {editContact?.id === contact.id && (
                          <DialogContent className="max-w-md">
                            <DialogHeader><DialogTitle>Edit Contact</DialogTitle></DialogHeader>
                            <div className="grid gap-3">
                              <div><Label>Name</Label><Input value={editContact.name} onChange={e => setEditContact(p => p ? { ...p, name: e.target.value } : null)} /></div>
                              <div><Label>Phone</Label><Input value={editContact.phone} onChange={e => setEditContact(p => p ? { ...p, phone: e.target.value } : null)} /></div>
                              <div><Label>WhatsApp</Label><Input value={editContact.whatsapp || ''} onChange={e => setEditContact(p => p ? { ...p, whatsapp: e.target.value } : null)} /></div>
                              <div><Label>Notes</Label><Textarea value={editContact.notes || ''} onChange={e => setEditContact(p => p ? { ...p, notes: e.target.value } : null)} /></div>
                              <Button onClick={handleSaveEditContact} className="bg-primary text-primary-foreground">Save</Button>
                            </div>
                          </DialogContent>
                        )}
                      </Dialog>
                      <button onClick={() => { deleteContact(contact.id); toast.success('Deleted'); }} className="p-1.5 sm:p-2 rounded-lg hover:bg-destructive/10">
                        <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-destructive" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardPage;
