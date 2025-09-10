"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft, Home, Globe } from "lucide-react"

export default function NavigationBar() {
  const router = useRouter()

  return (
    <div className="flex justify-between items-center mb-8">
      <button onClick={() => router.back()} className="btn-3d rounded-2xl">
        <div className="shadow"></div>
        <div
          className="edge"
          style={{
            background:
              "linear-gradient(to left, hsl(220deg 13% 18%) 0%, hsl(220deg 13% 28%) 8%, hsl(220deg 13% 28%) 92%, hsl(220deg 13% 18%) 100%)",
          }}
        ></div>
        <div className="front flex items-center gap-3 bg-gray-700 text-white px-6 py-4 rounded-2xl text-2xl font-semibold">
          <ArrowLeft className="w-6 h-6" />
          Indietro
        </div>
      </button>

      <button onClick={() => router.push("/")} className="btn-3d rounded-2xl">
        <div className="shadow"></div>
        <div
          className="edge"
          style={{
            background:
              "linear-gradient(to left, hsl(270deg 91% 35%) 0%, hsl(270deg 91% 45%) 8%, hsl(270deg 91% 45%) 92%, hsl(270deg 91% 35%) 100%)",
          }}
        ></div>
        <div className="front flex items-center gap-3 bg-[#8338ec] text-white px-6 py-4 rounded-2xl text-2xl font-semibold">
          <Globe className="w-6 h-6" />
          Lingua
        </div>
      </button>

      <button onClick={() => router.push("/")} className="btn-3d rounded-2xl">
        <div className="shadow"></div>
        <div
          className="edge"
          style={{
            background:
              "linear-gradient(to left, hsl(45deg 100% 35%) 0%, hsl(45deg 100% 45%) 8%, hsl(45deg 100% 45%) 92%, hsl(45deg 100% 35%) 100%)",
          }}
        ></div>
        <div className="front flex items-center gap-3 bg-[#ffbe0b] text-black px-6 py-4 rounded-2xl text-2xl font-semibold">
          <Home className="w-6 h-6" />
          Home
        </div>
      </button>
    </div>
  )
}
