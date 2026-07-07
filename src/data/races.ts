import { Race } from '@/types/race';

export const races: Race[] = [
  {
    id: 'protoss',
    name: 'protoss',
    description: 'Una raza tecnológicamente avanzada con poderosas unidades psiónicas y escudos energéticos.',
    theme: {
      primary: '#eab308', // yellow-500
      secondary: '#1e3a8a', // blue-900
      accent: '#60a5fa', // blue-400
      glow: 'rgba(234, 179, 8, 0.5)',
    },
    iconSrc: '/assets/races/protoss_icon.png',
  },
  {
    id: 'terran',
    name: 'Terran',
    description: 'Humanos adaptables con tecnología militar versátil y estructuras capaces de despegar.',
    theme: {
      primary: '#3b82f6', // blue-500
      secondary: '#451a03', // orange-900/brown
      accent: '#f97316', // orange-500
      glow: 'rgba(59, 130, 246, 0.5)',
    },
    iconSrc: '/assets/races/terran_icon.png',
  },
  {
    id: 'zerg',
    name: 'Zerg',
    description: 'Una colmena biológica que abruma a sus enemigos con números masivos y mutaciones rápidas.',
    theme: {
      primary: '#a855f7', // purple-500
      secondary: '#4c1d95', // purple-900
      accent: '#ef4444', // red-500
      glow: 'rgba(168, 85, 247, 0.5)',
    },
    iconSrc: '/assets/races/zerg_icon.png',
  },
];
