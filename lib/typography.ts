// Sistema di tipografia uniforme per tutta l'app
export const typography = {
  // Titoli principali (h1)
  title: {
    size: 'text-6xl',
    weight: 'font-bold',
    lineHeight: 'leading-tight',
    classes: 'text-6xl font-bold leading-tight'
  },
  
  // Sottotitoli (h2)
  subtitle: {
    size: 'text-4xl',
    weight: 'font-semibold',
    lineHeight: 'leading-tight',
    classes: 'text-4xl font-semibold leading-tight'
  },
  
  // Testi secondari (h3)
  secondary: {
    size: 'text-2xl',
    weight: 'font-medium',
    lineHeight: 'leading-normal',
    classes: 'text-2xl font-medium leading-normal'
  },
  
  // Testi di corpo (p)
  body: {
    size: 'text-xl',
    weight: 'font-normal',
    lineHeight: 'leading-relaxed',
    classes: 'text-xl font-normal leading-relaxed'
  },
  
  // Testi piccoli
  small: {
    size: 'text-lg',
    weight: 'font-normal',
    lineHeight: 'leading-normal',
    classes: 'text-lg font-normal leading-normal'
  }
}

// Colori per i gradienti
export const gradients = {
  primary: 'bg-gradient-to-r from-[#ffbe0b] via-[#fb5607] to-[#ff8500] bg-clip-text text-transparent',
  secondary: 'bg-gradient-to-r from-[#8338ec] via-[#3a86ff] to-[#ff006e]',
  accent: 'bg-gradient-to-r from-[#ffbe0b] to-[#fb5607]'
}
