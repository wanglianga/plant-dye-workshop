import type { Fabric, DyeMaterial, TieMethod, PatternTemplate, TimeSlot, Booking, PickupBatch, SoakStatus, WorkshopTable } from './types'

export const fabrics: Fabric[] = [
  { id: 'f1', name: '方巾', size: '45×45cm', texture: 'smooth', icon: 'Square', description: '棉质方巾，适合入门体验，纹路清晰', baseColor: 'light' },
  { id: 'f2', name: '帆布袋', size: '35×40cm', texture: 'canvas', icon: 'ShoppingBag', description: '厚实帆布，日常可用，显色饱满', baseColor: 'dark' },
  { id: 'f3', name: 'T恤', size: 'M / L', texture: 'knit', icon: 'Shirt', description: '精梳棉T恤，穿着舒适，纹样自然', baseColor: 'light' },
  { id: 'f4', name: '围巾', size: '180×50cm', texture: 'silk', icon: 'Scarf', description: '丝棉混纺，轻盈飘逸，渐变柔美', baseColor: 'light' },
  { id: 'f5', name: '深色T恤', size: 'M / L', texture: 'knit', icon: 'Shirt', description: '深色精梳棉T恤，深底显色有独特效果', baseColor: 'dark' },
]

export const dyeMaterials: DyeMaterial[] = [
  {
    id: 'd1', name: '蓝靛', color: '#2D4A5E', colorLight: '#6E93AB', colorName: '靛蓝',
    stock: 85, maxStock: 100, description: '传统板蓝根发酵，经典靛蓝色系', origin: '板蓝根叶',
    boilTimeMinutes: 120, dryTimeHours: 6, suitableForDark: true, needsPreBoil: false,
    alternativeDyeIds: ['d6'], difficultyLevel: 2, needsTeacherPrep: true,
  },
  {
    id: 'd2', name: '苏木', color: '#8F2E24', colorLight: '#D65A4D', colorName: '苏红',
    stock: 42, maxStock: 80, description: '苏木心材熬煮，温暖红棕调', origin: '苏木心材',
    boilTimeMinutes: 90, dryTimeHours: 5, suitableForDark: false, needsPreBoil: true,
    alternativeDyeIds: ['d5'], difficultyLevel: 2, needsTeacherPrep: false,
  },
  {
    id: 'd3', name: '姜黄', color: '#D4A843', colorLight: '#F0D699', colorName: '姜黄',
    stock: 67, maxStock: 90, description: '姜黄根茎提色，明亮的金黄调', origin: '姜黄根茎',
    boilTimeMinutes: 60, dryTimeHours: 4, suitableForDark: false, needsPreBoil: false,
    alternativeDyeIds: ['d4'], difficultyLevel: 1, needsTeacherPrep: false,
  },
  {
    id: 'd4', name: '洋葱皮', color: '#B8902E', colorLight: '#E6BF66', colorName: '洋葱黄',
    stock: 15, maxStock: 60, description: '洋葱外皮煮染，层次丰富的黄棕', origin: '洋葱外皮',
    boilTimeMinutes: 90, dryTimeHours: 5, suitableForDark: false, needsPreBoil: true,
    alternativeDyeIds: ['d3'], difficultyLevel: 2, needsTeacherPrep: false,
  },
  {
    id: 'd5', name: '茜草', color: '#C4524A', colorLight: '#E88E85', colorName: '茜红',
    stock: 55, maxStock: 70, description: '茜草根提取，柔和粉红色系', origin: '茜草根',
    boilTimeMinutes: 80, dryTimeHours: 5, suitableForDark: false, needsPreBoil: true,
    alternativeDyeIds: ['d2'], difficultyLevel: 3, needsTeacherPrep: true,
  },
  {
    id: 'd6', name: '五倍子', color: '#4A3728', colorLight: '#8B6F47', colorName: '铁黑',
    stock: 12, maxStock: 50, description: '五倍子加铁媒染，沉稳灰黑调', origin: '五倍子+铁',
    boilTimeMinutes: 100, dryTimeHours: 10, suitableForDark: true, needsPreBoil: true,
    alternativeDyeIds: ['d1'], difficultyLevel: 3, needsTeacherPrep: true,
  },
]

export const tieMethods: TieMethod[] = [
  {
    id: 't1', name: '螺旋', description: '从中心点旋转拧转布料，形成连续螺旋纹', patternType: 'spiral', icon: 'Spinner',
    difficultyLevel: 2, estimatedMinutes: 15,
    failureRisk: {
      level: 'medium',
      title: '螺旋不均风险',
      description: '拧转力度不均可能导致螺旋线条中断或模糊，手劲过松会让纹路失去层次',
      tips: ['从中心点固定后均匀旋转', '每圈间距保持在2-3cm', '使用筷子辅助固定中心点'],
    },
    colorBlockHint: '色块呈放射状螺旋分布，中心密集、边缘渐淡',
    patternHint: '连续曲线螺旋纹，类似水波纹旋转扩散',
    textureTip: '平滑棉布显色最佳，帆布纹理会让螺旋边缘略模糊',
  },
  {
    id: 't2', name: '条纹', description: '将布料反复折叠后捆扎，形成平行条纹图案', patternType: 'stripe', icon: 'AlignJustify',
    difficultyLevel: 1, estimatedMinutes: 10,
    failureRisk: {
      level: 'low',
      title: '条纹不齐风险',
      description: '折叠时边缘不齐会导致条纹歪斜，但不影响整体效果',
      tips: ['用尺子辅助对齐折叠线', '每折后用重物压平固定', '捆扎线间距保持均匀'],
    },
    colorBlockHint: '色块呈水平或垂直平行带状，间隔均匀分布',
    patternHint: '规整平行条纹，类似斑马纹或彩虹条',
    textureTip: '针织布料弹性大，条纹会略呈波浪形，别有韵味',
  },
  {
    id: 't3', name: '夹染', description: '用木板或夹子夹紧布料折叠处，形成锐利留白线', patternType: 'clamp', icon: 'GripVertical',
    difficultyLevel: 3, estimatedMinutes: 20,
    failureRisk: {
      level: 'high',
      title: '夹染漏色风险',
      description: '夹子夹持力度不足或布料折叠层数过多，会导致留白线条模糊甚至消失',
      tips: ['每层折叠不超过4层', '夹子间距控制在5cm以内', '夹持后检查是否有松动'],
    },
    colorBlockHint: '色块被锐利直线分割，形成几何留白区域',
    patternHint: '锐利直线分割的几何图案，类似日式友禅纹',
    textureTip: '丝绸类薄布料效果最佳，厚帆布需要多夹2道',
  },
  {
    id: 't4', name: '渐变', description: '分区域深浅浸染，控制浸泡时间形成自然过渡', patternType: 'gradient', icon: 'Sunrise',
    difficultyLevel: 2, estimatedMinutes: 25,
    failureRisk: {
      level: 'medium',
      title: '渐变过渡生硬风险',
      description: '各区域浸泡时间差控制不当，会导致颜色边界明显而非柔和过渡',
      tips: ['先浸浅色区3分钟，再加深色区', '过渡区反复提放2-3次', '使用温水加速染料扩散'],
    },
    colorBlockHint: '色块从深到浅自然过渡，边界柔和无硬线',
    patternHint: '上下或左右深浅渐变，如晨曦夕阳般柔和',
    textureTip: '丝绸吸水性好，渐变最自然；棉麻需延长过渡区操作',
  },
  {
    id: 't5', name: '留白', description: '大面积区域用蜡封或塑料膜包裹，保留原色留白', patternType: 'negative', icon: 'Frame',
    difficultyLevel: 3, estimatedMinutes: 30,
    failureRisk: {
      level: 'high',
      title: '留白区域渗色风险',
      description: '蜡封不完整或包裹有缝隙，染料会渗入留白区破坏图案',
      tips: ['蜡封涂2遍以上，检查边缘', '塑料膜用胶带紧密缠绕', '染色前先浸入温水测试密封性'],
    },
    colorBlockHint: '大块原布色留白与染色区对比鲜明，如窗花剪影',
    patternHint: '大面积留白图案，可呈现花朵、几何等具象造型',
    textureTip: '平滑棉布蜡封附着力最佳，针织布料建议用包裹法',
  },
]

export const patternTemplates: PatternTemplate[] = [
  { id: 'p1', name: '星芒', tieMethodId: 't1', dyeIds: ['d1'], description: '中心放射状纹路，如星辰般扩散' },
  { id: 'p2', name: '涟漪', tieMethodId: 't1', dyeIds: ['d1', 'd3'], description: '多层圆环叠加，色彩渐变过渡' },
  { id: 'p3', name: '山脊', tieMethodId: 't2', dyeIds: ['d1', 'd4'], description: '水平条纹起伏，如远山层叠' },
  { id: 'p4', name: '棋格', tieMethodId: 't2', dyeIds: ['d3'], description: '规整方格交错，简约而有节奏' },
  { id: 'p5', name: '花径', tieMethodId: 't3', dyeIds: ['d2', 'd5'], description: '弧线交织成花，浪漫而灵动' },
  { id: 'p6', name: '流水', tieMethodId: 't3', dyeIds: ['d1', 'd2'], description: '流畅曲线延伸，如溪水蜿蜒' },
  { id: 'p7', name: '棱角', tieMethodId: 't3', dyeIds: ['d1', 'd6'], description: '利落直线切割，现代感十足' },
  { id: 'p8', name: '窗格', tieMethodId: 't3', dyeIds: ['d4', 'd3'], description: '规整窗格留白，温润古朴' },
  { id: 'p9', name: '晨曦', tieMethodId: 't4', dyeIds: ['d3', 'd2'], description: '金黄到暖红的柔和渐变，如朝阳初升' },
  { id: 'p10', name: '深海', tieMethodId: 't4', dyeIds: ['d1', 'd6'], description: '浅蓝到深黑的纵向渐变，如深海潜行' },
  { id: 'p11', name: '樱花', tieMethodId: 't5', dyeIds: ['d5'], description: '留白樱花造型，粉色点缀枝头' },
  { id: 'p12', name: '月相', tieMethodId: 't5', dyeIds: ['d1'], description: '圆形留白如月，靛蓝夜空为底' },
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
