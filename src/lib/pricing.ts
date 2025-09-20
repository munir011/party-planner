import { differenceInDays } from 'date-fns';
import { CartItem, InventoryItem } from '../types';
import { settings } from '../data/seed';

export function calculateDays(startDate: string, endDate: string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return Math.max(1, differenceInDays(end, start));
}

export function calculateLineItemTotal(item: CartItem): number {
  const days = calculateDays(item.startDate, item.endDate);
  return item.unitPrice * item.qty * days;
}

export function calculateCartTotals(items: CartItem[]) {
  const subtotal = items.reduce((total, item) => total + calculateLineItemTotal(item), 0);
  const tax = subtotal * settings.taxRate;
  const total = subtotal + tax;
  
  // Calculate deposit estimate
  let depositEstimate = 0;
  for (const item of items) {
    const lineTotal = calculateLineItemTotal(item);
    // For simplicity, using flat deposit of 25% of line total
    depositEstimate += lineTotal * 0.25;
  }
  
  return {
    subtotal: Math.round(subtotal * 100) / 100,
    tax: Math.round(tax * 100) / 100,
    total: Math.round(total * 100) / 100,
    depositEstimate: Math.round(depositEstimate * 100) / 100
  };
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
}