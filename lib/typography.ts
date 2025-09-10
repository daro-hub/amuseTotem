// Sistema di tipografia uniforme per tutta l'app - SCRITTE GRANDI
export const typography = {
  // Titoli principali (h1) - MOLTO GRANDI
  title: {
    size: 'text-8xl',
    weight: 'font-bold',
    lineHeight: 'leading-tight',
    classes: 'text-8xl font-bold leading-tight'
  },
  
  // Sottotitoli (h2) - GRANDI
  subtitle: {
    size: 'text-6xl',
    weight: 'font-semibold',
    lineHeight: 'leading-tight',
    classes: 'text-6xl font-semibold leading-tight'
  },
  
  // Testi secondari (h3) - MEDIO-GRANDI
  secondary: {
    size: 'text-4xl',
    weight: 'font-medium',
    lineHeight: 'leading-normal',
    classes: 'text-4xl font-medium leading-normal'
  },
  
  // Testi di corpo (p) - GRANDI
  body: {
    size: 'text-3xl',
    weight: 'font-normal',
    lineHeight: 'leading-relaxed',
    classes: 'text-3xl font-normal leading-relaxed'
  },
  
  // Testi piccoli - MEDI
  small: {
    size: 'text-2xl',
    weight: 'font-normal',
    lineHeight: 'leading-normal',
    classes: 'text-2xl font-normal leading-normal'
  }
}

// Colori per i gradienti
export const gradients = {
  primary: 'text-white', // Scritte bianche invece che arancioni
  secondary: 'bg-gradient-to-r from-[#8338ec] via-[#3a86ff] to-[#ff006e]',
  accent: 'bg-gradient-to-r from-[#ffbe0b] to-[#fb5607]'
}
