import { useWorkshopStore } from '@/hooks/useWorkshopStore'
import { cn } from '@/lib/utils'

export default function DyeMaterialPicker() {
  const dyeMaterials = useWorkshopStore((s) => s.dyeMaterials)
  const selectedDyeIds = useWorkshopStore((s) => s.selectedDyeIds)
  const toggleDye = useWorkshopStore((s) => s.toggleDye)

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {dyeMaterials.map((dye) => {
        const isSelected = selectedDyeIds.includes(dye.id)
        const isFull = selectedDyeIds.length >= 3
        const isDisabled = isFull && !isSelected
        const stockRatio = dye.stock / dye.maxStock
        const isLowStock = stockRatio < 0.3

        return (
          <button
            key={dye.id}
            onClick={() => {
              if (!isDisabled) toggleDye(dye.id)
            }}
            className={cn(
              'craft-card relative p-3 text-left transition-all duration-300',
              isSelected
                ? 'animate-bounce-select border-2 shadow-lg'
                : 'border-2 border-earth-200',
              isDisabled && 'opacity-50 cursor-not-allowed',
              !isDisabled && 'cursor-pointer',
            )}
            style={
              isSelected
                ? {
                    borderColor: dye.color,
                    boxShadow: `0 0 12px ${dye.color}40`,
                  }
                : undefined
            }
            disabled={isDisabled}
            title={dye.description}
          >
            {isSelected && (
              <span
                className="absolute top-2 right-2 text-xs px-1.5 py-0.5 rounded-full text-white font-medium"
                style={{ backgroundColor: dye.color }}
              >
                已选
              </span>
            )}

            <div className="flex items-center gap-2 mb-2">
              <span
                className="w-8 h-8 rounded-full flex-shrink-0 ring-2 ring-white shadow-sm"
                style={{ backgroundColor: dye.color }}
              />
              <div className="min-w-0">
                <div className="font-serif-title text-earth-800 text-sm leading-tight truncate">
                  {dye.name}
                </div>
                <div className="text-xs leading-tight truncate" style={{ color: dye.color }}>
                  {dye.colorName}
                </div>
              </div>
            </div>

            <div className="text-xs text-earth-500 mb-2 truncate">
              来源：{dye.origin}
            </div>

            <div className="space-y-1">
              <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${stockRatio * 100}%`,
                    backgroundColor: dye.color,
                  }}
                />
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-earth-400">
                  {dye.stock}/{dye.maxStock}
                </span>
                {isLowStock && (
                  <span className="text-red-500 font-medium">余量紧张</span>
                )}
              </div>
            </div>

            <p className="mt-1.5 text-xs text-earth-400 leading-snug line-clamp-2">
              {dye.description}
            </p>
          </button>
        )
      })}
    </div>
  )
}
