"use client"

import { Clock, Euro } from "lucide-react"

interface Itinerary {
  id: number
  name: string
  description: string
  image: string
  badge: string
  badgeColor: string
  duration: string
  price: number
}

interface ItineraryCardProps {
  itinerary: Itinerary
  index: number
  onClick: () => void
}

export default function ItineraryCard({ itinerary, index, onClick }: ItineraryCardProps) {
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

    return `linear-gradient(to left, hsl(${hDeg}deg ${sPercent}% ${Math.max(lPercent - 15, 15)}%) 0%, hsl(${hDeg}deg ${sPercent}% ${Math.min(lPercent + 5, 85)}%) 8%, hsl(${hDeg}deg ${sPercent}% ${Math.min(lPercent + 5, 85)}%) 92%, hsl(${hDeg}deg ${sPercent}% ${Math.max(lPercent - 15, 15)}%) 100%)`
  }

  return (
    <div
      className="card-3d-homepage rounded-3xl w-80 h-96 bounce-in"
      style={{ animationDelay: `${index * 0.2}s` }}
      onClick={onClick}
    >
      <div className="shadow"></div>
      <div
        className="edge"
        style={{
          background:
            "linear-gradient(to left, hsl(220deg 13% 15%) 0%, hsl(220deg 13% 25%) 8%, hsl(220deg 13% 25%) 92%, hsl(220deg 13% 15%) 100%)",
        }}
      ></div>
      <div className="front bg-gray-800 rounded-3xl overflow-hidden h-full flex flex-col">
        <div className="relative">
          <img src={itinerary.image || "/placeholder.svg"} alt={itinerary.name} className="w-full h-48 object-cover" />
          <div
            className="absolute top-4 right-4 px-3 py-2 rounded-full text-white font-bold text-sm"
            style={{ backgroundColor: itinerary.badgeColor }}
          >
            {itinerary.badge}
          </div>
        </div>

        <div className="p-5 flex-1 flex flex-col">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white mb-3">{itinerary.name}</h3>
            <p className="text-base text-gray-300 mb-4 line-clamp-3">{itinerary.description}</p>
          </div>

          <div className="flex gap-3 mt-auto">
            <div className="bg-gray-700 rounded-xl px-3 py-2 flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#8ac926]" />
              <span className="text-white text-sm font-semibold">{itinerary.duration}</span>
            </div>
            <div className="bg-gray-700 rounded-xl px-3 py-2 flex items-center gap-2">
              <Euro className="w-4 h-4 text-[#ffbe0b]" />
              <span className="text-white text-sm font-semibold">€{itinerary.price}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
