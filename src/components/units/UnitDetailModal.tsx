'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { X, Shield, Swords, Zap, Clock, Box, AlertTriangle, CheckCircle, Lightbulb, Compass } from 'lucide-react';
import { Unit } from '@/types/unit';
import { races } from '@/data/races';
import { UnitModelViewer } from './UnitModelViewer';
import { Badge } from '@/components/ui/Badge';
import { trackEvent } from '@/lib/gtag';

interface UnitDetailModalProps {
  unit: Unit | null;
  isOpen: boolean;
  onClose: () => void;
}

export const UnitDetailModal = ({ unit, isOpen, onClose }: UnitDetailModalProps) => {
  const t = useTranslations();
  const tStats = useTranslations('stats');
  const tUi = useTranslations('ui');

  useEffect(() => {
    if (isOpen && unit) {
      trackEvent('unit_detail_opened', 'engagement', unit.slug, undefined, {
        race: unit.race,
        unit: unit.slug,
      });
    }
  }, [isOpen, unit]);

  if (!unit) return null;

  const race = races.find(r => r.id === unit.race);
  if (!race) return null;

  const unitName = t(`units.${unit.id}.name`);
  const longDescription = t(`units.${unit.id}.longDescription`);

  // Localized tactical info with robust data / config fallbacks
  const tacticalRole = t.has(`units.${unit.id}.tacticalRole`)
    ? t(`units.${unit.id}.tacticalRole`)
    : unit.tacticalRole || t(`units.${unit.id}.shortDescription`) || '';

  const strengths = t.has(`units.${unit.id}.strengths`)
    ? (t.raw(`units.${unit.id}.strengths`) as string[])
    : unit.strengths || [];

  const weaknesses = t.has(`units.${unit.id}.weaknesses`)
    ? (t.raw(`units.${unit.id}.weaknesses`) as string[])
    : unit.weaknesses || [];

  const goodAgainst = t.has(`units.${unit.id}.goodAgainst`)
    ? (t.raw(`units.${unit.id}.goodAgainst`) as string[])
    : unit.goodAgainst || [];

  const vulnerableAgainst = t.has(`units.${unit.id}.vulnerableAgainst`)
    ? (t.raw(`units.${unit.id}.vulnerableAgainst`) as string[])
    : unit.vulnerableAgainst || [];

  const usageTip = t.has(`units.${unit.id}.usageTip`)
    ? t(`units.${unit.id}.usageTip`)
    : unit.usageTip || '';

  const gamePhase = t.has(`units.${unit.id}.gamePhase`)
    ? (t.raw(`units.${unit.id}.gamePhase`) as string[])
    : unit.gamePhase || [];

  // Faction theme helpers
  const primaryColor = race.theme.primary;
  const glowColor = race.theme.glow;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 overflow-hidden">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              trackEvent('unit_detail_closed', 'engagement', unit.slug, undefined, {
                race: unit.race,
                unit: unit.slug,
                method: 'backdrop',
              });
              onClose();
            }}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            className="relative w-full max-w-5xl bg-slate-950/95 border border-white/10 rounded-2xl shadow-2xl flex flex-col lg:flex-row max-h-[90vh] overflow-hidden z-10"
            style={{ boxShadow: `0 0 50px -10px ${glowColor}25` }}
          >
            {/* Close Button */}
            <button
              onClick={() => {
                trackEvent('unit_detail_closed', 'engagement', unit.slug, undefined, {
                  race: unit.race,
                  unit: unit.slug,
                  method: 'button',
                });
                onClose();
              }}
              aria-label="Close unit detail"
              className="absolute top-4 right-4 z-50 p-2 rounded-full border border-white/10 bg-slate-900/80 hover:bg-slate-800 text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Left Column: Visuals (3D Model / Fallback) */}
            <div className="w-full lg:w-[45%] h-[280px] lg:h-auto shrink-0 relative lg:border-r border-b lg:border-b-0 border-white/10 bg-slate-900/20">
              <div className="absolute inset-0 z-0">
                <UnitModelViewer
                  unitName={unitName}
                  modelSrc={unit.assets.modelSrc}
                  imageSrc={unit.assets.imageSrc}
                  fallbackImageSrc={unit.assets.fallbackImageSrc}
                />
              </div>
            </div>

            {/* Right Column: Detailed Stats & Copy (Scrollable) */}
            <div className="flex-grow p-6 md:p-8 overflow-y-auto flex flex-col gap-6 max-h-[calc(90vh-280px)] lg:max-h-[90vh]">
              {/* Header: Name and badges */}
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  <Badge variant="race" raceId={unit.race as any}>
                    {t(`races.${unit.race}`)}
                  </Badge>
                  {unit.tags?.map(tag => {
                    const tagKey = `tags.${tag}`;
                    const localizedTag = t.has(tagKey) ? t(tagKey) : tag;
                    return (
                      <Badge key={tag} variant="outline">
                        {localizedTag}
                      </Badge>
                    );
                  })}
                  {gamePhase.map(phase => {
                    const phaseLower = phase.toLowerCase();
                    const phaseTranslation = tUi.has(phaseLower) ? tUi(phaseLower) : phase;
                    return (
                      <span
                        key={phase}
                        className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest border bg-blue-500/10 border-blue-500/30 text-blue-400"
                      >
                        {phaseTranslation}
                      </span>
                    );
                  })}
                </div>
                <h2
                  className="text-3xl md:text-5xl font-black text-white uppercase italic tracking-tighter"
                  style={{ textShadow: `0 0 20px ${glowColor}30` }}
                >
                  {unitName}
                </h2>
              </div>

              {/* Tactical Introduction */}
              <div className="space-y-2">
                <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5" style={{ color: primaryColor }} />
                  {tUi('tacticalOverview')}
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed font-semibold italic border-l-2 pl-3 py-1 border-white/10 bg-white/5 rounded-r">
                  {tacticalRole}
                </p>
                <p className="text-gray-400 text-xs leading-relaxed mt-2">
                  {longDescription}
                </p>
              </div>

              {/* Technical Costs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl border border-white/5 bg-slate-900/40">
                <div className="flex items-center gap-3">
                  <Box className="w-5 h-5 text-gray-500 shrink-0" />
                  <div>
                    <span className="text-[9px] text-gray-500 uppercase font-bold tracking-wider block leading-none mb-1">{tStats('minerals')}</span>
                    <span className="text-sm font-black text-white">{unit.cost.minerals}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-blue-400 shrink-0" />
                  <div>
                    <span className="text-[9px] text-gray-500 uppercase font-bold tracking-wider block leading-none mb-1">{tStats('vespeneGas')}</span>
                    <span className="text-sm font-black text-white">{unit.cost.gas}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-yellow-500 shrink-0" />
                  <div>
                    <span className="text-[9px] text-gray-500 uppercase font-bold tracking-wider block leading-none mb-1">{tStats('supply')}</span>
                    <span className="text-sm font-black text-white">{unit.cost.supply}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-red-400 shrink-0" />
                  <div>
                    <span className="text-[9px] text-gray-500 uppercase font-bold tracking-wider block leading-none mb-1">{tStats('buildTime')}</span>
                    <span className="text-sm font-black text-white">{unit.cost.buildTime || '—'}s</span>
                  </div>
                </div>
              </div>

              {/* Strengths and Weaknesses */}
              {(strengths.length > 0 || weaknesses.length > 0) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {strengths.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5" />
                        {tUi('strengths')}
                      </h4>
                      <ul className="space-y-2">
                        {strengths.map(s => (
                          <li key={s} className="text-xs text-gray-400 flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                            <span>{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {weaknesses.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-[10px] font-bold text-red-400 uppercase tracking-widest flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        {tUi('weaknesses')}
                      </h4>
                      <ul className="space-y-2">
                        {weaknesses.map(w => (
                          <li key={w} className="text-xs text-gray-400 flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                            <span>{w}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Matchups: Good Against / Vulnerable Against */}
              {(goodAgainst.length > 0 || vulnerableAgainst.length > 0) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-white/5">
                  {goodAgainst.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-[10px] font-bold text-blue-400 uppercase tracking-widest flex items-center gap-1.5">
                        <Swords className="w-3.5 h-3.5 text-blue-400" />
                        {tUi('goodAgainst')}
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {goodAgainst.map(item => (
                          <span key={item} className="px-2 py-1 rounded bg-blue-500/5 border border-blue-500/20 text-gray-300 text-xs font-medium">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {vulnerableAgainst.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-[10px] font-bold text-amber-500 uppercase tracking-widest flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                        {tUi('vulnerableAgainst')}
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {vulnerableAgainst.map(item => (
                          <span key={item} className="px-2 py-1 rounded bg-amber-500/5 border border-amber-500/20 text-gray-300 text-xs font-medium">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Usage Tip */}
              {usageTip && (
                <div
                  className="p-5 rounded-xl border flex gap-4 bg-slate-900/20 border-white/5 relative overflow-hidden shrink-0 mt-auto"
                >
                  <div
                    className="absolute inset-0 pointer-events-none opacity-5"
                    style={{
                      background: `radial-gradient(circle at top left, ${primaryColor} 0%, transparent 70%)`
                    }}
                  />
                  <div className="p-2.5 rounded-lg shrink-0 flex items-center justify-center bg-blue-500/10 border border-blue-500/20 max-h-11">
                    <Lightbulb className="w-5 h-5 text-blue-400 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-extrabold text-blue-400 uppercase tracking-wider mb-1 leading-none">
                      {tUi('usageTip')}
                    </h4>
                    <p className="text-xs text-gray-300 leading-relaxed font-medium">
                      {usageTip}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
