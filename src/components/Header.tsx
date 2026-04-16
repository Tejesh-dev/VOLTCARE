import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Search, Settings, Menu, X, LayoutDashboard, Droplets } from 'lucide-react'; // Added Droplets icon
import { useCart } from '@/context/CartContext';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const Header = ({ searchQuery, onSearchChange }: HeaderProps) => {
  const { getItemCount } = useCart();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const itemCount = getItemCount();

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
      <div className="container flex items-center justify-between h-14 sm:h-16 gap-2 sm:gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-1 shrink-0">
          <span className="font-heading text-lg sm:text-xl font-bold tracking-tight">
            <span className="text-voltcare-red">V </span>
            <span className="text-foreground">O L T </span>
            <span className="text-voltcare-gold">C </span>
            <span className="text-foreground">A R </span>
            <span className="text-voltcare-blue">E</span>
          </span>
        </Link>

        {/* Search - desktop */}
        <div className="hidden md:flex flex-1 max-w-xl relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search products, brands..."
            className="pl-10 bg-secondary border-0 focus-visible:ring-primary"
          />
        </div>

        {/* Nav - desktop */}
        <nav className="hidden md:flex items-center gap-1">
          <Link
            to="/"
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              location.pathname === '/' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary'
            }`}
          >
            Products
          </Link>

          {/* ADDED PLUMBING LINK FOR DESKTOP */}
          <Link
            to="/plumbing"
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
              location.pathname === '/plumbing' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary'
            }`}
          >
            <Droplets className="h-4 w-4" />
            Plumbing
          </Link>

          <Link
            to="/dashboard"
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
              location.pathname === '/dashboard' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary'
            }`}
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>
          <Link
            to="/admin"
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              location.pathname.startsWith('/admin') ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary'
            }`}
          >
            <Settings className="h-4 w-4" />
          </Link>
          <Link to="/cart" className="relative p-2 rounded-lg hover:bg-secondary transition-colors">
            <ShoppingCart className="h-5 w-5 text-foreground" />
            {itemCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-voltcare-red border-0 text-primary-foreground">
                {itemCount}
              </Badge>
            )}
          </Link>
        </nav>

        {/* Mobile menu buttons */}
        <div className="flex md:hidden items-center gap-1">
          <Link to="/cart" className="relative p-2">
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-voltcare-red border-0 text-primary-foreground">
                {itemCount}
              </Badge>
            )}
          </Link>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2">
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile search */}
      <div className="md:hidden px-4 pb-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search products..."
            className="pl-10 bg-secondary border-0"
          />
        </div>
      </div>

      {/* Mobile Menu Content */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-card animate-fade-in">
          <nav className="flex flex-col p-4 gap-1">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 rounded-lg hover:bg-secondary font-medium">Products</Link>
            
            {/* ADDED PLUMBING LINK FOR MOBILE */}
            <Link to="/plumbing" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 rounded-lg hover:bg-secondary font-medium flex items-center gap-2 text-voltcare-blue">
              <Droplets className="h-4 w-4" />
              Plumbing Section
            </Link>

            <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 rounded-lg hover:bg-secondary font-medium">Dashboard</Link>
            <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 rounded-lg hover:bg-secondary font-medium">Admin Panel</Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
