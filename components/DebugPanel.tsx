"use client"

import { useState, useEffect } from 'react'
import { sumupConfig } from '@/lib/sumup-config'

interface LogEntry {
  timestamp: string
  level: 'info' | 'error' | 'success'
  message: string
}

export function DebugPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const [logs, setLogs] = useState<LogEntry[]>([])

  const addLog = (level: LogEntry['level'], message: string) => {
    const newLog: LogEntry = {
      timestamp: new Date().toLocaleTimeString(),
      level,
      message
    }
    setLogs(prev => [...prev.slice(-9), newLog]) // Mantieni solo gli ultimi 10 log
  }

  const testConnection = async () => {
    addLog('info', '🔍 Testando connessione SumUp...')
    
    try {
      // Test API base
      const response = await fetch('https://api.sumup.com/v0.1/me', {
        headers: {
          'Authorization': `Bearer ${sumupConfig.accessToken}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        addLog('success', `✅ API OK - Account: ${data.merchant_code || 'N/A'}`)
      } else {
        addLog('error', `❌ API Error: ${response.status} ${response.statusText}`)
      }
    } catch (err) {
      addLog('error', `❌ Errore rete: ${err instanceof Error ? err.message : 'Sconosciuto'}`)
    }

    // Test configurazione
    addLog('info', `🔧 Config - Terminal: ${sumupConfig.terminalId}`)
    addLog('info', `🔧 Config - Merchant: ${sumupConfig.merchantCode}`)
    addLog('info', `🔧 Config - Token: ${sumupConfig.accessToken.substring(0, 20)}...`)
  }

  const clearLogs = () => {
    setLogs([])
  }

  useEffect(() => {
    addLog('info', '🚀 Debug Panel avviato')
  }, [])

  return (
    <>
      {/* Pulsante per aprire debug */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 left-4 z-50 w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center shadow-lg"
        title="Debug Panel"
      >
        🐛
      </button>

      {/* Pannello debug */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-lg w-full max-w-2xl h-96 flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-700 flex justify-between items-center">
              <h3 className="text-white font-bold">Debug SumUp</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Contenuto */}
            <div className="flex-1 p-4 overflow-auto">
              {/* Pulsanti test */}
              <div className="space-x-2 mb-4">
                <button
                  onClick={testConnection}
                  className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm"
                >
                  Test Connessione
                </button>
                <button
                  onClick={clearLogs}
                  className="px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded text-sm"
                >
                  Pulisci Log
                </button>
              </div>

              {/* Log */}
              <div className="space-y-1 font-mono text-sm">
                {logs.length === 0 ? (
                  <p className="text-gray-400">Nessun log ancora...</p>
                ) : (
                  logs.map((log, index) => (
                    <div key={index} className={`p-2 rounded ${
                      log.level === 'error' ? 'bg-red-900/20 text-red-300' :
                      log.level === 'success' ? 'bg-green-900/20 text-green-300' :
                      'bg-gray-800/50 text-gray-300'
                    }`}>
                      <span className="text-gray-500">[{log.timestamp}]</span> {log.message}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
