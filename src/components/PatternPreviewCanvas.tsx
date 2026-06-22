import { useRef, useEffect, useState } from 'react'
import { Info, RefreshCw, Sparkles, Layers, Palette } from 'lucide-react'
import { useWorkshopStore } from '@/hooks/useWorkshopStore'
import { renderPattern } from '@/lib/patternRenderer'
import { cn } from '@/lib/utils'

export default function PatternPreviewCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const selectedFabricId = useWorkshopStore((s) => s.selectedFabricId)
  const selectedDyeIds = useWorkshopStore((s) => s.selectedDyeIds)
  const selectedTieMethodId = useWorkshopStore((s) => s.selectedTieMethodId)
  const patternSeed = useWorkshopStore((s) => s.patternSeed)
  const regeneratePattern = useWorkshopStore((s) => s.regeneratePattern)
  const fabrics = useWorkshopStore((s) => s.fabrics)
  const dyeMaterials = useWorkshopStore((s) => s.dyeMaterials)
  const tieMethods = useWorkshopStore((s) => s.tieMethods)

  const [showTooltip, setShowTooltip] = useState(false)

  const hasSelection = selectedFabricId || selectedDyeIds.length > 0 || selectedTieMethodId

  const selectedFabric = fabrics.find((f) => f.id === selectedFabricId)
  const selectedDyes = dyeMaterials.filter((d) => selectedDyeIds.includes(d.id))
  const selectedTieMethod = tieMethods.find((m) => m.id === selectedTieMethodId)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    if (!hasSelection) {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      return
    }

    const dyeColors = selectedDyes.map((d) => d.color)
    const patternType = selectedTieMethod?.patternType ?? 'spiral'
    const fabricTexture = selectedFabric?.texture ?? 'smooth'

    renderPattern(ctx, canvas.width, canvas.height, dyeColors, patternType, fabricTexture, patternSeed)
  }, [selectedFabricId, selectedDyeIds, selectedTieMethodId, patternSeed, hasSelection, selectedDyes, selectedTieMethod, selectedFabric])

  return (
    <div className="w-full">
      <h2 className="craft-section-title mb-3">图案预览</h2>

      <div className="craft-card p-4 md:p-6">
        <div className="flex justify-center">
          <div className="relative w-[min(60vw,480px)] min-w-[280px] max-w-[480px] md:w-[560px] md:max-w-[560px]">
            <canvas
              ref={canvasRef}
              width={560}
              height={420}
              className={cn(
                'w-full rounded-xl',
                hasSelection
                  ? 'shadow-[0_8px_30px_-8px_rgba(139,111,71,0.35)]'
                  : 'shadow-[0_4px_20px_-4px_rgba(139,111,71,0.15)]',
              )}
              style={{ aspectRatio: '4 / 3' }}
            />

            {!hasSelection && (
              <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-earth-50/60 backdrop-blur-[2px]">
                <p className="font-serif-title text-earth-400 text-base md:text-lg px-6 text-center leading-relaxed">
                  选择布料与染材，预览你的创作
                </p>
              </div>
            )}

            <button
              onClick={() => setShowTooltip((v) => !v)}
              onBlur={() => setShowTooltip(false)}
              className={cn(
                'absolute top-2 right-2 md:top-3 md:right-3 w-7 h-7 md:w-8 md:h-8 rounded-full',
                'bg-earth-50/80 backdrop-blur-sm border border-earth-200/60',
                'flex items-center justify-center text-earth-400 hover:text-earth-600 transition-colors',
              )}
            >
              <Info className="w-3.5 h-3.5 md:w-4 md:h-4" />
            </button>

            {showTooltip && (
              <div
                className={cn(
                  'absolute top-10 right-2 md:top-12 md:right-3',
                  'bg-earth-50/95 backdrop-blur-sm rounded-xl px-3 py-2 md:px-4 md:py-2.5',
                  'border border-earth-200/60 shadow-lg max-w-[220px] md:max-w-[280px]',
                  'animate-fade-in z-10',
                )}
              >
                <div className="space-y-1.5">
                  <p className="text-xs md:text-sm text-earth-700 leading-relaxed font-medium flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    植物染色的独特魅力
                  </p>
                  <p className="text-xs text-earth-600 leading-relaxed">
                    实际成品会因手劲、浸泡时间、布料材质产生独特差异，每一件作品都是独一无二的。
                  </p>
                </div>
              </div>
            )}

            {selectedTieMethod && hasSelection && (
              <div className="absolute bottom-2 left-2 md:bottom-3 md:left-3 space-y-1.5">
                <div className="bg-earth-50/85 backdrop-blur-sm rounded-lg px-2.5 py-1.5 border border-earth-200/60 flex items-center gap-1.5">
                  <Palette className="w-3 h-3 text-indigo-500 flex-shrink-0" />
                  <span className="text-[10px] md:text-xs text-earth-600 truncate max-w-[150px]">
                    {selectedTieMethod.patternHint}
                  </span>
                </div>
                <div className="bg-earth-50/85 backdrop-blur-sm rounded-lg px-2.5 py-1.5 border border-earth-200/60 flex items-center gap-1.5">
                  <Layers className="w-3 h-3 text-amber-500 flex-shrink-0" />
                  <span className="text-[10px] md:text-xs text-earth-600 truncate max-w-[150px]">
                    {selectedTieMethod.colorBlockHint}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 space-y-3">
          {(selectedFabric || selectedDyes.length > 0 || selectedTieMethod) && (
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-earth-600">
              {selectedFabric && (
                <span className="flex items-center gap-1.5">
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-earth-300" />
                  <span className="font-serif-title">{selectedFabric.name}</span>
                  <span className="text-xs text-earth-400">({selectedFabric.size})</span>
                </span>
              )}

              {selectedDyes.length > 0 && (
                <span className="flex items-center gap-1.5 flex-wrap">
                  {selectedDyes.map((dye) => (
                    <span key={dye.id} className="flex items-center gap-1">
                      <span
                        className="inline-block w-2.5 h-2.5 rounded-full ring-1 ring-white/60"
                        style={{ backgroundColor: dye.color }}
                      />
                      <span className="text-xs">{dye.colorName}</span>
                    </span>
                  ))}
                </span>
              )}

              {selectedTieMethod && (
                <span className="flex items-center gap-1.5">
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-indigo-400" />
                  <span className="font-serif-title">{selectedTieMethod.name}</span>
                  <span className="text-xs text-earth-400">
                    ({selectedTieMethod.estimatedMinutes}分钟)
                  </span>
                </span>
              )}
            </div>
          )}

          {hasSelection && (
            <div className="bg-turmeric-50/60 border border-turmeric-200/60 rounded-xl p-3">
              <p className="text-xs text-earth-700 leading-relaxed">
                <span className="font-serif-title text-turmeric-700 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  预期效果说明
                </span>
              </p>
              <div className="mt-1.5 grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-earth-600">
                <div className="flex items-start gap-1.5">
                  <span className="text-turmeric-500 font-medium mt-0.5">手劲</span>
                  <span className="leading-relaxed">
                    捆扎松紧直接影响纹路清晰度，扎得越紧留白越明显
                  </span>
                </div>
                <div className="flex items-start gap-1.5">
                  <span className="text-turmeric-500 font-medium mt-0.5">浸泡</span>
                  <span className="leading-relaxed">
                    浸染时间越长颜色越深，复染可增加层次感
                  </span>
                </div>
                <div className="flex items-start gap-1.5">
                  <span className="text-turmeric-500 font-medium mt-0.5">材质</span>
                  <span className="leading-relaxed">
                    {selectedFabric
                      ? `${selectedFabric.name}的${selectedFabric.texture === 'silk' ? '丝滑质感' : selectedFabric.texture === 'canvas' ? '粗织纹理' : selectedFabric.texture === 'knit' ? '针织弹性' : '细腻棉布'}会让纹路呈现独特效果`
                      : '不同布料纹理会让纹路呈现独特效果'}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-center">
            <button
              onClick={regeneratePattern}
              disabled={!hasSelection}
              className={cn(
                'craft-btn-secondary inline-flex items-center gap-2',
                !hasSelection && 'opacity-40 cursor-not-allowed',
              )}
            >
              <RefreshCw className="w-4 h-4" />
              换一种随机
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
