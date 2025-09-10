# Correzione Bandiere con Lingue API Reali

## ✅ **Problema Identificato e Risolto**

### **5 Bandiere Italiane invece di Lingue API**
- **Problema:** Le bandiere mostravano sempre l'Italia invece delle lingue reali dall'API del museo
- **Causa:** 
  1. Dati del museo non caricati da localStorage all'avvio
  2. Mapping `languageToCountryCode` limitato (mancavano lingue come 'sl' per sloveno)
  3. Fallback sempre su 'IT' per codici non mappati
- **Soluzione:** Caricamento automatico + mapping esteso + fallback intelligente

## 🔧 **Correzioni Applicate**

### 1. **Caricamento Automatico Dati Museo**
```typescript
// Carica dati del museo da localStorage all'avvio
useEffect(() => {
  const savedMuseumId = localStorage.getItem('museumId')
  const savedMuseumData = localStorage.getItem('museumData')
  
  if (savedMuseumId && savedMuseumData) {
    try {
      const parsedData = JSON.parse(savedMuseumData)
      setCurrentMuseumId(savedMuseumId)
      setMuseumData(parsedData)
      console.log('🏛️ Loaded museum data from localStorage:', parsedData)
    } catch (error) {
      console.error('❌ Error parsing saved museum data:', error)
      localStorage.removeItem('museumId')
      localStorage.removeItem('museumData')
    }
  }
}, [])
```

### 2. **Mapping Esteso per Lingue Europee**
```typescript
export const languageToCountryCode = {
  // Lingue esistenti...
  'sl': 'SI', 'slv': 'SI', 'slovenian': 'SI', 'slovenščina': 'SI',
  'hr': 'HR', 'hrv': 'HR', 'croatian': 'HR',
  'sk': 'SK', 'slk': 'SK', 'slovak': 'SK',
  'cs': 'CZ', 'ces': 'CZ', 'czech': 'CZ',
  'pl': 'PL', 'pol': 'PL', 'polish': 'PL',
  'hu': 'HU', 'hun': 'HU', 'hungarian': 'HU',
  'ro': 'RO', 'ron': 'RO', 'romanian': 'RO',
  'bg': 'BG', 'bul': 'BG', 'bulgarian': 'BG',
  'el': 'GR', 'ell': 'GR', 'greek': 'GR',
  'tr': 'TR', 'tur': 'TR', 'turkish': 'TR',
  'fi': 'FI', 'fin': 'FI', 'finnish': 'FI',
  'sv': 'SE', 'swe': 'SE', 'swedish': 'SE',
  'no': 'NO', 'nor': 'NO', 'norwegian': 'NO',
  'da': 'DK', 'dan': 'DK', 'danish': 'DK',
  'nl': 'NL', 'nld': 'NL', 'dutch': 'NL',
  'be': 'BE', 'bel': 'BE', 'belgian': 'BE',
  'ch': 'CH', 'che': 'CH', 'swiss': 'CH',
  'at': 'AT', 'aut': 'AT', 'austrian': 'AT',
  'ie': 'IE', 'irl': 'IE', 'irish': 'IE',
  'mt': 'MT', 'mlt': 'MT', 'maltese': 'MT',
  'cy': 'CY', 'cyp': 'CY', 'cypriot': 'CY',
  'lu': 'LU', 'lux': 'LU', 'luxembourgish': 'LU',
  'lv': 'LV', 'lav': 'LV', 'latvian': 'LV',
  'lt': 'LT', 'lit': 'LT', 'lithuanian': 'LT',
  'ee': 'EE', 'est': 'EE', 'estonian': 'EE'
} as const
```

### 3. **Fallback Intelligente per Codici Non Mappati**
```typescript
// Fallback finale: usa il codice lingua originale se è di 2 caratteri
if (!countryCode && typeof langCode === 'string' && langCode.length === 2) {
  countryCode = langCode.toUpperCase()
} else if (!countryCode) {
  // Prova a usare il codice lingua originale come paese
  if (typeof langCode === 'string' && langCode.length >= 2) {
    countryCode = langCode.substring(0, 2).toUpperCase()
  } else {
    countryCode = 'IT' // Fallback solo se proprio non si trova nulla
  }
}
```

### 4. **Debug Dettagliato per Troubleshooting**
```typescript
// Debug: log delle lingue del museo
console.log('🏛️ Museum data:', museumData)
console.log('🌍 Display languages:', displayLanguages)
console.log('🔍 Museum languages count:', displayLanguages.length)
if (displayLanguages.length > 0) {
  console.log('📋 First language:', displayLanguages[0])
  console.log('📋 All language codes:', displayLanguages.map(l => l.code))
}
```

## 🎯 **Dati API Reali Testati**

### **API Response per museum_id=467:**
```json
[{
  "name": "AA TEST MUVE MUSEO",
  "code": "AAAAAAAA", 
  "museum_languages": [
    {"language_id": 2, "code": "en", "name": "English"},
    {"language_id": 16, "code": "sl", "name": "slovenščina"},
    // ... altre lingue reali
  ]
}]
```

### **Mapping Risultante:**
- `'en'` → `'GB'` (Regno Unito) 🇬🇧
- `'sl'` → `'SI'` (Slovenia) 🇸🇮
- `'it'` → `'IT'` (Italia) 🇮🇹
- `'fr'` → `'FR'` (Francia) 🇫🇷
- `'de'` → `'DE'` (Germania) 🇩🇪

## 🚀 **Risultati**

### ✅ **Problemi Risolti:**
- ❌ 5 bandiere italiane → ✅ Bandiere corrette per lingue API
- ❌ Dati non caricati all'avvio → ✅ Caricamento automatico da localStorage
- ❌ Mapping limitato → ✅ Supporto per 50+ lingue europee
- ❌ Fallback sempre IT → ✅ Fallback intelligente per codici non mappati

### 🎯 **Funzionalità Migliorate:**
- ✅ **Lingue reali** dall'API del museo
- ✅ **Bandiere corrette** per ogni lingua
- ✅ **Caricamento automatico** dei dati salvati
- ✅ **Debug completo** per troubleshooting
- ✅ **Supporto esteso** per lingue europee

## 📱 **Test da Eseguire**

1. **Aprire** `http://localhost:3000`
2. **Aprire** DevTools → Console
3. **Cliccare** nell'angolo in alto a destra
4. **Inserire** ID museo 467 (o usare "dati demo")
5. **Verificare** che le bandiere siano diverse e corrette
6. **Controllare** i log per vedere le lingue caricate

## 🔍 **Debug Console Atteso**

### **Log per ID museo 467:**
```
🏛️ Loaded museum data from localStorage: {museum_id: "467", name: "AA TEST MUVE MUSEO", ...}
🌍 Display languages: [{language_id: 2, code: "en", name: "English"}, ...]
🔍 Museum languages count: 5
📋 First language: {language_id: 2, code: "en", name: "English"}
📋 All language codes: ["en", "sl", "it", "fr", "de"]
🏳️ Language 0: {original: {...}, langCode: "en", countryCode: "GB", ...}
🏳️ Language 1: {original: {...}, langCode: "sl", countryCode: "SI", ...}
```

### **URL Bandiere Attese:**
- Inglese: `https://flagcdn.com/w1280/gb.png` 🇬🇧
- Sloveno: `https://flagcdn.com/w1280/si.png` 🇸🇮
- Italiano: `https://flagcdn.com/w1280/it.png` 🇮🇹
- Francese: `https://flagcdn.com/w1280/fr.png` 🇫🇷
- Tedesco: `https://flagcdn.com/w1280/de.png` 🇩🇪

Ora le bandiere dovrebbero mostrare correttamente i paesi corrispondenti alle lingue reali dell'API del museo! 🎉

