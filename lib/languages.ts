// Configurazione delle lingue supportate
export interface Language {
  id: number
  code: string
  name: string
  nativeName: string
  flag: string
}

export const supportedLanguages: Language[] = [
  { id: 1, code: 'it', name: 'Italiano', nativeName: 'Italiano', flag: '🇮🇹' },
  { id: 2, code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { id: 5, code: 'es', name: 'Español', nativeName: 'Español', flag: '🇪🇸' },
  { id: 6, code: 'fr', name: 'Français', nativeName: 'Français', flag: '🇫🇷' },
  { id: 7, code: 'de', name: 'Deutsch', nativeName: 'Deutsch', flag: '🇩🇪' },
  { id: 8, code: 'sv', name: 'Svenska', nativeName: 'Svenska', flag: '🇸🇪' },
  { id: 9, code: 'pt', name: 'Português', nativeName: 'Português', flag: '🇵🇹' },
  { id: 10, code: 'zh', name: '中国人 Chinese', nativeName: '中国人', flag: '🇨🇳' },
  { id: 11, code: 'jp', name: '日本語 Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { id: 12, code: 'ko', name: '한국어 Korean', nativeName: '한국어', flag: '🇰🇷' },
  { id: 13, code: 'ar', name: 'عربي Arabic', nativeName: 'عربي', flag: '🇸🇦' },
  { id: 14, code: 'pl', name: 'Polski', nativeName: 'Polski', flag: '🇵🇱' },
  { id: 15, code: 'ru', name: 'Русский', nativeName: 'Русский', flag: '🇷🇺' },
  { id: 16, code: 'sl', name: 'slovenščina', nativeName: 'slovenščina', flag: '🇸🇮' },
  { id: 17, code: 'hu', name: 'Magyar', nativeName: 'Magyar', flag: '🇭🇺' },
  { id: 18, code: 'sk', name: 'slovenský', nativeName: 'slovenský', flag: '🇸🇰' },
  { id: 19, code: 'uk', name: 'Українська', nativeName: 'Українська', flag: '🇺🇦' },
  { id: 20, code: 'ro', name: 'Română', nativeName: 'Română', flag: '🇷🇴' },
  { id: 21, code: 'da', name: 'Dansk', nativeName: 'Dansk', flag: '🇩🇰' },
  { id: 22, code: 'tr', name: 'Türkçe', nativeName: 'Türkçe', flag: '🇹🇷' },
  { id: 23, code: 'el', name: 'Ελληνικά', nativeName: 'Ελληνικά', flag: '🇬🇷' },
  { id: 24, code: 'bn', name: 'বাংলা', nativeName: 'বাংলা', flag: '🇧🇩' },
  { id: 25, code: 'nl', name: 'Nederlands', nativeName: 'Nederlands', flag: '🇳🇱' },
  { id: 26, code: 'sq', name: 'Shqip', nativeName: 'Shqip', flag: '🇦🇱' },
  { id: 27, code: 'id', name: 'Bahasa Indonesia', nativeName: 'Bahasa Indonesia', flag: '🇮🇩' },
  { id: 28, code: 'th', name: 'ไทย', nativeName: 'ไทย', flag: '🇹🇭' },
  { id: 29, code: 'vi', name: 'Tiếng Việt', nativeName: 'Tiếng Việt', flag: '🇻🇳' },
  { id: 30, code: 'he', name: 'עברית', nativeName: 'עברית', flag: '🇮🇱' },
  { id: 31, code: 'fa', name: 'فارسی', nativeName: 'فارسی', flag: '🇮🇷' },
  { id: 32, code: 'tl', name: 'Tagalog', nativeName: 'Tagalog', flag: '🇵🇭' },
  { id: 33, code: 'ms', name: 'Bahasa Melayu', nativeName: 'Bahasa Melayu', flag: '🇲🇾' },
  { id: 34, code: 'sw', name: 'Kiswahili', nativeName: 'Kiswahili', flag: '🇹🇿' },
  { id: 35, code: 'cs', name: 'Čeština', nativeName: 'Čeština', flag: '🇨🇿' },
  { id: 36, code: 'fi', name: 'Suomi', nativeName: 'Suomi', flag: '🇫🇮' },
  { id: 37, code: 'no', name: 'Norsk', nativeName: 'Norsk', flag: '🇳🇴' },
  { id: 38, code: 'hi', name: 'हिन्दी', nativeName: 'हिन्दी', flag: '🇮🇳' }
]

export const getLanguageByCode = (code: string): Language | undefined => {
  return supportedLanguages.find(lang => lang.code === code)
}

export const getLanguageName = (code: string): string => {
  const language = getLanguageByCode(code)
  return language?.nativeName || code
}

// Mapping da lingua a codice paese per le bandiere
export const languageToCountryCode = {
  'it': 'IT', 'ita': 'IT', 'italian': 'IT',
  'en': 'GB', 'eng': 'GB', 'english': 'GB',
  'es': 'ES', 'spa': 'ES', 'spanish': 'ES',
  'fr': 'FR', 'fra': 'FR', 'french': 'FR',
  'de': 'DE', 'deu': 'DE', 'german': 'DE',
  'sv': 'SE', 'swe': 'SE', 'swedish': 'SE',
  'pt': 'PT', 'por': 'PT', 'portuguese': 'PT',
  'zh': 'CN', 'chi': 'CN', 'chinese': 'CN',
  'jp': 'JP', 'jpn': 'JP', 'japanese': 'JP',
  'ko': 'KR', 'kor': 'KR', 'korean': 'KR',
  'ar': 'SA', 'ara': 'SA', 'arabic': 'SA',
  'pl': 'PL', 'pol': 'PL', 'polish': 'PL',
  'ru': 'RU', 'rus': 'RU', 'russian': 'RU',
  'sl': 'SI', 'slv': 'SI', 'slovenian': 'SI', 'slovenščina': 'SI',
  'hu': 'HU', 'hun': 'HU', 'hungarian': 'HU',
  'sk': 'SK', 'slk': 'SK', 'slovak': 'SK',
  'uk': 'UA', 'ukr': 'UA', 'ukrainian': 'UA',
  'ro': 'RO', 'ron': 'RO', 'romanian': 'RO',
  'da': 'DK', 'dan': 'DK', 'danish': 'DK',
  'tr': 'TR', 'tur': 'TR', 'turkish': 'TR',
  'el': 'GR', 'ell': 'GR', 'greek': 'GR',
  'bn': 'BD', 'ben': 'BD', 'bengali': 'BD',
  'nl': 'NL', 'nld': 'NL', 'dutch': 'NL',
  'sq': 'AL', 'alb': 'AL', 'albanian': 'AL',
  'id': 'ID', 'ind': 'ID', 'indonesian': 'ID',
  'th': 'TH', 'tha': 'TH', 'thai': 'TH',
  'vi': 'VN', 'vie': 'VN', 'vietnamese': 'VN',
  'he': 'IL', 'heb': 'IL', 'hebrew': 'IL',
  'fa': 'IR', 'per': 'IR', 'persian': 'IR',
  'tl': 'PH', 'fil': 'PH', 'filipino': 'PH',
  'ms': 'MY', 'may': 'MY', 'malay': 'MY',
  'sw': 'TZ', 'swa': 'TZ', 'swahili': 'TZ',
  'cs': 'CZ', 'ces': 'CZ', 'czech': 'CZ',
  'fi': 'FI', 'fin': 'FI', 'finnish': 'FI',
  'no': 'NO', 'nor': 'NO', 'norwegian': 'NO',
  'hi': 'IN', 'hin': 'IN', 'hindi': 'IN'
} as const
