'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 })
  const [isHovered, setIsHovered] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Only enable custom cursor on fine pointer devices (desktop mouse, not touch)
    const isTouch = window.matchMedia('(pointer: coarse)').matches
    if (isTouch) return

    setIsVisible(true)

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null
      if (
        target?.tagName === 'A' ||
        target?.tagName === 'BUTTON' ||
        target?.closest('a') ||
        target?.closest('button') ||
        target?.getAttribute('role') === 'button' ||
        target?.classList.contains('cursor-pointer')
      ) {
        setIsHovered(true)
      } else {
        setIsHovered(false)
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseover', handleMouseOver)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseover', handleMouseOver)
    }
  }, [])

  if (!isVisible) return null

  return (
    <>
      {/* Precision Center Dot */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-accent pointer-events-none z-50 mix-blend-screen"
        animate={{
          x: mousePosition.x - 4,
          y: mousePosition.y - 4,
          scale: isHovered ? 0 : 1,
        }}
        transition={{ type: 'spring', damping: 35, stiffness: 450, mass: 0.1 }}
      />

      {/* Trailing Aura Ring */}
      <motion.div
        className="fixed top-0 left-0 rounded-full border border-accent/60 pointer-events-none z-50 mix-blend-screen"
        animate={{
          x: mousePosition.x - (isHovered ? 24 : 14),
          y: mousePosition.y - (isHovered ? 24 : 14),
          width: isHovered ? 48 : 28,
          height: isHovered ? 48 : 28,
          backgroundColor: isHovered ? 'rgba(255, 87, 34, 0.15)' : 'rgba(255, 87, 34, 0.0)',
          borderColor: isHovered ? 'rgba(255, 87, 34, 0.9)' : 'rgba(255, 87, 34, 0.4)',
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 280, mass: 0.18 }}
      />
    </>
  )
}
