# Integrazione SumUp Air

## 📋 **Panoramica**

L'integrazione SumUp Air permette alla webapp di processare pagamenti reali tramite il lettore SumUp Air connesso al tablet del museo.

## 🔧 **Configurazione**

### **Dati di Connessione**
- **Serial Number**: `110014329170`
- **Tablet IP**: `172.20.10.2`
- **API Key**: `sup_sk_ETR1hNySrFcE6Ycm0f9ZWBuVmbusF0RIp`

### **Architettura**
```
Webapp → API Locale → Tablet SumUp → SumUp Air
```

## 📁 **File Creati/Modificati**

### **Servizi**
- `lib/sumup-service.ts` - Servizio principale per gestire pagamenti SumUp
- `hooks/useSumUpPayment.ts` - Hook React per gestire stato pagamenti

### **Componenti**
- `components/SumUpStatus.tsx` - Componente per visualizzare stato connessione

### **API Endpoints**
- `app/api/sumup/payment/route.ts` - Endpoint per processare pagamenti
- `app/api/sumup/status/route.ts` - Endpoint per verificare stato dispositivo

### **Pagine Aggiornate**
- `app/payment-process/page.tsx` - Integrazione pagamento SumUp reale
- `app/quantity-selector/page.tsx` - Utilizzo contesto museo per quantità
- `app/payment-confirm/page.tsx` - Utilizzo contesto museo per importo totale

### **Contesto**
- `contexts/MuseumContext.tsx` - Aggiunto `quantity` e `totalAmount`

## 🔄 **Flusso di Pagamento**

1. **Utente** seleziona quantità biglietti
2. **Sistema** calcola importo totale (€5.00 per biglietto)
3. **Utente** preme "Paga" nella payment-process page
4. **Webapp** verifica connessione SumUp Air
5. **Sistema** invia richiesta pagamento al tablet
6. **Tablet** attiva SumUp Air per pagamento contactless
7. **Cliente** avvicina carta al lettore
8. **SumUp Air** processa pagamento
9. **Sistema** riceve conferma e va alla thank-you page

## 🛠️ **Utilizzo**

### **Verifica Stato Connessione**
```typescript
const { isConnected, checkConnection } = useSumUpPayment()
```

### **Processare Pagamento**
```typescript
const { processPayment } = useSumUpPayment()

const result = await processPayment({
  amount: 15.00,
  currency: 'EUR',
  description: 'Biglietti Museo - 3x'
})
```

### **Gestire Errori**
```typescript
const { error, clearError } = useSumUpPayment()
```

## 🔌 **Comunicazione con Tablet**

### **Endpoint Pagamento**
```
POST /api/sumup/payment
Content-Type: application/json

{
  "amount": 15.00,
  "currency": "EUR",
  "description": "Biglietti Museo - 3x"
}
```

### **Endpoint Stato**
```
GET /api/sumup/status
```

## ⚠️ **Note Importanti**

1. **Il tablet** deve essere connesso al WiFi del museo
2. **L'app SumUp** deve essere attiva sul tablet
3. **Il SumUp Air** deve essere connesso al tablet via Bluetooth
4. **La comunicazione** avviene tramite API locali per sicurezza

## 🧪 **Test**

1. **Verifica connessione**: Controlla che il SumUp Air sia connesso
2. **Test pagamento**: Prova un pagamento di test
3. **Verifica flusso**: Assicurati che il pagamento porti alla thank-you page

## 🚀 **Prossimi Passi**

1. **Testare** con tablet reale
2. **Implementare** comunicazione webapp-tablet
3. **Ottimizzare** gestione errori
4. **Aggiungere** logging dettagliato
