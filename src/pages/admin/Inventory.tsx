import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Package, Search, Filter } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { AdminLayout } from '../../components/AdminLayout';
import { useInventoryStore } from '../../stores/inventoryStore';
import { formatPrice } from '../../lib/pricing';
import { useToast } from '../../hooks/use-toast';
import type { InventoryItem } from '../../types';

export default function AdminInventory() {
  const { toast } = useToast();
  const { items, addItem, updateItem, removeItem } = useInventoryStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    tags: '',
    qtyAvailable: 1,
    pricePerDay: 0,
    depositType: 'flat' as 'flat' | 'percent',
    depositValue: 0
  });

  const categories = ['Seating', 'Tables', 'Tents', 'Lighting', 'Entertainment', 'Concessions', 'Inflatables', 'Power', 'Heating'];

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: '',
      tags: '',
      qtyAvailable: 1,
      pricePerDay: 0,
      depositType: 'flat',
      depositValue: 0
    });
    setEditingItem(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const slug = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);

    const itemData = {
      name: formData.name,
      slug,
      description: formData.description,
      category: formData.category,
      tags: tagsArray,
      images: ['/images/placeholder.jpg'],
      qtyAvailable: formData.qtyAvailable,
      pricePerDay: formData.pricePerDay,
      deposit: formData.depositValue > 0 ? {
        type: formData.depositType,
        value: formData.depositValue
      } : undefined
    };

    if (editingItem) {
      updateItem(editingItem.id, itemData);
      toast({
        title: "Item Updated",
        description: `${formData.name} has been updated successfully.`,
      });
    } else {
      const newItem: InventoryItem = {
        ...itemData,
        id: Date.now().toString()
      };
      addItem(newItem);
      toast({
        title: "Item Added",
        description: `${formData.name} has been added to inventory.`,
      });
    }

    resetForm();
    setIsDialogOpen(false);
  };

  const handleEdit = (item: InventoryItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      category: item.category,
      tags: item.tags.join(', '),
      qtyAvailable: item.qtyAvailable,
      pricePerDay: item.pricePerDay,
      depositType: item.deposit?.type || 'flat',
      depositValue: item.deposit?.value || 0
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (item: InventoryItem) => {
    if (confirm(`Are you sure you want to delete "${item.name}"?`)) {
      removeItem(item.id);
      toast({
        title: "Item Deleted",
        description: `${item.name} has been removed from inventory.`,
        variant: "destructive"
      });
    }
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold">Inventory Management</h2>
          <p className="text-muted-foreground">Manage your party rental inventory</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="shadow-soft">
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? 'Edit Item' : 'Add New Item'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Item Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="wedding, outdoor, elegant"
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="qty">Quantity Available *</Label>
                  <Input
                    id="qty"
                    type="number"
                    min="1"
                    value={formData.qtyAvailable}
                    onChange={(e) => setFormData({ ...formData, qtyAvailable: parseInt(e.target.value) || 1 })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="price">Price per Day *</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.pricePerDay}
                    onChange={(e) => setFormData({ ...formData, pricePerDay: parseFloat(e.target.value) || 0 })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="deposit">Deposit Amount</Label>
                  <Input
                    id="deposit"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.depositValue}
                    onChange={(e) => setFormData({ ...formData, depositValue: parseFloat(e.target.value) || 0 })}
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingItem ? 'Update Item' : 'Add Item'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="md:col-span-2">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search inventory..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <Package className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold">{items.length}</div>
              <div className="text-sm text-muted-foreground">Total Items</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {items.filter(item => item.qtyAvailable > 0).length}
              </div>
              <div className="text-sm text-muted-foreground">Available</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Inventory Table */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Inventory Items ({filteredItems.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price/Day</TableHead>
                <TableHead>Available</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-muted-foreground line-clamp-1">
                        {item.description}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{item.category}</Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatPrice(item.pricePerDay)}
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{item.qtyAvailable}</span>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={item.qtyAvailable > 0 ? "default" : "secondary"}
                      className={item.qtyAvailable > 0 ? "bg-green-600" : ""}
                    >
                      {item.qtyAvailable > 0 ? 'In Stock' : 'Out of Stock'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEdit(item)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDelete(item)}
                        className="hover:bg-destructive hover:text-destructive-foreground"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredItems.length === 0 && (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No items found</h3>
              <p className="text-muted-foreground">
                {searchQuery ? 'Try adjusting your search criteria.' : 'Start by adding your first inventory item.'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
}