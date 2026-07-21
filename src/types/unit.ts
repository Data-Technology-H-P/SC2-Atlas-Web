import { RaceId } from './race';

export type UnitRole =
  'worker' | 'basic' | 'ranged' | 'melee' | 'caster' | 'air' | 'siege' | 'support' | 'capital';

export type UnitArmorType =
  | 'light'
  | 'armored'
  | 'biological'
  | 'mechanical'
  | 'massive'
  | 'psionic'
  | 'heroic'
  | 'structure';

export interface UnitStat {
  label: string;
  value: string | number;
  max?: number;
  unit?: string;
  description?: string;
}

export interface UnitAbility {
  id: string;
  name?: string;
  description?: string;
  iconSrc?: string;
  energyCost?: number;
  cooldown?: number;
}

export interface Unit {
  id: string;
  slug: string;
  name?: string;
  race: RaceId;
  role: UnitRole[];
  shortDescription?: string;
  longDescription?: string;

  cost: {
    minerals: number;
    gas: number;
    supply: number;
    buildTime?: number;
  };

  combat: {
    life?: number;
    shields?: number;
    energy?: number;
    armor?: number;
    damage?: string;
    attacks?: string;
    range?: string | number;
    speed?: number;
    sight?: number;
  };

  attributes: UnitArmorType[];

  production: {
    producedFrom?: string;
    requirements?: string[];
  };

  abilities?: UnitAbility[];
  upgrades?: UnitAbility[];

  assets: {
    portraitSrc?: string;
    imageSrc?: string;
    modelSrc?: string;
    fallbackImageSrc?: string;
  };

  tags?: string[];

  // Tactical Details
  tacticalRole?: string;
  strengths?: string[];
  weaknesses?: string[];
  goodAgainst?: string[];
  vulnerableAgainst?: string[];
  usageTip?: string;
  gamePhase?: Array<'Early' | 'Mid' | 'Late'>;
}
