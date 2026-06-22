import { Square, ShoppingBag, Shirt, Wind } from 'lucide-react'
import { useWorkshopStore } from '@/hooks/useWorkshopStore'
import { cn } from '@/lib/utils'
import type { Fabric } from '@/lib/types'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Square,
  ShoppingBag,
  Shirt,
  Scarf: Wind,
}

const textureConfig: Record<Fabric['texture'], { label: string; dot: string }> = {
  smooth: { label: '细腻', dot: 'bg-earth-300' },
  canvas: { label: '粗织', dot: 'bg-earth-500' },
  knit: { label: '针织', dot: 'bg-turmeric-400' },
  silk: { label: '丝滑', dot: 'bg-indigo-300' },
}

const baseColorConfig: Record<Fabric['baseColor'], { label: string; dot: string }> = {
  light: { label: '浅色', dot: 'bg-amber-100' },
  medium: { label: '中色', dot: 'bg-amber-300' },
  dark: { label: '深色', dot: 'bg-amber-700' },
}

export default function FabricSelector() {
  const fabrics = useWorkshopStore((s) => s.fabrics)
  const selectedFabricId = useWorkshopStore((s) => s.selectedFabricId)
  const selectFabric = useWorkshopStore((s) => s.selectFabric)

  return (
    <div className="w-full">
      <h2 className="craft-section-title mb-3">选择布料</h2>

      <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-thin">
        {fabrics.map((fabric) => {
          const isSelected = selectedFabricId === fabric.id
          const Icon = iconMap[fabric.icon] ?? Square
          const texture = textureConfig[fabric.texture]
          const baseColor = baseColorConfig[fabric.baseColor]

          return (
            <button
              key={fabric.id}
              onClick={() => selectFabric(fabric.id)}
              className={cn(
                'craft-card flex-shrink-0 w-[140px] p-4 flex flex-col items-center gap-2 cursor-pointer text-center',
                isSelected
                  ? 'border-indigo-500 ring-2 ring-indigo-200 animate-bounce-select'
                  : 'border-earth-200',
              )}
            >
              <Icon
                className={cn(
                  'w-8 h-8',
                  isSelected ? 'text-indigo-500' : 'text-earth-400',
                )}
              />

              <span
                className={cn(
                  'font-serif-title text-base',
                  isSelected ? 'text-indigo-600' : 'text-earth-700',
                )}
              >
                {fabric.name}
              </span>

              <span className="text-xs text-earth-400">{fabric.size}</span>

              <div className="flex items-center gap-3 text-xs text-earth-500">
                <span className="flex items-center gap-1">
                  <span
                    className={cn(
                      'inline-block w-2 h-2 rounded-full',
                      texture.dot,
                    )}
                  />
                  {texture.label}
                </span>
                <span className="flex items-center gap-1">
                  <span
                    className={cn(
                      'inline-block w-2 h-2 rounded-full',
                      baseColor.dot,
                    )}
                  />
                  {baseColor.label}
                </span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
