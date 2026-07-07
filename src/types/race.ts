export type RaceId = 'protoss' | 'terran' | 'zerg';

export interface Race {
  id: RaceId;
  name: string;
  description: string;
  theme: {
    primary: string;
    secondary: string;
    glow: string;
    accent: string;
  };
  emblemSrc?: string;
  iconSrc?: string;
}

