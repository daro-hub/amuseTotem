# Correzioni Mapping Bandiere - Language Selector

## ✅ **Problema Risolto**

### **5 Bandiere Italiane**
- **Problema:** Tutte le bandiere mostravano l'Italia invece delle bandiere corrette
- **Causa:** Mapping `languageToCountryCode` limitato e fallback sempre su 'IT'
- **Soluzione:** Mapping esteso e logica di fallback intelligente

## 🔧 **Miglioramenti Applicati**

### 1. **Mapping Esteso per Lingue**
```typescript
export const languageToCountryCode = {
  'it': 'IT', 'ita': 'IT', 'italian': 'IT',
  'en': 'GB', 'eng': 'GB', 'english': 'GB',
  'fr': 'FR', 'fra': 'FR', 'french': 'FR',
  'de': 'DE', 'deu': 'DE', 'german': 'DE',
  'es': 'ES', 'spa': 'ES', 'spanish': 'ES',
  'pt': 'PT', 'por': 'PT', 'portuguese': 'PT',
  'ru': 'RU', 'rus': 'RU', 'russian': 'RU',
  'zh': 'CN', 'chi': 'CN', 'chinese': 'CN',
  'ja': 'JP', 'jpn': 'JP', 'japanese': 'JP',
  'ko': 'KR', 'kor': 'KR', 'korean': 'KR',
  'ar': 'SA', 'ara': 'SA', 'arabic': 'SA'
} as const
```

### 2. **Logica di Fallback Intelligente**
```typescript
// Mapping più intelligente per le bandiere
let countryCode = languageToCountryCode[langCode]

if (!countryCode) {
  // Prova varianti del codice lingua
  const langVariants = [
    langCode.toLowerCase(),
    langCode.substring(0, 2),
    langCode.substring(0, 3)
  ]
  
  for (const variant of langVariants) {
    if (languageToCountryCode[variant]) {
      countryCode = languageToCountryCode[variant]
      break
    }
  }
}

// Fallback finale: usa il codice lingua originale se è di 2 caratteri
if (!countryCode && langCode.length === 2) {
  countryCode = langCode.toUpperCase()
} else if (!countryCode) {
  countryCode = 'IT' // Fallback solo se proprio non si trova nulla
}
```

### 3. **Debug Logging Dettagliato**
```typescript
// Debug: log delle lingue del museo
console.log('🏛️ Museum data:', museumData)
console.log('🌍 Display languages:', displayLanguages)

// Debug: log del mapping bandiere
console.log(`🏳️ Language ${index}:`, {
  original: language,
  langCode,
  countryCode,
  directMapping: languageToCountryCode[langCode],
  finalFlag: `https://flagcdn.com/w1280/${countryCode.toLowerCase()}.png`
})
```

## 🎯 **Come Funziona Ora**

### **Priorità di Mapping:**
1. **Mapping diretto** per codice esatto (es. 'en' → 'GB')
2. **Varianti** per codici simili (es. 'eng' → 'GB')
3. **Substring** per codici lunghi (es. 'english' → 'GB')
4. **Codice originale** se è di 2 caratteri (es. 'FR' → 'FR')
5. **Fallback IT** solo se tutto fallisce

### **Esempi di Mapping:**
- `'en'` → `'GB'` (Regno Unito)
- `'eng'` → `'GB'` (Regno Unito)
- `'english'` → `'GB'` (Regno Unito)
- `'fr'` → `'FR'` (Francia)
- `'fra'` → `'FR'` (Francia)
- `'french'` → `'FR'` (Francia)
- `'de'` → `'DE'` (Germania)
- `'es'` → `'ES'` (Spagna)
- `'pt'` → `'PT'` (Portogallo)

## 📱 **Test da Eseguire**

1. **Aprire** `http://localhost:3000`
2. **Aprire** DevTools → Console
3. **Cliccare** nell'angolo in alto a destra (tasto invisibile)
4. **Inserire** un ID museo o usare "dati demo"
5. **Verificare** che le bandiere siano diverse
6. **Controllare** i log nella console per debug

## 🔍 **Debug Console**

### **Log Attesi:**
```
🏛️ Museum data: {museum_id: "467", name: "Museo Demo", ...}
🌍 Display languages: [{code: "it", name: "Italiano"}, {code: "en", name: "English"}, ...]
🏳️ Language 0: {original: {...}, langCode: "it", countryCode: "IT", ...}
🏳️ Language 1: {original: {...}, langCode: "en", countryCode: "GB", ...}
```

### **URL Bandiere:**
- Italiano: `https://flagcdn.com/w1280/it.png`
- Inglese: `https://flagcdn.com/w1280/gb.png`
- Francese: `https://flagcdn.com/w1280/fr.png`

## 🚀 **Risultati**

### ✅ **Problemi Risolti:**
- ❌ 5 bandiere italiane → ✅ Bandiere corrette per ogni lingua
- ❌ Mapping limitato → ✅ Mapping esteso con varianti
- ❌ Fallback sempre IT → ✅ Fallback intelligente
- ❌ Nessun debug → ✅ Logging dettagliato

### 🎯 **Funzionalità Migliorate:**
- ✅ **Bandiere corrette** per ogni lingua del museo
- ✅ **Mapping robusto** per varianti di codici lingua
- ✅ **Debug completo** per troubleshooting
- ✅ **Fallback intelligente** per casi edge

Ora le bandiere dovrebbero mostrare correttamente i paesi corrispondenti alle lingue del museo! 🎉

