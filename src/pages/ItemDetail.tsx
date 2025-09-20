import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Plus, Minus, Star, Shield, Truck } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useInventoryStore } from '../stores/inventoryStore';
import { useCartStore } from '../stores/cartStore';
import { formatPrice, calculateDays } from '../lib/pricing';
import { calculateAvailability } from '../lib/availability';
import { format, addDays } from 'date-fns';
import { useToast } from '../hooks/use-toast';

export default function ItemDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { toast } = useToast();
  const getItem = useInventoryStore((state) => state.getItem);
  const addToCart = useCartStore((state) => state.addItem);
  
  const item = slug ? getItem(slug) : null;
  
  const [quantity, setQuantity] = useState(1);
  const [startDate, setStartDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(addDays(new Date(), 1), 'yyyy-MM-dd'));

  if (!item) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Item Not Found</h1>
          <Link to="/catalog">
            <Button>Back to Catalog</Button>
          </Link>
        </div>
      </div>
    );
  }

  const days = calculateDays(startDate, endDate);
  const availability = calculateAvailability(item, startDate, endDate, quantity);
  const total = item.pricePerDay * quantity * days;

  const handleAddToCart = () => {
    if (!availability.available) {
      toast({
        title: "Not Available",
        description: "The selected dates are not available for this quantity.",
        variant: "destructive"
      });
      return;
    }

    const cartItem = {
      id: `${item.id}-${startDate}-${endDate}-${Date.now()}`,
      itemId: item.id,
      name: item.name,
      qty: quantity,
      startDate,
      endDate,
      unitPrice: item.pricePerDay,
      image: item.images[0] || ''
    };

    addToCart(cartItem);
    
    toast({
      title: "Added to Cart",
      description: `${item.name} has been added to your cart.`,
    });
  };

  return (
    <div className="container py-8">
      {/* Back Button */}
      <div className="mb-6">
        <Link to="/catalog">
          <Button variant="ghost" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Catalog
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-square bg-gradient-card rounded-lg relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10" />
            <div className="absolute top-4 right-4">
              <Badge variant="secondary" className="bg-white/90 text-foreground">
                {item.category}
              </Badge>
            </div>
            <div className="absolute bottom-4 left-4 text-white">
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 fill-current" />
                <span className="text-sm font-medium">4.8 (127 reviews)</span>
              </div>
            </div>
          </div>
          
          {item.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {item.images.slice(1, 5).map((image, index) => (
                <div key={index} className="aspect-square bg-gradient-card rounded border cursor-pointer hover:border-primary">
                  <div className="w-full h-full bg-gradient-to-br from-primary/5 to-secondary/5 rounded" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Item Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{item.name}</h1>
            <div className="flex items-center gap-4 mb-4">
              <div className="text-2xl font-bold text-primary">
                {formatPrice(item.pricePerDay)}/day
              </div>
              <Badge variant={item.qtyAvailable > 10 ? "default" : "secondary"}>
                {item.qtyAvailable} available
              </Badge>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {item.tags.map(tag => (
                <Badge key={tag} variant="outline" className="text-sm">
                  {tag}
                </Badge>
              ))}
            </div>
            
            <p className="text-muted-foreground leading-relaxed">
              {item.description}
            </p>
          </div>

          {/* Booking Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Book This Item
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={startDate}
                    min={format(new Date(), 'yyyy-MM-dd')}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={endDate}
                    min={startDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="quantity">Quantity</Label>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    id="quantity"
                    type="number"
                    value={quantity}
                    min="1"
                    max={item.qtyAvailable}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="text-center w-20"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.min(item.qtyAvailable, quantity + 1))}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="bg-muted/30 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span>Duration:</span>
                  <span className="font-medium">{days} {days === 1 ? 'day' : 'days'}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span>Subtotal:</span>
                  <span className="font-medium">{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <span>Availability:</span>
                  <span className={availability.available ? 'text-green-600' : 'text-red-600'}>
                    {availability.available ? 'Available' : 'Not Available'}
                  </span>
                </div>
              </div>

              <Button 
                className="w-full" 
                size="lg" 
                onClick={handleAddToCart}
                disabled={!availability.available}
              >
                Add to Cart - {formatPrice(total)}
              </Button>
            </CardContent>
          </Card>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Shield className="h-4 w-4 text-primary" />
              <span>Insured & Safe</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Truck className="h-4 w-4 text-primary" />
              <span>Delivery Available</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-primary" />
              <span>Easy Rescheduling</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}