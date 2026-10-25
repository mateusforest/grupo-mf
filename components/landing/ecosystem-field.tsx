'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { Pause, Play, ArrowUpRight } from 'lucide-react'
import { portfolioProducts, productHref } from '@/lib/public-products'
import styles from './ecosystem-field.module.css'

const positions = [
  [22, 16],
  [79, 23],
  [84, 68],
  [46, 85],
  [13, 57],
]
const colors = ['#e98229', '#ed963a', '#147faa', '#178d45', '#087354']

export function EcosystemField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fieldRef = useRef<HTMLDivElement>(null)
  const pointer = useRef({ x: 0, y: 0 })
  const accent = useRef('#315be8')
  const savedPhase = useRef(0)
  const [active, setActive] = useState<number | null>(null)
  const [paused, setPaused] = useState(false)
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    accent.current = active === null ? '#315be8' : colors[active]
  }, [active])

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    const field = fieldRef.current
    if (!canvas || !field) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    let width = 0,
      height = 0,
      frame = 0,
      visible = false,
      phase = savedPhase.current,
      last = 0
    const rotation = { x: 0, y: 0 }
    const still = paused || reduced

    function render(now: number) {
      if (!ctx || !canvas) return
      const delta = last ? Math.min(now - last, 40) : 0
      last = now
      if (!still) phase += delta * 0.00012
      savedPhase.current = phase
      rotation.x += (pointer.current.x - rotation.x) * 0.045
      rotation.y += (pointer.current.y - rotation.y) * 0.045
      ctx.clearRect(0, 0, width, height)
      const scale = Math.min(width, height) * 0.255
      const turn = phase * 0.3 + rotation.x * 0.22
      const tilt = -0.4 + rotation.y * 0.16
      const segments = width < 400 ? 80 : 110
      const bands = 7
      for (let band = 0; band < bands; band++) {
        let previous: { x: number; y: number } | null = null
        for (let i = 0; i <= segments; i++) {
          const t = (i / segments) * Math.PI * 2
          const offset = (band - 3) * 0.038
          const r = 1 + 0.24 * Math.cos(3 * t + phase * 0.35) + offset
          const x = r * Math.cos(2 * t)
          const y = 0.64 * Math.sin(3 * t) + offset * Math.cos(t)
          const z = r * Math.sin(2 * t) * 0.7
          const rx = x * Math.cos(turn) - z * Math.sin(turn)
          const rz = x * Math.sin(turn) + z * Math.cos(turn)
          const ry = y * Math.cos(tilt) - rz * Math.sin(tilt)
          const depth = y * Math.sin(tilt) + rz * Math.cos(tilt)
          const perspective = 2.8 / (2.8 + depth * 0.35)
          const px = width * 0.5 + rx * scale * perspective
          const py = height * 0.49 + ry * scale * perspective
          ctx.strokeStyle = accent.current
          ctx.fillStyle = accent.current
          if (previous) {
            ctx.globalAlpha = 0.07 + (depth + 1.5) * 0.025
            ctx.lineWidth = 0.6
            ctx.beginPath()
            ctx.moveTo(previous.x, previous.y)
            ctx.lineTo(px, py)
            ctx.stroke()
          }
          ctx.globalAlpha = 0.24 + (depth + 1.5) * 0.16
          ctx.beginPath()
          ctx.arc(px, py, 0.75 + (depth + 1.5) * 0.3, 0, Math.PI * 2)
          ctx.fill()
          previous = { x: px, y: py }
        }
      }
      ctx.globalAlpha = 1
    }
    function loop(now: number) {
      render(now)
      if (visible && !document.hidden && !still)
        frame = requestAnimationFrame(loop)
    }
    function sync() {
      cancelAnimationFrame(frame)
      last = 0
      render(performance.now())
      if (visible && !document.hidden && !still)
        frame = requestAnimationFrame(loop)
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
        sync()
      },
      { threshold: 0.05 }
    )
    observer.observe(field)
    const resize = new ResizeObserver(() => {
      const rect = field.getBoundingClientRect()
      width = rect.width
      height = rect.height
      const dpr = Math.min(devicePixelRatio || 1, 1.5)
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      sync()
    })
    resize.observe(field)
    document.addEventListener('visibilitychange', sync)
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      resize.disconnect()
      document.removeEventListener('visibilitychange', sync)
    }
  }, [paused, reduced])

  return (
    <div
      className={styles.field}
      ref={fieldRef}
      data-paused={paused || reduced}
      onPointerMove={(event) => {
        if (event.pointerType !== 'mouse' || reduced || paused) return
        const rect = event.currentTarget.getBoundingClientRect()
        pointer.current = {
          x: (event.clientX - rect.left) / rect.width - 0.5,
          y: (event.clientY - rect.top) / rect.height - 0.5,
        }
      }}
      onPointerLeave={() => {
        pointer.current = { x: 0, y: 0 }
        setActive(null)
      }}
    >
      <div className={styles.halo} aria-hidden="true" />
      <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />
      <svg
        className={styles.connections}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {positions.map(([x, y], i) => (
          <path
            key={i}
            d={'M 50 49 Q ' + x + ' 49 ' + x + ' ' + y}
            className={active === i ? styles.connected : undefined}
          />
        ))}
      </svg>
      <div className={styles.core} aria-hidden="true">
        <Image src="/mf-logo.png" alt="" width={52} height={52} />
        <span>GRUPO MF</span>
      </div>
      <nav
        aria-label="Explore os produtos do Grupo MF"
        className={styles.nodes}
      >
        {portfolioProducts.map((product, i) => (
          <a
            key={product.id}
            href={productHref(product.id)}
            className={styles.node}
            style={{ left: positions[i][0] + '%', top: positions[i][1] + '%' }}
            data-active={active === i}
            onPointerEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
            onBlur={() => setActive(null)}
            aria-label={'Conheça o ' + product.name}
          >
            <Image src={product.logo} alt="" width={38} height={38} />
            <span>{product.name}</span>
            <ArrowUpRight size={12} aria-hidden="true" />
          </a>
        ))}
      </nav>
      <div className={styles.caption}>
        <span className={styles.captionDot} />
        <p>
          {active === null
            ? 'Uma ideia conecta a próxima.'
            : portfolioProducts[active].category}
        </p>
      </div>
      <button
        className={styles.motion}
        type="button"
        disabled={reduced}
        onClick={() => setPaused((current) => !current)}
        aria-label={
          reduced
            ? 'Movimento reduzido ativado'
            : paused
              ? 'Retomar movimento'
              : 'Pausar movimento'
        }
        title={
          reduced
            ? 'Movimento reduzido ativado'
            : paused
              ? 'Retomar movimento'
              : 'Pausar movimento'
        }
      >
        {paused || reduced ? <Play size={14} /> : <Pause size={14} />}
      </button>
    </div>
  )
}
