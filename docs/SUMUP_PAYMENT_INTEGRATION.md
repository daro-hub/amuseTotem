# Integrazione Pagamento SumUp con App Android

## Panoramica

Il sistema implementa un flusso di pagamento completo che integra la webapp Next.js con un'app Android companion chiamata "AmuseTotemBridge" per gestire i pagamenti SumUp tramite card reader fisico.

## Architettura del Sistema

```
┌─────────────────┐    Deep Link    ┌──────────────────┐    SumUp API    ┌─────────────┐
│   Webapp        │───────────────→ │  App Android     │────────────────→│ Card Reader │
│   (Next.js)     │                 │  AmuseTotemBridge│                 │   (SumUp)   │
└─────────────────┘                 └──────────────────┘                 └─────────────┘
         ↑                                    │
         │                                    │ HTTP Callback
         │                                    ↓
         │                          ┌──────────────────┐
         └──────────────────────────│  API Callback    │
                  Polling            │  /sumup/callback │
                                     └──────────────────┘
```

## Flusso Completo

### 1. **Avvio Pagamento (Webapp → App Android)**

Quando l'utente clicca "Paga Ora":

1. **Generazione Ordine**:
   ```typescript
   const orderId = PaymentService.generateOrderId()
   const paymentData = {
     orderId,
     amount: "15.00",
     currency: "EUR",
     museumCode,
     tickets,
     email
   }
   ```

2. **Creazione Deep Link**:
   ```
   myapp://checkout?amount=15.00&currency=EUR&orderId=ORDER-1234567890-ABC123
   ```

3. **Apertura App Android**:
   ```typescript
   window.location.href = deepLink
   ```

4. **Reindirizzamento a Pagina di Stato**:
   ```
   /payment-status?orderId=ORDER-1234567890-ABC123
   ```

### 2. **Gestione Pagamento (App Android)**

L'app Android riceve il deep link e:

1. Estrae i parametri (`amount`, `currency`, `orderId`)
2. Inizializza il lettore di carte SumUp
3. Processa il pagamento fisico
4. Invia callback alla webapp

### 3. **Callback Pagamento (App Android → Webapp)**

```http
POST https://amuse-totem.vercel.app/api/sumup/callback
Content-Type: application/json

{
  "orderId": "ORDER-1234567890-ABC123",
  "status": "SUCCESSFUL|FAILED|CANCELLED",
  "txCode": "TX-1234567890-DEF456",
  "amount": "15.00"
}
```

### 4. **Monitoraggio Stato (Webapp)**

La pagina `/payment-status` effettua polling ogni 2 secondi:

```typescript
GET /api/sumup/callback?orderId=ORDER-1234567890-ABC123
```

### 5. **Finalizzazione (Webapp)**

- **Se SUCCESSFUL**: redirect a `/thank-you` con generazione ticket
- **Se FAILED/CANCELLED**: mostra errore + pulsante retry
- **Se TIMEOUT**: mostra timeout + pulsante retry

## Componenti Implementati

### 1. **API Endpoints**

- **`/api/sumup/create-order`**: Crea ordini in memoria
- **`/api/sumup/callback`**: Riceve notifiche dall'app Android
- **`/api/sumup/test`**: Endpoint per testare il flusso (sviluppo)

### 2. **Pagine**

- **`/payment-status`**: Mostra stato pagamento con polling
- **`/thank-you`**: Pagina finale con QR codes generati

### 3. **Servizi**

- **`PaymentService`**: Gestisce deep link, ordini, polling
- **`PaymentErrorHandler`**: Componente per gestire errori
- **`usePaymentStatus`**: Hook React per monitoraggio stato

### 4. **Traduzioni**

Supporto multilingua per tutti i messaggi di pagamento:
- `payment.processing`
- `payment.successful`
- `payment.failed`
- `payment.cancelled`
- `payment.timeout`
- `payment.retry`
- `payment.appNotInstalled`

## Testing del Sistema

### Test Manuale con Endpoint di Test

```bash
# 1. Avvia un pagamento normale nella webapp
# 2. Quando arrivi a /payment-status, simula il callback:

curl -X POST http://localhost:3000/api/sumup/test \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "ORDER-1234567890-ABC123",
    "status": "SUCCESSFUL",
    "delay": 3000
  }'
```

### Scenari di Test

1. **Pagamento Riuscito**:
   ```json
   { "orderId": "ORDER-123", "status": "SUCCESSFUL" }
   ```

2. **Pagamento Fallito**:
   ```json
   { "orderId": "ORDER-123", "status": "FAILED" }
   ```

3. **Pagamento Annullato**:
   ```json
   { "orderId": "ORDER-123", "status": "CANCELLED" }
   ```

4. **Timeout** (non inviare callback, aspetta 5 minuti)

### Verifica URL Deep Link

Per testare se il deep link viene generato correttamente, controlla la console del browser dopo aver cliccato "Paga Ora":

```
🔗 Aprendo deep link: myapp://checkout?amount=15.00&currency=EUR&orderId=ORDER-1726129234567-AB1C2D
```

## Configurazione Produzione

### Variabili d'Ambiente

```env
NEXT_PUBLIC_BASE_URL=https://amuse-totem.vercel.app
```

### App Android

L'app Android deve implementare:

1. **Intent Filter** per il deep link `myapp://checkout`
2. **HTTP Client** per inviare callback a `/api/sumup/callback`
3. **SumUp SDK** per gestire i pagamenti

#### AndroidManifest.xml
```xml
<activity android:name=".PaymentActivity">
    <intent-filter>
        <action android:name="android.intent.action.VIEW" />
        <category android:name="android.intent.category.DEFAULT" />
        <category android:name="android.intent.category.BROWSABLE" />
        <data android:scheme="myapp" android:host="checkout" />
    </intent-filter>
</activity>
```

## Gestione Errori

### Timeout (5 minuti)
- Mostra messaggio timeout
- Pulsante "Riprova Pagamento"
- Genera nuovo orderId per retry

### App Non Installata
- Rileva sistema Android
- Mostra messaggio + pulsante download
- Link al Play Store

### Connessione Persa
- Retry automatico delle chiamate API
- Messaggio di errore user-friendly
- Possibilità di retry manuale

### Importo Non Corrispondente
- Validazione server-side
- Log dell'errore
- Blocco del pagamento

## Sicurezza

### Validazioni
- ✅ OrderId univoci e non prevedibili
- ✅ Validazione importi server-side
- ✅ Timeout automatici
- ✅ Logging completo per audit

### Considerations Future
- [ ] Database persistente (vs in-memory)
- [ ] Autenticazione callback app Android
- [ ] Crittografia dei payload sensibili
- [ ] Rate limiting sugli endpoint

## Monitoraggio

### Log Chiave

```typescript
// Creazione ordine
console.log('💳 Generato orderId per pagamento SumUp:', orderId)

// Apertura app
console.log('🔗 Aprendo deep link:', deepLink)

// Callback ricevuto
console.log('🔔 Ricevuto callback SumUp:', payload)

// Polling status
console.log('📊 Aggiornamento stato pagamento:', status)

// Generazione ticket
console.log('🎫 Pagamento riuscito, generando tickets...')
```

### Metriche da Monitorare
- Tempo medio di completamento pagamento
- Tasso di successo vs fallimento
- Timeout frequency
- Retry success rate

## Troubleshooting

### Problema: Deep Link Non Apre App
**Soluzione**: Verifica che l'app Android sia installata e registrata per il deep link `myapp://checkout`

### Problema: Polling Non Riceve Updates
**Soluzione**: Verifica che l'app Android invii callback all'URL corretto con payload valido

### Problema: Ticket Non Generati
**Soluzione**: Controlla che l'API Xano per la generazione ticket sia raggiungibile e il museum code sia corretto

### Problema: Ordine Non Trovato
**Soluzione**: In produzione, implementare database persistente invece di store in-memory

## Struttura File

```
lib/
├── payment-service.ts      # Servizio principale pagamenti
├── translations.ts         # Traduzioni messaggi pagamento

app/
├── api/sumup/
│   ├── callback/route.ts   # Endpoint callback
│   ├── create-order/route.ts # Creazione ordini
│   └── test/route.ts       # Test endpoint
├── payment-status/page.tsx # Pagina stato pagamento
└── thank-you/page.tsx      # Pagina finale con ticket

components/
├── PaymentErrorHandler.tsx # Gestione errori UI

hooks/
└── use-payment-status.tsx  # Hook monitoraggio stato
```

## Next Steps

1. **Implementare Database Persistente**
   - Sostituire Map in-memory con database
   - Aggiungere schema per ordini e pagamenti

2. **Autenticazione App Android**
   - API keys per autenticare callback
   - Verifica firma digitale payload

3. **Analytics e Monitoring**
   - Dashboard per monitorare pagamenti
   - Alert per errori frequenti

4. **Test Automatizzati**
   - Unit test per PaymentService
   - Integration test per flusso completo
   - E2E test con app Android simulata
