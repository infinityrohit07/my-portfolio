import React from 'react';
import { motion } from 'framer-motion';
import { Quote, Star } from 'lucide-react';

export default function Testimonials({ data = [] }) {
  if (!data || data.length === 0) return null;

  // Helper to extract initials from reviewer name
  const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  // Helper to pick a unique gradient based on reviewer name
  const getGradient = (name) => {
    const gradients = [
      'from-blue-500 to-indigo-600',
      'from-purple-500 to-pink-600',
      'from-cyan-400 to-blue-600',
      'from-teal-400 to-emerald-600',
      'from-amber-400 to-orange-600'
    ];
    let sum = 0;
    for (let i = 0; i < (name || '').length; i++) {
      sum += name.charCodeAt(i);
    }
    return gradients[sum % gradients.length];
  };

  return (
    <section id="testimonials" className="relative py-24 px-6 overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-80 h-80 rounded-full bg-brand-indigo/5 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-96 h-96 rounded-full bg-brand-cyan/5 blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Section Heading */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-xs font-bold text-brand-cyan uppercase tracking-widest bg-brand-cyan/10 px-3 py-1.5 rounded-full border border-brand-cyan/20 font-sans">
              Recommendations
            </span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-3xl sm:text-4xl font-extrabold text-white mt-4 tracking-tight font-sans"
          >
            Client & Teammate Testimonials
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-slate-400 mt-4 max-w-xl mx-auto text-sm sm:text-base leading-relaxed font-sans"
          >
            Here is what colleagues and project managers say about working with me on web interfaces and systems.
          </motion.p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 justify-center">
          {data.map((item, index) => {
            const hasAvatar = item.avatarUrl && item.avatarUrl.trim() !== '';
            const initials = getInitials(item.name);
            const gradient = getGradient(item.name);

            return (
              <motion.div
                key={item._id || index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="group relative rounded-2xl bg-slate-900/40 border border-slate-800 p-6 sm:p-8 hover:border-brand-indigo/35 hover:bg-slate-900/60 transition-all duration-300 shadow-xl flex flex-col justify-between"
              >
                {/* Decorative Quotes & Glow */}
                <div className="absolute top-6 right-6 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity pointer-events-none">
                  <Quote className="w-24 h-24 text-white" />
                </div>
                <div className="absolute -inset-[1px] bg-gradient-to-r from-brand-indigo/0 via-brand-cyan/0 to-brand-cyan/0 rounded-2xl group-hover:from-brand-indigo/10 group-hover:via-brand-cyan/10 group-hover:to-brand-indigo/5 transition-all duration-500 -z-10 pointer-events-none" />

                <div>
                  {/* Stars Rating */}
                  <div className="flex items-center space-x-1 mb-5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < (item.rating || 5)
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-700'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Testimonial Text */}
                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed italic mb-6 font-sans relative z-10">
                    "{item.text}"
                  </p>
                </div>

                {/* Reviewer Details */}
                <div className="flex items-center space-x-4 border-t border-slate-950 pt-5 mt-auto">
                  {hasAvatar ? (
                    <img
                      src={item.avatarUrl}
                      alt={item.name}
                      className="w-12 h-12 rounded-full object-cover border border-slate-750 bg-slate-950"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  
                  {/* Initials Fallback (visible if image fails or not provided) */}
                  <div
                    style={{ display: hasAvatar ? 'none' : 'flex' }}
                    className={`w-12 h-12 rounded-full bg-gradient-to-br ${gradient} items-center justify-center text-white text-sm font-bold tracking-wider shadow-md`}
                  >
                    {initials}
                  </div>

                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-white font-sans">
                      {item.name}
                    </h4>
                    <p className="text-xs text-slate-400 font-sans">
                      {item.role} at <span className="text-brand-cyan font-semibold">{item.company}</span>
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
