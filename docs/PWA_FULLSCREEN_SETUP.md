# Configurazione PWA e Fullscreen per Tablet

## Panoramica
La webapp è stata configurata per funzionare come una Progressive Web App (PWA) che si apre a schermo intero su tablet, nascondendo la barra degli indirizzi e altri elementi del browser.

## Funzionalità Implementate

### 1. Manifest PWA (`public/manifest.json`)
- **display**: "fullscreen" - forza l'apertura a schermo intero
- **orientation**: "portrait" - orientamento preferito
- **theme_color**: "#000000" - colore del tema
- **background_color**: "#000000" - colore di sfondo
- **start_url**: "/" - URL di avvio

### 2. Meta Tag per Fullscreen
- `viewport-fit=cover` - utilizza l'intero schermo incluso le aree con notch
- `user-scalable=no` - disabilita lo zoom
- `maximum-scale=1` - impedisce lo zoom
- Meta tag specifici per iOS e Android

### 3. Service Worker (`public/sw.js`)
- Cache delle risorse principali
- Supporto offline di base
- Registrazione automatica

### 4. Componente PWAInstaller
- Pulsante "Installa App" per installare la PWA
- Pulsante "Schermo Intero" per attivare il fullscreen programmatico
- Gestione automatica degli eventi di installazione

### 5. Hook useFullscreen
- API per controllare il fullscreen programmaticamente
- Supporto cross-browser
- Gestione degli eventi di cambio fullscreen

## Come Testare

### Su Tablet Android:
1. Apri la webapp nel browser Chrome
2. Tocca il menu (tre puntini) → "Aggiungi alla schermata Home"
3. L'app si installerà come PWA
4. Apri l'app dalla schermata home
5. L'app dovrebbe aprirsi a schermo intero senza barra degli indirizzi

### Su iPad:
1. Apri la webapp nel browser Safari
2. Tocca il pulsante "Condividi" → "Aggiungi alla schermata Home"
3. L'app si installerà come PWA
4. Apri l'app dalla schermata home
5. L'app dovrebbe aprirsi a schermo intero

### Test Fullscreen Programmatico:
1. Usa il pulsante "Schermo Intero" nell'angolo in basso a destra
2. L'app dovrebbe entrare/uscire dalla modalità fullscreen
3. Funziona anche quando l'app è già installata come PWA

## Configurazioni Specifiche per Dispositivo

### Safe Area Support
- Supporto per dispositivi con notch (iPhone X+, iPad Pro)
- Padding automatico per le aree sicure
- Utilizzo di `env(safe-area-inset-*)`

### Stili Responsivi
- Media queries per tablet (768px - 1024px)
- Supporto per orientamento landscape
- Pulsanti PWA ottimizzati per touch

## Browser Supportati

### PWA Installation:
- ✅ Chrome (Android)
- ✅ Safari (iOS)
- ✅ Edge (Windows)
- ✅ Firefox (Android)

### Fullscreen API:
- ✅ Chrome/Chromium
- ✅ Safari (con prefisso webkit)
- ✅ Firefox (con prefisso moz)
- ✅ Edge (con prefisso ms)

## Troubleshooting

### L'app non si installa:
1. Verifica che il manifest.json sia accessibile
2. Controlla che il service worker sia registrato
3. Assicurati che l'app sia servita via HTTPS

### Il fullscreen non funziona:
1. Verifica che l'utente abbia interagito con la pagina
2. Controlla i permessi del browser
3. Testa su diversi browser

### La barra degli indirizzi è ancora visibile:
1. Assicurati che l'app sia installata come PWA
2. Verifica che il manifest.json abbia `"display": "fullscreen"`
3. Riavvia l'app dopo l'installazione

## File Modificati

- `app/layout.tsx` - Meta tag e configurazione PWA
- `public/manifest.json` - Manifest PWA
- `public/sw.js` - Service Worker
- `components/PWAInstaller.tsx` - Componente per installazione
- `hooks/use-fullscreen.tsx` - Hook per fullscreen API
- `app/globals.css` - Stili per PWA e fullscreen

## Note Aggiuntive

- L'app funziona anche senza installazione, ma il fullscreen completo è garantito solo quando installata come PWA
- Il service worker fornisce cache di base per migliorare le performance
- I pulsanti PWA sono visibili solo quando appropriato (evento beforeinstallprompt)
- Supporto completo per dispositivi con notch e safe areas

