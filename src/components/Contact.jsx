import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, MapPin, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { Github, Linkedin } from './Icons';

export default function Contact({ data }) {
  const emailVal = data?.socials?.email || 'alexcarter.dev@gmail.com';
  const locationVal = data?.location || 'San Francisco Bay Area, CA';
  const githubVal = data?.socials?.github || 'https://github.com';
  const linkedinVal = data?.socials?.linkedin || 'https://linkedin.com';
  const nameVal = data?.name || 'Alex Carter';

  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' or 'error'
  const [submitError, setSubmitError] = useState('');

  const validate = () => {
    let tempErrors = {};
    if (!formData.name.trim()) tempErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      tempErrors.email = 'Email is required';
    } else if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(formData.email.trim().toLowerCase())) {
      tempErrors.email = 'Please enter a valid Gmail address (@gmail.com)';
    }
    if (!formData.message.trim()) {
      tempErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      tempErrors.message = 'Message must be at least 10 characters';
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear field-specific error as they type
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitStatus(null);
    setSubmitError('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', message: '' });
        setSubmitError('');
      } else {
        const data = await response.json().catch(() => ({}));
        setSubmitError(data.message || 'An error occurred while sending your message.');
        setSubmitStatus('error');
      }
    } catch (err) {
      console.error('Contact submission error:', err);
      setSubmitError('Could not reach the server. Please check your connection or try again later.');
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 relative">
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
            Get In Touch
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          
          {/* Left panel: Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 flex flex-col justify-between"
          >
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-white font-sans">
                Let's discuss a project or role!
              </h3>
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed font-sans">
                Whether you have an open junior position, a freelance project, or just want to chat about frontend architectures, feel free to drop me a message. I usually respond within 24 hours.
              </p>

              {/* Direct Info list */}
              <div className="space-y-6 pt-6">
                <div className="flex items-center space-x-4">
                  <div className="w-11 h-11 rounded-xl bg-slate-900/90 flex items-center justify-center border border-slate-800 shadow-md">
                    <Mail className="w-5 h-5 text-brand-indigo" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider font-sans">Email Me</h4>
                    <a href={`mailto:${emailVal}`} className="text-sm sm:text-base font-semibold text-slate-200 hover:text-brand-cyan transition-colors">
                      {emailVal}
                    </a>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-11 h-11 rounded-xl bg-slate-900/90 flex items-center justify-center border border-slate-800 shadow-md">
                    <MapPin className="w-5 h-5 text-brand-cyan" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider font-sans">Location</h4>
                    <span className="text-sm sm:text-base font-semibold text-slate-200">
                      {locationVal}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Resume button & socials */}
            <div className="pt-10 lg:pt-0">
              <div className="flex items-center space-x-4 mb-4">
                <a
                  href={githubVal}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 rounded-xl glass hover:bg-slate-900/80 hover:text-brand-cyan hover:scale-105 transition-all text-slate-400 cursor-pointer"
                  aria-label="GitHub"
                >
                  <Github className="w-5 h-5" />
                </a>
                <a
                  href={linkedinVal}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 rounded-xl glass hover:bg-slate-900/80 hover:text-brand-indigo hover:scale-105 transition-all text-slate-400 cursor-pointer"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
              <p className="text-xs text-slate-500 font-sans">
                © {new Date().getFullYear()} {nameVal}. All rights reserved.
              </p>
            </div>
          </motion.div>

          {/* Right panel: Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7"
          >
            <div className="p-8 rounded-2xl glass border border-slate-800/80 h-full flex flex-col justify-center">
              <AnimatePresence mode="wait">
                {submitStatus === 'success' ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col items-center justify-center text-center py-12 space-y-4"
                  >
                    <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-2">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-bold text-white font-sans">Message Sent!</h3>
                    <p className="text-slate-400 text-sm max-w-sm font-sans">
                      Thank you for reaching out! Your message has been saved to the database. I will review it and get back to you as soon as possible.
                    </p>
                    <button
                      onClick={() => setSubmitStatus(null)}
                      className="mt-6 px-6 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white glass hover:bg-slate-900/80 transition-all cursor-pointer"
                    >
                      Send Another Message
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    className="space-y-6"
                    noValidate
                  >
                    {submitStatus === 'error' && (
                      <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs sm:text-sm flex items-start gap-2.5 font-sans">
                        <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold">Failed to submit message</p>
                          <p className="text-[11px] text-red-400/80 mt-0.5">{submitError}</p>
                        </div>
                      </div>
                    )}

                    {/* Name */}
                    <div>
                      <label htmlFor="name" className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 font-sans">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 rounded-xl bg-slate-950/80 border text-slate-100 text-sm focus:outline-none focus:border-brand-indigo transition-colors font-sans ${
                          errors.name ? 'border-red-500/60' : 'border-slate-800'
                        }`}
                        placeholder="John Doe"
                      />
                      {errors.name && (
                        <p className="mt-2 text-xs text-red-400 flex items-center gap-1 font-sans">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>{errors.name}</span>
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="email" className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 font-sans">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 rounded-xl bg-slate-950/80 border text-slate-100 text-sm focus:outline-none focus:border-brand-indigo transition-colors font-sans ${
                          errors.email ? 'border-red-500/60' : 'border-slate-800'
                        }`}
                        placeholder="john@gmail.com"
                      />
                      {errors.email && (
                        <p className="mt-2 text-xs text-red-400 flex items-center gap-1 font-sans">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>{errors.email}</span>
                        </p>
                      )}
                    </div>

                    {/* Message */}
                    <div>
                      <label htmlFor="message" className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 font-sans">
                        Your Message
                      </label>
                      <textarea
                        name="message"
                        id="message"
                        rows="5"
                        value={formData.message}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 rounded-xl bg-slate-950/80 border text-slate-100 text-sm focus:outline-none focus:border-brand-indigo transition-colors font-sans resize-none ${
                          errors.message ? 'border-red-500/60' : 'border-slate-800'
                        }`}
                        placeholder="Hi Alex, I'd love to chat about a front-end position..."
                      />
                      {errors.message && (
                        <p className="mt-2 text-xs text-red-400 flex items-center gap-1 font-sans">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>{errors.message}</span>
                        </p>
                      )}
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full px-6 py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-brand-indigo to-brand-purple hover:from-brand-indigo hover:to-brand-cyan shadow-lg shadow-brand-indigo/25 hover:shadow-brand-cyan/25 hover:scale-101 transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin mr-2" />
                          <span>Sending Message...</span>
                        </>
                      ) : (
                        <>
                          <span>Send Message</span>
                          <Send className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
