import React, { useState, useEffect } from 'react';
import { Menu, X, Code2, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { name: 'Home', id: 'hero' },
  { name: 'About', id: 'about' },
  { name: 'Skills', id: 'skills' },
  { name: 'Projects', id: 'projects' },
  { name: 'Experience', id: 'experience' },
  { name: 'Education', id: 'education' },
  { name: 'Testimonials', id: 'testimonials' },
  { name: 'Contact', id: 'contact' },
];

export default function Navbar({ brandName = 'Alex Carter', hasSkills = true, hasProjects = true, hasExperience = true, hasEducation = true, hasTestimonials = true, resumeUrl = '' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [scrolled, setScrolled] = useState(false);

  const logoNameParts = brandName.trim().split(' ');
  const firstName = logoNameParts[0] || 'Alex';
  const lastName = logoNameParts.slice(1).join(' ') || 'Carter';

  const visibleLinks = navLinks.filter(link => {
    if (link.id === 'skills') return hasSkills;
    if (link.id === 'projects') return hasProjects;
    if (link.id === 'experience') return hasExperience;
    if (link.id === 'education') return hasEducation;
    if (link.id === 'testimonials') return hasTestimonials;
    return true;
  });

  useEffect(() => {
    const handleScroll = () => {
      // Background blur opacity when scrolling down
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      // Determine active section based on scroll position
      const scrollPosition = window.scrollY + 120; // offset for nav height

      for (const link of visibleLinks) {
        const el = document.getElementById(link.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(link.id);
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // run once on mount

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (id) => {
    setIsOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // navbar height offset
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

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'glass-nav py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo / Brand */}
          <div 
            onClick={() => handleLinkClick('hero')} 
            className="flex items-center space-x-2 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-indigo to-brand-cyan flex items-center justify-center text-white shadow-lg shadow-brand-indigo/20 group-hover:scale-105 transition-transform duration-300">
              <Code2 className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white font-sans">
              {firstName}<span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-indigo to-brand-cyan"> {lastName}</span>
            </span>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-1">
            {visibleLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className={`relative px-4 py-2 text-sm font-medium tracking-wide rounded-lg transition-colors duration-300 font-sans cursor-pointer ${
                  activeSection === link.id ? 'text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {link.name}
                {activeSection === link.id && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute bottom-1 left-4 right-4 h-0.5 bg-gradient-to-r from-brand-indigo to-brand-cyan rounded-full"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            ))}

            {resumeUrl && (
              <a
                href={resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 ml-2 text-xs font-semibold text-brand-cyan hover:text-white border border-brand-cyan/25 hover:border-brand-cyan/80 bg-brand-cyan/5 hover:bg-brand-cyan/10 rounded-lg transition-all flex items-center gap-1 cursor-pointer font-sans"
              >
                <span>Resume</span>
              </a>
            )}

            {/* CMS Dashboard Link */}
            <Link
              to="/admin"
              className="p-2 ml-2 rounded-lg text-slate-400 hover:text-brand-cyan hover:bg-slate-900/60 transition-all cursor-pointer"
              title="CMS Admin Dashboard"
            >
              <Lock className="w-4.5 h-4.5" />
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900/60 focus:outline-none cursor-pointer"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="md:hidden glass-nav border-t border-slate-900 overflow-hidden"
          >
            <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
              {visibleLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link.id)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-base font-medium transition-colors duration-250 cursor-pointer ${
                    activeSection === link.id
                      ? 'bg-gradient-to-r from-brand-indigo/15 to-brand-cyan/15 text-white border-l-2 border-brand-indigo'
                      : 'text-slate-400 hover:bg-slate-900/55 hover:text-white'
                  }`}
                >
                  {link.name}
                </button>
              ))}

              {resumeUrl && (
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full text-left px-4 py-3 rounded-xl text-base font-medium text-brand-cyan hover:bg-slate-900/55 transition-colors flex items-center gap-2 cursor-pointer font-sans"
                >
                  <span>View Resume</span>
                </a>
              )}

              <Link
                to="/admin"
                onClick={() => setIsOpen(false)}
                className="w-full text-left px-4 py-3 rounded-xl text-base font-medium text-slate-400 hover:bg-slate-905 hover:text-brand-cyan transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Lock className="w-4 h-4" />
                <span>Admin CMS</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
