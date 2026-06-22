export interface Fabric {
  id: string
  name: string
  size: string
  texture: 'smooth' | 'canvas' | 'knit' | 'silk'
  icon: string
  description: string
  baseColor: 'light' | 'medium' | 'dark'
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
  boilTimeMinutes: number
  dryTimeHours: number
  suitableForDark: boolean
  needsPreBoil: boolean
  alternativeDyeIds: string[]
  difficultyLevel: 1 | 2 | 3
  needsTeacherPrep: boolean
}

export interface FailureRisk {
  level: 'low' | 'medium' | 'high'
  title: string
  description: string
  tips: string[]
}

export interface TieMethod {
  id: string
  name: string
  description: string
  patternType: string
  icon: string
  difficultyLevel: 1 | 2 | 3
  estimatedMinutes: number
  failureRisk: FailureRisk
  colorBlockHint: string
  patternHint: string
  textureTip: string
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

export interface DyeAlert {
  dyeId: string
  dyeName: string
  alertType: 'low_stock' | 'needs_pre_boil' | 'unsuitable_dark' | 'long_dry_time'
  title: string
  description: string
  severity: 'info' | 'warning' | 'danger'
  alternativeColors?: { id: string; name: string; color: string }[]
  difficultyChange?: string
  teacherPrepRequired?: boolean
  pickupDateImpact?: string
}
