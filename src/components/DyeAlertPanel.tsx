import { useState } from 'react'
import {
  AlertTriangle, AlertCircle, Info, Clock, Sun, Package,
  ChefHat, CalendarDays, UserCheck, Shuffle, ChevronDown, ChevronUp, Flame
} from 'lucide-react'
import { useWorkshopStore } from '@/hooks/useWorkshopStore'
import { cn } from '@/lib/utils'
import type { DyeAlert, DyeMaterial, Fabric } from '@/lib/types'

const alertTypeConfig: Record<DyeAlert['alertType'], { icon: React.ComponentType<{ className?: string }>; label: string }> = {
  low_stock: { icon: Package, label: '库存紧张' },
  needs_pre_boil: { icon: ChefHat, label: '需提前熬煮' },
  unsuitable_dark: { icon: Sun, label: '深色布慎用' },
  long_dry_time: { icon: Clock, label: '晾干周期长' },
}

const severityConfig: Record<DyeAlert['severity'], { bg: string; border: string; text: string; badgeBg: string; badgeText: string }> = {
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-800',
    badgeBg: 'bg-blue-100',
    badgeText: 'text-blue-700',
  },
  warning: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-800',
    badgeBg: 'bg-amber-100',
    badgeText: 'text-amber-700',
  },
  danger: {
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    text: 'text-rose-800',
    badgeBg: 'bg-rose-100',
    badgeText: 'text-rose-700',
  },
}

function generateAlerts(
  selectedDyes: DyeMaterial[],
  selectedFabric: Fabric | undefined,
  dyeMaterials: DyeMaterial[]
): DyeAlert[] {
  const alerts: DyeAlert[] = []

  for (const dye of selectedDyes) {
    const stockRatio = dye.stock / dye.maxStock

    if (stockRatio < 0.3) {
      const alternatives = dye.alternativeDyeIds
        .map((id) => dyeMaterials.find((d) => d.id === id))
        .filter(Boolean) as DyeMaterial[]

      alerts.push({
        dyeId: dye.id,
        dyeName: dye.name,
        alertType: 'low_stock',
        title: `${dye.name}库存不足`,
        description: `当前库存仅 ${dye.stock}/${dye.maxStock}，当天可能供不应求，建议提前预约或选择替代色`,
        severity: stockRatio < 0.15 ? 'danger' : 'warning',
        alternativeColors: alternatives.map((a) => ({ id: a.id, name: a.name, color: a.color })),
        difficultyChange: '如坚持使用，工坊会尽力调配，但无法100%保证当天足量',
        teacherPrepRequired: true,
        pickupDateImpact: null,
      })
    }

    if (dye.needsPreBoil) {
      alerts.push({
        dyeId: dye.id,
        dyeName: dye.name,
        alertType: 'needs_pre_boil',
        title: `${dye.name}需提前熬煮`,
        description: `该染料需提前 ${dye.boilTimeMinutes} 分钟熬煮才能使用，请按预约时间到场${dye.needsTeacherPrep ? '，老师会提前准备' : ''}`,
        severity: 'info',
        alternativeColors: undefined,
        difficultyChange: dye.needsTeacherPrep
          ? '操作难度不变，但需老师提前预处理染料'
          : '操作难度不变，染料需提前熬煮后即可使用',
        teacherPrepRequired: dye.needsTeacherPrep,
        pickupDateImpact: null,
      })
    }

    if (selectedFabric && selectedFabric.baseColor === 'dark' && !dye.suitableForDark) {
      const alternatives = dye.alternativeDyeIds
        .map((id) => dyeMaterials.find((d) => d.id === id && d.suitableForDark))
        .filter(Boolean) as DyeMaterial[]

      alerts.push({
        dyeId: dye.id,
        dyeName: dye.name,
        alertType: 'unsuitable_dark',
        title: `${dye.name}在深色布上显色较弱`,
        description: `选择的${selectedFabric.name}底色较深，${dye.colorName}色可能无法充分显色，建议更换为适合深色布的染料`,
        severity: 'warning',
        alternativeColors: alternatives.length > 0
          ? alternatives.map((a) => ({ id: a.id, name: a.name, color: a.color }))
          : undefined,
        difficultyChange: '如果坚持使用，需要增加浸染次数和时间，整体操作难度略有提升',
        teacherPrepRequired: true,
        pickupDateImpact: '由于需要反复浸染，晾干时间可能延长约1-2小时',
      })
    }

    if (dye.dryTimeHours >= 7) {
      alerts.push({
        dyeId: dye.id,
        dyeName: dye.name,
        alertType: 'long_dry_time',
        title: `${dye.name}晾干周期较长`,
        description: `预计晾干时间约 ${dye.dryTimeHours} 小时（视天气情况而定），可能无法当天取件`,
        severity: 'info',
        alternativeColors: undefined,
        difficultyChange: '染色步骤难度无变化，但后续需要多轮固色冲洗',
        teacherPrepRequired: dye.needsTeacherPrep,
        pickupDateImpact: '建议预约次日取件，或选择快递到付服务（需额外支付运费）',
      })
    }
  }

  return alerts
}

export default function DyeAlertPanel() {
  const selectedDyeIds = useWorkshopStore((s) => s.selectedDyeIds)
  const selectedFabricId = useWorkshopStore((s) => s.selectedFabricId)
  const dyeMaterials = useWorkshopStore((s) => s.dyeMaterials)
  const fabrics = useWorkshopStore((s) => s.fabrics)
  const toggleDye = useWorkshopStore((s) => s.toggleDye)

  const [expandedAlerts, setExpandedAlerts] = useState<Set<string>>(new Set())

  const selectedDyes = dyeMaterials.filter((d) => selectedDyeIds.includes(d.id))
  const selectedFabric = fabrics.find((f) => f.id === selectedFabricId)

  const alerts = generateAlerts(selectedDyes, selectedFabric, dyeMaterials)

  if (alerts.length === 0) {
    if (selectedDyeIds.length === 0) return null

    return (
      <div className="craft-card p-4 bg-green-50/50 border-green-200/60">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
            <Info className="w-4 h-4 text-green-600" />
          </div>
          <div>
            <h4 className="font-serif-title text-sm text-green-800 mb-1">染材状态良好</h4>
            <p className="text-xs text-green-700 leading-relaxed">
              当前选择的染材库存充足、无需特殊处理，可直接按预约时间到场创作
            </p>
          </div>
        </div>
      </div>
    )
  }

  const toggleAlert = (key: string) => {
    setExpandedAlerts((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="craft-section-title mb-0">染材准备提醒</h2>
        <span className="inline-flex items-center gap-1 text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
          <AlertCircle className="w-3 h-3" />
          {alerts.length} 条提示
        </span>
      </div>

      <div className="space-y-2.5">
        {alerts.map((alert, idx) => {
          const key = `${alert.dyeId}-${alert.alertType}-${idx}`
          const isExpanded = expandedAlerts.has(key)
          const typeCfg = alertTypeConfig[alert.alertType]
          const sevCfg = severityConfig[alert.severity]
          const TypeIcon = typeCfg.icon

          return (
            <div
              key={key}
              className={cn(
                'craft-card overflow-hidden transition-all duration-300',
                sevCfg.bg,
                sevCfg.border,
              )}
            >
              <button
                onClick={() => toggleAlert(key)}
                className="w-full p-3.5 text-left flex items-start gap-3"
              >
                <div className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
                  sevCfg.badgeBg,
                )}>
                  <TypeIcon className={cn('w-4 h-4', sevCfg.badgeText)} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h4 className={cn('font-serif-title text-sm', sevCfg.text)}>
                      {alert.title}
                    </h4>
                    <span className={cn(
                      'text-[10px] px-1.5 py-0.5 rounded-full flex-shrink-0',
                      sevCfg.badgeBg,
                      sevCfg.badgeText,
                    )}>
                      {typeCfg.label}
                    </span>
                  </div>
                  <p className={cn('text-xs leading-relaxed', sevCfg.text, 'opacity-90')}>
                    {alert.description}
                  </p>
                </div>

                <div className={cn(
                  'flex-shrink-0 mt-0.5 transition-transform duration-200',
                  isExpanded && 'rotate-180',
                )}>
                  <ChevronDown className={cn('w-4 h-4', sevCfg.badgeText)} />
                </div>
              </button>

              {isExpanded && (
                <div className="px-3.5 pb-3.5 pt-1 space-y-3 border-t border-current/5 animate-fade-in"
                  style={{ borderColor: 'rgba(120,100,70,0.08)' }}
                >
                  {alert.alternativeColors && alert.alternativeColors.length > 0 && (
                    <div>
                      <p className="text-[11px] font-medium text-earth-700 mb-2 flex items-center gap-1">
                        <Shuffle className="w-3 h-3 text-indigo-500" />
                        推荐替代色：
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {alert.alternativeColors.map((alt) => {
                          const isAltSelected = selectedDyeIds.includes(alt.id)
                          return (
                            <button
                              key={alt.id}
                              onClick={(e) => {
                                e.stopPropagation()
                                if (!isAltSelected && selectedDyeIds.length >= 3) return
                                if (!isAltSelected) toggleDye(alert.dyeId)
                                toggleDye(alt.id)
                              }}
                              className={cn(
                                'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border transition-all',
                                isAltSelected
                                  ? 'border-indigo-400 bg-indigo-50 text-indigo-700'
                                  : 'border-earth-200 bg-white/70 hover:border-indigo-300 hover:bg-indigo-50/50 text-earth-600',
                              )}
                            >
                              <span
                                className="w-3 h-3 rounded-full ring-1 ring-white/80 flex-shrink-0"
                                style={{ backgroundColor: alt.color }}
                              />
                              <span>{alt.name}</span>
                              {isAltSelected && <span className="text-[10px] text-indigo-500">已选</span>}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {alert.difficultyChange && (
                    <div className="flex items-start gap-2">
                      <Flame className="w-3 h-3 text-orange-500 mt-0.5 flex-shrink-0" />
                      <div className="text-[11px] text-earth-600 leading-relaxed">
                        <span className="font-medium text-earth-700">难度变化：</span>
                        {alert.difficultyChange}
                      </div>
                    </div>
                  )}

                  {alert.teacherPrepRequired !== undefined && (
                    <div className="flex items-start gap-2">
                      <UserCheck className="w-3 h-3 text-purple-500 mt-0.5 flex-shrink-0" />
                      <div className="text-[11px] text-earth-600 leading-relaxed">
                        <span className="font-medium text-earth-700">老师预处理：</span>
                        {alert.teacherPrepRequired
                          ? '需要老师提前完成染料调配/媒染处理，请预留充足准备时间'
                          : '无需额外预处理，到场即可开始创作'}
                      </div>
                    </div>
                  )}

                  {alert.pickupDateImpact && (
                    <div className="flex items-start gap-2">
                      <CalendarDays className="w-3 h-3 text-teal-500 mt-0.5 flex-shrink-0" />
                      <div className="text-[11px] text-earth-600 leading-relaxed">
                        <span className="font-medium text-earth-700">取件影响：</span>
                        {alert.pickupDateImpact}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
