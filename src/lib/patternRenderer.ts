export function renderPattern(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  dyeColors: string[],
  patternType: string,
  fabricTexture: string,
  seed: number
) {
  const rng = createRng(seed)

  ctx.clearRect(0, 0, width, height)

  const baseColor = dyeColors.length > 0 ? dyeColors[0] : '#E0D0B0'
  ctx.fillStyle = mixColors(dyeColors, rng)
  ctx.fillRect(0, 0, width, height)

  applyFabricTexture(ctx, width, height, fabricTexture, rng)

  switch (patternType) {
    case 'radial':
      drawRadialPattern(ctx, width, height, dyeColors, rng)
      break
    case 'geometric':
      drawGeometricPattern(ctx, width, height, dyeColors, rng)
      break
    case 'curved':
      drawCurvedPattern(ctx, width, height, dyeColors, rng)
      break
    case 'sharp':
      drawSharpPattern(ctx, width, height, dyeColors, rng)
      break
  }

  addOrganicVariation(ctx, width, height, rng)
  addDyeBleeding(ctx, width, height, dyeColors, rng)
}

function createRng(seed: number) {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff
    return (s >>> 0) / 0xffffffff
  }
}

function mixColors(colors: string[], rng: () => number): string {
  if (colors.length === 0) return '#E0D0B0'
  if (colors.length === 1) return colors[0]
  const r = Math.floor(colors.reduce((s, c) => s + parseInt(c.slice(1, 3), 16), 0) / colors.length + (rng() - 0.5) * 20)
  const g = Math.floor(colors.reduce((s, c) => s + parseInt(c.slice(3, 5), 16), 0) / colors.length + (rng() - 0.5) * 20)
  const b = Math.floor(colors.reduce((s, c) => s + parseInt(c.slice(5, 7), 16), 0) / colors.length + (rng() - 0.5) * 20)
  return `rgb(${clamp(r)},${clamp(g)},${clamp(b)})`
}

function clamp(v: number, min = 0, max = 255) {
  return Math.max(min, Math.min(max, v))
}

function applyFabricTexture(ctx: CanvasRenderingContext2D, w: number, h: number, texture: string, rng: () => number) {
  const imageData = ctx.getImageData(0, 0, w, h)
  const data = imageData.data

  for (let i = 0; i < data.length; i += 4) {
    let noise = 0
    switch (texture) {
      case 'canvas':
        noise = (rng() - 0.5) * 12
        if ((i / 4) % 4 < 2) noise += 3
        break
      case 'knit':
        noise = (rng() - 0.5) * 8
        if (Math.sin(i * 0.1) > 0.5) noise += 5
        break
      case 'silk':
        noise = (rng() - 0.5) * 4
        break
      default:
        noise = (rng() - 0.5) * 6
    }
    data[i] = clamp(data[i] + noise)
    data[i + 1] = clamp(data[i + 1] + noise)
    data[i + 2] = clamp(data[i + 2] + noise)
  }

  ctx.putImageData(imageData, 0, 0)
}

function drawRadialPattern(ctx: CanvasRenderingContext2D, w: number, h: number, colors: string[], rng: () => number) {
  const cx = w / 2 + (rng() - 0.5) * 40
  const cy = h / 2 + (rng() - 0.5) * 40
  const rings = 3 + Math.floor(rng() * 4)
  const maxR = Math.min(w, h) * 0.45

  for (let i = rings; i >= 0; i--) {
    const radius = maxR * (i / rings) + rng() * 10
    const colorIdx = i % colors.length
    const color = colors[colorIdx] || '#2D4A5E'

    ctx.save()
    ctx.globalAlpha = 0.4 + rng() * 0.3
    ctx.beginPath()
    ctx.arc(cx, cy, radius, 0, Math.PI * 2)

    const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius)
    gradient.addColorStop(0, color + '60')
    gradient.addColorStop(0.5, color + 'A0')
    gradient.addColorStop(1, color + '30')
    ctx.fillStyle = gradient
    ctx.fill()
    ctx.restore()
  }

  const resistLines = 4 + Math.floor(rng() * 4)
  ctx.save()
  for (let i = 0; i < resistLines; i++) {
    const angle = (Math.PI * 2 * i) / resistLines + rng() * 0.3
    ctx.beginPath()
    ctx.moveTo(cx, cy)
    ctx.lineTo(cx + Math.cos(angle) * maxR * 1.2, cy + Math.sin(angle) * maxR * 1.2)
    ctx.strokeStyle = `rgba(255,245,230,${0.3 + rng() * 0.4})`
    ctx.lineWidth = 2 + rng() * 6
    ctx.stroke()
  }
  ctx.restore()
}

function drawGeometricPattern(ctx: CanvasRenderingContext2D, w: number, h: number, colors: string[], rng: () => number) {
  const stripes = 5 + Math.floor(rng() * 5)
  const stripeH = h / stripes
  const horizontal = rng() > 0.4

  for (let i = 0; i < stripes; i++) {
    const colorIdx = i % colors.length
    const color = colors[colorIdx] || '#D4A843'

    ctx.save()
    ctx.globalAlpha = 0.3 + rng() * 0.4
    ctx.fillStyle = color

    if (horizontal) {
      const y = i * stripeH + (rng() - 0.5) * 8
      ctx.fillRect(0, y, w, stripeH * (0.4 + rng() * 0.4))
    } else {
      const x = i * stripeH + (rng() - 0.5) * 8
      ctx.fillRect(x, 0, stripeH * (0.4 + rng() * 0.4), h)
    }
    ctx.restore()
  }

  const resistLines = 2 + Math.floor(rng() * 3)
  for (let i = 0; i < resistLines; i++) {
    const pos = rng() * (horizontal ? h : w)
    ctx.save()
    ctx.globalAlpha = 0.5 + rng() * 0.3
    ctx.beginPath()
    if (horizontal) {
      ctx.moveTo(0, pos)
      ctx.lineTo(w, pos + (rng() - 0.5) * 20)
    } else {
      ctx.moveTo(pos, 0)
      ctx.lineTo(pos + (rng() - 0.5) * 20, h)
    }
    ctx.strokeStyle = 'rgba(255,245,230,0.6)'
    ctx.lineWidth = 3 + rng() * 8
    ctx.stroke()
    ctx.restore()
  }
}

function drawCurvedPattern(ctx: CanvasRenderingContext2D, w: number, h: number, colors: string[], rng: () => number) {
  const curves = 4 + Math.floor(rng() * 4)

  for (let i = 0; i < curves; i++) {
    const colorIdx = i % colors.length
    const color = colors[colorIdx] || '#8F2E24'

    ctx.save()
    ctx.globalAlpha = 0.3 + rng() * 0.4
    ctx.beginPath()

    const startX = rng() * w
    const startY = rng() * h
    ctx.moveTo(startX, startY)

    const points = 3 + Math.floor(rng() * 3)
    for (let j = 0; j < points; j++) {
      const cpx1 = rng() * w
      const cpy1 = rng() * h
      const cpx2 = rng() * w
      const cpy2 = rng() * h
      const ex = rng() * w
      const ey = rng() * h
      ctx.bezierCurveTo(cpx1, cpy1, cpx2, cpy2, ex, ey)
    }

    ctx.strokeStyle = color
    ctx.lineWidth = 8 + rng() * 20
    ctx.lineCap = 'round'
    ctx.stroke()

    ctx.lineWidth = 3 + rng() * 6
    ctx.strokeStyle = 'rgba(255,245,230,0.4)'
    ctx.stroke()
    ctx.restore()
  }
}

function drawSharpPattern(ctx: CanvasRenderingContext2D, w: number, h: number, colors: string[], rng: () => number) {
  const lines = 4 + Math.floor(rng() * 4)

  for (let i = 0; i < lines; i++) {
    const colorIdx = i % colors.length
    const color = colors[colorIdx] || '#4A3728'

    ctx.save()
    ctx.globalAlpha = 0.4 + rng() * 0.3
    ctx.beginPath()

    const x1 = rng() * w
    const y1 = rng() * h
    const x2 = rng() * w
    const y2 = rng() * h
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)

    ctx.strokeStyle = color
    ctx.lineWidth = 10 + rng() * 25
    ctx.lineCap = 'square'
    ctx.stroke()

    ctx.strokeStyle = 'rgba(255,245,230,0.5)'
    ctx.lineWidth = 2 + rng() * 4
    ctx.stroke()
    ctx.restore()
  }

  const rects = 1 + Math.floor(rng() * 3)
  for (let i = 0; i < rects; i++) {
    const colorIdx = i % colors.length
    const color = colors[colorIdx] || '#4A3728'

    ctx.save()
    ctx.globalAlpha = 0.2 + rng() * 0.2
    const rx = rng() * w * 0.6
    const ry = rng() * h * 0.6
    const rw = 30 + rng() * 80
    const rh = 30 + rng() * 80
    ctx.fillStyle = color
    ctx.fillRect(rx, ry, rw, rh)

    ctx.strokeStyle = 'rgba(255,245,230,0.6)'
    ctx.lineWidth = 2 + rng() * 5
    ctx.strokeRect(rx, ry, rw, rh)
    ctx.restore()
  }
}

function addOrganicVariation(ctx: CanvasRenderingContext2D, w: number, h: number, rng: () => number) {
  const spots = 15 + Math.floor(rng() * 20)
  for (let i = 0; i < spots; i++) {
    const x = rng() * w
    const y = rng() * h
    const r = 2 + rng() * 15

    ctx.save()
    ctx.globalAlpha = 0.05 + rng() * 0.1
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fillStyle = rng() > 0.5 ? 'rgba(255,245,230,0.8)' : 'rgba(0,0,0,0.15)'
    ctx.fill()
    ctx.restore()
  }
}

function addDyeBleeding(ctx: CanvasRenderingContext2D, w: number, h: number, colors: string[], rng: () => number) {
  const bleedCount = 5 + Math.floor(rng() * 8)
  for (let i = 0; i < bleedCount; i++) {
    const x = rng() * w
    const y = rng() * h
    const r = 20 + rng() * 60
    const color = colors[Math.floor(rng() * colors.length)] || '#2D4A5E'

    ctx.save()
    ctx.globalAlpha = 0.06 + rng() * 0.08
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, r)
    gradient.addColorStop(0, color)
    gradient.addColorStop(1, 'transparent')
    ctx.fillStyle = gradient
    ctx.fillRect(x - r, y - r, r * 2, r * 2)
    ctx.restore()
  }
}

export function generateSeed(): number {
  return Math.floor(Math.random() * 1000000)
}
