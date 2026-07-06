import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Award, Calendar, BookOpen } from 'lucide-react';
import { DEFAULT_PORTFOLIO_DATA } from '../dataFallback';

export default function Education({ educationsData, certificationsData }) {
  const educationsList = educationsData || DEFAULT_PORTFOLIO_DATA.educations;
  const certificationsList = certificationsData || DEFAULT_PORTFOLIO_DATA.certifications;

  const hasEdu = educationsList && educationsList.length > 0;
  const hasCert = certificationsList && certificationsList.length > 0;

  if (!hasEdu && !hasCert) {
    return null;
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
  };

  return (
    <section id="education" className="py-24 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4 font-sans"
          >
            Education & Certifications
          </motion.h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="h-1 w-20 bg-gradient-to-r from-brand-indigo to-brand-cyan mx-auto rounded-full origin-left"
          />
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Degree Section (Left) */}
          {hasEdu && (
            <div className={`${hasCert ? 'lg:col-span-7' : 'lg:col-span-12'} space-y-6`}>
              <h3 className="text-xl font-bold text-slate-350 flex items-center gap-2 mb-4 pl-1 font-sans">
                <GraduationCap className="w-5 h-5 text-brand-indigo" />
                <span>Academic Degrees</span>
              </h3>

              {educationsList.map((edu, index) => (
                <motion.div
                  key={edu._id || index}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-100px' }}
                  variants={cardVariants}
                  className="p-8 rounded-2xl glass border border-slate-800/80 glow-card relative"
                >
                  {/* Duration Badge */}
                  <div className="flex items-center space-x-1 text-xs text-brand-cyan mb-3 font-sans font-medium">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{edu.duration}</span>
                  </div>

                  {/* Degree & Inst */}
                  <h4 className="text-2xl font-bold text-white mb-1 font-sans">
                    {edu.degree}
                  </h4>
                  <p className="text-base text-brand-indigo font-semibold mb-4 font-sans">
                    {edu.institution}
                  </p>

                  {/* GPA Badge */}
                  {edu.gpa && (
                    <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-6 font-sans">
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>{edu.gpa}</span>
                    </div>
                  )}

                  {/* Bullets */}
                  <ul className="space-y-3">
                    {edu.highlights && edu.highlights.map((hl, hlIndex) => (
                      <li key={hlIndex} className="text-sm text-slate-300 leading-relaxed flex items-start font-sans">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-brand-cyan/70 mt-2 mr-3 shrink-0" />
                        <span>{hl}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          )}

          {/* Certifications Section (Right) */}
          {hasCert && (
            <div className={`${hasEdu ? 'lg:col-span-5' : 'lg:col-span-12'} space-y-6`}>
              <h3 className="text-xl font-bold text-slate-350 flex items-center gap-2 mb-4 pl-1 font-sans">
                <Award className="w-5 h-5 text-brand-cyan" />
                <span>Certifications</span>
              </h3>

              <div className="space-y-4">
                {certificationsList.map((cert, index) => (
                  <motion.div
                    key={cert._id || index}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-100px' }}
                    variants={cardVariants}
                    className="p-6 rounded-xl glass border border-slate-800/80 hover:border-slate-700/80 transition-colors flex items-start space-x-4"
                  >
                    <div className="w-10 h-10 rounded-xl bg-slate-900/90 flex items-center justify-center border border-slate-800 shadow-md shrink-0">
                      <Award className="w-5 h-5 text-brand-cyan" />
                    </div>

                    <div>
                      <h4 className="text-sm sm:text-base font-bold text-slate-100 leading-tight mb-1 font-sans">
                        {cert.title}
                      </h4>
                      <p className="text-xs text-brand-indigo font-medium font-sans">
                        {cert.issuer}
                      </p>
                      <div className="flex items-center space-x-3 mt-3 text-[11px] text-slate-400 font-sans">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {cert.date}
                        </span>
                        {cert.credentialId && (
                          <>
                            <span>•</span>
                            <span>ID: {cert.credentialId}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </section>
  );
}
