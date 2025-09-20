import { Link } from 'react-router-dom';
import { ShoppingCart, Trash2, Plus, Minus, Calendar } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Separator } from '../components/ui/separator';
import { useCartStore } from '../stores/cartStore';
import { formatPrice, calculateDays, calculateCartTotals } from '../lib/pricing';
import { format } from 'date-fns';

export default function Cart() {
  const { items, updateItem, removeItem, clearCart } = useCartStore();
  
  if (items.length === 0) {
    return (
      <div className="container py-16">
        <div className="max-w-md mx-auto text-center">
          <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
          <p className="text-muted-foreground mb-6">
            Add some party rental items to get started!
          </p>
          <Link to="/catalog">
            <Button size="lg">Browse Rentals</Button>
          </Link>
        </div>
      </div>
    );
  }

  const totals = calculateCartTotals(items);

  const updateQuantity = (itemId: string, newQty: number) => {
    if (newQty <= 0) {
      removeItem(itemId);
    } else {
      updateItem(itemId, { qty: newQty });
    }
  };

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => {
              const days = calculateDays(item.startDate, item.endDate);
              const lineTotal = item.unitPrice * item.qty * days;
              
              return (
                <Card key={item.id} className="shadow-card">
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      {/* Item Image */}
                      <div className="w-24 h-24 bg-gradient-card rounded-lg flex-shrink-0">
                        <div className="w-full h-full bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg" />
                      </div>
                      
                      {/* Item Details */}
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-lg">{item.name}</h3>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeItem(item.id)}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {format(new Date(item.startDate), 'MMM d')} - {format(new Date(item.endDate), 'MMM d')}
                            </span>
                          </div>
                          <span>•</span>
                          <span>{days} {days === 1 ? 'day' : 'days'}</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.id, item.qty - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <Input
                              type="number"
                              value={item.qty}
                              onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                              className="w-16 text-center h-8"
                              min="1"
                            />
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.id, item.qty + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          
                          <div className="text-right">
                            <div className="text-sm text-muted-foreground">
                              {formatPrice(item.unitPrice)} × {item.qty} × {days} days
                            </div>
                            <div className="font-semibold text-lg">
                              {formatPrice(lineTotal)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            
            <div className="flex justify-between items-center pt-4">
              <Button variant="outline" onClick={clearCart}>
                Clear Cart
              </Button>
              <Link to="/catalog">
                <Button variant="ghost">Continue Shopping</Button>
              </Link>
            </div>
          </div>
          
          {/* Order Summary */}
          <div>
            <Card className="shadow-card sticky top-8">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{formatPrice(totals.subtotal)}</span>
                </div>
                
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Est. Deposit:</span>
                  <span>{formatPrice(totals.depositEstimate)}</span>
                </div>
                
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Tax:</span>
                  <span>{formatPrice(totals.tax)}</span>
                </div>
                
                <Separator />
                
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total:</span>
                  <span>{formatPrice(totals.total)}</span>
                </div>
                
                <div className="space-y-2">
                  <Link to="/checkout" className="block">
                    <Button className="w-full" size="lg">
                      Proceed to Checkout
                    </Button>
                  </Link>
                  
                  <p className="text-xs text-muted-foreground text-center">
                    Secure checkout • Free cancellation up to 48hrs
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}