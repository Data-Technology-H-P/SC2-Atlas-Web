import React from 'react';
import { Unit } from '@/types/unit';
import { useTranslations } from 'next-intl';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { StatBar } from '@/components/ui/StatBar';
import { Shield, Zap, Swords, Navigation, Eye, Clock, Box, Target } from 'lucide-react';

interface UnitStatsPanelProps {
  unit: Unit;
}

export const UnitStatsPanel = ({ unit }: UnitStatsPanelProps) => {
  const t = useTranslations('stats');
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Vital Stats */}
      <GlassPanel className="p-6 border-white/5 space-y-6">
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
          <Shield className="w-4 h-4" /> {t('vitalSystems')}
        </h3>
        
        <div className="space-y-4">
          <StatBar 
            label={t('hullIntegrity')} 
            value={unit.combat.life || 0} 
            max={200} 
            color="bg-green-500" 
          />
          
          {unit.combat.shields !== undefined && (
            <StatBar 
              label={t('plasmaShields')} 
              value={unit.combat.shields} 
              max={200} 
              color="bg-blue-400" 
            />
          )}

          {unit.combat.energy !== undefined && (
            <StatBar 
              label={t('energyReserves')} 
              value={unit.combat.energy} 
              max={200} 
              color="bg-purple-500" 
            />
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-600 uppercase font-bold tracking-widest">{t('baseArmor')}</span>
            <span className="text-xl font-black text-white">{unit.combat.armor || 0}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-600 uppercase font-bold tracking-widest">{t('attributes')}</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {unit.attributes.map(attr => (
                <span key={attr} className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-gray-400 border border-white/5 uppercase">
                  {attr}
                </span>
              ))}
            </div>
          </div>
        </div>
      </GlassPanel>

      {/* Combat Stats */}
      <GlassPanel className="p-6 border-white/5 space-y-6">
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
          <Swords className="w-4 h-4" /> {t('combatSpecs')}
        </h3>

        <div className="grid grid-cols-1 gap-y-5">
          <div className="flex items-start gap-3 min-w-0">
            <div className="p-2 rounded bg-red-500/10 border border-red-500/20 shrink-0">
              <Zap className="w-4 h-4 text-red-500" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] text-gray-500 uppercase font-extrabold tracking-wider block leading-none mb-1.5">{t('damageOutput')}</span>
              <div className="flex flex-col">
                {unit.combat.damage ? (
                  <>
                    <span className="text-lg font-black text-white leading-none">
                      {unit.combat.damage.split('(')[0].trim()}
                    </span>
                    {unit.combat.damage.includes('(') && (
                      <span className="text-[11px] font-medium text-gray-400 leading-tight mt-1 break-words block max-w-full">
                        ({unit.combat.damage.split('(')[1]}
                      </span>
                    )}
                  </>
                ) : (
                  <span className="text-lg font-black text-white leading-none">—</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 min-w-0">
            <div className="p-2 rounded bg-yellow-500/10 border border-yellow-500/20 shrink-0">
              <Target className="w-4 h-4 text-yellow-500" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] text-gray-500 uppercase font-extrabold tracking-wider block leading-none mb-1.5">{t('attackRange')}</span>
              <span className="text-lg font-black text-white leading-none">
                {unit.combat.range !== undefined ? unit.combat.range : '—'}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3 min-w-0">
            <div className="p-2 rounded bg-blue-500/10 border border-blue-500/20 shrink-0">
              <Navigation className="w-4 h-4 text-blue-500" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] text-gray-500 uppercase font-extrabold tracking-wider block leading-none mb-1.5">{t('movementSpeed')}</span>
              <span className="text-lg font-black text-white leading-none">
                {unit.combat.speed !== undefined ? unit.combat.speed : '—'}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3 min-w-0">
            <div className="p-2 rounded bg-purple-500/10 border border-purple-500/20 shrink-0">
              <Eye className="w-4 h-4 text-purple-500" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] text-gray-500 uppercase font-extrabold tracking-wider block leading-none mb-1.5">{t('sensorSight')}</span>
              <span className="text-lg font-black text-white leading-none">
                {unit.combat.sight !== undefined ? unit.combat.sight : '—'}
              </span>
            </div>
          </div>
        </div>
      </GlassPanel>

      {/* Resource & Production */}
      <GlassPanel className="p-6 border-white/5 md:col-span-2">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-8">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-slate-800 rounded flex items-center justify-center">
              <Box className="w-5 h-5 text-gray-400" />
            </div>
            <div>
              <span className="text-[10px] text-gray-600 uppercase font-bold tracking-widest block">{t('minerals')}</span>
              <span className="text-xl font-black text-white">{unit.cost.minerals}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-slate-800 rounded flex items-center justify-center">
              <Zap className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <span className="text-[10px] text-gray-600 uppercase font-bold tracking-widest block">{t('vespeneGas')}</span>
              <span className="text-xl font-black text-white">{unit.cost.gas}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-slate-800 rounded flex items-center justify-center">
              <Shield className="w-5 h-5 text-yellow-500" />
            </div>
            <div>
              <span className="text-[10px] text-gray-600 uppercase font-bold tracking-widest block">{t('supply')}</span>
              <span className="text-xl font-black text-white">{unit.cost.supply}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-slate-800 rounded flex items-center justify-center">
              <Clock className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <span className="text-[10px] text-gray-600 uppercase font-bold tracking-widest block">{t('buildTime')}</span>
              <span className="text-xl font-black text-white">{unit.cost.buildTime}s</span>
            </div>
          </div>
        </div>
      </GlassPanel>
    </div>
  );
};
