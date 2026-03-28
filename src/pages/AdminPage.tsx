import { useState, useRef } from 'react';
import { useAdmin } from '@/context/AdminContext';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, Pencil, Trash2, Package, Lock, FolderPlus, ImagePlus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Product, Subcategory } from '@/data/types';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';

const AdminPage = () => {
  const {
    products, addProduct, updateProduct, deleteProduct,
    categories, addCategory, addSubcategory, deleteCategory, deleteSubcategory,
    isAdmin, login, logout,
  } = useAdmin();

  const [password, setPassword] = useState('');
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryIcon, setNewCategoryIcon] = useState('Package');
  const [newSubName, setNewSubName] = useState('');
  const [newSubCatId, setNewSubCatId] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editFileRef = useRef<HTMLInputElement>(null);

  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    category: categories[0]?.id || '', subcategory: categories[0]?.subcategories[0]?.id || '', unit: 'piece', stock: 0, price: 0, image: '📦',
  });

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
        <Lock className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mb-4" />
        <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground mb-2">Admin Access</h2>
        <p className="text-muted-foreground mb-6 text-xs sm:text-sm">Enter password to access admin panel</p>
        <div className="flex gap-2 w-full max-w-xs">
          <Input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
            onKeyDown={e => { if (e.key === 'Enter') { if (!login(password)) toast.error('Wrong password'); } }}
          />
          <Button onClick={() => { if (!login(password)) toast.error('Wrong password'); }} className="bg-primary text-primary-foreground">Login</Button>
        </div>
      </div>
    );
  }

  const selectedCategory = categories.find(c => c.id === (editProduct?.category || newProduct.category));
  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'new' | 'edit') => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { toast.error('Image must be under 2MB'); return; }
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      if (target === 'new') setNewProduct(p => ({ ...p, image: dataUrl }));
      else if (editProduct) setEditProduct(p => p ? { ...p, image: dataUrl } : null);
    };
    reader.readAsDataURL(file);
  };

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.sku) {
      toast.error('Name and SKU are required');
      return;
    }
    addProduct({ ...newProduct, id: `prod-${Date.now()}` } as Product);
    setShowAddDialog(false);
    setNewProduct({ category: categories[0]?.id || '', subcategory: categories[0]?.subcategories[0]?.id || '', unit: 'piece', stock: 0, price: 0, image: '📦' });
    toast.success('Product added!');
  };

  const handleSaveEdit = () => {
    if (editProduct) {
      updateProduct(editProduct.id, editProduct);
      setEditProduct(null);
      toast.success('Product updated!');
    }
  };

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) { toast.error('Category name required'); return; }
    const id = newCategoryName.toLowerCase().replace(/\s+/g, '-');
    addCategory({ id, name: newCategoryName.trim(), icon: newCategoryIcon, subcategories: [] });
    setNewCategoryName('');
    toast.success('Category added!');
  };

  const handleAddSubcategory = () => {
    if (!newSubName.trim() || !newSubCatId) { toast.error('Select category and enter name'); return; }
    const subId = newSubName.toLowerCase().replace(/\s+/g, '-');
    addSubcategory(newSubCatId, { id: subId, name: newSubName.trim(), categoryId: newSubCatId });
    setNewSubName('');
    toast.success('Subcategory added!');
  };

  const isImageUrl = (img: string) => img.startsWith('data:') || img.startsWith('http') || img.startsWith('/');

  return (
    <div className="container py-3 sm:py-4">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center gap-3">
          <Link to="/"><ArrowLeft className="h-5 w-5" /></Link>
          <h1 className="font-heading text-xl sm:text-2xl font-bold text-foreground">Admin Panel</h1>
        </div>
        <Button onClick={logout} variant="outline" size="sm" className="text-xs sm:text-sm">Logout</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4 sm:mb-6">
        <div className="bg-card rounded-xl border border-border p-3 sm:p-4">
          <span className="text-[10px] sm:text-xs text-muted-foreground">Products</span>
          <p className="font-heading text-lg sm:text-2xl font-bold text-foreground">{products.length}</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-3 sm:p-4">
          <span className="text-[10px] sm:text-xs text-muted-foreground">Categories</span>
          <p className="font-heading text-lg sm:text-2xl font-bold text-foreground">{categories.length}</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-3 sm:p-4">
          <span className="text-[10px] sm:text-xs text-muted-foreground">Low Stock</span>
          <p className="font-heading text-lg sm:text-2xl font-bold text-destructive">{products.filter(p => p.stock < 10).length}</p>
        </div>
      </div>

      <Tabs defaultValue="products">
        <TabsList className="mb-3 sm:mb-4 w-full sm:w-auto">
          <TabsTrigger value="products" className="text-xs sm:text-sm">Products</TabsTrigger>
          <TabsTrigger value="categories" className="text-xs sm:text-sm">Categories</TabsTrigger>
        </TabsList>

        {/* Products Tab */}
        <TabsContent value="products">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-3 sm:mb-4">
            <Input value={searchFilter} onChange={e => setSearchFilter(e.target.value)} placeholder="Search products..." className="sm:max-w-sm text-sm" />
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button className="bg-primary text-primary-foreground text-xs sm:text-sm"><Plus className="mr-1 h-4 w-4" /> Add Product</Button>
              </DialogTrigger>
              <DialogContent className="max-h-[90vh] overflow-y-auto max-w-lg">
                <DialogHeader><DialogTitle>Add Product</DialogTitle></DialogHeader>
                <div className="grid gap-3">
                  {/* Image Upload */}
                  <div>
                    <Label>Product Image</Label>
                    <div className="flex items-center gap-3 mt-1">
                      <div className="h-16 w-16 rounded-lg bg-secondary flex items-center justify-center border border-border overflow-hidden">
                        {isImageUrl(newProduct.image || '') ? (
                          <img src={newProduct.image} alt="" className="h-full w-full object-contain" />
                        ) : (
                          <span className="text-2xl">{newProduct.image}</span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                          <ImagePlus className="mr-1 h-4 w-4" /> Upload
                        </Button>
                        {isImageUrl(newProduct.image || '') && (
                          <Button type="button" variant="ghost" size="sm" onClick={() => setNewProduct(p => ({ ...p, image: '📦' }))}>
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={e => handleImageUpload(e, 'new')} />
                    </div>
                  </div>
                  <div><Label>Name *</Label><Input value={newProduct.name || ''} onChange={e => setNewProduct(p => ({ ...p, name: e.target.value }))} /></div>
                  <div><Label>SKU *</Label><Input value={newProduct.sku || ''} onChange={e => setNewProduct(p => ({ ...p, sku: e.target.value }))} /></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Category</Label>
                      <Select value={newProduct.category} onValueChange={v => setNewProduct(p => ({ ...p, category: v, subcategory: categories.find(c => c.id === v)?.subcategories[0]?.id || '' }))}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>{categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Subcategory</Label>
                      <Select value={newProduct.subcategory} onValueChange={v => setNewProduct(p => ({ ...p, subcategory: v }))}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>{selectedCategory?.subcategories.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><Label>Price</Label><Input type="number" value={newProduct.price || ''} onChange={e => setNewProduct(p => ({ ...p, price: Number(e.target.value) }))} /></div>
                    <div><Label>Stock</Label><Input type="number" value={newProduct.stock || ''} onChange={e => setNewProduct(p => ({ ...p, stock: Number(e.target.value) }))} /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><Label>Unit</Label><Input value={newProduct.unit || ''} onChange={e => setNewProduct(p => ({ ...p, unit: e.target.value }))} /></div>
                    <div><Label>Brand</Label><Input value={newProduct.brand || ''} onChange={e => setNewProduct(p => ({ ...p, brand: e.target.value }))} /></div>
                  </div>
                  <div><Label>Description</Label><Textarea value={newProduct.description || ''} onChange={e => setNewProduct(p => ({ ...p, description: e.target.value }))} /></div>
                  <Button onClick={handleAddProduct} className="bg-primary text-primary-foreground">Add Product</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs sm:text-sm">
                <thead className="bg-secondary">
                  <tr>
                    <th className="text-left p-2 sm:p-3 font-medium text-muted-foreground">Product</th>
                    <th className="text-left p-2 sm:p-3 font-medium text-muted-foreground hidden sm:table-cell">SKU</th>
                    <th className="text-left p-2 sm:p-3 font-medium text-muted-foreground hidden md:table-cell">Category</th>
                    <th className="text-right p-2 sm:p-3 font-medium text-muted-foreground">Price</th>
                    <th className="text-right p-2 sm:p-3 font-medium text-muted-foreground">Stock</th>
                    <th className="text-right p-2 sm:p-3 font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map(product => (
                    <tr key={product.id} className="border-t border-border hover:bg-secondary/50">
                      <td className="p-2 sm:p-3">
                        <div className="flex items-center gap-2">
                          {isImageUrl(product.image) ? (
                            <img src={product.image} alt="" className="h-8 w-8 rounded object-contain bg-secondary" />
                          ) : (
                            <span className="text-lg">{product.image}</span>
                          )}
                          <span className="font-medium text-foreground text-xs sm:text-sm truncate max-w-[120px] sm:max-w-none">{product.name}</span>
                        </div>
                      </td>
                      <td className="p-2 sm:p-3 text-muted-foreground hidden sm:table-cell">{product.sku}</td>
                      <td className="p-2 sm:p-3 text-muted-foreground capitalize hidden md:table-cell">{product.category}</td>
                      <td className="p-2 sm:p-3 text-right text-foreground">₹{product.price}</td>
                      <td className="p-2 sm:p-3 text-right">
                        <span className={product.stock < 10 ? 'text-destructive font-bold' : 'text-foreground'}>{product.stock}</span>
                      </td>
                      <td className="p-2 sm:p-3 text-right">
                        <div className="flex justify-end gap-1">
                          <Dialog>
                            <DialogTrigger asChild>
                              <button onClick={() => setEditProduct({ ...product })} className="p-1 sm:p-1.5 rounded-lg hover:bg-secondary"><Pencil className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" /></button>
                            </DialogTrigger>
                            {editProduct?.id === product.id && (
                              <DialogContent className="max-h-[90vh] overflow-y-auto max-w-lg">
                                <DialogHeader><DialogTitle>Edit Product</DialogTitle></DialogHeader>
                                <div className="grid gap-3">
                                  <div>
                                    <Label>Image</Label>
                                    <div className="flex items-center gap-3 mt-1">
                                      <div className="h-16 w-16 rounded-lg bg-secondary flex items-center justify-center border overflow-hidden">
                                        {isImageUrl(editProduct.image) ? (
                                          <img src={editProduct.image} alt="" className="h-full w-full object-contain" />
                                        ) : (
                                          <span className="text-2xl">{editProduct.image}</span>
                                        )}
                                      </div>
                                      <Button type="button" variant="outline" size="sm" onClick={() => editFileRef.current?.click()}>
                                        <ImagePlus className="mr-1 h-4 w-4" /> Upload
                                      </Button>
                                      <input ref={editFileRef} type="file" accept="image/*" className="hidden" onChange={e => handleImageUpload(e, 'edit')} />
                                    </div>
                                  </div>
                                  <div><Label>Name</Label><Input value={editProduct.name} onChange={e => setEditProduct(p => p ? { ...p, name: e.target.value } : null)} /></div>
                                  <div className="grid grid-cols-2 gap-3">
                                    <div>
                                      <Label>Category</Label>
                                      <Select value={editProduct.category} onValueChange={v => setEditProduct(p => p ? { ...p, category: v } : null)}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>{categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                                      </Select>
                                    </div>
                                    <div>
                                      <Label>Subcategory</Label>
                                      <Select value={editProduct.subcategory} onValueChange={v => setEditProduct(p => p ? { ...p, subcategory: v } : null)}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                          {categories.find(c => c.id === editProduct.category)?.subcategories.map(s => (
                                            <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-3">
                                    <div><Label>Price</Label><Input type="number" value={editProduct.price} onChange={e => setEditProduct(p => p ? { ...p, price: Number(e.target.value) } : null)} /></div>
                                    <div><Label>Stock</Label><Input type="number" value={editProduct.stock} onChange={e => setEditProduct(p => p ? { ...p, stock: Number(e.target.value) } : null)} /></div>
                                  </div>
                                  <Button onClick={handleSaveEdit} className="bg-primary text-primary-foreground">Save Changes</Button>
                                </div>
                              </DialogContent>
                            )}
                          </Dialog>
                          <button onClick={() => { deleteProduct(product.id); toast.success('Deleted'); }} className="p-1 sm:p-1.5 rounded-lg hover:bg-destructive/10">
                            <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-destructive" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        {/* Categories Tab */}
        <TabsContent value="categories">
          <div className="space-y-4 sm:space-y-6">
            {/* Add Category */}
            <div className="bg-card rounded-xl border border-border p-3 sm:p-4">
              <h3 className="font-heading font-bold text-foreground mb-3 text-sm sm:text-base flex items-center gap-2">
                <FolderPlus className="h-4 w-4" /> Add Category
              </h3>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <Input value={newCategoryName} onChange={e => setNewCategoryName(e.target.value)} placeholder="Category name" className="flex-1 text-sm" />
                <Select value={newCategoryIcon} onValueChange={setNewCategoryIcon}>
                  <SelectTrigger className="w-full sm:w-32"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Zap">⚡ Electric</SelectItem>
                    <SelectItem value="Droplets">💧 Water</SelectItem>
                    <SelectItem value="Wrench">🔧 Tools</SelectItem>
                    <SelectItem value="Package">📦 General</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={handleAddCategory} className="bg-primary text-primary-foreground text-sm">Add</Button>
              </div>
            </div>

            {/* Add Subcategory */}
            <div className="bg-card rounded-xl border border-border p-3 sm:p-4">
              <h3 className="font-heading font-bold text-foreground mb-3 text-sm sm:text-base">Add Subcategory</h3>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <Select value={newSubCatId} onValueChange={setNewSubCatId}>
                  <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="Category" /></SelectTrigger>
                  <SelectContent>{categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                </Select>
                <Input value={newSubName} onChange={e => setNewSubName(e.target.value)} placeholder="Subcategory name" className="flex-1 text-sm" />
                <Button onClick={handleAddSubcategory} className="bg-primary text-primary-foreground text-sm">Add</Button>
              </div>
            </div>

            {/* Category List */}
            <div className="space-y-3">
              {categories.map(cat => (
                <div key={cat.id} className="bg-card rounded-xl border border-border p-3 sm:p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-heading font-bold text-foreground text-sm sm:text-base">{cat.name}</h4>
                    <button
                      onClick={() => {
                        if (confirm(`Delete category "${cat.name}" and all its products?`)) {
                          deleteCategory(cat.id);
                          toast.success('Category deleted');
                        }
                      }}
                      className="p-1 rounded hover:bg-destructive/10"
                    >
                      <Trash2 className="h-3.5 w-3.5 text-destructive" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {cat.subcategories.map(sub => (
                      <span key={sub.id} className="inline-flex items-center gap-1 bg-secondary text-foreground text-[10px] sm:text-xs px-2 py-1 rounded-full">
                        {sub.name}
                        <button
                          onClick={() => { deleteSubcategory(cat.id, sub.id); toast.success('Subcategory removed'); }}
                          className="hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                    {cat.subcategories.length === 0 && <span className="text-xs text-muted-foreground">No subcategories</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPage;
