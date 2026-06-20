export interface Fabric {
  id: string
  name: string
  size: string
  texture: 'smooth' | 'canvas' | 'knit' | 'silk'
  icon: string
  description: string
}

export interface DyeMaterial {
  id: string
  name: string
  color: string
  colorLight: string
  colorName: string
  stock: number
  maxStock: number
  description: string
  origin: string
}

export interface TieMethod {
  id: string
  name: string
  description: string
  patternType: string
  icon: string
}

export interface PatternTemplate {
  id: string
  name: string
  tieMethodId: string
  dyeIds: string[]
  description: string
}

export interface TimeSlot {
  id: string
  tableId: string
  tableName: string
  time: string
  currentCount: number
  maxCount: number
  isChildFriendly: boolean
  isAvailable: boolean
}

export interface Booking {
  id: string
  fabricId: string
  dyeIds: string[]
  tieMethodId: string
  timeSlotId: string
  isParentChild: boolean
  childAge?: number
  status: 'pending' | 'confirmed' | 'completed' | 'picked_up'
  pickupBatchId?: string
  estimatedDryTime?: string
  createdAt: string
}

export interface PickupBatch {
  id: string
  time: string
  bookingIds: string[]
  status: 'drying' | 'ready' | 'picked_up'
}

export interface SoakStatus {
  id: string
  dyeId: string
  dyeName: string
  color: string
  status: 'preparing' | 'soaking' | 'ready'
  remainingMinutes: number
  totalMinutes: number
}

export interface WorkshopTable {
  id: string
  name: string
  capacity: number
  hasChildSeat: boolean
}
