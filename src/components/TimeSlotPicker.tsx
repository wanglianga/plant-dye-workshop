import { Baby, Users, Clock } from 'lucide-react'
import { useWorkshopStore } from '@/hooks/useWorkshopStore'
import { cn } from '@/lib/utils'

const timeGroups = [
  { label: '上午', times: ['09:00', '10:30'] },
  { label: '下午', times: ['14:00', '15:30'] },
]

export default function TimeSlotPicker() {
  const timeSlots = useWorkshopStore((s) => s.timeSlots)
  const selectedTimeSlotId = useWorkshopStore((s) => s.selectedTimeSlotId)
  const selectTimeSlot = useWorkshopStore((s) => s.selectTimeSlot)
  const isParentChild = useWorkshopStore((s) => s.isParentChild)
  const setParentChild = useWorkshopStore((s) => s.setParentChild)
  const childAge = useWorkshopStore((s) => s.childAge)
  const setChildAge = useWorkshopStore((s) => s.setChildAge)

  const filteredSlots = isParentChild
    ? timeSlots.filter((s) => s.isChildFriendly)
    : timeSlots

  return (
    <div className="w-full">
      <h2 className="craft-section-title mb-3">选择时段</h2>

      {timeGroups.map((group) => {
        const groupSlots = filteredSlots.filter((s) =>
          group.times.includes(s.time),
        )
        if (groupSlots.length === 0) return null

        return (
          <div key={group.label} className="mb-5">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-earth-400" />
              <span className="font-serif-title text-sm text-earth-500 tracking-wider">
                {group.label}
              </span>
            </div>

            <div className="flex flex-col gap-2">
              {groupSlots.map((slot) => {
                const isSelected = selectedTimeSlotId === slot.id
                const isFull = !slot.isAvailable
                const ratio = slot.currentCount / slot.maxCount

                return (
                  <button
                    key={slot.id}
                    onClick={() => {
                      if (!isFull) selectTimeSlot(slot.id)
                    }}
                    disabled={isFull}
                    className={cn(
                      'craft-card w-full p-3 text-left flex items-center gap-3',
                      !isFull && 'cursor-pointer',
                      isFull && 'opacity-50 cursor-not-allowed',
                      isSelected &&
                        'border-indigo-500 ring-2 ring-indigo-200',
                    )}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-serif-title text-base text-earth-700">
                          {slot.tableName}
                        </span>
                        <span className="text-sm text-earth-400">
                          {slot.time}
                        </span>
                        {slot.isChildFriendly && (
                          <Baby className="w-3.5 h-3.5 text-turmeric-500 flex-shrink-0" />
                        )}
                        {isFull && (
                          <span className="text-xs text-earth-400 font-medium ml-auto">
                            已满
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 mt-1.5">
                        <div className="flex-1 h-1.5 bg-earth-200 rounded-full overflow-hidden">
                          <div
                            className={cn(
                              'h-full rounded-full transition-all duration-300',
                              ratio >= 1
                                ? 'bg-earth-300'
                                : ratio >= 0.7
                                  ? 'bg-turmeric-400'
                                  : 'bg-indigo-400',
                            )}
                            style={{
                              width: `${Math.min(ratio * 100, 100)}%`,
                            }}
                          />
                        </div>
                        <span className="text-xs text-earth-400 tabular-nums whitespace-nowrap">
                          {slot.currentCount}/{slot.maxCount}
                        </span>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )
      })}

      <div className="mt-4 craft-card p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-earth-400" />
            <span className="font-serif-title text-sm text-earth-600">
              亲子协作
            </span>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={isParentChild}
            onClick={() => setParentChild(!isParentChild)}
            className={cn(
              'relative w-10 h-5.5 rounded-full transition-colors duration-200',
              isParentChild ? 'bg-indigo-500' : 'bg-earth-300',
            )}
          >
            <span
              className={cn(
                'absolute top-0.5 left-0.5 w-4.5 h-4.5 bg-white rounded-full shadow transition-transform duration-200',
                isParentChild ? 'translate-x-[18px]' : 'translate-x-0',
              )}
            />
          </button>
        </div>

        {isParentChild && (
          <div className="mt-3 flex items-center gap-2">
            <label className="text-sm text-earth-500">儿童年龄</label>
            <input
              type="number"
              min={3}
              max={12}
              value={childAge}
              onChange={(e) => {
                const v = parseInt(e.target.value, 10)
                if (!isNaN(v)) setChildAge(Math.min(12, Math.max(3, v)))
              }}
              className="craft-input w-20 text-center py-1.5 px-2 text-sm"
            />
            <span className="text-xs text-earth-400">3-12岁</span>
          </div>
        )}
      </div>
    </div>
  )
}
