import { Palette, Sun, Package } from 'lucide-react'
import { useWorkshopStore } from '@/hooks/useWorkshopStore'
import { cn } from '@/lib/utils'

const dryingTimeMap: Record<string, string> = {
  '09:00': '14:00',
  '10:30': '16:00',
  '14:00': '18:00',
  '15:30': '19:30',
}

const steps = [
  { key: 'dye', label: '染色', Icon: Palette },
  { key: 'dry', label: '晾晒', Icon: Sun },
  { key: 'pickup', label: '取件', Icon: Package },
] as const

function LeafDecor() {
  return (
    <svg
      className="absolute -top-2 -right-2 w-10 h-10 text-earth-200/60 rotate-12 pointer-events-none"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6 34C6 34 8 18 20 10C32 2 38 6 38 6C38 6 34 22 22 30C10 38 6 34 6 34Z"
        fill="currentColor"
      />
      <path
        d="M20 10C20 10 18 22 12 30"
        stroke="#FAF6F0"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <path
        d="M26 14C26 14 22 22 16 28"
        stroke="#FAF6F0"
        strokeWidth="0.8"
        strokeLinecap="round"
      />
    </svg>
  )
}

export default function PickupInfo() {
  const selectedTimeSlotId = useWorkshopStore((s) => s.selectedTimeSlotId)
  const timeSlots = useWorkshopStore((s) => s.timeSlots)

  const selectedSlot = timeSlots.find((ts) => ts.id === selectedTimeSlotId)
  const estimatedPickupTime = selectedSlot
    ? dryingTimeMap[selectedSlot.time] ?? null
    : null

  const activeStep = selectedTimeSlotId
    ? estimatedPickupTime
      ? 3
      : 0
    : -1

  return (
    <div className="craft-card relative overflow-hidden p-5">
      <LeafDecor />

      <h2 className="craft-section-title mb-4">取件信息</h2>

      <div className="mb-5">
        {selectedTimeSlotId && estimatedPickupTime ? (
          <p className="text-earth-700 text-base">
            预计 <span className="font-serif-title text-indigo-600 text-lg">{estimatedPickupTime}</span> 可取件
          </p>
        ) : (
          <p className="text-earth-400 text-sm">选择时段后显示预估晾晒时间</p>
        )}
      </div>

      <div className="flex items-center justify-between mb-6 px-2">
        {steps.map((step, i) => {
          const isActive = i <= activeStep && activeStep >= 0
          const { Icon } = step

          return (
            <div key={step.key} className="flex items-center">
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={cn(
                    'w-11 h-11 rounded-full flex items-center justify-center transition-colors duration-300',
                    isActive
                      ? 'bg-indigo-500 text-white shadow-md'
                      : 'bg-earth-300/40 text-earth-400',
                  )}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span
                  className={cn(
                    'text-xs font-medium transition-colors duration-300',
                    isActive ? 'text-indigo-600' : 'text-earth-400',
                  )}
                >
                  {step.label}
                </span>
              </div>

              {i < steps.length - 1 && (
                <div
                  className={cn(
                    'w-10 sm:w-14 border-t-2 border-dashed mx-1 transition-colors duration-300',
                    isActive && i < activeStep
                      ? 'border-indigo-400'
                      : 'border-earth-300/50',
                  )}
                />
              )}
            </div>
          )
        })}
      </div>

      <div className="bg-earth-100/60 rounded-xl p-3.5 border border-earth-200/40">
        <p className="text-earth-600 text-sm leading-relaxed">
          晾晒约需3-4小时，取件时请出示预约码
        </p>
      </div>
    </div>
  )
}
