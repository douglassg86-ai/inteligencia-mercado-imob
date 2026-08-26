import { useEffect, useRef } from 'react'
import { motion as Motion, useMotionValue, useTransform, animate } from 'framer-motion'

// Conta de 0 até `value` quando entra em tela (ou muda), formatando com
// `format`. Usa framer-motion's `animate` sobre um motion value — mais leve
// que re-renderizar React a cada frame.
export default function AnimatedNumber({ value, format = (v) => Math.round(v).toLocaleString('pt-BR'), duration = 1.1, className }) {
  const mv = useMotionValue(0)
  const rounded = useTransform(mv, (v) => format(v))
  const ref = useRef(null)

  useEffect(() => {
    if (value == null) return
    const controls = animate(mv, value, { duration, ease: [0.16, 1, 0.3, 1] })
    return () => controls.stop()
  }, [value, mv, duration])

  return <Motion.span ref={ref} className={className}>{rounded}</Motion.span>
}
