import React from 'react';
import { ArrowRight, Mail, FileText } from 'lucide-react';
import { Github, Linkedin, Twitter } from './Icons';
import { motion } from 'framer-motion';
import { DEFAULT_PORTFOLIO_DATA } from '../dataFallback';

export default function Hero({ data }) {
  const heroData = data || DEFAULT_PORTFOLIO_DATA.profile.hero;
  const { statusText = '', greeting = "Hi, I'm", name = 'Alex Carter', subtitle = '', description = '', socials = {}, resumeUrl = '' } = heroData;

  const handleScrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  return (
    <section
      id="hero"
      className="min-h-screen flex items-center justify-center pt-24 pb-12 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center"
        >
          {/* Badge */}
          {statusText && (
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full glass border-slate-800/80 mb-6 text-xs sm:text-sm text-slate-300 font-sans shadow-lg shadow-black/30"
            >
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span>{statusText}</span>
            </motion.div>
          )}

          {/* Heading */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight font-sans leading-none mb-6"
          >
            <span className="block text-slate-100 mb-2">{greeting}</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-indigo via-purple-400 to-brand-cyan">
              {name}
            </span>
          </motion.h1>

          {/* Subheading */}
          {subtitle && (
            <motion.h2
              variants={itemVariants}
              className="text-lg sm:text-2xl md:text-3xl text-slate-400 font-medium font-sans max-w-3xl mb-8 leading-relaxed"
            >
              {subtitle}
            </motion.h2>
          )}

          {/* Slogan details / elevator pitch */}
          {description && (
            <motion.p
              variants={itemVariants}
              className="text-sm sm:text-base text-slate-500 max-w-xl mb-10 leading-relaxed font-sans"
            >
              {description}
            </motion.p>
          )}

          {/* CTAs */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-2xl mb-12"
          >
            <button
              onClick={() => handleScrollTo('projects')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-medium text-white bg-gradient-to-r from-brand-indigo to-brand-purple hover:from-brand-indigo hover:to-brand-cyan shadow-lg shadow-brand-indigo/25 hover:shadow-brand-cyan/25 hover:scale-103 transition-all duration-300 flex items-center justify-center space-x-2 group cursor-pointer"
            >
              <span>View Projects</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => handleScrollTo('contact')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-medium text-slate-300 hover:text-white glass hover:bg-slate-900/80 hover:scale-103 transition-all duration-300 flex items-center justify-center cursor-pointer"
            >
              Contact Me
            </button>

            {resumeUrl && (
              <a
                href={resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-medium text-brand-cyan hover:text-white border border-brand-cyan/20 hover:border-brand-cyan/60 glass hover:bg-brand-cyan/10 hover:scale-103 transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer font-sans"
              >
                <FileText className="w-4 h-4" />
                <span>View Resume</span>
              </a>
            )}
          </motion.div>

          {/* Social Icons */}
          <motion.div
            variants={itemVariants}
            className="flex items-center space-x-6"
          >
            {socials.github && (
              <a
                href={socials.github}
                target="_blank"
                rel="noreferrer"
                className="p-3 rounded-xl glass hover:bg-slate-900/80 hover:text-brand-cyan hover:scale-110 hover:-translate-y-1 transition-all duration-300 text-slate-400 cursor-pointer"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
            )}
            {socials.linkedin && (
              <a
                href={socials.linkedin}
                target="_blank"
                rel="noreferrer"
                className="p-3 rounded-xl glass hover:bg-slate-900/80 hover:text-brand-indigo hover:scale-110 hover:-translate-y-1 transition-all duration-300 text-slate-400 cursor-pointer"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            )}
            {socials.twitter && (
              <a
                href={socials.twitter}
                target="_blank"
                rel="noreferrer"
                className="p-3 rounded-xl glass hover:bg-slate-900/80 hover:text-purple-400 hover:scale-110 hover:-translate-y-1 transition-all duration-300 text-slate-400 cursor-pointer"
                aria-label="Twitter/X"
              >
                <Twitter className="w-5 h-5" />
              </a>
            )}
            {socials.email && (
              <a
                href={`mailto:${socials.email}`}
                className="p-3 rounded-xl glass hover:bg-slate-900/80 hover:text-emerald-400 hover:scale-110 hover:-translate-y-1 transition-all duration-300 text-slate-400 cursor-pointer"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            )}
          </motion.div>
        </motion.div>
      </div>

      {/* Decorative gradient overlay */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none" />
    </section>
  );
}
