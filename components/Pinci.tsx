"use client"

import { useState, useEffect } from "react"

interface PinciProps {
  state: "idle" | "talking" | "encouraging" | "celebrating"
  message: string
}

export default function Pinci({ state, message }: PinciProps) {
  const [showMessage, setShowMessage] = useState(false)
  const [eyeState, setEyeState] = useState("open") // "open", "closed", "wink"
  const [expression, setExpression] = useState("neutral") // "neutral", "happy", "excited"

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMessage(true)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  // Animazioni degli occhi e espressioni
  useEffect(() => {
    const eyeInterval = setInterval(() => {
      const rand = Math.random()
      if (rand < 0.1) {
        setEyeState("closed")
        setTimeout(() => setEyeState("open"), 200)
      } else if (rand < 0.15) {
        setEyeState("wink")
        setTimeout(() => setEyeState("open"), 300)
      }
    }, 2000)

    const expressionInterval = setInterval(() => {
      const expressions = ["neutral", "happy", "excited"]
      const currentIndex = expressions.indexOf(expression)
      const nextExpression = expressions[(currentIndex + 1) % expressions.length]
      setExpression(nextExpression)
    }, 4000)

    return () => {
      clearInterval(eyeInterval)
      clearInterval(expressionInterval)
    }
  }, [expression])

  const getPinciCharacter = () => {
    let face = ""

    // Occhi
    switch (eyeState) {
      case "open":
        face += "👀"
        break
      case "closed":
        face += "😌"
        break
      case "wink":
        face += "😉"
        break
    }

    // Espressione base
    switch (expression) {
      case "happy":
        return "😊🤖"
      case "excited":
        return "🤩🤖"
      default:
        return "🤖"
    }
  }

  const getAnimationClass = () => {
    switch (state) {
      case "idle":
        return "animate-bounce"
      case "talking":
        return "animate-pulse"
      case "encouraging":
        return "animate-bounce"
      case "celebrating":
        return "animate-spin"
      default:
        return ""
    }
  }

  return (
    <div className="relative">
      {/* Pinci Character */}
      <div
        className={`text-8xl ${getAnimationClass()}`}
        style={{ animationDuration: "3s", animationIterationCount: "infinite" }}
      >
        {getPinciCharacter()}
      </div>

      {/* Speech Bubble */}
      {showMessage && (
        <div className="absolute top-20 -left-32 w-80 bg-white text-black p-4 rounded-2xl shadow-lg fade-in z-50">
          <div className="text-lg font-semibold">{message}</div>
          {/* Arrow pointing to Pinci */}
          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
            <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-white"></div>
          </div>
        </div>
      )}

      {/* Gears and steampunk elements */}
      <div className="absolute -bottom-2 -right-2 text-2xl animate-spin" style={{ animationDuration: "3s" }}>
        ⚙️
      </div>
      <div
        className="absolute -top-2 -left-2 text-xl animate-spin"
        style={{ animationDuration: "4s", animationDirection: "reverse" }}
      >
        🔧
      </div>

      {/* Leonardo da Vinci inspired elements */}
      <div className="absolute top-1/2 -left-8 text-lg opacity-70">📐</div>
      <div className="absolute bottom-1/4 -right-8 text-lg opacity-70">🎨</div>
    </div>
  )
}
