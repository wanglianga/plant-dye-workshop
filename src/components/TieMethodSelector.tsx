import { useState } from 'react'
import {
  RotateCw, AlignJustify, GripVertical, Sunrise, Frame,
  AlertTriangle, AlertCircle, CheckCircle2, Clock, Target, Droplets, Layers
} from 'lucide-react'
import { useWorkshopStore } from '@/hooks/useWorkshopStore'
import { cn } from '@/lib/utils'
import type { FailureRisk } from '@/lib/types'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Spinner: RotateCw,
  RotateCw,
  AlignJustify,
  GripVertical,
  Sunrise,
  Frame,
  Circle: RotateCw,
  Layers: AlignJustify,
  PenTool: Sunrise,
  Grip: GripVertical,
}

const patternStyle: Record<string, { label: string; bg: string }> = {
  spiral: {
    label: '螺旋纹',
    bg: 'repeating-conic-gradient(from 0deg, transparent 0deg 20deg, rgba(99,102,241,0.12) 20deg 22deg)',
  },
  stripe: {
    label: '平行条纹',
    bg: 'repeating-linear-gradient(0deg, transparent, transparent 4px, rgba(99,102,241,0.18) 4px, rgba(99,102,241,0.18) 6px)',
  },
  clamp: {
    label: '锐利夹染',
    bg: 'linear-gradient(90deg, transparent 0%, transparent 28%, rgba(99,102,241,0.25) 28%, rgba(99,102,241,0.25) 30%, transparent 30%, transparent 65%, rgba(99,102,241,0.25) 65%, rgba(99,102,241,0.25) 67%, transparent 67%)',
  },
  gradient: {
    label: '深浅渐变',
    bg: 'linear-gradient(180deg, transparent, rgba(99,102,241,0.08) 30%, rgba(99,102,241,0.2) 60%, rgba(99,102,241,0.35) 100%)',
  },
  negative: {
    label: '留白剪影',
    bg: 'radial-gradient(circle at 30% 40%, rgba(250,245,234,0.95) 18%, transparent 20%), radial-gradient(circle at 72% 65%, rgba(250,245,234,0.95) 12%, transparent 14%), rgba(99,102,241,0.22)',
  },
  radial: {
    label: '放射纹',
    bg: 'repeating-radial-gradient(circle, transparent, transparent 3px, rgba(99,102,241,0.15) 3px, rgba(99,102,241,0.15) 4px)',
  },
  geometric: {
    label: '条纹',
    bg: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(99,102,241,0.15) 3px, rgba(99,102,241,0.15) 4px)',
  },
  curved: {
    label: '曲线',
    bg: 'repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(99,102,241,0.15) 3px, rgba(99,102,241,0.15) 4px)',
  },
  sharp: {
    label: '折线',
    bg: 'repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(99,102,241,0.2) 2px, rgba(99,102,241,0.2) 3px, transparent 3px, transparent 5px)',
  },
}

const difficultyLabel: Record<number, { label: string; color: string }> = {
  1: { label: '入门', color: 'text-green-600 bg-green-50 border-green-200' },
  2: { label: '进阶', color: 'text-amber-600 bg-amber-50 border-amber-200' },
  3: { label: '挑战', color: 'text-rose-600 bg-rose-50 border-rose-200' },
}

const riskConfig: Record<FailureRisk['level'], { icon: React.ComponentType<{ className?: string }>; label: string; color: string; bg: string; border: string }> = {
  low: { icon: CheckCircle2, label: '低风险', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' },
  medium: { icon: AlertCircle, label: '中风险', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
  high: { icon: AlertTriangle, label: '高风险', color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-200' },
}

export default function TieMethodSelector() {
  const tieMethods = useWorkshopStore((s) => s.tieMethods)
  const selectedTieMethodId = useWorkshopStore((s) => s.selectedTieMethodId)
  const selectTieMethod = useWorkshopStore((s) => s.selectTieMethod)
  const [expandedMethodId, setExpandedMethodId] = useState<string | null>(null)

  const selectedMethod = tieMethods.find((m) => m.id === selectedTieMethodId)

  return (
    <div className="w-full">
      <h2 className="craft-section-title mb-3">选择扎法</h2>

      <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-thin">
        {tieMethods.map((method) => {
          const isSelected = selectedTieMethodId === method.id
          const isExpanded = expandedMethodId === method.id
          const Icon = iconMap[method.icon] ?? RotateCw
          const pattern = patternStyle[method.patternType] ?? patternStyle.radial
          const difficulty = difficultyLabel[method.difficultyLevel]
          const risk = riskConfig[method.failureRisk.level]
          const RiskIcon = risk.icon

          return (
            <div key={method.id} className="flex-shrink-0 w-[170px]">
              <button
                onClick={() => selectTieMethod(method.id)}
                onDoubleClick={() => setExpandedMethodId(isExpanded ? null : method.id)}
                className={cn(
                  'craft-card w-full p-3.5 flex flex-col items-center gap-2 cursor-pointer text-center relative transition-all duration-300',
                  isSelected
                    ? 'border-indigo-500 ring-2 ring-indigo-200'
                    : 'border-earth-200',
                )}
              >
                <div className="absolute top-2 left-2">
                  <span className={cn(
                    'text-[10px] px-1.5 py-0.5 rounded-full border font-medium',
                    difficulty.color,
                  )}>
                    {difficulty.label}
                  </span>
                </div>

                <div className="absolute top-2 right-2">
                  <div className={cn(
                    'w-5 h-5 rounded-full flex items-center justify-center',
                    risk.bg,
                  )}>
                    <RiskIcon className={cn('w-3 h-3', risk.color)} />
                  </div>
                </div>

                <Icon
                  className={cn(
                    'w-8 h-8 mt-3',
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

                <span className="text-xs text-earth-400 leading-relaxed line-clamp-2 px-1">
                  {method.description}
                </span>

                <div className="flex items-center gap-1.5 text-xs text-earth-500 w-full justify-center">
                  <span
                    className="inline-block w-5 h-5 rounded border border-earth-200/60"
                    style={{ backgroundImage: pattern.bg }}
                  />
                  <span className="truncate max-w-[100px]">{pattern.label}</span>
                </div>

                <div className="flex items-center gap-3 text-[10px] text-earth-400 w-full justify-center">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {method.estimatedMinutes}分钟
                  </span>
                  <span className={cn('flex items-center gap-1', risk.color)}>
                    <AlertTriangle className="w-3 h-3" />
                    {risk.label}
                  </span>
                </div>
              </button>

              {isSelected && (
                <button
                  onClick={() => setExpandedMethodId(isExpanded ? null : method.id)}
                  className="w-full mt-1.5 text-[10px] text-indigo-500 hover:text-indigo-700 transition-colors"
                >
                  {isExpanded ? '收起详情' : '查看效果详解 ↓'}
                </button>
              )}
            </div>
          )
        })}
      </div>

      {selectedMethod && expandedMethodId === selectedMethod.id && (
        <div className={cn(
          'mt-4 craft-card p-4 animate-fade-in',
          riskConfig[selectedMethod.failureRisk.level].border,
        )}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <h4 className="font-serif-title text-sm text-earth-800 mb-2 flex items-center gap-1.5">
                  <Target className="w-4 h-4 text-indigo-500" />
                  纹路与色块分布
                </h4>
                <div className="space-y-1.5 text-xs text-earth-600 leading-relaxed">
                  <p><span className="font-medium text-earth-700">纹路样式：</span>{selectedMethod.patternHint}</p>
                  <p><span className="font-medium text-earth-700">色块分布：</span>{selectedMethod.colorBlockHint}</p>
                  <p><span className="font-medium text-earth-700">材质建议：</span>{selectedMethod.textureTip}</p>
                </div>
              </div>

              <div>
                <h4 className="font-serif-title text-sm text-earth-800 mb-2 flex items-center gap-1.5">
                  <Droplets className="w-4 h-4 text-blue-500" />
                  浸泡时间参考
                </h4>
                <div className="text-xs text-earth-600 leading-relaxed bg-blue-50/50 rounded-lg p-2.5 border border-blue-100">
                  <p>初次浸染 <span className="font-medium text-blue-600">3-5 分钟</span>，观察颜色深浅后决定是否复染</p>
                  <p className="mt-1">建议比预期浅一些，晾干后颜色会加深约 20%</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className={cn(
                'font-serif-title text-sm mb-2 flex items-center gap-1.5',
                riskConfig[selectedMethod.failureRisk.level].color,
              )}>
                {(() => {
                  const RIcon = riskConfig[selectedMethod.failureRisk.level].icon
                  return <RIcon className="w-4 h-4" />
                })()}
                {selectedMethod.failureRisk.title}
              </h4>
              <p className="text-xs text-earth-600 leading-relaxed mb-2.5">
                {selectedMethod.failureRisk.description}
              </p>
              <div className="space-y-1.5">
                <p className="text-[11px] font-medium text-earth-700 flex items-center gap-1">
                  <Layers className="w-3 h-3" />
                  避坑技巧：
                </p>
                <ul className="space-y-1">
                  {selectedMethod.failureRisk.tips.map((tip, i) => (
                    <li key={i} className="text-[11px] text-earth-600 flex items-start gap-1.5 leading-relaxed">
                      <span className="text-indigo-400 mt-0.5 flex-shrink-0">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-earth-100">
            <div className="bg-turmeric-50/70 border border-turmeric-200/60 rounded-xl p-3">
              <p className="text-xs text-earth-700 leading-relaxed">
                <span className="font-serif-title text-turmeric-700">真实成品差异说明：</span>
                以上为模拟预览效果。实际作品会因
                <span className="font-medium text-turmeric-800 mx-0.5">手劲松紧</span>、
                <span className="font-medium text-turmeric-800 mx-0.5">浸泡时长</span>、
                <span className="font-medium text-turmeric-800 mx-0.5">布料纹理</span>
                以及染料批次不同而产生独特差异，这正是植物染色的魅力所在。
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
