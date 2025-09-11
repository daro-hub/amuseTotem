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
      // Test API /me
      addLog('info', '📡 Test API /me...')
      const response = await fetch('https://api.sumup.com/v0.1/me', {
        headers: {
          'Authorization': `Bearer ${sumupConfig.accessToken}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        addLog('success', `✅ API /me OK`)
        addLog('info', `📊 Dati account: ${JSON.stringify(data, null, 2)}`)
      } else {
        const errorText = await response.text()
        addLog('error', `❌ API /me Error: ${response.status} ${response.statusText}`)
        addLog('error', `📄 Risposta: ${errorText}`)
      }
    } catch (err) {
      addLog('error', `❌ Errore rete /me: ${err instanceof Error ? err.message : 'Sconosciuto'}`)
    }

    try {
      // Test API /transactions
      addLog('info', '📡 Test API /transactions...')
      const transResponse = await fetch('https://api.sumup.com/v0.1/me/transactions?limit=1', {
        headers: {
          'Authorization': `Bearer ${sumupConfig.accessToken}`,
          'Content-Type': 'application/json'
        }
      })

      if (transResponse.ok) {
        const transData = await transResponse.json()
        addLog('success', `✅ API /transactions OK`)
        addLog('info', `💳 Ultime transazioni: ${transData.length || 0}`)
      } else {
        const errorText = await transResponse.text()
        addLog('error', `❌ API /transactions Error: ${transResponse.status}`)
        addLog('error', `📄 Risposta: ${errorText}`)
      }
    } catch (err) {
      addLog('error', `❌ Errore rete /transactions: ${err instanceof Error ? err.message : 'Sconosciuto'}`)
    }

    // Test configurazione
    addLog('info', `🔧 Config - Terminal: ${sumupConfig.terminalId}`)
    addLog('info', `🔧 Config - Merchant: ${sumupConfig.merchantCode}`)
    addLog('info', `🔧 Config - Token: ${sumupConfig.accessToken.substring(0, 20)}...`)
  }

  const testCreateTransaction = async () => {
    addLog('info', '💳 Test creazione transazione...')
    
    try {
      const response = await fetch('https://api.sumup.com/v0.1/checkouts', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer sup_sk_ETR1hNySrFcE6Ycm0f9ZWBuVmbusF0RIp`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          checkout_reference: `test-${Date.now()}`,
          amount: 1.00,
          currency: 'EUR',
          description: 'Test pagamento',
          merchant_code: 'MW3ZRZS2',
          return_url: `${window.location.origin}/thank-you`,
          cancel_url: `${window.location.origin}/payment-confirm`
        })
      })

      if (response.ok) {
        const data = await response.json()
        addLog('success', `✅ Checkout creato: ${data.id}`)
        addLog('info', `🔗 URL: ${data.checkout_url}`)
      } else {
        const errorText = await response.text()
        addLog('error', `❌ Errore checkout: ${response.status}`)
        addLog('error', `📄 Risposta: ${errorText}`)
      }
    } catch (err) {
      addLog('error', `❌ Errore creazione checkout: ${err instanceof Error ? err.message : 'Sconosciuto'}`)
    }
  }

  const testSpecificAPI = async () => {
    addLog('info', '🎯 Test API key specifica...')
    
    // Test con la tua API key specifica
    const apiKey = 'sup_sk_ETR1hNySrFcE6Ycm0f9ZWBuVmbusF0RIp'
    
    try {
      // Test 1: Verifica account
      addLog('info', '📡 Test /me con API key specifica...')
      const meResponse = await fetch('https://api.sumup.com/v0.1/me', {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      })

      if (meResponse.ok) {
        const meData = await meResponse.json()
        addLog('success', `✅ Account verificato!`)
        addLog('info', `👤 Email: ${meData.email || 'N/A'}`)
        addLog('info', `🏪 Merchant: ${meData.merchant_code || 'N/A'}`)
        addLog('info', `🌍 Paese: ${meData.country || 'N/A'}`)
        addLog('info', `💼 Business: ${meData.personal_profile?.first_name || 'N/A'} ${meData.personal_profile?.last_name || 'N/A'}`)
      } else {
        const errorText = await meResponse.text()
        addLog('error', `❌ Errore /me: ${meResponse.status} ${meResponse.statusText}`)
        addLog('error', `📄 Dettaglio: ${errorText}`)
      }

      // Test 2: Verifica terminali
      addLog('info', '📡 Test terminali...')
      const terminalsResponse = await fetch('https://api.sumup.com/v0.1/me/terminals', {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      })

      if (terminalsResponse.ok) {
        const terminalsData = await terminalsResponse.json()
        addLog('success', `✅ Terminali trovati: ${terminalsData.length || 0}`)
        if (terminalsData.length > 0) {
          terminalsData.forEach((terminal: any, index: number) => {
            addLog('info', `🖥️ Terminal ${index + 1}: ${terminal.id} (${terminal.status || 'N/A'})`)
          })
        }
      } else {
        const errorText = await terminalsResponse.text()
        addLog('error', `❌ Errore terminali: ${terminalsResponse.status}`)
        addLog('error', `📄 Dettaglio: ${errorText}`)
      }

    } catch (err) {
      addLog('error', `❌ Errore test API: ${err instanceof Error ? err.message : 'Sconosciuto'}`)
    }
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
              <div className="space-x-2 mb-4 flex flex-wrap gap-2">
                <button
                  onClick={testConnection}
                  className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm"
                >
                  Test Base
                </button>
                <button
                  onClick={testSpecificAPI}
                  className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm"
                >
                  Test API Key
                </button>
                <button
                  onClick={testCreateTransaction}
                  className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm"
                >
                  Test Checkout
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
