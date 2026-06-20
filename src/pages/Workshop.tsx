import { useState } from 'react'
import { Palette, Leaf, Check } from 'lucide-react'
import FabricSelector from '@/components/FabricSelector'
import DyeMaterialPicker from '@/components/DyeMaterialPicker'
import TieMethodSelector from '@/components/TieMethodSelector'
import PatternTemplateGrid from '@/components/PatternTemplateGrid'
import PatternPreviewCanvas from '@/components/PatternPreviewCanvas'
import TimeSlotPicker from '@/components/TimeSlotPicker'
import PickupInfo from '@/components/PickupInfo'
import { useWorkshopStore } from '@/hooks/useWorkshopStore'
import { cn } from '@/lib/utils'

const STEPS = [
  { key: 'fabric', label: '布料', short: '布' },
  { key: 'dye', label: '染材', short: '染' },
  { key: 'tie', label: '扎法', short: '扎' },
  { key: 'pattern', label: '图案', short: '纹' },
  { key: 'booking', label: '预约', short: '约' },
]

export default function Workshop() {
  const [activeStep, setActiveStep] = useState(0)

  const selectedFabricId = useWorkshopStore((s) => s.selectedFabricId)
  const selectedDyeIds = useWorkshopStore((s) => s.selectedDyeIds)
  const selectedTieMethodId = useWorkshopStore((s) => s.selectedTieMethodId)
  const selectedTimeSlotId = useWorkshopStore((s) => s.selectedTimeSlotId)
  const submitBooking = useWorkshopStore((s) => s.submitBooking)
  const [showConfirm, setShowConfirm] = useState(false)

  const stepCompletion = [
    !!selectedFabricId,
    selectedDyeIds.length > 0,
    !!selectedTieMethodId,
    true,
    !!selectedTimeSlotId,
  ]

  const canSubmit = selectedFabricId && selectedDyeIds.length > 0 && selectedTieMethodId && selectedTimeSlotId

  const handleStepClick = (index: number) => {
    setActiveStep(index)
  }

  const handleSubmit = () => {
    if (!canSubmit) return
    submitBooking()
    setShowConfirm(true)
    setTimeout(() => setShowConfirm(false), 3000)
  }

  return (
    <div className="min-h-screen bg-earth-50">
      <header className="sticky top-0 z-30 bg-earth-50/90 backdrop-blur-md border-b border-earth-200/50">
        <div className="max-w-lg mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Leaf className="w-5 h-5 text-green-600" />
              <h1 className="font-serif-title text-lg text-earth-800">草木染工坊</h1>
            </div>
            <a
              href="/teacher"
              className="text-xs text-earth-400 hover:text-indigo-500 transition-colors"
            >
              老师端 →
            </a>
          </div>

          <div className="flex items-center gap-1">
            {STEPS.map((step, i) => {
              const isComplete = stepCompletion[i]
              const isActive = i === activeStep

              return (
                <button
                  key={step.key}
                  onClick={() => handleStepClick(i)}
                  className={cn(
                    'flex-1 flex flex-col items-center gap-0.5 py-1 rounded-lg transition-all duration-200',
                    isActive && 'bg-indigo-50',
                    !isActive && 'hover:bg-earth-100/50',
                  )}
                >
                  <div
                    className={cn(
                      'w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-300',
                      isComplete && !isActive && 'bg-indigo-400 text-white',
                      isActive && 'bg-indigo-500 text-white ring-2 ring-indigo-200',
                      !isComplete && !isActive && 'bg-earth-200 text-earth-500',
                    )}
                  >
                    {isComplete && !isActive ? (
                      <Check className="w-3.5 h-3.5" />
                    ) : (
                      step.short
                    )}
                  </div>
                  <span
                    className={cn(
                      'text-[10px] transition-colors',
                      isActive ? 'text-indigo-600 font-medium' : 'text-earth-400',
                    )}
                  >
                    {step.label}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-8 pb-32">
        {(activeStep === 0 || stepCompletion[0]) && (
          <div className={cn(activeStep !== 0 && 'opacity-70')}>
            <FabricSelector />
          </div>
        )}

        {(activeStep === 1 || stepCompletion[1]) && selectedFabricId && (
          <div className={cn(activeStep !== 1 && 'opacity-70')}>
            <h2 className="craft-section-title mb-3">搭配染材</h2>
            <DyeMaterialPicker />
          </div>
        )}

        {(activeStep === 2 || stepCompletion[2]) && selectedDyeIds.length > 0 && (
          <div className={cn(activeStep !== 2 && 'opacity-70')}>
            <TieMethodSelector />
          </div>
        )}

        {(activeStep === 3) && (
          <div>
            <h2 className="craft-section-title mb-3">图案灵感</h2>
            <PatternTemplateGrid />
          </div>
        )}

        <PatternPreviewCanvas />

        {(activeStep === 4 || stepCompletion[4]) && selectedTieMethodId && (
          <div className={cn(activeStep !== 4 && 'opacity-70')}>
            <TimeSlotPicker />
          </div>
        )}

        <PickupInfo />
      </main>

      {canSubmit && (
        <div className="fixed bottom-0 left-0 right-0 z-30 bg-earth-50/90 backdrop-blur-md border-t border-earth-200/50">
          <div className="max-w-lg mx-auto px-4 py-3">
            <button
              onClick={handleSubmit}
              className="craft-btn-primary w-full flex items-center justify-center gap-2 text-base"
            >
              <Palette className="w-5 h-5" />
              确认预约
            </button>
          </div>
        </div>
      )}

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-earth-900/30 backdrop-blur-sm animate-fade-in">
          <div className="craft-card p-8 mx-4 text-center max-w-sm animate-slide-up">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="font-serif-title text-xl text-earth-800 mb-2">预约成功</h3>
            <p className="text-sm text-earth-500 leading-relaxed">
              植物染色有随机之美，每次作品独一无二。<br />
              请按时到场，享受创作的乐趣。
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
