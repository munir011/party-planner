import { addDays, eachDayOfInterval, isAfter, isBefore, parseISO, format } from 'date-fns';
import { Reservation, InventoryItem, AvailabilityCheck } from '../types';
import { reservations } from '../data/seed';
import { settings } from '../data/seed';

export function calculateAvailability(
  item: InventoryItem,
  startDate: string,
  endDate: string,
  requestedQty: number = 1,
  excludeReservationId?: string
): AvailabilityCheck {
  const start = parseISO(startDate);
  const end = parseISO(endDate);
  
  // Get all days in the requested range
  const requestedDays = eachDayOfInterval({ start, end: addDays(end, -1) });
  
  // Get relevant reservations for this item
  const itemReservations = reservations.filter(res => 
    res.itemId === item.id && 
    res.status === 'confirmed' &&
    res.id !== excludeReservationId
  );
  
  const disabledDates: string[] = [];
  let minAvailableQty = item.qtyAvailable;
  
  // Check each day in the requested range
  for (const day of requestedDays) {
    const dayStr = format(day, 'yyyy-MM-dd');
    let qtyUsed = 0;
    
    // Check all reservations that overlap with this day
    for (const reservation of itemReservations) {
      const resStart = parseISO(reservation.startDate);
      const resEnd = parseISO(reservation.endDate);
      
      // Add buffer days
      const bufferStart = addDays(resStart, -settings.buffers.preDays);
      const bufferEnd = addDays(resEnd, settings.buffers.postDays);
      
      // Check if this day overlaps with the reservation (including buffers)
      if (!isBefore(day, bufferStart) && isBefore(day, bufferEnd)) {
        qtyUsed += reservation.qty;
      }
    }
    
    const availableQty = item.qtyAvailable - qtyUsed;
    
    if (availableQty < requestedQty) {
      disabledDates.push(dayStr);
    }
    
    minAvailableQty = Math.min(minAvailableQty, availableQty);
  }
  
  return {
    available: disabledDates.length === 0,
    availableQty: minAvailableQty,
    disabledDates
  };
}

export function getDisabledDatesForItem(item: InventoryItem, requestedQty: number = 1): string[] {
  const today = new Date();
  const endRange = addDays(today, 365); // Check next year
  
  // Get all days to check
  const allDays = eachDayOfInterval({ start: today, end: endRange });
  const disabledDates: string[] = [];
  
  const itemReservations = reservations.filter(res => 
    res.itemId === item.id && res.status === 'confirmed'
  );
  
  for (const day of allDays) {
    const dayStr = format(day, 'yyyy-MM-dd');
    let qtyUsed = 0;
    
    for (const reservation of itemReservations) {
      const resStart = parseISO(reservation.startDate);
      const resEnd = parseISO(reservation.endDate);
      
      const bufferStart = addDays(resStart, -settings.buffers.preDays);
      const bufferEnd = addDays(resEnd, settings.buffers.postDays);
      
      if (!isBefore(day, bufferStart) && isBefore(day, bufferEnd)) {
        qtyUsed += reservation.qty;
      }
    }
    
    if (item.qtyAvailable - qtyUsed < requestedQty) {
      disabledDates.push(dayStr);
    }
  }
  
  return disabledDates;
}