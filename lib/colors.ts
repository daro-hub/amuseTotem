// Palette colori per i musei
export const museumColors = {
  primary: '#FFBE0B',    // Giallo oro
  secondary: '#FB8500',  // Arancione
  accent: '#8ECAE6',     // Azzurro
  success: '#219653',    // Verde
  warning: '#FF6B35',    // Rosso-arancio
  dark: '#023047',       // Blu scuro
  light: '#FFB3C6',      // Rosa chiaro
  purple: '#8B5CF6',     // Viola
  teal: '#14B8A6',       // Teal
  indigo: '#6366F1'      // Indigo
}

// Colori per i diversi tipi di POI
export const poiColors = {
  museum: museumColors.primary,
  art: museumColors.accent,
  history: museumColors.dark,
  science: museumColors.teal,
  culture: museumColors.purple,
  nature: museumColors.success,
  architecture: museumColors.secondary,
  default: museumColors.light
}

// Gradiente per le card
export const gradients = {
  sunset: 'from-orange-400 to-pink-400',
  ocean: 'from-blue-400 to-teal-400',
  forest: 'from-green-400 to-emerald-400',
  royal: 'from-purple-400 to-indigo-400',
  fire: 'from-red-400 to-orange-400',
  sky: 'from-cyan-400 to-blue-400'
}

// Dimensioni ottimizzate per tablet
export const tabletSizes = {
  logo: {
    size: 'lg' as const,
    className: 'w-32 h-32'
  },
  spacing: {
    gap: 'gap-8',
    padding: 'p-8',
    margin: 'mb-8',
    container: 'max-w-2xl'
  },
  text: {
    title: 'text-5xl',
    subtitle: 'text-3xl',
    body: 'text-2xl',
    small: 'text-xl'
  },
  button: {
    height: 'h-24',
    text: 'text-3xl',
    padding: 'px-10 py-6'
  },
  card: {
    padding: 'p-6',
    rounded: 'rounded-2xl',
    minHeight: 'min-h-[200px]'
  }
}

// Stili per i pulsanti
export const buttonStyles = {
  primary: 'bg-yellow-400 hover:bg-yellow-500 text-black font-bold',
  secondary: 'bg-blue-600 hover:bg-blue-700 text-white',
  success: 'bg-[#219653] hover:bg-[#1a7a42] text-white font-medium',
  danger: 'bg-red-600 hover:bg-red-700 text-white',
  outline: 'border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black',
  ghost: 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
}
