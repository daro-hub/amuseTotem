"use client"

import { useState, useEffect } from "react"
import QRCode from "react-qr-code"
import { X, ChevronRight, ChevronLeft } from "lucide-react"

interface QRCodeDisplayProps {
  qrCodes: string[]
  museumCode?: string
  itineraryTitle: string
  tickets: number
  total: number
  email: string
}

const qrColors = ["#ffbe0b", "#fb5607", "#ff006e", "#8338ec", "#3a86ff", "#8ac926"]

export default function QRCodeDisplay({ 
  qrCodes, 
  museumCode, 
  itineraryTitle, 
  tickets, 
  total, 
  email 
}: QRCodeDisplayProps) {
  const [showQRs, setShowQRs] = useState<boolean[]>([])
  const [fullscreenQR, setFullscreenQR] = useState<number | null>(null)

  // Anima l'apparizione dei QR codes uno alla volta
  useEffect(() => {
    if (qrCodes && Array.isArray(qrCodes)) {
      qrCodes.forEach((_, index) => {
        setTimeout(
          () => {
            setShowQRs((prev) => {
              const newState = [...prev]
              newState[index] = true
              return newState
            })
          },
          (index + 1) * 500,
        )
      })
    }
  }, [qrCodes])

  // Calcola il layout centrato per i biglietti
  const getGridLayout = (totalTickets: number) => {
    if (totalTickets <= 2) return { rows: [totalTickets], cols: totalTickets, ticketWidth: 280 }
    if (totalTickets <= 4) return { rows: [2, Math.min(2, totalTickets - 2)], cols: 2, ticketWidth: 240 }
    if (totalTickets <= 6) return { rows: [3, 3], cols: 3, ticketWidth: 200 }
    return { rows: [3, 3, totalTickets - 6], cols: 3, ticketWidth: 180 }
  }

  const getTicketEdgeGradient = (color: string) => {
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

  const handleNextTicket = () => {
    if (fullscreenQR !== null && qrCodes) {
      const nextIndex = (fullscreenQR + 1) % qrCodes.length
      setFullscreenQR(nextIndex)
    }
  }

  const handlePrevTicket = () => {
    if (fullscreenQR !== null && qrCodes) {
      const prevIndex = fullscreenQR === 0 ? qrCodes.length - 1 : fullscreenQR - 1
      setFullscreenQR(prevIndex)
    }
  }

  // Verifica che qrCodes esista e sia un array
  if (!qrCodes || !Array.isArray(qrCodes)) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl text-white">Errore nel caricamento dei biglietti</p>
        </div>
      </div>
    )
  }

  const layout = getGridLayout(tickets)

  return (
    <div className="min-h-screen bg-[#121212] p-8">
      <div className="max-w-6xl mx-auto text-center">
        <div className="fade-in">
          <div className="mb-8">
            <div className="text-8xl mb-6">🎉</div>
            <h1 className="text-6xl font-bold text-[#8ac926] mb-4">Acquisto Completato!</h1>
            <p className="text-3xl text-white mb-2">{itineraryTitle}</p>
            <p className="text-2xl text-gray-300">
              {tickets} biglietto{tickets > 1 ? "i" : ""} - €{total}
            </p>
          </div>

          <div className="mb-12">
            <h2 className="text-4xl font-bold text-white mb-8">I Tuoi Biglietti QR</h2>

            <div className="flex flex-col items-center gap-6">
              {layout.rows.map((ticketsInRow, rowIndex) => {
                const startIndex = layout.rows.slice(0, rowIndex).reduce((sum, count) => sum + count, 0)
                return (
                  <div key={rowIndex} className="flex justify-center gap-4">
                    {Array.from({ length: ticketsInRow }).map((_, indexInRow) => {
                      const index = startIndex + indexInRow
                      const qrCode = qrCodes[index]
                      const bgColor = qrColors[index % qrColors.length]
                      const ticketHeight = layout.ticketWidth * 1.2

                      // Verifica che il QR code esista
                      if (!qrCode) {
                        return null
                      }

                      return (
                        <div
                          key={index}
                          className={`
                            card-3d rounded-3xl transition-all duration-500 relative
                            ${showQRs[index] ? "opacity-100 scale-100" : "opacity-0 scale-0"}
                            z-10
                          `}
                          style={{
                            width: `${layout.ticketWidth}px`,
                            height: `${ticketHeight}px`,
                          }}
                          onClick={() => setFullscreenQR(index)}
                        >
                          <div className="shadow"></div>
                          <div className="edge" style={{ background: getTicketEdgeGradient(bgColor) }}></div>
                          <div
                            className="front p-6 h-full flex flex-col justify-between rounded-3xl"
                            style={{ backgroundColor: bgColor }}
                          >
                            <div className="bg-white rounded-2xl p-4 shadow-md">
                              <QRCode
                                value={qrCode}
                                size={layout.ticketWidth - 80}
                                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                              />
                            </div>
                            <div>
                              <p
                                className="text-white font-bold text-xl"
                                style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}
                              >
                                Biglietto #{index + 1}
                              </p>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )
              })}
            </div>
          </div>

          <div className="bg-gray-800 rounded-3xl p-8 mb-8 max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold text-[#8ac926] mb-4">📧 Ricevuta inviata!</h3>
            <p className="text-2xl text-white">Abbiamo inviato la ricevuta e i biglietti a:</p>
            <p className="text-2xl font-bold text-[#3a86ff] mt-2">{email}</p>
          </div>
        </div>
      </div>

      {/* Fullscreen QR Modal */}
      {fullscreenQR !== null && qrCodes && qrCodes[fullscreenQR] && (
        <div className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50 p-8">
          <div className="relative max-w-lg max-h-full">
            {/* Close button */}
            <button
              onClick={() => setFullscreenQR(null)}
              className="absolute -top-12 right-0 text-white text-4xl hover:text-gray-300 transition-colors"
            >
              <X className="w-10 h-10" />
            </button>

            {/* Fullscreen QR Code */}
            <div
              className="rounded-3xl shadow-2xl p-8 flex flex-col items-center max-w-lg"
              style={{
                backgroundColor: qrColors[fullscreenQR % qrColors.length],
              }}
            >
              <div className="bg-white rounded-3xl p-6 shadow-xl mb-6">
                <QRCode
                  value={qrCodes[fullscreenQR]}
                  size={300}
                  style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                />
              </div>

              <div className="text-center mb-6">
                <p className="text-white font-bold text-3xl mb-4" style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}>
                  Biglietto #{fullscreenQR + 1}
                </p>
              </div>

              {/* Navigation buttons */}
              {tickets > 1 && (
                <div className="flex gap-4">
                  <button
                    onClick={handlePrevTicket}
                    className="bg-white bg-opacity-20 text-white text-xl font-bold py-3 px-6 rounded-full hover:bg-opacity-30 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-3 backdrop-blur-sm"
                  >
                    <ChevronLeft className="w-5 h-5" />
                    Precedente
                  </button>
                  <button
                    onClick={handleNextTicket}
                    className="bg-white bg-opacity-20 text-white text-xl font-bold py-3 px-6 rounded-full hover:bg-opacity-30 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-3 backdrop-blur-sm"
                  >
                    <ChevronRight className="w-5 h-5" />
                    Prossimo
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
