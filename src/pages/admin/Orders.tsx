import { useState, useEffect } from 'react';
import { Calendar, Package, DollarSign, Eye, Search, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Separator } from '../../components/ui/separator';
import { AdminLayout } from '../../components/AdminLayout';
import { formatPrice } from '../../lib/pricing';
import { format } from 'date-fns';
import type { Order } from '../../types';

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    // Load orders from localStorage
    const savedOrders = JSON.parse(localStorage.getItem('party-rentals-orders') || '[]');
    setOrders(savedOrders);
  }, []);

  const filteredOrders = orders.filter(order =>
    order.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.customer.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalRevenue = orders.reduce((sum, order) => sum + order.totals.total, 0);
  const averageOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;

  return (
    <AdminLayout>
      <div className="mb-8">
        <h2 className="text-2xl font-bold">Order Management</h2>
        <p className="text-muted-foreground">View and manage customer orders</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <Package className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold">{orders.length}</div>
              <div className="text-sm text-muted-foreground">Total Orders</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">{formatPrice(totalRevenue)}</div>
              <div className="text-sm text-muted-foreground">Total Revenue</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">{formatPrice(averageOrderValue)}</div>
              <div className="text-sm text-muted-foreground">Avg Order Value</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {orders.filter(order => order.status === 'confirmed').length}
              </div>
              <div className="text-sm text-muted-foreground">Confirmed</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="mb-8">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search orders by number, customer name, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Orders ({filteredOrders.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order #</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <div className="font-mono text-sm">{order.number}</div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{order.customer.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {order.customer.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {format(new Date(order.createdAt), 'MMM d, yyyy')}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {order.lineItems.length} item{order.lineItems.length !== 1 ? 's' : ''}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatPrice(order.totals.total)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="default" className="bg-green-600">
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setSelectedOrder(order)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Order Details - {order.number}</DialogTitle>
                        </DialogHeader>
                        
                        {selectedOrder && (
                          <div className="space-y-6">
                            {/* Customer Info */}
                            <div>
                              <h3 className="font-semibold mb-2">Customer Information</h3>
                              <div className="space-y-1 text-sm">
                                <div><strong>Name:</strong> {selectedOrder.customer.name}</div>
                                <div><strong>Email:</strong> {selectedOrder.customer.email}</div>
                                <div><strong>Phone:</strong> {selectedOrder.customer.phone}</div>
                                <div><strong>Address:</strong> {selectedOrder.customer.address}</div>
                              </div>
                            </div>

                            <Separator />

                            {/* Order Items */}
                            <div>
                              <h3 className="font-semibold mb-2">Order Items</h3>
                              <div className="space-y-3">
                                {selectedOrder.lineItems.map((item, index) => (
                                  <div key={index} className="flex justify-between items-start border-b pb-2">
                                    <div>
                                      <div className="font-medium">{item.name}</div>
                                      <div className="text-sm text-muted-foreground">
                                        Qty: {item.qty} • {format(new Date(item.startDate), 'MMM d')} - {format(new Date(item.endDate), 'MMM d')}
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <div className="font-medium">{formatPrice(item.unitPrice * item.qty)}</div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <Separator />

                            {/* Order Summary */}
                            <div>
                              <h3 className="font-semibold mb-2">Order Summary</h3>
                              <div className="space-y-1 text-sm">
                                <div className="flex justify-between">
                                  <span>Subtotal:</span>
                                  <span>{formatPrice(selectedOrder.totals.subtotal)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Security Deposit:</span>
                                  <span>{formatPrice(selectedOrder.totals.depositEstimate)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Tax:</span>
                                  <span>{formatPrice(selectedOrder.totals.tax)}</span>
                                </div>
                                <Separator />
                                <div className="flex justify-between font-semibold">
                                  <span>Total:</span>
                                  <span>{formatPrice(selectedOrder.totals.total)}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredOrders.length === 0 && (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No orders found</h3>
              <p className="text-muted-foreground">
                {searchQuery ? 'Try adjusting your search criteria.' : 'Orders will appear here when customers place them.'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
}