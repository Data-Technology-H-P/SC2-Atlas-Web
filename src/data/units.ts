import { Unit } from '@/types/unit';
import patch_5_0_16 from './patches/5.0.16.json';
import patch_5_0_16b from './patches/5.0.16b.json';

export const AVAILABLE_PATCHES = [
  { id: '5.0.16b', label: 'Parche 5.0.16b' },
  { id: '5.0.16', label: 'Parche 5.0.16' },
] as const;

export const DEFAULT_PATCH = '5.0.16b';

const patches: Record<string, Unit[]> = {
  '5.0.16': patch_5_0_16 as Unit[],
  '5.0.16b': patch_5_0_16b as Unit[],
};

export function getUnits(patchVersion: string = DEFAULT_PATCH): Unit[] {
  return patches[patchVersion] || patches[DEFAULT_PATCH];
}

export function getUnitBySlug(
  slug: string,
  patchVersion: string = DEFAULT_PATCH,
): Unit | undefined {
  const unitsList = getUnits(patchVersion);
  return unitsList.find((u) => u.slug === slug);
}

export function getUnitsByRace(raceId: string, patchVersion: string = DEFAULT_PATCH): Unit[] {
  const unitsList = getUnits(patchVersion);
  return unitsList.filter((u) => u.race === raceId);
}

// Fallback static export for backward compatibility
export const units: Unit[] = getUnits(DEFAULT_PATCH);
