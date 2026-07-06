import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { ArrowUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Component Imports
import Starfield from './components/Starfield';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Experience from './components/Experience';
import Education from './components/Education';
import Contact from './components/Contact';
import Testimonials from './components/Testimonials';
import AdminPanel from './components/AdminPanel';

import { DEFAULT_PORTFOLIO_DATA } from './dataFallback';

function PortfolioView({ data, loading }) {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl + Shift + A
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        navigate('/admin');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-slate-300">
        <div className="w-12 h-12 rounded-full border-4 border-slate-800 border-t-brand-cyan animate-spin mb-4" />
        <span className="text-sm font-semibold tracking-wider font-sans">LOADING PORTFOLIO...</span>
      </div>
    );
  }

  const { profile = {}, projects = [], experiences = [], educations = [], certifications = [], testimonials = [] } = data;

  return (
    <>
      {/* Floating Header */}
      <Navbar 
        brandName={profile?.hero?.name}
        hasSkills={profile?.skills?.categories && profile.skills.categories.length > 0}
        hasProjects={projects && projects.length > 0}
        hasExperience={experiences && experiences.length > 0}
        hasEducation={(educations && educations.length > 0) || (certifications && certifications.length > 0)}
        hasTestimonials={testimonials && testimonials.length > 0}
        resumeUrl={profile?.hero?.resumeUrl}
      />

      {/* Main Container */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Hero data={profile?.hero} />
        <About data={profile?.about} />
        <Skills data={profile?.skills} />
        <Projects data={projects} />
        <Experience data={experiences} />
        <Education educationsData={educations} certificationsData={certifications} />
        <Testimonials data={testimonials} />
        <Contact data={profile?.hero} />
      </main>

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.2 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 p-3.5 rounded-xl glass hover:bg-slate-900 text-brand-cyan hover:text-white border-slate-800 shadow-lg shadow-black/45 hover:scale-105 hover:-translate-y-1 transition-all z-50 cursor-pointer"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}

export default function App() {
  const [data, setData] = useState(DEFAULT_PORTFOLIO_DATA);
  const [loading, setLoading] = useState(true);

  const fetchPortfolioData = async () => {
    try {
      const response = await fetch('/api/portfolio');
      if (response.ok) {
        const json = await response.json();
        setData(json);
      } else {
        console.warn("API response not ok. Using local fallback database.");
      }
    } catch (err) {
      console.warn("Could not load portfolio from API. Using local fallback database.", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolioData();
  }, []);

  useEffect(() => {
    if (data?.profile?.hero?.name) {
      document.title = `${data.profile.hero.name} | Frontend Engineer`;
    }
  }, [data]);

  return (
    <Router>
      {/* Background Starfield */}
      <Starfield />

      {/* Content Wrapper */}
      <div className="relative z-10 min-h-screen font-sans text-slate-100 overflow-x-hidden selection:bg-brand-indigo/35 selection:text-white">
        <Routes>
          <Route path="/" element={<PortfolioView data={data} loading={loading} />} />
          <Route path="/admin" element={<AdminPanel onUpdate={fetchPortfolioData} />} />
        </Routes>
      </div>
    </Router>
  );
}
