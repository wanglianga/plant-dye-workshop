import { useRef, useEffect, useCallback } from 'react'
import { useWorkshopStore } from '@/hooks/useWorkshopStore'
import { renderPattern, generateSeed } from '@/lib/patternRenderer'
import { cn } from '@/lib/utils'

function idToSeed(id: string): number {
  let hash = 0
  for (let i = 0; i < id.length; i++) {
    hash = ((hash << 5) - hash + id.charCodeAt(i)) | 0
  }
  return Math.abs(hash) % 1000000
}

function PatternCanvas({ templateId, dyeColors, patternType }: {
  templateId: string
  dyeColors: string[]
  patternType: string
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const seed = idToSeed(templateId)
    renderPattern(ctx, 300, 200, dyeColors, patternType, 'smooth', seed)
  }, [templateId, dyeColors, patternType])

  return (
    <canvas
      ref={canvasRef}
      width={300}
      height={200}
      className="w-full rounded-xl"
      style={{ aspectRatio: '3/2' }}
    />
  )
}

export default function PatternTemplateGrid() {
  const {
    patternTemplates,
    tieMethods,
    dyeMaterials,
    selectedTieMethodId,
    selectedDyeIds,
    toggleDye,
    selectTieMethod,
  } = useWorkshopStore()

  const filteredTemplates = selectedTieMethodId
    ? patternTemplates.filter((t) => t.tieMethodId === selectedTieMethodId)
    : patternTemplates

  const getTieMethod = useCallback(
    (id: string) => tieMethods.find((m) => m.id === id),
    [tieMethods]
  )

  const getDyeColor = useCallback(
    (id: string) => dyeMaterials.find((d) => d.id === id)?.color ?? '#999',
    [dyeMaterials]
  )

  const isMatch = useCallback(
    (template: { tieMethodId: string; dyeIds: string[] }) => {
      if (selectedTieMethodId !== template.tieMethodId) return false
      if (selectedDyeIds.length !== template.dyeIds.length) return false
      const s1 = [...selectedDyeIds].sort()
      const s2 = [...template.dyeIds].sort()
      return s1.every((id, i) => id === s2[i])
    },
    [selectedTieMethodId, selectedDyeIds]
  )

  const handleApplyTemplate = useCallback(
    (template: { tieMethodId: string; dyeIds: string[] }) => {
      selectTieMethod(template.tieMethodId)

      const toAdd = template.dyeIds.filter((id) => !selectedDyeIds.includes(id))
      const toRemove = selectedDyeIds.filter((id) => !template.dyeIds.includes(id))

      toRemove.forEach((id) => toggleDye(id))
      toAdd.forEach((id) => toggleDye(id))
    },
    [selectTieMethod, toggleDye, selectedDyeIds]
  )

  if (filteredTemplates.length === 0) {
    return (
      <div className="py-8 text-center text-earth-400">
        暂无匹配的图案模板
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
      {filteredTemplates.map((template) => {
        const tieMethod = getTieMethod(template.tieMethodId)
        const matched = isMatch(template)

        return (
          <button
            key={template.id}
            onClick={() => handleApplyTemplate(template)}
            className={cn(
              'craft-card p-2 text-left cursor-pointer relative',
              matched && 'ring-2 ring-indigo-400'
            )}
          >
            {matched && (
              <span className="absolute top-3 right-3 z-10 bg-indigo-500 text-white text-xs px-2 py-0.5 rounded-full">
                同款
              </span>
            )}

            <PatternCanvas
              templateId={template.id}
              dyeColors={template.dyeIds.map(getDyeColor)}
              patternType={tieMethod?.patternType ?? 'radial'}
            />

            <div className="mt-2 px-1">
              <div className="font-medium text-earth-800 text-sm truncate">
                {template.name}
              </div>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="text-xs text-earth-500 bg-earth-100 px-1.5 py-0.5 rounded">
                  {tieMethod?.name}
                </span>
                <span className="flex items-center gap-1">
                  {template.dyeIds.map((dyeId) => (
                    <span
                      key={dyeId}
                      className="inline-block w-3 h-3 rounded-full border border-white/60 shadow-sm"
                      style={{ backgroundColor: getDyeColor(dyeId) }}
                    />
                  ))}
                </span>
              </div>
            </div>
          </button>
        )
      })}
    </div>
  )
}
