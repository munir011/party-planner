import { ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Calendar, Package, Search } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useCartStore } from '../stores/cartStore';
import { SearchDialog } from './SearchDialog';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const cartItems = useCartStore((state) => state.items);
  const cartCount = cartItems.reduce((total, item) => total + item.qty, 0);
  const [searchOpen, setSearchOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <div className="mr-4 flex">
            <Link to="/" className="mr-6 flex items-center space-x-2">
              <Package className="h-6 w-6 text-primary" />
              <span className="hidden font-bold text-xl sm:inline-block bg-gradient-primary bg-clip-text text-transparent">
                Premier Party Rentals
              </span>
            </Link>
          </div>

          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              to="/"
              className={`transition-colors hover:text-primary ${
                isActive('/') ? 'text-primary' : 'text-foreground/60'
              }`}
            >
              Home
            </Link>
            <Link
              to="/catalog"
              className={`transition-colors hover:text-primary ${
                isActive('/catalog') ? 'text-primary' : 'text-foreground/60'
              }`}
            >
              Catalog
            </Link>
            <Link
              to="/admin/inventory"
              className={`transition-colors hover:text-primary ${
                location.pathname.startsWith('/admin') ? 'text-primary' : 'text-foreground/60'
              }`}
            >
              Admin
            </Link>
          </nav>

          <div className="flex flex-1 items-center justify-end space-x-4">
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="icon" onClick={() => setSearchOpen(true)}>
                <Search className="h-4 w-4" />
              </Button>
              <Link to="/cart">
                <Button variant="outline" size="icon" className="relative">
                  <ShoppingCart className="h-4 w-4" />
                  {cartCount > 0 && (
                    <Badge 
                      variant="secondary" 
                      className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-primary text-primary-foreground"
                    >
                      {cartCount}
                    </Badge>
                  )}
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t py-6 md:py-8">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
            <Package className="h-6 w-6 text-primary" />
            <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
              © 2024 Premier Party Rentals. Making your events unforgettable.
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Book your perfect event today</span>
          </div>
        </div>
      </footer>
    </div>
  );
}