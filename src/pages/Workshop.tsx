import { useState, useEffect, useRef } from 'react'
import { Palette, Leaf, Check, Lock, ChevronRight } from 'lucide-react'
import FabricSelector from '@/components/FabricSelector'
import DyeMaterialPicker from '@/components/DyeMaterialPicker'
import DyeAlertPanel from '@/components/DyeAlertPanel'
import TieMethodSelector from '@/components/TieMethodSelector'
import PatternTemplateGrid from '@/components/PatternTemplateGrid'
import PatternPreviewCanvas from '@/components/PatternPreviewCanvas'
import TimeSlotPicker from '@/components/TimeSlotPicker'
import PickupInfo from '@/components/PickupInfo'
import { useWorkshopStore } from '@/hooks/useWorkshopStore'
import { cn } from '@/lib/utils'

const STEPS = [
  { key: 'fabric', label: '布料', short: '布', hint: '选择要染的布料' },
  { key: 'dye', label: '染材', short: '染', hint: '挑选染色材料' },
  { key: 'tie', label: '扎法', short: '扎', hint: '决定扎结方式' },
  { key: 'pattern', label: '图案', short: '纹', hint: '浏览图案灵感' },
  { key: 'booking', label: '预约', short: '约', hint: '选择桌台时段' },
]

export default function Workshop() {
  const [activeStep, setActiveStep] = useState(0)
  const [showConfirm, setShowConfirm] = useState(false)
  const [hoveredLockedStep, setHoveredLockedStep] = useState<number | null>(null)
  const prevFabricIdRef = useRef<string | null>(null)
  const prevDyeLenRef = useRef<number>(0)
  const prevTieIdRef = useRef<string | null>(null)

  const selectedFabricId = useWorkshopStore((s) => s.selectedFabricId)
  const selectedDyeIds = useWorkshopStore((s) => s.selectedDyeIds)
  const selectedTieMethodId = useWorkshopStore((s) => s.selectedTieMethodId)
  const selectedTimeSlotId = useWorkshopStore((s) => s.selectedTimeSlotId)
  const submitBooking = useWorkshopStore((s) => s.submitBooking)

  const stepCompletion = [
    !!selectedFabricId,
    selectedDyeIds.length > 0,
    !!selectedTieMethodId,
    true,
    !!selectedTimeSlotId,
  ]

  const stepLocked = [
    false,
    !stepCompletion[0],
    !stepCompletion[1],
    !stepCompletion[2],
    !stepCompletion[2],
  ]

  const canSubmit = selectedFabricId && selectedDyeIds.length > 0 && selectedTieMethodId && selectedTimeSlotId

  useEffect(() => {
    if (prevFabricIdRef.current == null && selectedFabricId != null) {
      setTimeout(() => setActiveStep(1), 350)
    }
    prevFabricIdRef.current = selectedFabricId
  }, [selectedFabricId])

  useEffect(() => {
    if (prevDyeLenRef.current === 0 && selectedDyeIds.length > 0) {
      setTimeout(() => setActiveStep(2), 350)
    }
    prevDyeLenRef.current = selectedDyeIds.length
  }, [selectedDyeIds])

  useEffect(() => {
    if (prevTieIdRef.current == null && selectedTieMethodId != null) {
      setTimeout(() => setActiveStep(3), 350)
    }
    prevTieIdRef.current = selectedTieMethodId
  }, [selectedTieMethodId])

  const handleStepClick = (index: number) => {
    if (stepLocked[index]) {
      setHoveredLockedStep(index)
      setTimeout(() => setHoveredLockedStep(null), 2000)
      return
    }
    setActiveStep(index)
  }

  const handleSubmit = () => {
    if (!canSubmit) return
    submitBooking()
    setShowConfirm(true)
    prevFabricIdRef.current = null
    prevDyeLenRef.current = 0
    prevTieIdRef.current = null
    setActiveStep(0)
    setTimeout(() => setShowConfirm(false), 3000)
  }

  const scrollToStep = (stepIdx: number) => {
    setActiveStep(stepIdx)
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
              const isLocked = stepLocked[i]
              const isHovered = hoveredLockedStep === i

              return (
                <div key={step.key} className="relative flex-1">
                  <button
                    onClick={() => handleStepClick(i)}
                    className={cn(
                      'w-full flex flex-col items-center gap-0.5 py-1 rounded-lg transition-all duration-200',
                      isActive && !isLocked && 'bg-indigo-50',
                      !isActive && !isLocked && 'hover:bg-earth-100/50 cursor-pointer',
                      isLocked && 'cursor-not-allowed opacity-60',
                      isHovered && isLocked && 'animate-shake',
                    )}
                  >
                    <div
                      className={cn(
                        'w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-300',
                        isComplete && !isActive && !isLocked && 'bg-indigo-400 text-white',
                        isActive && !isLocked && 'bg-indigo-500 text-white ring-2 ring-indigo-200',
                        !isComplete && !isLocked && !isActive && 'bg-earth-200 text-earth-500',
                        isLocked && 'bg-earth-100 text-earth-300 border border-earth-200',
                      )}
                    >
                      {isLocked ? (
                        <Lock className="w-3 h-3" />
                      ) : isComplete && !isActive ? (
                        <Check className="w-3.5 h-3.5" />
                      ) : (
                        step.short
                      )}
                    </div>
                    <span
                      className={cn(
                        'text-[10px] transition-colors',
                        isActive && !isLocked ? 'text-indigo-600 font-medium' : isLocked ? 'text-earth-300' : 'text-earth-400',
                      )}
                    >
                      {step.label}
                    </span>
                  </button>

                  {isHovered && isLocked && (
                    <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 z-50 whitespace-nowrap">
                      <div className="bg-earth-800 text-earth-50 text-[10px] px-2 py-1.5 rounded-lg shadow-lg animate-fade-in">
                        <div className="font-medium">请先完成「{STEPS[i - 1]?.label}」</div>
                        <div className="text-earth-300/80 mt-0.5">{STEPS[i - 1]?.hint}</div>
                      </div>
                      <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-earth-800 rotate-45" />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-8 pb-32">
        {(activeStep === 0 || stepCompletion[0]) && (
          <div id="step-fabric" className={cn(
            'transition-all duration-300',
            activeStep !== 0 && 'opacity-60',
          )}>
            <FabricSelector />
            {stepCompletion[0] && activeStep === 0 && (
              <button
                onClick={() => scrollToStep(1)}
                className="mt-4 craft-btn-secondary w-full flex items-center justify-center gap-1.5 text-sm animate-pulse-soft"
              >
                已选好，下一步：搭配染材
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
            {!stepCompletion[0] && (
              <div className="mt-3 craft-card p-3 bg-turmeric-50/60 border-turmeric-200/60">
                <p className="text-xs text-earth-600 leading-relaxed">
                  <span className="font-serif-title text-turmeric-600">第一步</span>
                  ：请先挑选要染色的布料类型
                </p>
              </div>
            )}
          </div>
        )}

        {(activeStep >= 1 || stepCompletion[0]) && (
          <div id="step-dye" className={cn(
            'transition-all duration-300',
            stepLocked[1] && 'opacity-40 blur-[1px]',
          )}>
            <div className="flex items-center justify-between mb-3">
              <h2 className="craft-section-title">搭配染材</h2>
              {stepLocked[1] && (
                <span className="inline-flex items-center gap-1 text-xs text-earth-400 bg-earth-100 px-2 py-1 rounded-full">
                  <Lock className="w-3 h-3" />
                  请先选择布料
                </span>
              )}
              {!stepLocked[1] && stepCompletion[1] && activeStep === 1 && (
                <button
                  onClick={() => scrollToStep(2)}
                  className="inline-flex items-center gap-1 text-xs text-indigo-600 font-medium animate-pulse-soft"
                >
                  下一步：选择扎法
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            {!stepLocked[1] ? (
              <div className="space-y-4">
                <DyeMaterialPicker />
                {(activeStep === 1 || stepCompletion[1]) && (
                  <DyeAlertPanel />
                )}
              </div>
            ) : (
              <div className="craft-card p-8 text-center">
                <div className="w-12 h-12 rounded-full bg-earth-100 flex items-center justify-center mx-auto mb-3">
                  <Lock className="w-5 h-5 text-earth-400" />
                </div>
                <p className="text-sm text-earth-400">先选好布料，再来挑选染材吧</p>
              </div>
            )}
          </div>
        )}

        {(activeStep >= 2 || stepCompletion[1]) && (
          <div id="step-tie" className={cn(
            'transition-all duration-300',
            stepLocked[2] && 'opacity-40 blur-[1px]',
          )}>
            <div className="flex items-center justify-between mb-3">
              <h2 className="craft-section-title">选择扎法</h2>
              {stepLocked[2] && (
                <span className="inline-flex items-center gap-1 text-xs text-earth-400 bg-earth-100 px-2 py-1 rounded-full">
                  <Lock className="w-3 h-3" />
                  请先选择染材
                </span>
              )}
              {!stepLocked[2] && stepCompletion[2] && activeStep === 2 && (
                <button
                  onClick={() => scrollToStep(3)}
                  className="inline-flex items-center gap-1 text-xs text-indigo-600 font-medium animate-pulse-soft"
                >
                  下一步：图案灵感
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            {!stepLocked[2] ? (
              <TieMethodSelector />
            ) : (
              <div className="craft-card p-8 text-center">
                <div className="w-12 h-12 rounded-full bg-earth-100 flex items-center justify-center mx-auto mb-3">
                  <Lock className="w-5 h-5 text-earth-400" />
                </div>
                <p className="text-sm text-earth-400">先选好染材，再来决定扎结方式吧</p>
              </div>
            )}
          </div>
        )}

        <PatternPreviewCanvas />

        {(activeStep === 3 || (stepCompletion[2] && activeStep >= 2)) && (
          <div id="step-pattern" className={cn(
            'transition-all duration-300',
            stepLocked[3] && 'opacity-40 blur-[1px]',
          )}>
            <div className="flex items-center justify-between mb-3">
              <h2 className="craft-section-title">图案灵感</h2>
              {stepLocked[3] && (
                <span className="inline-flex items-center gap-1 text-xs text-earth-400 bg-earth-100 px-2 py-1 rounded-full">
                  <Lock className="w-3 h-3" />
                  请先选择扎法
                </span>
              )}
              {!stepLocked[3] && activeStep === 3 && (
                <button
                  onClick={() => scrollToStep(4)}
                  className="inline-flex items-center gap-1 text-xs text-indigo-600 font-medium animate-pulse-soft"
                >
                  下一步：预约时段
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            {!stepLocked[3] ? (
              <PatternTemplateGrid />
            ) : (
              <div className="craft-card p-8 text-center">
                <div className="w-12 h-12 rounded-full bg-earth-100 flex items-center justify-center mx-auto mb-3">
                  <Lock className="w-5 h-5 text-earth-400" />
                </div>
                <p className="text-sm text-earth-400">选好扎结方式后，就能看到参考图案啦</p>
              </div>
            )}
          </div>
        )}

        {(activeStep >= 4 || (stepCompletion[2] && activeStep >= 3)) && (
          <div id="step-booking" className={cn(
            'transition-all duration-300',
            stepLocked[4] && 'opacity-40 blur-[1px]',
          )}>
            <div className="flex items-center justify-between mb-3">
              <h2 className="craft-section-title">选择时段</h2>
              {stepLocked[4] && (
                <span className="inline-flex items-center gap-1 text-xs text-earth-400 bg-earth-100 px-2 py-1 rounded-full">
                  <Lock className="w-3 h-3" />
                  请先选择扎法
                </span>
              )}
            </div>
            {!stepLocked[4] ? (
              <TimeSlotPicker />
            ) : (
              <div className="craft-card p-8 text-center">
                <div className="w-12 h-12 rounded-full bg-earth-100 flex items-center justify-center mx-auto mb-3">
                  <Lock className="w-5 h-5 text-earth-400" />
                </div>
                <p className="text-sm text-earth-400">完成前面的创作步骤，就可以预约时段啦</p>
              </div>
            )}
          </div>
        )}

        <PickupInfo />

        {activeStep === 3 && stepCompletion[2] && (
          <div className="craft-card p-4 bg-indigo-50/60 border-indigo-200/60">
            <p className="text-sm text-indigo-700 leading-relaxed">
              <span className="font-serif-title">灵感已经看到</span>
              ，可以直接选择桌台时段完成预约，或点击下一步继续。
            </p>
          </div>
        )}
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
