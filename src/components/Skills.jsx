import React from 'react';
import { motion } from 'framer-motion';
import { Workflow } from 'lucide-react';
import DynamicIcon from './DynamicIcon';
import { DEFAULT_PORTFOLIO_DATA } from '../dataFallback';

export default function Skills({ data }) {
  const skillsData = data || DEFAULT_PORTFOLIO_DATA.profile.skills;
  const { categories = [], learningSummary = '' } = skillsData;

  if (!categories || categories.length === 0) {
    return null;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  return (
    <section id="skills" className="py-24 relative">
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
            Technical Skills
          </motion.h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="h-1 w-20 bg-gradient-to-r from-brand-indigo to-brand-cyan mx-auto rounded-full origin-left"
          />
        </div>

        {/* Categories Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {categories.map((category, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              className="p-8 rounded-2xl glass glow-card flex flex-col h-full"
            >
              {/* Category Header */}
              <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-slate-800/80">
                <div className="w-10 h-10 rounded-xl bg-slate-900/90 flex items-center justify-center border border-slate-800 shadow-md">
                  <DynamicIcon name={category.iconName} className="w-5 h-5 text-brand-indigo" />
                </div>
                <h3 className="text-xl font-bold text-white font-sans">{category.title}</h3>
              </div>

              {/* Skills Tags list (names only, no level badges) */}
              <div className="flex flex-wrap gap-3 mt-2">
                {category.skills.map((skillName, sIndex) => (
                  <div
                    key={sIndex}
                    className="flex items-center justify-between px-4 py-2 rounded-xl bg-slate-900/50 border border-slate-850 hover:border-slate-700/80 hover:bg-slate-900/90 transition-all duration-300 group flex-grow sm:flex-grow-0"
                  >
                    <span className="text-sm font-medium text-slate-300 group-hover:text-slate-100 transition-colors">
                      {skillName}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Summary tag at the bottom */}
        {learningSummary && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-16 text-center"
          >
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-2xl glass border-slate-800 text-sm text-slate-400 font-sans">
              <Workflow className="w-4 h-4 text-brand-cyan animate-pulse" />
              <span dangerouslySetInnerHTML={{ __html: learningSummary }} />
            </div>
          </motion.div>
        )}

      </div>
    </section>
  );
}
