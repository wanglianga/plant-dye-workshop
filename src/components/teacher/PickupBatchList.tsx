import { Clock, Package, CheckCircle, Baby } from 'lucide-react'
import { useWorkshopStore } from '@/hooks/useWorkshopStore'
import { cn } from '@/lib/utils'
import type { PickupBatch } from '@/lib/types'

const statusConfig: Record<PickupBatch['status'], { label: string; color: string; bg: string; icon: typeof Clock }> = {
  drying: { label: '晾晒中', color: 'text-yellow-700', bg: 'bg-yellow-100 border-yellow-300/60', icon: Clock },
  ready: { label: '可取件', color: 'text-blue-700', bg: 'bg-blue-100 border-blue-300/60', icon: Package },
  picked_up: { label: '已取件', color: 'text-green-700', bg: 'bg-green-100 border-green-300/60', icon: CheckCircle },
}

const nextStatus: Record<PickupBatch['status'], PickupBatch['status'] | null> = {
  drying: 'ready',
  ready: 'picked_up',
  picked_up: null,
}

export default function PickupBatchList() {
  const pickupBatches = useWorkshopStore((s) => s.pickupBatches)
  const bookings = useWorkshopStore((s) => s.bookings)
  const updatePickupBatchStatus = useWorkshopStore((s) => s.updatePickupBatchStatus)
  const dyeMaterials = useWorkshopStore((s) => s.dyeMaterials)
  const fabrics = useWorkshopStore((s) => s.fabrics)
  const tieMethods = useWorkshopStore((s) => s.tieMethods)

  const handleAdvance = (batch: PickupBatch) => {
    const next = nextStatus[batch.status]
    if (!next) return
    updatePickupBatchStatus(batch.id, next)
  }

  const sortedBatches = [...pickupBatches].sort((a, b) => a.time.localeCompare(b.time))

  return (
    <div className="craft-card p-5">
      <div className="flex items-center gap-2 mb-5">
        <Clock className="w-5 h-5 text-indigo-500" />
        <h2 className="craft-section-title">取件批次</h2>
      </div>

      {sortedBatches.length === 0 ? (
        <p className="text-sm text-earth-400 text-center py-6">暂无取件批次</p>
      ) : (
        <div className="relative">
          <div className="absolute left-[23px] top-4 bottom-4 w-0.5 bg-earth-200/60" />

          <div className="space-y-4">
            {sortedBatches.map((batch) => {
              const config = statusConfig[batch.status]
              const StatusIcon = config.icon
              const next = nextStatus[batch.status]
              const batchBookings = bookings.filter((b) => batch.bookingIds.includes(b.id))

              return (
                <div key={batch.id} className="relative flex gap-4">
                  <div className="relative flex-shrink-0 w-12 flex flex-col items-center">
                    <div
                      className={cn(
                        'w-10 h-10 rounded-full border-2 flex items-center justify-center z-10',
                        config.bg,
                      )}
                    >
                      <StatusIcon className={cn('w-4 h-4', config.color)} />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0 pb-2">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-serif-title text-earth-700 text-sm">
                          {batch.time}
                        </span>
                        <span className="text-xs text-earth-400">
                          {batch.bookingIds.length} 件
                        </span>
                        <span
                          className={cn(
                            'inline-flex items-center gap-0.5 text-xs font-medium px-2 py-0.5 rounded-full border',
                            config.bg,
                            config.color,
                          )}
                        >
                          {config.label}
                        </span>
                      </div>

                      {next && (
                        <button
                          onClick={() => handleAdvance(batch)}
                          className={cn(
                            'text-xs font-medium px-3 py-1 rounded-lg transition-all duration-200 active:scale-95',
                            batch.status === 'drying'
                              ? 'bg-blue-500 text-white hover:bg-blue-400'
                              : 'bg-green-500 text-white hover:bg-green-400',
                          )}
                        >
                          {next === 'ready' ? '标记可取件' : '标记已取件'}
                        </button>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      {batchBookings.map((booking) => {
                        const fabric = fabrics.find((f) => f.id === booking.fabricId)
                        const tieMethod = tieMethods.find((t) => t.id === booking.tieMethodId)
                        const dyeColors = booking.dyeIds
                          .map((dId) => dyeMaterials.find((d) => d.id === dId))
                          .filter(Boolean)

                        return (
                          <div
                            key={booking.id}
                            className="flex items-center gap-2 bg-white/50 rounded-lg border border-earth-200/40 px-3 py-2"
                          >
                            <span className="text-xs text-earth-600 font-medium">
                              {fabric?.name ?? '—'}
                            </span>

                            <div className="flex items-center gap-1">
                              {dyeColors.map((dye) =>
                                dye ? (
                                  <span
                                    key={dye.id}
                                    className="w-4 h-4 rounded-full ring-1 ring-white shadow-sm"
                                    style={{ backgroundColor: dye.color }}
                                    title={dye.name}
                                  />
                                ) : null,
                              )}
                            </div>

                            <span className="text-xs text-earth-400">
                              {tieMethod?.name ?? '—'}
                            </span>

                            {booking.isParentChild && (
                              <Baby className="w-3.5 h-3.5 text-pink-500" />
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
