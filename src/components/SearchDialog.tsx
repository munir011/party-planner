import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Package, Calendar, Tag } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { useInventoryStore } from '../stores/inventoryStore';
import { formatPrice } from '../lib/pricing';

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const navigate = useNavigate();
  const items = useInventoryStore((state) => state.items);
  const categories = useInventoryStore((state) => state.categories);
  const [query, setQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState(items);

  useEffect(() => {
    if (!query.trim()) {
      setFilteredItems(items.slice(0, 6)); // Show first 6 items when no query
      return;
    }

    const filtered = items.filter(item =>
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    ).slice(0, 8); // Limit results

    setFilteredItems(filtered);
  }, [query, items]);

  const handleItemClick = (slug: string) => {
    navigate(`/item/${slug}`);
    onOpenChange(false);
    setQuery('');
  };

  const handleCategoryClick = (category: string) => {
    navigate(`/catalog?category=${encodeURIComponent(category)}`);
    onOpenChange(false);
    setQuery('');
  };

  const handleViewAll = () => {
    if (query.trim()) {
      navigate(`/catalog?search=${encodeURIComponent(query)}`);
    } else {
      navigate('/catalog');
    }
    onOpenChange(false);
    setQuery('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search Rentals
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search for party rentals..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10"
              autoFocus
            />
          </div>

          {/* Categories */}
          {!query && (
            <div>
              <h3 className="text-sm font-medium mb-2 flex items-center gap-1">
                <Tag className="h-4 w-4" />
                Browse Categories
              </h3>
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <Badge
                    key={category}
                    variant="outline"
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                    onClick={() => handleCategoryClick(category)}
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Results */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium flex items-center gap-1">
                <Package className="h-4 w-4" />
                {query ? 'Search Results' : 'Popular Items'}
              </h3>
              {filteredItems.length > 0 && (
                <button
                  onClick={handleViewAll}
                  className="text-sm text-primary hover:underline"
                >
                  View all
                </button>
              )}
            </div>

            <div className="max-h-96 overflow-y-auto space-y-2">
              {filteredItems.map(item => (
                <Card
                  key={item.id}
                  className="cursor-pointer transition-all hover:shadow-md hover:scale-[1.02]"
                  onClick={() => handleItemClick(item.slug)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-card rounded flex-shrink-0">
                        <div className="w-full h-full bg-gradient-to-br from-primary/10 to-secondary/10 rounded" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{item.name}</h4>
                        <p className="text-sm text-muted-foreground truncate">
                          {item.description}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {item.category}
                          </Badge>
                          <span className="text-sm font-medium text-primary">
                            {formatPrice(item.pricePerDay)}/day
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-xs text-muted-foreground">
                          {item.qtyAvailable} available
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {filteredItems.length === 0 && query && (
                <div className="text-center py-8">
                  <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No results found</h3>
                  <p className="text-muted-foreground">
                    Try searching for different keywords or browse our categories.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}