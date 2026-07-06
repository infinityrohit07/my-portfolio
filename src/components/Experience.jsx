import React from 'react';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import DynamicIcon from './DynamicIcon';
import { DEFAULT_PORTFOLIO_DATA } from '../dataFallback';

export default function Experience({ data }) {
  const experiencesList = data || DEFAULT_PORTFOLIO_DATA.experiences;

  if (!experiencesList || experiencesList.length === 0) {
    return null;
  }

  return (
    <section id="experience" className="py-24 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4 font-sans"
          >
            Experience
          </motion.h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="h-1 w-20 bg-gradient-to-r from-brand-indigo to-brand-cyan mx-auto rounded-full origin-left"
          />
        </div>

        {/* Timeline */}
        <div className="relative border-l border-slate-800/80 ml-4 md:ml-44 py-4 space-y-12">
          {experiencesList.map((exp, index) => (
            <motion.div
              key={exp._id || index}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-150px' }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative pl-8 md:pl-12 group"
            >
              {/* Year Label (Absolute on left side of timeline line on Desktop) */}
              <div className="hidden md:block absolute right-full mr-8 top-7 text-right whitespace-nowrap">
                <span className="text-sm font-semibold text-slate-400 group-hover:text-white transition-colors">
                  {exp.duration}
                </span>
              </div>

              {/* Timeline dot icon */}
              <div className="absolute -left-5 top-1.5 w-10 h-10 rounded-full bg-slate-950 border-2 border-slate-800 flex items-center justify-center shadow-lg group-hover:border-brand-indigo group-hover:shadow-brand-indigo/10 transition-all duration-300 z-10">
                <DynamicIcon name={exp.iconName} className="w-5 h-5 text-brand-indigo" />
              </div>

              {/* Box Content */}
              <div className="p-6 sm:p-8 rounded-2xl glass glow-card relative">

                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-2">
                  <div>
                    <h3 className="text-xl font-bold text-white font-sans group-hover:text-brand-cyan transition-colors">
                      {exp.role}
                    </h3>
                    <p className="text-sm font-semibold text-brand-indigo mt-0.5 font-sans">
                      {exp.company}
                    </p>
                  </div>
                  {/* Date label for mobile */}
                  <div className="md:hidden flex items-center space-x-1.5 text-xs text-slate-400 font-sans mt-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{exp.duration}</span>
                  </div>
                </div>

                {/* Bullet details */}
                <ul className="space-y-3 mb-6">
                  {exp.bullets && exp.bullets.map((bullet, bIndex) => (
                    <li key={bIndex} className="text-slate-300 text-sm leading-relaxed flex items-start font-sans">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-brand-cyan/70 mt-2 mr-3 shrink-0" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>

                {/* Tech Badges */}
                <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-900">
                  {exp.tech && exp.tech.map((t, tIndex) => (
                    <span
                      key={tIndex}
                      className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-400 font-sans"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
