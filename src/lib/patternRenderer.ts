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

  ctx.fillStyle = mixColors(dyeColors, rng, 0.3)
  ctx.fillRect(0, 0, width, height)

  applyFabricTexture(ctx, width, height, fabricTexture, rng)

  switch (patternType) {
    case 'spiral':
      drawSpiralPattern(ctx, width, height, dyeColors, rng)
      break
    case 'stripe':
      drawStripePattern(ctx, width, height, dyeColors, rng)
      break
    case 'clamp':
      drawClampPattern(ctx, width, height, dyeColors, rng)
      break
    case 'gradient':
      drawGradientPattern(ctx, width, height, dyeColors, rng)
      break
    case 'negative':
      drawNegativePattern(ctx, width, height, dyeColors, rng)
      break
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

function mixColors(colors: string[], rng: () => number, alpha = 1): string {
  if (colors.length === 0) return '#E8DDC8'
  if (colors.length === 1) return colors[0]
  const r = Math.floor(colors.reduce((s, c) => s + parseInt(c.slice(1, 3), 16), 0) / colors.length + (rng() - 0.5) * 20)
  const g = Math.floor(colors.reduce((s, c) => s + parseInt(c.slice(3, 5), 16), 0) / colors.length + (rng() - 0.5) * 20)
  const b = Math.floor(colors.reduce((s, c) => s + parseInt(c.slice(5, 7), 16), 0) / colors.length + (rng() - 0.5) * 20)
  return `rgba(${clamp(r)},${clamp(g)},${clamp(b)},${alpha})`
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

function drawSpiralPattern(ctx: CanvasRenderingContext2D, w: number, h: number, colors: string[], rng: () => number) {
  const cx = w / 2 + (rng() - 0.5) * 30
  const cy = h / 2 + (rng() - 0.5) * 30
  const maxR = Math.min(w, h) * 0.48
  const arms = 3 + Math.floor(rng() * 3)

  for (let arm = 0; arm < arms; arm++) {
    const colorIdx = arm % colors.length
    const color = colors[colorIdx] || '#2D4A5E'
    const armOffset = (Math.PI * 2 * arm) / arms

    ctx.save()
    ctx.globalAlpha = 0.55 + rng() * 0.25

    for (let t = 0; t < maxR * 3.5; t += 2) {
      const angle = armOffset + t * 0.08 + rng() * 0.02
      const radius = t * 0.3
      const x = cx + Math.cos(angle) * radius
      const y = cy + Math.sin(angle) * radius
      const size = 3 + (radius / maxR) * 18 + rng() * 4

      ctx.beginPath()
      ctx.arc(x, y, size, 0, Math.PI * 2)
      ctx.fillStyle = color
      ctx.globalAlpha = 0.1 + (radius / maxR) * 0.5 + rng() * 0.1
      ctx.fill()
    }
    ctx.restore()
  }

  ctx.save()
  ctx.globalAlpha = 0.35
  for (let ring = 0; ring < 5; ring++) {
    const r = (maxR * (ring + 1)) / 6
    ctx.beginPath()
    ctx.arc(cx, cy, r, 0, Math.PI * 2)
    ctx.strokeStyle = `rgba(255,248,235,${0.25 + rng() * 0.2})`
    ctx.lineWidth = 2 + rng() * 5
    ctx.stroke()
  }
  ctx.restore()

  const centerColor = colors[0] || '#2D4A5E'
  ctx.save()
  const centerGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR * 0.15)
  centerGrad.addColorStop(0, centerColor)
  centerGrad.addColorStop(1, centerColor + '00')
  ctx.fillStyle = centerGrad
  ctx.fillRect(cx - maxR * 0.2, cy - maxR * 0.2, maxR * 0.4, maxR * 0.4)
  ctx.restore()
}

function drawStripePattern(ctx: CanvasRenderingContext2D, w: number, h: number, colors: string[], rng: () => number) {
  const stripes = 7 + Math.floor(rng() * 6)
  const horizontal = rng() > 0.35
  const dimension = horizontal ? h : w
  const stripeW = dimension / stripes

  for (let i = 0; i < stripes; i++) {
    const colorIdx = i % colors.length
    const color = colors[colorIdx] || '#D4A843'
    const nextColor = colors[(colorIdx + 1) % colors.length] || color

    ctx.save()
    const offset = (rng() - 0.5) * 10
    const thickness = stripeW * (0.55 + rng() * 0.3)

    if (horizontal) {
      const y = i * stripeW + offset
      const grad = ctx.createLinearGradient(0, y, 0, y + thickness)
      grad.addColorStop(0, color + 'CC')
      grad.addColorStop(0.5, color)
      grad.addColorStop(1, nextColor + '99')
      ctx.fillStyle = grad
      ctx.globalAlpha = 0.5 + rng() * 0.3
      ctx.fillRect(-10, y, w + 20, thickness)
    } else {
      const x = i * stripeW + offset
      const grad = ctx.createLinearGradient(x, 0, x + thickness, 0)
      grad.addColorStop(0, color + 'CC')
      grad.addColorStop(0.5, color)
      grad.addColorStop(1, nextColor + '99')
      ctx.fillStyle = grad
      ctx.globalAlpha = 0.5 + rng() * 0.3
      ctx.fillRect(x, -10, thickness, h + 20)
    }
    ctx.restore()
  }

  const resistLines = 2 + Math.floor(rng() * 3)
  for (let i = 0; i < resistLines; i++) {
    const pos = rng() * dimension
    ctx.save()
    ctx.globalAlpha = 0.45 + rng() * 0.25
    ctx.beginPath()
    if (horizontal) {
      ctx.moveTo(0, pos)
      ctx.bezierCurveTo(w * 0.3, pos + (rng() - 0.5) * 25, w * 0.7, pos + (rng() - 0.5) * 25, w, pos + (rng() - 0.5) * 15)
    } else {
      ctx.moveTo(pos, 0)
      ctx.bezierCurveTo(pos + (rng() - 0.5) * 25, h * 0.3, pos + (rng() - 0.5) * 25, h * 0.7, pos + (rng() - 0.5) * 15, h)
    }
    ctx.strokeStyle = 'rgba(255,250,240,0.7)'
    ctx.lineWidth = 4 + rng() * 10
    ctx.stroke()
    ctx.restore()
  }
}

function drawClampPattern(ctx: CanvasRenderingContext2D, w: number, h: number, colors: string[], rng: () => number) {
  const sections = 3 + Math.floor(rng() * 3)
  const foldLines: number[] = []

  for (let i = 1; i < sections; i++) {
    foldLines.push((w / sections) * i + (rng() - 0.5) * 20)
  }

  let lastX = 0
  for (let s = 0; s < sections; s++) {
    const colorIdx = s % colors.length
    const color = colors[colorIdx] || '#4A3728'
    const x2 = foldLines[s] ?? w

    ctx.save()
    ctx.globalAlpha = 0.55 + rng() * 0.25

    const grad = ctx.createLinearGradient(lastX, 0, x2, 0)
    grad.addColorStop(0, color + 'AA')
    grad.addColorStop(0.5, color)
    grad.addColorStop(1, color + '88')
    ctx.fillStyle = grad
    ctx.fillRect(lastX + 5, 0, x2 - lastX - 10, h)
    ctx.restore()

    lastX = x2
  }

  for (const fx of foldLines) {
    ctx.save()
    ctx.globalAlpha = 0.85
    ctx.beginPath()
    ctx.moveTo(fx + (rng() - 0.5) * 8, 0)
    ctx.lineTo(fx + (rng() - 0.5) * 12, h)
    ctx.strokeStyle = 'rgba(255,252,245,0.95)'
    ctx.lineWidth = 10 + rng() * 8
    ctx.stroke()

    ctx.strokeStyle = 'rgba(255,252,245,0.5)'
    ctx.lineWidth = 20 + rng() * 12
    ctx.stroke()
    ctx.restore()
  }

  const horizontalFolds = 1 + Math.floor(rng() * 2)
  for (let hf = 0; hf < horizontalFolds; hf++) {
    const y = (h / (horizontalFolds + 1)) * (hf + 1) + (rng() - 0.5) * 30
    ctx.save()
    ctx.globalAlpha = 0.7
    ctx.beginPath()
    ctx.moveTo(0, y + (rng() - 0.5) * 10)
    ctx.lineTo(w, y + (rng() - 0.5) * 15)
    ctx.strokeStyle = 'rgba(255,252,245,0.85)'
    ctx.lineWidth = 8 + rng() * 10
    ctx.stroke()
    ctx.restore()
  }

  const clampedAreas = 2 + Math.floor(rng() * 2)
  for (let ca = 0; ca < clampedAreas; ca++) {
    const rx = rng() * w * 0.6
    const ry = rng() * h * 0.6
    const rw = 50 + rng() * 100
    const rh = 40 + rng() * 80
    ctx.save()
    ctx.globalAlpha = 0.92
    ctx.fillStyle = 'rgba(255,252,245,0.98)'
    ctx.fillRect(rx, ry, rw, rh)
    ctx.strokeStyle = 'rgba(200,180,150,0.3)'
    ctx.lineWidth = 2
    ctx.strokeRect(rx, ry, rw, rh)
    ctx.restore()
  }
}

function drawGradientPattern(ctx: CanvasRenderingContext2D, w: number, h: number, colors: string[], rng: () => number) {
  const vertical = rng() > 0.3
  const sortedColors = [...colors]
  if (rng() > 0.5) sortedColors.reverse()

  ctx.save()
  if (vertical) {
    const grad = ctx.createLinearGradient(0, 0, 0, h)
    const stops = sortedColors.length
    for (let i = 0; i < stops; i++) {
      const pos = i / Math.max(1, stops - 1)
      grad.addColorStop(Math.max(0, Math.min(1, pos - 0.05 + rng() * 0.1)), sortedColors[i])
    }
    if (sortedColors.length === 1) {
      grad.addColorStop(0, sortedColors[0] + '22')
      grad.addColorStop(1, sortedColors[0])
    }
    ctx.fillStyle = grad
    ctx.globalAlpha = 0.75
  } else {
    const grad = ctx.createLinearGradient(0, 0, w, 0)
    const stops = sortedColors.length
    for (let i = 0; i < stops; i++) {
      const pos = i / Math.max(1, stops - 1)
      grad.addColorStop(Math.max(0, Math.min(1, pos - 0.05 + rng() * 0.1)), sortedColors[i])
    }
    if (sortedColors.length === 1) {
      grad.addColorStop(0, sortedColors[0] + '22')
      grad.addColorStop(1, sortedColors[0])
    }
    ctx.fillStyle = grad
    ctx.globalAlpha = 0.75
  }
  ctx.fillRect(0, 0, w, h)
  ctx.restore()

  const bands = 2 + Math.floor(rng() * 3)
  for (let b = 0; b < bands; b++) {
    const colorIdx = b % sortedColors.length
    const color = sortedColors[colorIdx]

    ctx.save()
    if (vertical) {
      const y = (h / (bands + 1)) * (b + 1) + (rng() - 0.5) * 30
      const grad = ctx.createLinearGradient(0, y - 40, 0, y + 40)
      grad.addColorStop(0, color + '00')
      grad.addColorStop(0.5, color + '55')
      grad.addColorStop(1, color + '00')
      ctx.fillStyle = grad
      ctx.fillRect(0, y - 60, w, 120)
    } else {
      const x = (w / (bands + 1)) * (b + 1) + (rng() - 0.5) * 30
      const grad = ctx.createLinearGradient(x - 40, 0, x + 40, 0)
      grad.addColorStop(0, color + '00')
      grad.addColorStop(0.5, color + '55')
      grad.addColorStop(1, color + '00')
      ctx.fillStyle = grad
      ctx.fillRect(x - 60, 0, 120, h)
    }
    ctx.restore()
  }

  const transitionBands = 3 + Math.floor(rng() * 3)
  for (let tb = 0; tb < transitionBands; tb++) {
    ctx.save()
    ctx.globalAlpha = 0.15 + rng() * 0.1
    if (vertical) {
      const y = rng() * h
      const grad = ctx.createLinearGradient(0, y - 80, 0, y + 80)
      grad.addColorStop(0, 'rgba(255,250,240,0)')
      grad.addColorStop(0.5, 'rgba(255,250,240,0.6)')
      grad.addColorStop(1, 'rgba(255,250,240,0)')
      ctx.fillStyle = grad
      ctx.fillRect(0, y - 100, w, 200)
    } else {
      const x = rng() * w
      const grad = ctx.createLinearGradient(x - 80, 0, x + 80, 0)
      grad.addColorStop(0, 'rgba(255,250,240,0)')
      grad.addColorStop(0.5, 'rgba(255,250,240,0.6)')
      grad.addColorStop(1, 'rgba(255,250,240,0)')
      ctx.fillStyle = grad
      ctx.fillRect(x - 100, 0, 200, h)
    }
    ctx.restore()
  }
}

function drawNegativePattern(ctx: CanvasRenderingContext2D, w: number, h: number, colors: string[], rng: () => number) {
  const bgColor = colors.length > 0 ? colors[0] : '#2D4A5E'
  const secondaryColor = colors.length > 1 ? colors[1] : bgColor

  ctx.save()
  ctx.globalAlpha = 0.85
  const grad = ctx.createRadialGradient(w / 2, h / 2, 50, w / 2, h / 2, Math.max(w, h) * 0.7)
  grad.addColorStop(0, secondaryColor)
  grad.addColorStop(1, bgColor)
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, w, h)
  ctx.restore()

  const shapes = 3 + Math.floor(rng() * 4)
  for (let s = 0; s < shapes; s++) {
    const cx = w * (0.2 + rng() * 0.6)
    const cy = h * (0.2 + rng() * 0.6)
    const size = Math.min(w, h) * (0.08 + rng() * 0.12)
    const shapeType = Math.floor(rng() * 4)

    ctx.save()
    ctx.globalAlpha = 0.97
    ctx.fillStyle = '#FAF5EA'
    ctx.shadowColor = 'rgba(200,180,150,0.4)'
    ctx.shadowBlur = 8 + rng() * 10

    switch (shapeType) {
      case 0:
        drawFlower(ctx, cx, cy, size, rng)
        break
      case 1:
        drawStar(ctx, cx, cy, size, 5 + Math.floor(rng() * 3), rng)
        break
      case 2:
        ctx.beginPath()
        ctx.arc(cx, cy, size * (0.7 + rng() * 0.4), 0, Math.PI * 2)
        ctx.fill()
        break
      case 3:
        const sides = 4 + Math.floor(rng() * 3)
        ctx.beginPath()
        for (let i = 0; i < sides; i++) {
          const angle = (Math.PI * 2 * i) / sides - Math.PI / 2 + rng() * 0.2
          const r = size * (0.8 + rng() * 0.3)
          const x = cx + Math.cos(angle) * r
          const y = cy + Math.sin(angle) * r
          if (i === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.closePath()
        ctx.fill()
        break
    }
    ctx.restore()
  }

  const smallDots = 20 + Math.floor(rng() * 30)
  for (let d = 0; d < smallDots; d++) {
    const dx = rng() * w
    const dy = rng() * h
    const dr = 2 + rng() * 8

    ctx.save()
    ctx.globalAlpha = 0.85 + rng() * 0.1
    ctx.fillStyle = '#FAF5EA'
    ctx.beginPath()
    ctx.arc(dx, dy, dr, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }

  const borderShapes = 4 + Math.floor(rng() * 4)
  for (let bs = 0; bs < borderShapes; bs++) {
    const side = Math.floor(rng() * 4)
    let bx = 0, by = 0
    switch (side) {
      case 0: bx = rng() * w; by = 20 + rng() * 40; break
      case 1: bx = rng() * w; by = h - 20 - rng() * 40; break
      case 2: bx = 20 + rng() * 40; by = rng() * h; break
      case 3: bx = w - 20 - rng() * 40; by = rng() * h; break
    }
    const bsize = 15 + rng() * 35

    ctx.save()
    ctx.globalAlpha = 0.92
    ctx.fillStyle = '#FAF5EA'
    ctx.beginPath()
    ctx.arc(bx, by, bsize, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }

  const edgeSeep = 15 + Math.floor(rng() * 20)
  for (let es = 0; es < edgeSeep; es++) {
    const ex = rng() * w
    const ey = rng() * h
    const nearEdge = Math.min(ex, ey, w - ex, h - ey) < 80
    if (!nearEdge) continue

    ctx.save()
    ctx.globalAlpha = 0.08 + rng() * 0.12
    ctx.fillStyle = bgColor
    ctx.beginPath()
    ctx.arc(ex, ey, 8 + rng() * 20, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }
}

function drawFlower(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number, rng: () => number) {
  const petals = 5 + Math.floor(rng() * 3)
  for (let p = 0; p < petals; p++) {
    const angle = (Math.PI * 2 * p) / petals - Math.PI / 2
    const px = cx + Math.cos(angle) * size * 0.6
    const py = cy + Math.sin(angle) * size * 0.6
    ctx.beginPath()
    ctx.ellipse(px, py, size * 0.5, size * 0.35, angle, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.beginPath()
  ctx.arc(cx, cy, size * 0.3, 0, Math.PI * 2)
  ctx.fillStyle = '#FFF8EC'
  ctx.fill()
}

function drawStar(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number, points: number, rng: () => number) {
  ctx.beginPath()
  for (let i = 0; i < points * 2; i++) {
    const angle = (Math.PI * i) / points - Math.PI / 2
    const r = i % 2 === 0 ? size : size * 0.45
    const x = cx + Math.cos(angle) * r
    const y = cy + Math.sin(angle) * r
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.closePath()
  ctx.fill()
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
