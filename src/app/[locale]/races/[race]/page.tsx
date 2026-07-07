'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Link } from '@/i18n/routing';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { getUnitsByRace } from '@/data/units';
import { races } from '@/data/races';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Badge } from '@/components/ui/Badge';
import { ChevronLeft, Info, ChevronRight, Search, SortAsc, Clock, Box, Zap } from 'lucide-react';
import { trackEvent } from '@/lib/gtag';
import { Unit } from '@/types/unit';

interface UnitCardImageProps {
  imageSrc?: string;
  unitName: string;
  roles: string[];
}

function UnitCardImage({ imageSrc, unitName, roles }: UnitCardImageProps) {
  const [hasError, setHasError] = useState(false);
  const tUi = useTranslations('ui');

  return (
    <div className="aspect-video bg-slate-900 flex items-center justify-center relative overflow-hidden shrink-0">
      {/* Large background letters (always rendered as structural background) */}
      <div className="absolute inset-0 flex items-center justify-center select-none z-0">
        <div className="text-white/5 text-6xl font-black italic uppercase tracking-tighter select-none text-center px-4 line-clamp-1">
          {unitName}
        </div>
      </div>

      {/* The image (rendered absolutely on top of the letters) */}
      {imageSrc && !hasError && (
        <img 
          src={imageSrc} 
          alt={unitName} 
          className="absolute inset-0 w-full h-full object-contain p-2 z-10 transition-all duration-700 ease-out group-hover:scale-105 opacity-100"
          onError={() => setHasError(true)}
        />
      )}

      {/* Premium gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent z-20 pointer-events-none" />
      
      {/* Roles Badges */}
      <div className="absolute bottom-4 left-4 z-30">
        <div className="flex gap-2">
          {roles.map(role => {
            const filterKey = `filter${role.charAt(0).toUpperCase() + role.slice(1)}`;
            const localizedRole = tUi.has(filterKey) ? tUi(filterKey) : role;
            return (
              <Badge key={role} variant="outline" className="bg-black/50 backdrop-blur-sm uppercase text-[9px] tracking-wider font-extrabold">
                {localizedRole}
              </Badge>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function RaceUnitGridPage() {
  const params = useParams();
  const raceId = params.race as string;
  const race = races.find(r => r.id === raceId);
  const rawUnits = useMemo(() => getUnitsByRace(raceId), [raceId]);
  const t = useTranslations();

  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'minerals' | 'gas' | 'buildTime'>('name');
  const [selectedRole, setSelectedRole] = useState('all');

  // Available Filter Roles
  const roles = [
    'all',
    'worker',
    'basic',
    'melee',
    'ranged',
    'air',
    'siege',
    'support',
    'caster',
    'capital',
    'detector',
    'transport',
    'harassment',
    'spellcaster'
  ];

  // Helper matching role/tag filters
  const matchesFilter = (unit: Unit, filter: string) => {
    if (filter === 'all') return true;
    const f = filter.toLowerCase();
    
    // Standard role check
    if (unit.role.some(r => {
      const role = r.toLowerCase();
      if (f === 'spellcaster' && role === 'caster') return true;
      if (role === f) return true;
      return false;
    })) return true;
    
    // Custom tag mapping check
    if (unit.tags?.some(t => {
      const tag = t.toLowerCase();
      if (f === 'harassment' && tag === 'harass') return true;
      if (f === 'spellcaster' && tag === 'caster') return true;
      if (f === 'caster' && tag === 'caster') return true;
      if (tag === f) return true;
      return false;
    })) return true;
    
    return false;
  };

  // Debounced search analytics
  useEffect(() => {
    if (!search.trim()) return;
    const timer = setTimeout(() => {
      trackEvent('search_used', 'filter', undefined, undefined, {
        race: raceId,
        query_length: search.length,
        results_count: filteredUnits.length,
      });
    }, 1500); // 1.5 second delay
    return () => clearTimeout(timer);
  }, [search, raceId]);

  const filteredUnits = useMemo(() => {
    let result = rawUnits.filter(unit => {
      const nameMatch = t(`units.${unit.id}.name`).toLowerCase().includes(search.toLowerCase());
      const descMatch = t(`units.${unit.id}.shortDescription`).toLowerCase().includes(search.toLowerCase());
      const roleMatch = matchesFilter(unit, selectedRole);
      return (nameMatch || descMatch) && roleMatch;
    });

    result.sort((a, b) => {
      if (sortBy === 'name') {
        return t(`units.${a.id}.name`).localeCompare(t(`units.${b.id}.name`));
      } else if (sortBy === 'minerals') {
        return a.cost.minerals - b.cost.minerals;
      } else if (sortBy === 'gas') {
        return a.cost.gas - b.cost.gas;
      } else if (sortBy === 'buildTime') {
        return (a.cost.buildTime || 0) - (b.cost.buildTime || 0);
      }
      return 0;
    });

    return result;
  }, [rawUnits, search, sortBy, selectedRole, t]);

  if (!race) return <div className="p-20 text-white">{t('ui.dataNotFound')}</div>;

  return (
    <div className="min-h-screen bg-slate-950 py-20 bg-grid-white">
      <div className="container mx-auto px-4">
        {/* Return Button */}
        <Link
          href="/"
          onClick={() => trackEvent('nav_back_clicked', 'navigation', 'command_center', undefined, { from: 'race_roster', race: raceId })}
          className="inline-flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-12 group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          {t('ui.returnToCommandCenter')}
        </Link>

        {/* Faction Header & Intro */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
          <div>
            <div className="flex items-center gap-6 mb-4">
              <div 
                className="w-12 h-12 rounded flex items-center justify-center border relative backdrop-blur-sm"
                style={{ 
                  borderColor: race.theme.primary, 
                  backgroundColor: `${race.theme.primary}10`,
                  boxShadow: `0 0 15px ${race.theme.glow}` 
                }}
              >
                {race.iconSrc ? (
                  <img 
                    src={race.iconSrc} 
                    alt={race.name} 
                    className="w-16 h-16 object-contain absolute -top-2 -left-2 max-w-none transition-transform duration-300 hover:scale-110"
                    style={{ filter: `drop-shadow(0 0 8px ${race.theme.glow})` }}
                  />
                ) : (
                  <span className="text-xl font-bold" style={{ color: race.theme.primary }}>{race.name[0]}</span>
                )}
              </div>
              <Badge variant="race" raceId={race.id as any}>{t(`races.${race.id}`)}</Badge>
            </div>
            <h1 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter">
              {t('ui.tacticalUnits')}
            </h1>
            
            {/* Tactical Intro Card */}
            <div className="mt-6 max-w-2xl">
              <GlassPanel 
                className="p-4 border-l-4 bg-slate-950/20 text-gray-300 text-sm leading-relaxed" 
                style={{ borderColor: race.theme.primary }}
              >
                {t(`races.${race.id}Intro`)}
              </GlassPanel>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input 
                type="text" 
                placeholder={t('ui.searchUnits')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search units"
                className="bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors w-64"
              />
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2">
              <SortAsc className="w-4 h-4 text-gray-500" />
              <span className="text-xs text-gray-500 uppercase font-bold">{t('ui.sortBy')}:</span>
              <select 
                value={sortBy}
                onChange={(e) => {
                  const val = e.target.value;
                  setSortBy(val as any);
                  trackEvent('sort_changed', 'filter', val, undefined, {
                    race: raceId,
                    sort_by: val,
                  });
                }}
                className="bg-transparent text-white text-sm focus:outline-none cursor-pointer"
              >
                <option value="name" className="bg-slate-900">{t('ui.name')}</option>
                <option value="minerals" className="bg-slate-900">{t('ui.minerals')}</option>
                <option value="gas" className="bg-slate-900">{t('ui.gas')}</option>
                <option value="buildTime" className="bg-slate-900">{t('ui.buildTime')}</option>
              </select>
            </div>

            <div className="text-right ml-auto lg:ml-0">
              <span className="text-3xl font-black text-white/10 uppercase tracking-tighter">
                {t('ui.unitsCount', { count: filteredUnits.length })}
              </span>
            </div>
          </div>
        </div>

        {/* Role Filter Chips */}
        <div className="flex flex-wrap gap-2 mb-8 bg-slate-950/40 p-3 rounded-xl border border-white/5">
          {roles.map(role => {
            const isActive = selectedRole === role;
            const filterKey = `filter${role.charAt(0).toUpperCase() + role.slice(1)}`;
            const label = t(`ui.${filterKey}`);
            
            return (
              <button
                key={role}
                onClick={() => {
                  setSelectedRole(role);
                  trackEvent('role_filter_used', 'filter', role, undefined, {
                    race: raceId,
                    role: role,
                  });
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg border border-blue-500'
                    : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/5'
                }`}
                style={isActive ? { backgroundColor: race.theme.primary, borderColor: race.theme.primary } : {}}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Units Grid / Empty State */}
        {filteredUnits.length === 0 ? (
          <GlassPanel className="p-12 text-center">
            <Info className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">{t('ui.dataNotFound')}</h2>
            <p className="text-gray-500 max-w-md mx-auto">
              {t('ui.noUnitsFoundSearch')}
            </p>
          </GlassPanel>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredUnits.map((unit) => {
              const unitName = t(`units.${unit.id}.name`);
              const shortDescription = t(`units.${unit.id}.shortDescription`);
              
              return (
                <motion.div
                  key={unit.id}
                  initial={false}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                  className="h-full"
                >
                  <Link 
                    href={`/units/${unit.slug}`}
                    onClick={() => {
                      trackEvent('unit_card_clicked', 'engagement', unit.slug, undefined, {
                        race: raceId,
                        unit: unit.slug,
                      });
                    }}
                    className="cursor-pointer h-full block"
                  >
                    <GlassPanel hoverable className="p-0 border-white/5 overflow-hidden group h-full flex flex-col">
                      {/* Unit Image */}
                      <UnitCardImage 
                        imageSrc={unit.assets.imageSrc} 
                        unitName={unitName} 
                        roles={unit.role} 
                      />

                      <div className="p-6 flex flex-col flex-grow relative">
                        <h3 className="text-xl font-bold text-white mb-2 uppercase group-hover:text-blue-400 transition-colors">
                          {unitName}
                        </h3>
                        <p className="text-gray-500 text-xs line-clamp-2 mb-6 flex-grow">
                          {shortDescription}
                        </p>
                        
                        <div className="grid grid-cols-3 gap-2 pt-4 border-t border-white/5 mt-auto">
                          <div className="flex flex-col">
                            <span className="text-[10px] text-gray-600 uppercase font-bold tracking-widest flex items-center gap-1">
                              <Box className="w-2.5 h-2.5" /> Min
                            </span>
                            <span className="text-sm font-bold text-white">{unit.cost.minerals}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[10px] text-gray-600 uppercase font-bold tracking-widest flex items-center gap-1">
                              <Zap className="w-2.5 h-2.5 text-blue-400" /> Gas
                            </span>
                            <span className="text-sm font-bold text-white">{unit.cost.gas}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[10px] text-gray-600 uppercase font-bold tracking-widest flex items-center gap-1">
                              <Clock className="w-2.5 h-2.5 text-red-400" /> Time
                            </span>
                            <span className="text-sm font-bold text-white">{unit.cost.buildTime || '—'}s</span>
                          </div>
                        </div>
                        
                        <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                           <div className="w-8 h-8 rounded border border-blue-500/50 bg-blue-500/10 flex items-center justify-center">
                            <ChevronRight className="w-4 h-4 text-blue-400" />
                          </div>
                        </div>
                      </div>
                    </GlassPanel>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

