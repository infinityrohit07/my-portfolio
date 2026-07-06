import React from 'react';
import { motion } from 'framer-motion';
import DynamicIcon from './DynamicIcon';
import { DEFAULT_PORTFOLIO_DATA } from '../dataFallback';

export default function About({ data }) {
  const aboutData = data || DEFAULT_PORTFOLIO_DATA.profile.about;
  const { title = '', bioLines = [], traits = [] } = aboutData;

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
    hidden: { opacity: 0, y: 35 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  return (
    <section id="about" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4 font-sans"
          >
            About Me
          </motion.h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="h-1 w-20 bg-gradient-to-r from-brand-indigo to-brand-cyan mx-auto rounded-full origin-left"
          />
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Bio Description (left) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 space-y-6 text-slate-300 font-sans"
          >
            {title && (
              <h3 className="text-xl sm:text-2xl font-semibold text-white">
                {title}
              </h3>
            )}
            {bioLines.map((line, lIndex) => (
              <p key={lIndex} className="leading-relaxed">
                {line}
              </p>
            ))}
          </motion.div>

          {/* Core Values / Traits Grid (right) */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-6"
          >
            {traits.map((trait, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="p-6 rounded-2xl glass glow-card flex flex-col space-y-4"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-900/90 flex items-center justify-center border border-slate-800 shadow-md">
                  <DynamicIcon name={trait.iconName} className="w-6 h-6 text-brand-indigo" />
                </div>
                <h4 className="text-lg font-semibold text-white">{trait.title}</h4>
                <p className="text-sm text-slate-400 leading-relaxed">{trait.description}</p>
              </motion.div>
            ))}
          </motion.div>

        </div>

      </div>
    </section>
  );
}
