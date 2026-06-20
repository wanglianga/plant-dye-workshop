import { create } from 'zustand'
import type { Fabric, DyeMaterial, TieMethod, PatternTemplate, TimeSlot, Booking, PickupBatch, SoakStatus, WorkshopTable } from '@/lib/types'
import { fabrics, dyeMaterials, tieMethods, patternTemplates, timeSlots, initialBookings, initialPickupBatches, initialSoakStatuses, workshopTables } from '@/lib/mockData'

interface WorkshopState {
  fabrics: Fabric[]
  dyeMaterials: DyeMaterial[]
  tieMethods: TieMethod[]
  patternTemplates: PatternTemplate[]
  timeSlots: TimeSlot[]
  workshopTables: WorkshopTable[]
  bookings: Booking[]
  pickupBatches: PickupBatch[]
  soakStatuses: SoakStatus[]

  selectedFabricId: string | null
  selectedDyeIds: string[]
  selectedTieMethodId: string | null
  selectedTimeSlotId: string | null
  isParentChild: boolean
  childAge: number
  patternSeed: number

  selectFabric: (id: string) => void
  toggleDye: (id: string) => void
  selectTieMethod: (id: string) => void
  selectTimeSlot: (id: string) => void
  setParentChild: (v: boolean) => void
  setChildAge: (age: number) => void
  regeneratePattern: () => void
  submitBooking: () => void
  updatePickupBatchStatus: (batchId: string, status: PickupBatch['status']) => void
  updateSoakStatus: (soakId: string, status: SoakStatus['status'], remainingMinutes?: number) => void
  resetSelection: () => void
}

export const useWorkshopStore = create<WorkshopState>((set, get) => ({
  fabrics,
  dyeMaterials,
  tieMethods,
  patternTemplates,
  timeSlots,
  workshopTables,
  bookings: initialBookings,
  pickupBatches: initialPickupBatches,
  soakStatuses: initialSoakStatuses,

  selectedFabricId: null,
  selectedDyeIds: [],
  selectedTieMethodId: null,
  selectedTimeSlotId: null,
  isParentChild: false,
  childAge: 6,
  patternSeed: Math.floor(Math.random() * 1000000),

  selectFabric: (id) => set({ selectedFabricId: id }),

  toggleDye: (id) => set((state) => {
    const exists = state.selectedDyeIds.includes(id)
    const newIds = exists
      ? state.selectedDyeIds.filter((d) => d !== id)
      : state.selectedDyeIds.length < 3
        ? [...state.selectedDyeIds, id]
        : state.selectedDyeIds
    return { selectedDyeIds: newIds, patternSeed: Math.floor(Math.random() * 1000000) }
  }),

  selectTieMethod: (id) => set({ selectedTieMethodId: id, patternSeed: Math.floor(Math.random() * 1000000) }),

  selectTimeSlot: (id) => set({ selectedTimeSlotId: id }),

  setParentChild: (v) => set({ isParentChild: v }),

  setChildAge: (age) => set({ childAge: age }),

  regeneratePattern: () => set({ patternSeed: Math.floor(Math.random() * 1000000) }),

  submitBooking: () => {
    const state = get()
    if (!state.selectedFabricId || state.selectedDyeIds.length === 0 || !state.selectedTieMethodId || !state.selectedTimeSlotId) return

    const slot = state.timeSlots.find((s) => s.id === state.selectedTimeSlotId)
    if (!slot) return

    const newBooking: Booking = {
      id: `b${Date.now()}`,
      fabricId: state.selectedFabricId,
      dyeIds: [...state.selectedDyeIds],
      tieMethodId: state.selectedTieMethodId,
      timeSlotId: state.selectedTimeSlotId,
      isParentChild: state.isParentChild,
      childAge: state.isParentChild ? state.childAge : undefined,
      status: 'pending',
      estimatedDryTime: slot.time === '09:00' ? '14:00' : slot.time === '10:30' ? '16:00' : slot.time === '14:00' ? '18:00' : '19:30',
      createdAt: new Date().toISOString(),
    }

    set((state) => ({
      bookings: [...state.bookings, newBooking],
      timeSlots: state.timeSlots.map((ts) =>
        ts.id === state.selectedTimeSlotId
          ? { ...ts, currentCount: ts.currentCount + 1, isAvailable: ts.currentCount + 1 < ts.maxCount }
          : ts
      ),
      selectedFabricId: null,
      selectedDyeIds: [],
      selectedTieMethodId: null,
      selectedTimeSlotId: null,
      isParentChild: false,
      childAge: 6,
    }))
  },

  updatePickupBatchStatus: (batchId, status) => set((state) => ({
    pickupBatches: state.pickupBatches.map((b) =>
      b.id === batchId ? { ...b, status } : b
    ),
    bookings: state.bookings.map((b) =>
      b.pickupBatchId === batchId && status === 'picked_up'
        ? { ...b, status: 'picked_up' as const }
        : b
    ),
  })),

  updateSoakStatus: (soakId, status, remainingMinutes) => set((state) => ({
    soakStatuses: state.soakStatuses.map((s) =>
      s.id === soakId
        ? { ...s, status, remainingMinutes: remainingMinutes ?? s.remainingMinutes }
        : s
    ),
  })),

  resetSelection: () => set({
    selectedFabricId: null,
    selectedDyeIds: [],
    selectedTieMethodId: null,
    selectedTimeSlotId: null,
    isParentChild: false,
    childAge: 6,
  }),
}))
