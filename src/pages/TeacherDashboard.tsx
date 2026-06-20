import { Leaf, ArrowLeft } from 'lucide-react'
import MaterialManager from '@/components/teacher/MaterialManager'
import SoakStatusPanel from '@/components/teacher/SoakStatusPanel'
import TableSchedule from '@/components/teacher/TableSchedule'
import PickupBatchList from '@/components/teacher/PickupBatchList'

export default function TeacherDashboard() {
  return (
    <div className="min-h-screen bg-earth-50">
      <header className="sticky top-0 z-30 bg-earth-50/90 backdrop-blur-md border-b border-earth-200/50">
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Leaf className="w-5 h-5 text-green-600" />
              <h1 className="font-serif-title text-lg text-earth-800">工作台管理</h1>
              <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full">老师端</span>
            </div>
            <a
              href="/"
              className="flex items-center gap-1 text-xs text-earth-400 hover:text-indigo-500 transition-colors"
            >
              <ArrowLeft className="w-3 h-3" />
              学员端
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 md:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <MaterialManager />
            <SoakStatusPanel />
          </div>
          <div className="space-y-6">
            <TableSchedule />
            <PickupBatchList />
          </div>
        </div>
      </main>
    </div>
  )
}
