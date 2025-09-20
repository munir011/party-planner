import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Star } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useInventoryStore } from '../stores/inventoryStore';
import { formatPrice } from '../lib/pricing';

export default function Catalog() {
  const items = useInventoryStore((state) => state.items);
  const categories = useInventoryStore((state) => state.categories);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name');

  const filteredAndSortedItems = useMemo(() => {
    let filtered = items;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    // Sort items
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.pricePerDay - b.pricePerDay;
        case 'price-high':
          return b.pricePerDay - a.pricePerDay;
        case 'category':
          return a.category.localeCompare(b.category);
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  }, [items, searchQuery, selectedCategory, sortBy]);

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Party Rentals Catalog</h1>
        <p className="text-lg text-muted-foreground">
          Browse our complete selection of party rental items for your special event.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-card rounded-lg border p-6 mb-8 shadow-card">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search rentals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name A-Z</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="category">Category</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            More Filters
          </Button>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-muted-foreground">
          Showing {filteredAndSortedItems.length} of {items.length} items
          {selectedCategory !== 'all' && ` in ${selectedCategory}`}
        </p>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredAndSortedItems.map((item) => (
          <Link key={item.id} to={`/item/${item.slug}`}>
            <Card className="group cursor-pointer transition-all duration-300 hover:shadow-glow hover:-translate-y-2">
              <div className="aspect-square bg-gradient-card rounded-t-lg relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10" />
                <div className="absolute top-4 right-4">
                  <Badge variant="secondary" className="bg-white/90 text-foreground">
                    {item.category}
                  </Badge>
                </div>
                <div className="absolute bottom-4 left-4 text-white">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="text-sm font-medium">4.8</span>
                  </div>
                </div>
                <div className="absolute top-4 left-4">
                  {item.qtyAvailable <= 5 && (
                    <Badge variant="destructive" className="text-xs">
                      Limited Stock
                    </Badge>
                  )}
                </div>
              </div>
              
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                  {item.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {item.description}
                </p>
                
                <div className="flex flex-wrap gap-1 mb-3">
                  {item.tags.slice(0, 3).map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-lg font-bold text-primary">
                    {formatPrice(item.pricePerDay)}/day
                  </div>
                  <Badge 
                    variant={item.qtyAvailable > 10 ? "default" : "secondary"} 
                    className="text-xs"
                  >
                    {item.qtyAvailable} available
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {filteredAndSortedItems.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold mb-2">No items found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search or filter criteria.
          </p>
          <Button onClick={() => {
            setSearchQuery('');
            setSelectedCategory('all');
          }}>
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}