import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { Github } from './Icons';
import DynamicIcon from './DynamicIcon';
import { DEFAULT_PORTFOLIO_DATA } from '../dataFallback';

export default function Projects({ data }) {
  const projectsList = data || DEFAULT_PORTFOLIO_DATA.projects;

  if (!projectsList || projectsList.length === 0) {
    return null;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  return (
    <section id="projects" className="py-24 relative">
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
            Featured Projects
          </motion.h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="h-1 w-20 bg-gradient-to-r from-brand-indigo to-brand-cyan mx-auto rounded-full origin-left"
          />
        </div>

        {/* Projects Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {projectsList.map((project, index) => (
            <motion.div
              key={project._id || index}
              variants={cardVariants}
              className={`group relative rounded-2xl glass p-8 border border-slate-800/80 transition-all duration-500 hover:-translate-y-2 flex flex-col justify-between ${project.borderColor || 'group-hover:border-brand-indigo/50'}`}
            >
              <div>
                {/* Visual Header Mockup */}
                <div className={`w-full h-32 rounded-xl mb-6 bg-gradient-to-br ${project.color || 'from-blue-500/20 to-indigo-500/20'} flex items-center justify-center border border-white/5 relative overflow-hidden`}>
                  <div className="absolute top-2 left-3 flex space-x-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                  </div>
                  
                  {/* Floating Icon */}
                  <div className="w-14 h-14 rounded-2xl bg-slate-900/90 flex items-center justify-center border border-slate-800 shadow-xl group-hover:scale-110 transition-transform duration-300">
                    <DynamicIcon name={project.iconName} className="w-6 h-6 text-brand-indigo" />
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-brand-indigo group-hover:to-brand-cyan transition-colors duration-300 font-sans">
                  {project.title}
                </h3>

                {/* Description */}
                <p className="text-slate-400 text-sm leading-relaxed mb-6 font-sans">
                  {project.description}
                </p>
              </div>

              <div>
                {/* Tech tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tech && project.tech.map((t, tIndex) => (
                    <span
                      key={tIndex}
                      className={`text-xs font-semibold px-3 py-1 rounded-lg border ${project.tagColor || 'bg-brand-indigo/10 text-brand-indigo border-brand-indigo/20'} font-sans`}
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {/* Links */}
                <div className="flex items-center space-x-4 pt-4 border-t border-slate-800/60">
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors group/link cursor-pointer"
                    >
                      <Github className="w-4 h-4" />
                      <span>Source Code</span>
                    </a>
                  )}
                  {project.live && (
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center space-x-2 text-xs font-semibold text-brand-cyan hover:text-cyan-300 transition-colors group/link cursor-pointer"
                    >
                      <ExternalLink className="w-4 h-4 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                      <span>Live Demo</span>
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
