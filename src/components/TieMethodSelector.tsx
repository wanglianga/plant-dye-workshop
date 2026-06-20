import { Circle, Layers, PenTool, Grip } from 'lucide-react'
import { useWorkshopStore } from '@/hooks/useWorkshopStore'
import { cn } from '@/lib/utils'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Circle,
  Layers,
  PenTool,
  Grip,
}

const patternStyle: Record<string, { label: string; bg: string }> = {
  radial: {
    label: '放射纹',
    bg:
      'repeating-radial-gradient(circle, transparent, transparent 3px, rgba(99,102,241,0.15) 3px, rgba(99,102,241,0.15) 4px)',
  },
  geometric: {
    label: '条纹',
    bg:
      'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(99,102,241,0.15) 3px, rgba(99,102,241,0.15) 4px)',
  },
  curved: {
    label: '曲线',
    bg:
      'repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(99,102,241,0.15) 3px, rgba(99,102,241,0.15) 4px)',
  },
  sharp: {
    label: '折线',
    bg:
      'repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(99,102,241,0.2) 2px, rgba(99,102,241,0.2) 3px, transparent 3px, transparent 5px)',
  },
}

export default function TieMethodSelector() {
  const tieMethods = useWorkshopStore((s) => s.tieMethods)
  const selectedTieMethodId = useWorkshopStore((s) => s.selectedTieMethodId)
  const selectTieMethod = useWorkshopStore((s) => s.selectTieMethod)

  return (
    <div className="w-full">
      <h2 className="craft-section-title mb-3">选择扎法</h2>

      <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-thin">
        {tieMethods.map((method) => {
          const isSelected = selectedTieMethodId === method.id
          const Icon = iconMap[method.icon] ?? Circle
          const pattern = patternStyle[method.patternType] ?? patternStyle.radial

          return (
            <button
              key={method.id}
              onClick={() => selectTieMethod(method.id)}
              className={cn(
                'craft-card flex-shrink-0 w-[150px] p-4 flex flex-col items-center gap-2 cursor-pointer text-center',
                isSelected
                  ? 'border-indigo-500 ring-2 ring-indigo-200'
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
                {method.name}
              </span>

              <span className="text-xs text-earth-400 leading-relaxed">
                {method.description}
              </span>

              <span
                className="flex items-center gap-1.5 text-xs text-earth-500"
              >
                <span
                  className="inline-block w-5 h-5 rounded border border-earth-200/60"
                  style={{ backgroundImage: pattern.bg }}
                />
                {pattern.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
