'use client';

import React from 'react';
import { Link } from '@/i18n/routing';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { ChevronRight, Zap, Target, Shield } from 'lucide-react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Badge } from '@/components/ui/Badge';

import { races } from '@/data/races';
import { trackEvent } from '@/lib/gtag';
import { useSettings } from '@/context/SettingsContext';

export default function LandingPage() {
  const t = useTranslations();
  const { disable3D, setDisable3D } = useSettings();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <div className="relative min-h-screen bg-grid-white">
      {/* Hero Section */}
      <section className="relative pt-20 pb-20 overflow-hidden">
        {/* Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-blue-600/20 blur-[120px] -z-10" />

        <div className="container mx-auto px-4">
          <motion.div
            variants={containerVariants}
            initial={false}
            animate="visible"
            className="max-w-3xl mx-auto text-center"
          >
            <motion.div variants={itemVariants} className="flex justify-center mb-8">
              <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-blue-500/50 shadow-[0_0_30px_rgba(59,130,246,0.3)]">
                <img src="/logo.png" alt="SC2 Atlas Logo" className="w-full h-full object-cover" />
              </div>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-5xl md:text-7xl font-black tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40"
            >
              {t.rich('landing.heroTitle', {
                br: () => <br />,
                blue: (chunks) => <span className="text-blue-500">{chunks}</span>
              })}
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-lg md:text-xl text-gray-400 mb-6 leading-relaxed"
            >
              {t('landing.heroSubtitle')}
            </motion.p>

            <motion.p
              variants={itemVariants}
              className="text-sm md:text-base text-blue-400/80 mb-10 max-w-lg mx-auto font-medium tracking-wide border border-blue-500/20 bg-blue-950/20 px-6 py-3 rounded-full backdrop-blur-sm"
            >
              {t('landing.heroExplanation')}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Race Selector Section (Integrated) */}
      <section className="pb-32 relative z-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center mb-16 text-center">
            <Badge variant="outline" className="mb-4">{t('landing.selectRace')}</Badge>
            <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter">{t('landing.commandCenter')}</h2>
            <p className="text-sm text-gray-400 mt-2 max-w-md mb-6">{t('landing.commandCenterSubtitle')}</p>
            
            {/* 3D Mobile Toggle Switch */}
            <div className="block lg:hidden w-full max-w-sm mt-2">
              <div className="p-4 rounded-xl border border-white/5 bg-slate-900/40 backdrop-blur-md shadow-2xl flex items-center justify-between gap-4 text-left">
                <div className="flex-1 pr-2">
                  <span className="text-xs font-bold text-white block uppercase tracking-wider mb-0.5">{t('ui.disable3D')}</span>
                  <span className="text-[10px] text-gray-400 block leading-tight">{t('ui.disable3DDesc')}</span>
                </div>
                <button
                  onClick={() => {
                    const next = !disable3D;
                    setDisable3D(next);
                    trackEvent('toggle_3d_mode', 'preferences', next ? 'disabled' : 'enabled', undefined, {
                      mode: next ? '2d' : '3d',
                    });
                  }}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    disable3D ? 'bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'bg-slate-700'
                  }`}
                  role="switch"
                  aria-checked={disable3D}
                  aria-label="Toggle 3D Models"
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      disable3D ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {races.map((race) => (
              <motion.div
                key={race.id}
                whileHover={{ y: -10 }}
                initial={false}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="h-full"
              >
                <Link
                  href={`/races/${race.id}`}
                  onClick={() => trackEvent('race_selected', 'engagement', race.id, undefined, { race: race.id })}
                  className="block h-full group"
                >
                  <div className="relative overflow-hidden rounded-xl border border-white/10 bg-slate-950/40 backdrop-blur-md transition-all duration-300 hover:border-white/20 hover:bg-slate-950/70 hover:shadow-2xl hover:shadow-blue-500/10 flex flex-col h-full">
                    {/* Subtle Inner Glow */}
                    <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-white/5 to-transparent z-10" />

                    {/* Top Section: Image and Name */}
                    <div className="relative h-[280px] w-full overflow-hidden bg-slate-900 shrink-0 z-0">
                      {/* Race Image */}
                      <img
                        src={`/assets/races/${race.id}.png`}
                        alt={t(`races.${race.id}`)}
                        className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-95 group-hover:scale-105 transition-all duration-700 ease-out z-0"
                      />
                      {/* Dark Gradient Overlay for the name inside the image block */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent z-10" />

                      {/* Hover glow tinted overlay */}
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-25 transition-opacity duration-500 z-10"
                        style={{
                          background: `radial-gradient(circle at center, ${race.theme.primary} 0%, transparent 70%)`
                        }}
                      />

                      {/* Race Name Overlayed at the bottom of the image container */}
                      <div className="absolute bottom-4 left-6 z-20">
                        <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter transition-all duration-300 group-hover:translate-x-1" style={{ textShadow: `0 0 20px ${race.theme.glow}` }}>
                          {t(`races.${race.id}`)}
                        </h3>
                      </div>
                    </div>

                    {/* Bottom Section: Description & Tactical Link */}
                    <div className="p-6 flex flex-col flex-grow bg-slate-950/80 border-t border-white/5 relative z-20">
                      <p className="text-gray-300 text-sm mb-6 leading-relaxed flex-grow group-hover:text-white transition-colors duration-300 line-clamp-4">
                        {t(`races.${race.id}Desc`)}
                      </p>

                      <div className="flex items-center justify-between mt-auto">
                        <Badge variant="race" raceId={race.id as any}>
                          {t('landing.tacticalEntry')}
                        </Badge>
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 border-t border-white/5 bg-black/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <GlassPanel hoverable className="p-8">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-6 border border-blue-500/20">
                <Target className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-white">{t('landing.precisionData')}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {t('landing.precisionDataDesc')}
              </p>
            </GlassPanel>

            <GlassPanel hoverable className="p-8">
              <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center mb-6 border border-yellow-500/20">
                <Zap className="w-6 h-6 text-yellow-500" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-white">{t('landing.tacticalAbilities')}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {t('landing.tacticalAbilitiesDesc')}
              </p>
            </GlassPanel>

            <GlassPanel hoverable className="p-8">
              <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-6 border border-purple-500/20">
                <Shield className="w-6 h-6 text-purple-500" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-white">{t('landing.advancedView')}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {t('landing.advancedViewDesc')}
              </p>
            </GlassPanel>
          </div>
        </div>
      </section>
    </div>
  );
}
