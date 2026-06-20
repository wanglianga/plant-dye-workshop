import type { Fabric, DyeMaterial, TieMethod, PatternTemplate, TimeSlot, Booking, PickupBatch, SoakStatus, WorkshopTable } from './types'

export const fabrics: Fabric[] = [
  { id: 'f1', name: '方巾', size: '45×45cm', texture: 'smooth', icon: 'Square', description: '棉质方巾，适合入门体验，纹路清晰' },
  { id: 'f2', name: '帆布袋', size: '35×40cm', texture: 'canvas', icon: 'ShoppingBag', description: '厚实帆布，日常可用，显色饱满' },
  { id: 'f3', name: 'T恤', size: 'M / L', texture: 'knit', icon: 'Shirt', description: '精梳棉T恤，穿着舒适，纹样自然' },
  { id: 'f4', name: '围巾', size: '180×50cm', texture: 'silk', icon: 'Scarf', description: '丝棉混纺，轻盈飘逸，渐变柔美' },
]

export const dyeMaterials: DyeMaterial[] = [
  { id: 'd1', name: '蓝靛', color: '#2D4A5E', colorLight: '#6E93AB', colorName: '靛蓝', stock: 85, maxStock: 100, description: '传统板蓝根发酵，经典靛蓝色系', origin: '板蓝根叶' },
  { id: 'd2', name: '苏木', color: '#8F2E24', colorLight: '#D65A4D', colorName: '苏红', stock: 42, maxStock: 80, description: '苏木心材熬煮，温暖红棕调', origin: '苏木心材' },
  { id: 'd3', name: '姜黄', color: '#D4A843', colorLight: '#F0D699', colorName: '姜黄', stock: 67, maxStock: 90, description: '姜黄根茎提色，明亮的金黄调', origin: '姜黄根茎' },
  { id: 'd4', name: '洋葱皮', color: '#B8902E', colorLight: '#E6BF66', colorName: '洋葱黄', stock: 28, maxStock: 60, description: '洋葱外皮煮染，层次丰富的黄棕', origin: '洋葱外皮' },
  { id: 'd5', name: '茜草', color: '#C4524A', colorLight: '#E88E85', colorName: '茜红', stock: 55, maxStock: 70, description: '茜草根提取，柔和粉红色系', origin: '茜草根' },
  { id: 'd6', name: '五倍子', color: '#4A3728', colorLight: '#8B6F47', colorName: '铁黑', stock: 38, maxStock: 50, description: '五倍子加铁媒染，沉稳灰黑调', origin: '五倍子+铁' },
]

export const tieMethods: TieMethod[] = [
  { id: 't1', name: '捆扎', description: '用棉线将布料随机捆扎，形成放射状纹路', patternType: 'radial', icon: 'Circle' },
  { id: 't2', name: '折叠', description: '将布料反复折叠后捆扎，形成几何条纹', patternType: 'geometric', icon: 'Layers' },
  { id: 't3', name: '缝扎', description: '用针线缝合后拉紧，形成曲线图案', patternType: 'curved', icon: 'PenTool' },
  { id: 't4', name: '夹扎', description: '用木夹夹住布料，形成锐利几何线', patternType: 'sharp', icon: 'Grip' },
]

export const patternTemplates: PatternTemplate[] = [
  { id: 'p1', name: '星芒', tieMethodId: 't1', dyeIds: ['d1'], description: '中心放射状纹路，如星辰般扩散' },
  { id: 'p2', name: '涟漪', tieMethodId: 't1', dyeIds: ['d1', 'd3'], description: '多层圆环叠加，色彩渐变过渡' },
  { id: 'p3', name: '山脊', tieMethodId: 't2', dyeIds: ['d1', 'd4'], description: '水平条纹起伏，如远山层叠' },
  { id: 'p4', name: '棋格', tieMethodId: 't2', dyeIds: ['d3'], description: '规整方格交错，简约而有节奏' },
  { id: 'p5', name: '花径', tieMethodId: 't3', dyeIds: ['d2', 'd5'], description: '弧线交织成花，浪漫而灵动' },
  { id: 'p6', name: '流水', tieMethodId: 't3', dyeIds: ['d1', 'd2'], description: '流畅曲线延伸，如溪水蜿蜒' },
  { id: 'p7', name: '棱角', tieMethodId: 't4', dyeIds: ['d1', 'd6'], description: '利落直线切割，现代感十足' },
  { id: 'p8', name: '窗格', tieMethodId: 't4', dyeIds: ['d4', 'd3'], description: '规整窗格留白，温润古朴' },
]

export const workshopTables: WorkshopTable[] = [
  { id: 'tb1', name: 'A桌', capacity: 4, hasChildSeat: true },
  { id: 'tb2', name: 'B桌', capacity: 4, hasChildSeat: true },
  { id: 'tb3', name: 'C桌', capacity: 3, hasChildSeat: false },
  { id: 'tb4', name: 'D桌', capacity: 3, hasChildSeat: false },
  { id: 'tb5', name: 'E桌', capacity: 2, hasChildSeat: true },
  { id: 'tb6', name: 'F桌', capacity: 2, hasChildSeat: false },
]

export const timeSlots: TimeSlot[] = [
  { id: 'ts1', tableId: 'tb1', tableName: 'A桌', time: '09:00', currentCount: 2, maxCount: 4, isChildFriendly: true, isAvailable: true },
  { id: 'ts2', tableId: 'tb1', tableName: 'A桌', time: '10:30', currentCount: 4, maxCount: 4, isChildFriendly: true, isAvailable: false },
  { id: 'ts3', tableId: 'tb2', tableName: 'B桌', time: '09:00', currentCount: 1, maxCount: 4, isChildFriendly: true, isAvailable: true },
  { id: 'ts4', tableId: 'tb2', tableName: 'B桌', time: '10:30', currentCount: 3, maxCount: 4, isChildFriendly: true, isAvailable: true },
  { id: 'ts5', tableId: 'tb3', tableName: 'C桌', time: '09:00', currentCount: 0, maxCount: 3, isChildFriendly: false, isAvailable: true },
  { id: 'ts6', tableId: 'tb3', tableName: 'C桌', time: '10:30', currentCount: 2, maxCount: 3, isChildFriendly: false, isAvailable: true },
  { id: 'ts7', tableId: 'tb4', tableName: 'D桌', time: '09:00', currentCount: 3, maxCount: 3, isChildFriendly: false, isAvailable: false },
  { id: 'ts8', tableId: 'tb4', tableName: 'D桌', time: '10:30', currentCount: 1, maxCount: 3, isChildFriendly: false, isAvailable: true },
  { id: 'ts9', tableId: 'tb5', tableName: 'E桌', time: '14:00', currentCount: 0, maxCount: 2, isChildFriendly: true, isAvailable: true },
  { id: 'ts10', tableId: 'tb5', tableName: 'E桌', time: '15:30', currentCount: 1, maxCount: 2, isChildFriendly: true, isAvailable: true },
  { id: 'ts11', tableId: 'tb6', tableName: 'F桌', time: '14:00', currentCount: 2, maxCount: 2, isChildFriendly: false, isAvailable: false },
  { id: 'ts12', tableId: 'tb6', tableName: 'F桌', time: '15:30', currentCount: 0, maxCount: 2, isChildFriendly: false, isAvailable: true },
]

export const initialBookings: Booking[] = [
  { id: 'b1', fabricId: 'f1', dyeIds: ['d1'], tieMethodId: 't1', timeSlotId: 'ts2', isParentChild: true, childAge: 7, status: 'confirmed', pickupBatchId: 'pb1', estimatedDryTime: '16:00', createdAt: '2026-06-20T08:30:00' },
  { id: 'b2', fabricId: 'f2', dyeIds: ['d3', 'd4'], tieMethodId: 't2', timeSlotId: 'ts2', isParentChild: false, status: 'confirmed', pickupBatchId: 'pb1', estimatedDryTime: '16:00', createdAt: '2026-06-20T08:45:00' },
  { id: 'b3', fabricId: 'f3', dyeIds: ['d2', 'd5'], tieMethodId: 't3', timeSlotId: 'ts4', isParentChild: true, childAge: 5, status: 'pending', estimatedDryTime: '18:00', createdAt: '2026-06-20T09:10:00' },
]

export const initialPickupBatches: PickupBatch[] = [
  { id: 'pb1', time: '16:00', bookingIds: ['b1', 'b2'], status: 'drying' },
  { id: 'pb2', time: '18:00', bookingIds: ['b3'], status: 'drying' },
]

export const initialSoakStatuses: SoakStatus[] = [
  { id: 's1', dyeId: 'd1', dyeName: '蓝靛', color: '#2D4A5E', status: 'ready', remainingMinutes: 0, totalMinutes: 120 },
  { id: 's2', dyeId: 'd2', dyeName: '苏木', color: '#8F2E24', status: 'soaking', remainingMinutes: 35, totalMinutes: 90 },
  { id: 's3', dyeId: 'd3', dyeName: '姜黄', color: '#D4A843', status: 'ready', remainingMinutes: 0, totalMinutes: 60 },
  { id: 's4', dyeId: 'd4', dyeName: '洋葱皮', color: '#B8902E', status: 'preparing', remainingMinutes: 55, totalMinutes: 90 },
  { id: 's5', dyeId: 'd5', dyeName: '茜草', color: '#C4524A', status: 'soaking', remainingMinutes: 20, totalMinutes: 80 },
  { id: 's6', dyeId: 'd6', dyeName: '五倍子', color: '#4A3728', status: 'preparing', remainingMinutes: 70, totalMinutes: 100 },
]
