import { Package, AlertTriangle } from 'lucide-react'
import { useWorkshopStore } from '@/hooks/useWorkshopStore'
import { cn } from '@/lib/utils'

function getStockBarColor(ratio: number): string {
  if (ratio > 0.6) return 'bg-green-500'
  if (ratio >= 0.3) return 'bg-yellow-500'
  return 'bg-red-500'
}

function getStockLabel(ratio: number): string {
  if (ratio > 0.6) return '充足'
  if (ratio >= 0.3) return '适中'
  return '紧张'
}

export default function MaterialManager() {
  const dyeMaterials = useWorkshopStore((s) => s.dyeMaterials)
  const bookings = useWorkshopStore((s) => s.bookings)
  const fabrics = useWorkshopStore((s) => s.fabrics)

  const fabricStats = fabrics.map((fabric) => {
    const count = bookings.filter((b) => b.fabricId === fabric.id).length
    return { ...fabric, count }
  }).filter((f) => f.count > 0)

  return (
    <div className="craft-card p-5">
      <div className="flex items-center gap-2 mb-5">
        <Package className="w-5 h-5 text-indigo-500" />
        <h2 className="craft-section-title">染料库存管理</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-5">
        {dyeMaterials.map((dye) => {
          const ratio = dye.stock / dye.maxStock
          const isLow = ratio < 0.3

          return (
            <div
              key={dye.id}
              className={cn(
                'relative rounded-xl border p-3.5 transition-all duration-200',
                isLow
                  ? 'border-red-300/70 bg-red-50/30'
                  : 'border-earth-200/60 bg-white/50',
              )}
            >
              {isLow && (
                <span className="absolute top-2 right-2 flex items-center gap-0.5 bg-red-100 text-red-600 text-xs font-medium px-1.5 py-0.5 rounded-full">
                  <AlertTriangle className="w-3 h-3" />
                  低库存
                </span>
              )}

              <div className="flex items-center gap-2.5 mb-3">
                <span
                  className="w-7 h-7 rounded-full flex-shrink-0 ring-2 ring-white shadow-sm"
                  style={{ backgroundColor: dye.color }}
                />
                <div className="min-w-0 flex-1">
                  <div className="font-serif-title text-earth-800 text-sm leading-tight truncate">
                    {dye.name}
                  </div>
                  <div className="text-xs truncate" style={{ color: dye.color }}>
                    {dye.colorName}
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="h-2 rounded-full bg-earth-100 overflow-hidden">
                  <div
                    className={cn('h-full rounded-full transition-all duration-500', getStockBarColor(ratio))}
                    style={{ width: `${ratio * 100}%` }}
                  />
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-earth-400">
                    {dye.stock} / {dye.maxStock}
                  </span>
                  <span
                    className={cn(
                      'font-medium',
                      ratio > 0.6 ? 'text-green-600' : ratio >= 0.3 ? 'text-yellow-600' : 'text-red-600',
                    )}
                  >
                    {getStockLabel(ratio)}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="border-t border-earth-200/50 pt-4">
        <div className="text-xs text-earth-500 font-medium mb-2.5">当前预约面料分布</div>
        <div className="flex flex-wrap gap-2">
          {fabricStats.map((f) => (
            <span
              key={f.id}
              className="inline-flex items-center gap-1 text-xs bg-earth-100/80 text-earth-600 px-2.5 py-1 rounded-lg border border-earth-200/40"
            >
              {f.name}
              <span className="font-medium text-indigo-600">{f.count}</span>
            </span>
          ))}
          {fabricStats.length === 0 && (
            <span className="text-xs text-earth-400">暂无预约</span>
          )}
        </div>
      </div>
    </div>
  )
}
