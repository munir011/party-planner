import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Package, ShoppingCart, BarChart3, Settings } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="container py-8">
      {/* Admin Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage your party rental business</p>
      </div>

      {/* Admin Navigation */}
      <Card className="mb-8 shadow-card">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            <Link to="/admin/inventory">
              <Button 
                variant={isActive('/admin/inventory') ? 'default' : 'outline'}
                className="flex items-center gap-2"
              >
                <Package className="h-4 w-4" />
                Inventory
              </Button>
            </Link>
            <Link to="/admin/orders">
              <Button 
                variant={isActive('/admin/orders') ? 'default' : 'outline'}
                className="flex items-center gap-2"
              >
                <ShoppingCart className="h-4 w-4" />
                Orders
              </Button>
            </Link>
            <Button variant="outline" className="flex items-center gap-2" disabled>
              <BarChart3 className="h-4 w-4" />
              Analytics
              <span className="text-xs bg-muted px-1 rounded">Soon</span>
            </Button>
            <Button variant="outline" className="flex items-center gap-2" disabled>
              <Settings className="h-4 w-4" />
              Settings
              <span className="text-xs bg-muted px-1 rounded">Soon</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Admin Content */}
      {children}
    </div>
  );
}