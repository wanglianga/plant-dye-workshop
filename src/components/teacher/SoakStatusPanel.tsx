import { Timer, Droplets, CheckCircle } from 'lucide-react'
import { useWorkshopStore } from '@/hooks/useWorkshopStore'
import { cn } from '@/lib/utils'
import type { SoakStatus } from '@/lib/types'

const statusConfig: Record<SoakStatus['status'], { label: string; color: string; bg: string; icon: typeof Timer }> = {
  preparing: { label: '准备中', color: 'text-yellow-700', bg: 'bg-yellow-100 border-yellow-300/60', icon: Timer },
  soaking: { label: '浸泡中', color: 'text-blue-700', bg: 'bg-blue-100 border-blue-300/60', icon: Droplets },
  ready: { label: '已就绪', color: 'text-green-700', bg: 'bg-green-100 border-green-300/60', icon: CheckCircle },
}

const nextStatus: Record<SoakStatus['status'], SoakStatus['status']> = {
  preparing: 'soaking',
  soaking: 'ready',
  ready: 'ready',
}

function CircularProgress({ remaining, total, color }: { remaining: number; total: number; color: string }) {
  const ratio = total > 0 ? (total - remaining) / total : 0
  const r = 22
  const circumference = 2 * Math.PI * r
  const offset = circumference * (1 - ratio)

  return (
    <div className="relative w-14 h-14 flex-shrink-0">
      <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
        <circle cx="28" cy="28" r={r} fill="none" stroke="#E0D0B0" strokeWidth="4" />
        <circle
          cx="28" cy="28" r={r} fill="none"
          stroke={color} strokeWidth="4" strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-700"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-medium text-earth-700">
          {remaining > 0 ? `${remaining}'` : '✓'}
        </span>
      </div>
    </div>
  )
}

export default function SoakStatusPanel() {
  const soakStatuses = useWorkshopStore((s) => s.soakStatuses)
  const updateSoakStatus = useWorkshopStore((s) => s.updateSoakStatus)

  const handleAdvance = (soak: SoakStatus) => {
    if (soak.status === 'ready') return
    const next = nextStatus[soak.status]
    const newRemaining = next === 'ready' ? 0 : soak.remainingMinutes
    updateSoakStatus(soak.id, next, newRemaining)
  }

  return (
    <div className="craft-card p-5">
      <div className="flex items-center gap-2 mb-5">
        <Droplets className="w-5 h-5 text-indigo-500" />
        <h2 className="craft-section-title">染缸准备状态</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {soakStatuses.map((soak) => {
          const config = statusConfig[soak.status]
          const StatusIcon = config.icon
          const isReady = soak.status === 'ready'

          return (
            <button
              key={soak.id}
              onClick={() => handleAdvance(soak)}
              disabled={isReady}
              className={cn(
                'relative rounded-xl border p-4 text-left transition-all duration-200',
                config.bg,
                !isReady && 'cursor-pointer hover:shadow-md active:scale-[0.98]',
                isReady && 'cursor-default',
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className="w-6 h-6 rounded-full flex-shrink-0 ring-2 ring-white shadow-sm"
                      style={{ backgroundColor: soak.color }}
                    />
                    <span className="font-serif-title text-earth-800 text-sm truncate">
                      {soak.dyeName}
                    </span>
                  </div>

                  <div className={cn('inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full', config.color, config.bg.replace('border-', 'bg-').split(' ')[0])}>
                    <StatusIcon className="w-3 h-3" />
                    {config.label}
                  </div>

                  {!isReady && soak.remainingMinutes > 0 && (
                    <p className="text-xs text-earth-500 mt-2">
                      剩余 {soak.remainingMinutes} 分钟
                    </p>
                  )}

                  {!isReady && (
                    <p className="text-xs text-indigo-500 mt-1.5">
                      点击推进状态 →
                    </p>
                  )}
                </div>

                <CircularProgress
                  remaining={soak.remainingMinutes}
                  total={soak.totalMinutes}
                  color={soak.color}
                />
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
