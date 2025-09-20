import { addDays, format } from 'date-fns';
import { InventoryItem, Reservation, Tenant, Settings } from '../types';

export const defaultTenant: Tenant = {
  id: '1',
  slug: 'demo',
  name: 'Premier Party Rentals',
  logoUrl: '/logo.png',
  theme: {
    primary: '#5B8DEF',
    background: '#FFFFFF',
    text: '#1F2937'
  }
};

export const inventoryItems: InventoryItem[] = [
  {
    id: '1',
    slug: 'chiavari-chair',
    name: 'Chiavari Chair',
    description: 'Elegant gold chiavari chairs perfect for weddings and formal events. Comfortable and stylish seating option.',
    category: 'Seating',
    tags: ['wedding', 'formal', 'chair', 'gold'],
    images: ['/images/chiavari-chair-1.jpg', '/images/chiavari-chair-2.jpg'],
    qtyAvailable: 200,
    pricePerDay: 3.50,
    deposit: { type: 'flat', value: 1.00 }
  },
  {
    id: '2',
    slug: '20x20-tent',
    name: '20x20 Frame Tent',
    description: 'Professional frame tent providing shelter for outdoor events. Seats approximately 40 guests.',
    category: 'Tents',
    tags: ['tent', 'outdoor', 'wedding', 'party'],
    images: ['/images/tent-20x20-1.jpg', '/images/tent-20x20-2.jpg'],
    qtyAvailable: 5,
    pricePerDay: 150.00,
    deposit: { type: 'percent', value: 25 }
  },
  {
    id: '3',
    slug: '6ft-folding-table',
    name: '6ft Folding Table',
    description: 'Sturdy rectangular folding table seats 6-8 people. Perfect for dining and display.',
    category: 'Tables',
    tags: ['table', 'folding', 'rectangular', 'dining'],
    images: ['/images/folding-table-1.jpg', '/images/folding-table-2.jpg'],
    qtyAvailable: 50,
    pricePerDay: 8.00,
    deposit: { type: 'flat', value: 5.00 }
  },
  {
    id: '4',
    slug: 'bounce-house',
    name: 'Castle Bounce House',
    description: 'Large inflatable bounce house with castle theme. Great for kids parties and family events.',
    category: 'Inflatables',
    tags: ['bounce house', 'kids', 'inflatable', 'castle'],
    images: ['/images/bounce-house-1.jpg', '/images/bounce-house-2.jpg'],
    qtyAvailable: 3,
    pricePerDay: 200.00,
    deposit: { type: 'percent', value: 50 }
  },
  {
    id: '5',
    slug: 'cotton-candy-machine',
    name: 'Cotton Candy Machine',
    description: 'Professional cotton candy machine with supplies. Includes cones and flavored sugar.',
    category: 'Concessions',
    tags: ['cotton candy', 'concession', 'sweet', 'kids'],
    images: ['/images/cotton-candy-1.jpg', '/images/cotton-candy-2.jpg'],
    qtyAvailable: 2,
    pricePerDay: 75.00,
    deposit: { type: 'flat', value: 50.00 }
  },
  {
    id: '6',
    slug: 'popcorn-machine',
    name: 'Popcorn Machine',
    description: 'Vintage-style popcorn machine with supplies. Includes kernels, oil, and seasoning.',
    category: 'Concessions',
    tags: ['popcorn', 'concession', 'vintage', 'snack'],
    images: ['/images/popcorn-machine-1.jpg', '/images/popcorn-machine-2.jpg'],
    qtyAvailable: 2,
    pricePerDay: 65.00,
    deposit: { type: 'flat', value: 40.00 }
  },
  {
    id: '7',
    slug: 'led-uplight',
    name: 'LED Uplight',
    description: 'Color-changing LED uplight for ambient lighting. Battery powered with remote control.',
    category: 'Lighting',
    tags: ['LED', 'uplight', 'color', 'wireless'],
    images: ['/images/led-uplight-1.jpg', '/images/led-uplight-2.jpg'],
    qtyAvailable: 40,
    pricePerDay: 12.00,
    deposit: { type: 'flat', value: 5.00 }
  },
  {
    id: '8',
    slug: 'photo-booth',
    name: 'Photo Booth',
    description: 'Professional photo booth setup with props and instant printing. Great for events.',
    category: 'Entertainment',
    tags: ['photo booth', 'photos', 'props', 'entertainment'],
    images: ['/images/photo-booth-1.jpg', '/images/photo-booth-2.jpg'],
    qtyAvailable: 1,
    pricePerDay: 300.00,
    deposit: { type: 'percent', value: 30 }
  },
  {
    id: '9',
    slug: 'generator',
    name: 'Generac Generator',
    description: 'Portable generator for outdoor events. Provides reliable power for equipment.',
    category: 'Power',
    tags: ['generator', 'power', 'outdoor', 'portable'],
    images: ['/images/generator-1.jpg', '/images/generator-2.jpg'],
    qtyAvailable: 2,
    pricePerDay: 85.00,
    deposit: { type: 'flat', value: 100.00 }
  },
  {
    id: '10',
    slug: 'patio-heater',
    name: 'Patio Heater',
    description: 'Outdoor propane patio heater. Perfect for extending outdoor events into cooler weather.',
    category: 'Heating',
    tags: ['heater', 'propane', 'outdoor', 'warmth'],
    images: ['/images/patio-heater-1.jpg', '/images/patio-heater-2.jpg'],
    qtyAvailable: 8,
    pricePerDay: 35.00,
    deposit: { type: 'flat', value: 25.00 }
  }
];

// Create sample reservations for the next 30 days
const today = new Date();
export const reservations: Reservation[] = [
  {
    id: '1',
    itemId: '1', // Chiavari chairs
    qty: 50,
    startDate: format(addDays(today, 3), 'yyyy-MM-dd'),
    endDate: format(addDays(today, 5), 'yyyy-MM-dd'),
    status: 'confirmed'
  },
  {
    id: '2',
    itemId: '2', // 20x20 tent
    qty: 2,
    startDate: format(addDays(today, 7), 'yyyy-MM-dd'),
    endDate: format(addDays(today, 9), 'yyyy-MM-dd'),
    status: 'confirmed'
  },
  {
    id: '3',
    itemId: '4', // Bounce house
    qty: 1,
    startDate: format(addDays(today, 5), 'yyyy-MM-dd'),
    endDate: format(addDays(today, 6), 'yyyy-MM-dd'),
    status: 'confirmed'
  },
  {
    id: '4',
    itemId: '8', // Photo booth
    qty: 1,
    startDate: format(addDays(today, 12), 'yyyy-MM-dd'),
    endDate: format(addDays(today, 14), 'yyyy-MM-dd'),
    status: 'confirmed'
  },
  {
    id: '5',
    itemId: '3', // Folding tables
    qty: 20,
    startDate: format(addDays(today, 15), 'yyyy-MM-dd'),
    endDate: format(addDays(today, 17), 'yyyy-MM-dd'),
    status: 'confirmed'
  },
  {
    id: '6',
    itemId: '7', // LED uplights
    qty: 15,
    startDate: format(addDays(today, 20), 'yyyy-MM-dd'),
    endDate: format(addDays(today, 22), 'yyyy-MM-dd'),
    status: 'confirmed'
  }
];

export const settings: Settings = {
  cancellationPolicy: 'Cancellations must be made 48 hours prior to event date for full refund.',
  taxRate: 0.08,
  deliveryEnabled: true,
  pickupEnabled: true,
  buffers: {
    preDays: 0,
    postDays: 1
  }
};