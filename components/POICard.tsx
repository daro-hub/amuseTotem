"use client"

import { useState } from "react"

interface POI {
  id: number
  name: string
  image: string
  description: string
}

interface POICardProps {
  poi: POI
  index: number
  color: string
  expandDirection: "left" | "right" | "vertical"
  isExpanded: boolean
  onToggleExpand: () => void
}

export default function POICard({ poi, index, color, expandDirection, isExpanded, onToggleExpand }: POICardProps) {

  const getEdgeGradient = (color: string) => {
    // Converti il colore hex in HSL per creare il gradiente
    const r = Number.parseInt(color.slice(1, 3), 16) / 255
    const g = Number.parseInt(color.slice(3, 5), 16) / 255
    const b = Number.parseInt(color.slice(5, 7), 16) / 255

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    const diff = max - min
    const sum = max + min
    const l = sum / 2

    let h = 0
    let s = 0

    if (diff !== 0) {
      s = l > 0.5 ? diff / (2 - sum) : diff / sum

      switch (max) {
        case r:
          h = ((g - b) / diff + (g < b ? 6 : 0)) / 6
          break
        case g:
          h = ((b - r) / diff + 2) / 6
          break
        case b:
          h = ((r - g) / diff + 4) / 6
          break
      }
    }

    const hDeg = Math.round(h * 360)
    const sPercent = Math.round(s * 100)
    const lPercent = Math.round(l * 100)

    return `linear-gradient(to left, hsl(${hDeg}deg ${sPercent}% ${Math.max(lPercent - 20, 10)}%) 0%, hsl(${hDeg}deg ${sPercent}% ${Math.min(lPercent + 10, 90)}%) 8%, hsl(${hDeg}deg ${sPercent}% ${Math.min(lPercent + 10, 90)}%) 92%, hsl(${hDeg}deg ${sPercent}% ${Math.max(lPercent - 20, 10)}%) 100%)`
  }

  // Contenuto della card che verrà replicato in edge e shadow
  const cardContent = (
    <div className="flex flex-col h-full">
      <img
        src={poi.image || "/placeholder.svg"}
        alt={poi.name}
        className={`w-full object-cover rounded-2xl mb-3 ${isExpanded ? "h-48" : "h-28"}`}
      />
      <div className="flex-1 flex flex-col justify-between">
        <h4
          className={`font-bold text-white text-center leading-tight ${isExpanded ? "text-xl mb-3" : "text-base"}`}
        >
          {poi.name}
        </h4>

        {isExpanded && <p className="text-white text-base leading-relaxed fade-in flex-1">{poi.description}</p>}
      </div>
    </div>
  )

  return (
    <div
      className={`
        poi-3d rounded-3xl transition-all duration-500 relative z-10
        w-60
      `}
      style={{
        animation: `float ${3 + index * 0.5}s ease-in-out infinite`,
        animationDelay: `${index * 0.3}s`,
        zIndex: isExpanded ? 100 : 10,
        minHeight: isExpanded ? 'auto' : '160px'
      }}
      onClick={onToggleExpand}
    >
      {/* Edge - replica del contenuto con altezza forzata */}
      <div className="edge rounded-3xl p-4" style={{ 
        background: getEdgeGradient(color), 
        display: 'flex',
        flexDirection: 'column',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        boxSizing: 'border-box'
      }}>
        {cardContent}
      </div>
      
      {/* Front - contenuto principale */}
      <div className="front p-4 rounded-3xl" style={{ 
        backgroundColor: color,
        position: 'relative',
        width: '100%',
        minHeight: isExpanded ? 'auto' : '160px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {cardContent}

        {/* Step number */}
        <div className="absolute -top-3 -left-3 w-8 h-8 bg-[#3b82f6] text-white rounded-full flex items-center justify-center font-black text-sm shadow-lg">
          {index + 1}
        </div>
      </div>
    </div>
  )
}
