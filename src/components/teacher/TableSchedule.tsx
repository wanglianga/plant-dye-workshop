import { useState } from 'react'
import { LayoutGrid, Users, Baby } from 'lucide-react'
import { useWorkshopStore } from '@/hooks/useWorkshopStore'
import { cn } from '@/lib/utils'

const TIME_PERIODS = ['09:00', '10:30', '14:00', '15:30']

function getCellIntensity(ratio: number): string {
  if (ratio === 0) return 'bg-earth-100/60 border-earth-200/40'
  if (ratio < 0.3) return 'bg-indigo-100 border-indigo-200/50'
  if (ratio < 0.6) return 'bg-indigo-200 border-indigo-300/50'
  if (ratio < 1) return 'bg-indigo-300 border-indigo-400/50'
  return 'bg-indigo-500 border-indigo-600/50 text-white'
}

interface CellTooltipProps {
  tableId: string
  time: string
  bookings: ReturnType<typeof useWorkshopStore.getState>['bookings']
  timeSlots: ReturnType<typeof useWorkshopStore.getState>['timeSlots']
  fabrics: ReturnType<typeof useWorkshopStore.getState>['fabrics']
}

function CellTooltip({ tableId, time, bookings, timeSlots, fabrics }: CellTooltipProps) {
  const slot = timeSlots.find((ts) => ts.tableId === tableId && ts.time === time)
  if (!slot) return null

  const slotBookings = bookings.filter((b) => b.timeSlotId === slot.id)

  return (
    <div className="absolute z-20 bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-white rounded-xl shadow-lg border border-earth-200/60 p-3 pointer-events-none animate-fade-in">
      <div className="text-xs font-medium text-earth-700 mb-1.5">
        {slot.tableName} · {time}
      </div>
      <div className="text-xs text-earth-500 mb-1.5">
        容量 {slot.currentCount}/{slot.maxCount}
        {slot.isChildFriendly && ' · 有儿童座'}
      </div>
      {slotBookings.length > 0 && (
        <div className="space-y-1">
          {slotBookings.map((b) => {
            const fabric = fabrics.find((f) => f.id === b.fabricId)
            return (
              <div key={b.id} className="text-xs text-earth-600 flex items-center gap-1">
                {fabric?.name ?? '—'}
                {b.isParentChild && <Baby className="w-3 h-3 text-pink-500" />}
              </div>
            )
          })}
        </div>
      )}
      {slotBookings.length === 0 && (
        <div className="text-xs text-earth-400">暂无预约</div>
      )}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white" />
    </div>
  )
}

export default function TableSchedule() {
  const timeSlots = useWorkshopStore((s) => s.timeSlots)
  const workshopTables = useWorkshopStore((s) => s.workshopTables)
  const bookings = useWorkshopStore((s) => s.bookings)
  const fabrics = useWorkshopStore((s) => s.fabrics)

  const [hoveredCell, setHoveredCell] = useState<string | null>(null)

  const hasParentChildBooking = (tableId: string, time: string): boolean => {
    const slot = timeSlots.find((ts) => ts.tableId === tableId && ts.time === time)
    if (!slot) return false
    return bookings.some((b) => b.timeSlotId === slot.id && b.isParentChild)
  }

  return (
    <div className="craft-card p-5">
      <div className="flex items-center gap-2 mb-5">
        <LayoutGrid className="w-5 h-5 text-indigo-500" />
        <h2 className="craft-section-title">桌位时段总览</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="text-xs text-earth-500 font-medium p-2 text-left w-20">
                <Users className="w-3.5 h-3.5 inline mr-1" />
                桌位
              </th>
              {TIME_PERIODS.map((time) => (
                <th key={time} className="text-xs text-earth-500 font-medium p-2 text-center">
                  {time}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {workshopTables.map((table) => (
              <tr key={table.id}>
                <td className="p-2">
                  <div className="text-sm font-serif-title text-earth-700">{table.name}</div>
                  <div className="text-xs text-earth-400 flex items-center gap-1">
                    {table.capacity}人
                    {table.hasChildSeat && <Baby className="w-3 h-3 text-pink-400" />}
                  </div>
                </td>
                {TIME_PERIODS.map((time) => {
                  const slot = timeSlots.find((ts) => ts.tableId === table.id && ts.time === time)
                  const ratio = slot ? slot.currentCount / slot.maxCount : 0
                  const cellKey = `${table.id}-${time}`
                  const isHovered = hoveredCell === cellKey
                  const hasChild = hasParentChildBooking(table.id, time)

                  return (
                    <td key={time} className="p-1.5">
                      <div
                        className="relative"
                        onMouseEnter={() => setHoveredCell(cellKey)}
                        onMouseLeave={() => setHoveredCell(null)}
                      >
                        <div
                          className={cn(
                            'h-14 rounded-lg border flex flex-col items-center justify-center gap-0.5 transition-all duration-200 cursor-default',
                            getCellIntensity(ratio),
                          )}
                        >
                          <span className="text-xs font-medium">
                            {slot ? `${slot.currentCount}/${slot.maxCount}` : '—'}
                          </span>
                          {hasChild && <Baby className="w-3 h-3 text-pink-500" />}
                        </div>

                        {isHovered && (
                          <CellTooltip
                            tableId={table.id}
                            time={time}
                            bookings={bookings}
                            timeSlots={timeSlots}
                            fabrics={fabrics}
                          />
                        )}
                      </div>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center gap-4 mt-4 pt-3 border-t border-earth-200/40">
        <span className="text-xs text-earth-400">占用率：</span>
        <div className="flex items-center gap-1.5">
          <span className="w-4 h-3 rounded bg-earth-100/60 border border-earth-200/40" />
          <span className="text-xs text-earth-500">空</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-4 h-3 rounded bg-indigo-200 border border-indigo-300/50" />
          <span className="text-xs text-earth-500">少</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-4 h-3 rounded bg-indigo-300 border border-indigo-400/50" />
          <span className="text-xs text-earth-500">半</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-4 h-3 rounded bg-indigo-500 border border-indigo-600/50" />
          <span className="text-xs text-earth-500">满</span>
        </div>
        <div className="flex items-center gap-1.5 ml-2">
          <Baby className="w-3.5 h-3.5 text-pink-500" />
          <span className="text-xs text-earth-500">亲子</span>
        </div>
      </div>
    </div>
  )
}
