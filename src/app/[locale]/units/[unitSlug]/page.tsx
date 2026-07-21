'use client';

import React, { useEffect } from 'react';
import { Link } from '@/i18n/routing';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { getUnitBySlug } from '@/data/units';
import { races } from '@/data/races';
import { Badge } from '@/components/ui/Badge';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { UnitModelViewer } from '@/components/units/UnitModelViewer';
import { UnitStatsPanel } from '@/components/units/UnitStatsPanel';
import {
  ChevronLeft,
  Info,
  Zap,
  ArrowUpCircle,
  Compass,
  CheckCircle,
  AlertTriangle,
  Swords,
  Lightbulb,
} from 'lucide-react';
import { trackEvent } from '@/lib/gtag';
import { useSettings } from '@/context/SettingsContext';

export default function UnitDetailPage() {
  const params = useParams();
  const unitSlug = params.unitSlug as string;
  const { patchVersion } = useSettings();
  const unit = getUnitBySlug(unitSlug, patchVersion);
  const t = useTranslations();

  const race = unit ? races.find((r) => r.id === unit.race) : null;

  const unitName = t(`units.${unit?.id || ''}.name`);
  const shortDescription = t(`units.${unit?.id || ''}.shortDescription`);
  const longDescription = t(`units.${unit?.id || ''}.longDescription`);

  const tUi = useTranslations('ui');

  const tacticalRole = unit
    ? t.has(`units.${unit.id}.tacticalRole`)
      ? t(`units.${unit.id}.tacticalRole`)
      : unit.tacticalRole || t(`units.${unit.id}.shortDescription`) || ''
    : '';

  const strengths = unit
    ? t.has(`units.${unit.id}.strengths`)
      ? (t.raw(`units.${unit.id}.strengths`) as string[])
      : unit.strengths || []
    : [];

  const weaknesses = unit
    ? t.has(`units.${unit.id}.weaknesses`)
      ? (t.raw(`units.${unit.id}.weaknesses`) as string[])
      : unit.weaknesses || []
    : [];

  const goodAgainst = unit
    ? t.has(`units.${unit.id}.goodAgainst`)
      ? (t.raw(`units.${unit.id}.goodAgainst`) as string[])
      : unit.goodAgainst || []
    : [];

  const vulnerableAgainst = unit
    ? t.has(`units.${unit.id}.vulnerableAgainst`)
      ? (t.raw(`units.${unit.id}.vulnerableAgainst`) as string[])
      : unit.vulnerableAgainst || []
    : [];

  const usageTip = unit
    ? t.has(`units.${unit.id}.usageTip`)
      ? t(`units.${unit.id}.usageTip`)
      : unit.usageTip || ''
    : '';

  const gamePhase = unit
    ? t.has(`units.${unit.id}.gamePhase`)
      ? (t.raw(`units.${unit.id}.gamePhase`) as string[])
      : unit.gamePhase || []
    : [];

  useEffect(() => {
    if (unit) {
      trackEvent('view_unit_details', 'engagement', unit.slug, undefined, {
        name: unitName,
        race: unit.race,
      });
    }
  }, [unit, unitName]);

  if (!unit || !race) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-4xl font-black text-white mb-4">{t('ui.dataNotFound')}</h1>
          <p className="text-gray-500 mb-8">
            The requested unit profile does not exist in our tactical database.
          </p>
          <Link
            href="/"
            onClick={() =>
              trackEvent('nav_back_clicked', 'navigation', 'command_center', undefined, {
                from: '404_unit',
                unitSlug,
              })
            }
            className="px-6 py-3 bg-blue-600 rounded-lg text-white font-bold"
          >
            {t('ui.returnToCommandCenter')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-slate-950 py-12"
      style={{
        backgroundImage: `linear-gradient(rgba(2, 6, 23, 0.40), rgba(2, 6, 23, 0.75)), url('/assets/races/${unit.race}_bg.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="container mx-auto px-4">
        {/* Navigation */}
        <div className="mb-12">
          <Link
            href={`/races/${unit.race}`}
            onClick={() =>
              trackEvent('nav_back_clicked', 'navigation', 'race_roster', undefined, {
                from: 'unit_detail',
                race: unit.race,
                unit: unit.slug,
              })
            }
            className="inline-flex items-center gap-2 text-gray-500 hover:text-white transition-colors group"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            {t('ui.backToRoster', { race: t(`races.${unit.race}`).toUpperCase() })}
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Visuals */}
          <div className="lg:col-span-7 space-y-8">
            <motion.div
              initial={false}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <UnitModelViewer
                unitName={unitName}
                modelSrc={unit.assets.modelSrc}
                imageSrc={unit.assets.imageSrc}
                fallbackImageSrc={unit.assets.fallbackImageSrc}
              />
            </motion.div>

            {/* Mobile Header & Stats (Visible only on mobile/tablet) */}
            <div className="block lg:hidden space-y-8 mt-8">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-3">
                  <Badge variant="race" raceId={unit.race as any}>
                    {t(`races.${unit.race}`)}
                  </Badge>
                  {unit.tags?.map((tag) => {
                    const tagKey = `tags.${tag}`;
                    const localizedTag = t.has(tagKey) ? t(tagKey) : tag;
                    return (
                      <Badge key={tag} variant="outline">
                        {localizedTag}
                      </Badge>
                    );
                  })}
                  {gamePhase.map((phase) => {
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
                <h1 className="text-5xl md:text-7xl font-black text-white uppercase italic tracking-tighter">
                  {unitName}
                </h1>
              </div>

              <UnitStatsPanel unit={unit} />
            </div>

            {/* Description Card */}
            <GlassPanel className="p-8 border-white/5 space-y-6">
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                  <Compass className="w-4 h-4" style={{ color: race.theme.primary }} />{' '}
                  {tUi('tacticalOverview')}
                </h3>
                {tacticalRole && (
                  <p className="text-lg text-gray-300 leading-relaxed italic border-l-2 pl-3 py-1 border-white/10 bg-white/5 rounded-r">
                    "{tacticalRole}"
                  </p>
                )}
                <p className="text-gray-400 leading-relaxed text-sm">
                  {longDescription || shortDescription}
                </p>
              </div>

              {/* Strengths and Weaknesses */}
              {(strengths.length > 0 || weaknesses.length > 0) && (
                <div className="h-px bg-white/5 my-4" />
              )}
              {(strengths.length > 0 || weaknesses.length > 0) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {strengths.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5" />
                        {tUi('strengths')}
                      </h4>
                      <ul className="space-y-2">
                        {strengths.map((s) => (
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
                        {weaknesses.map((w) => (
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
                <div className="h-px bg-white/5 my-4" />
              )}
              {(goodAgainst.length > 0 || vulnerableAgainst.length > 0) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {goodAgainst.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-[10px] font-bold text-blue-400 uppercase tracking-widest flex items-center gap-1.5">
                        <Swords className="w-3.5 h-3.5 text-blue-400" />
                        {tUi('goodAgainst')}
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {goodAgainst.map((item) => (
                          <span
                            key={item}
                            className="px-2 py-1 rounded bg-blue-500/5 border border-blue-500/20 text-gray-300 text-xs font-medium"
                          >
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
                        {vulnerableAgainst.map((item) => (
                          <span
                            key={item}
                            className="px-2 py-1 rounded bg-amber-500/5 border border-amber-500/20 text-gray-300 text-xs font-medium"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Usage Tip */}
              {usageTip && <div className="h-px bg-white/5 my-4" />}
              {usageTip && (
                <div className="p-5 rounded-xl border flex gap-4 bg-slate-900/20 border-white/5 relative overflow-hidden shrink-0 mt-auto">
                  <div
                    className="absolute inset-0 pointer-events-none opacity-5"
                    style={{
                      background: `radial-gradient(circle at top left, ${race.theme.primary} 0%, transparent 70%)`,
                    }}
                  />
                  <div className="p-2.5 rounded-lg shrink-0 flex items-center justify-center bg-blue-500/10 border border-blue-500/20 max-h-11">
                    <Lightbulb className="w-5 h-5 text-blue-400 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-extrabold text-blue-400 uppercase tracking-wider mb-1 leading-none">
                      {tUi('usageTip')}
                    </h4>
                    <p className="text-xs text-gray-300 leading-relaxed font-medium">{usageTip}</p>
                  </div>
                </div>
              )}
            </GlassPanel>

            {/* Abilities */}
            {unit.abilities && unit.abilities.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2 px-2">
                  <Zap className="w-4 h-4 text-blue-500" /> {t('ui.tacticalAbilities')}
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  {unit.abilities.map((ability) => (
                    <GlassPanel
                      key={ability.id}
                      className="p-6 border-white/5 flex gap-6 items-center"
                    >
                      <div className="w-16 h-16 rounded bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                        <Zap className="w-8 h-8 text-blue-500" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-white uppercase tracking-tight mb-1">
                          {t(`units.${unit.id}.abilities.${ability.id}.name`)}
                        </h4>
                        <p className="text-sm text-gray-400">
                          {t(`units.${unit.id}.abilities.${ability.id}.description`)}
                        </p>
                      </div>
                    </GlassPanel>
                  ))}
                </div>
              </div>
            )}

            {/* Upgrades */}
            {unit.upgrades && unit.upgrades.length > 0 && (
              <div className="space-y-4 mt-8">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2 px-2">
                  <ArrowUpCircle className="w-4 h-4 text-emerald-500" /> {t('ui.upgrades')}
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  {unit.upgrades.map((upgrade) => (
                    <GlassPanel
                      key={upgrade.id}
                      className="p-6 border-white/5 flex gap-6 items-center"
                    >
                      <div className="w-16 h-16 rounded bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                        <ArrowUpCircle className="w-8 h-8 text-emerald-500" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-white uppercase tracking-tight mb-1">
                          {t(`units.${unit.id}.upgrades.${upgrade.id}.name`)}
                        </h4>
                        <p className="text-sm text-gray-400">
                          {t(`units.${unit.id}.upgrades.${upgrade.id}.description`)}
                        </p>
                      </div>
                    </GlassPanel>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Stats & Data */}
          <div className="lg:col-span-5 space-y-8">
            <div className="hidden lg:block space-y-8">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-3">
                  <Badge variant="race" raceId={unit.race as any}>
                    {t(`races.${unit.race}`)}
                  </Badge>
                  {unit.tags?.map((tag) => {
                    const tagKey = `tags.${tag}`;
                    const localizedTag = t.has(tagKey) ? t(tagKey) : tag;
                    return (
                      <Badge key={tag} variant="outline">
                        {localizedTag}
                      </Badge>
                    );
                  })}
                  {gamePhase.map((phase) => {
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
                <h1 className="text-5xl md:text-7xl font-black text-white uppercase italic tracking-tighter">
                  {unitName}
                </h1>
              </div>

              <UnitStatsPanel unit={unit} />
            </div>

            {/* Production Reqs */}
            <GlassPanel className="p-6 border-white/5 bg-blue-900/10 border-blue-500/10">
              <h3 className="text-sm font-bold text-blue-500 uppercase tracking-widest mb-4">
                {t('ui.productionIntelligence')}
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">{t('ui.facility')}:</span>
                  <span className="text-white font-bold">
                    {unit.production.producedFrom
                      ? t(`tech.${unit.production.producedFrom}`)
                      : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between items-start text-sm">
                  <span className="text-gray-500">{t('ui.techRequirements')}:</span>
                  <div className="text-right">
                    {unit.production.requirements?.map((req) => (
                      <div key={req} className="text-white font-bold">
                        {t(`tech.${req}`)}
                      </div>
                    )) || <div className="text-white font-bold">None</div>}
                  </div>
                </div>
              </div>
            </GlassPanel>
          </div>
        </div>
      </div>
    </div>
  );
}
