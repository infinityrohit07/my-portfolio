import React, { useState, useEffect } from 'react';
import { 
  Lock, User, LogOut, Save, Plus, Trash2, Edit2, 
  Check, X, Mail, Settings, Briefcase, GraduationCap, 
  Award, Braces, Layers, Terminal, Compass, Eye, EyeOff, AlertCircle,
  MessageSquare, Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminPanel({ onUpdate }) {
  const [token, setToken] = useState(localStorage.getItem('adminToken') || '');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Password Visibility States
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Dashboard states
  const [activeTab, setActiveTab] = useState('hero');
  const [portfolioData, setPortfolioData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' }); // 'success' or 'error'

  // Edit Forms States
  const [heroForm, setHeroForm] = useState({ statusText: '', greeting: '', name: '', subtitle: '', description: '', location: '', resumeUrl: '', socials: { github: '', linkedin: '', twitter: '', email: '' } });
  const [aboutForm, setAboutForm] = useState({ title: '', bioLines: '', traits: [] });
  const [skillsForm, setSkillsForm] = useState({ categories: [], learningSummary: '' });
  
  // CRUD Item states
  const [editingProject, setEditingProject] = useState(null); // { _id, title, ... } or 'new'
  const [projectForm, setProjectForm] = useState({ title: '', description: '', tech: '', github: '', live: '', iconName: 'Compass', color: 'from-blue-500/20 to-indigo-500/20' });

  const [editingExperience, setEditingExperience] = useState(null); // { _id, ... } or 'new'
  const [experienceForm, setExperienceForm] = useState({ role: '', company: '', duration: '', iconName: 'Briefcase', bullets: '', tech: '' });

  const [isUploadingResume, setIsUploadingResume] = useState(false);

  const [editingEducation, setEditingEducation] = useState(null);
  const [educationForm, setEducationForm] = useState({ degree: '', institution: '', duration: '', gpa: '', highlights: '' });

  const [editingCertification, setEditingCertification] = useState(null);
  const [certificationForm, setCertificationForm] = useState({ title: '', issuer: '', date: '', credentialId: '' });

  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [testimonialForm, setTestimonialForm] = useState({ name: '', role: '', company: '', text: '', avatarUrl: '', rating: 5 });

  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

  // Load Data if token is active
  useEffect(() => {
    if (token) {
      fetchAdminData();
    }
  }, [token]);

  const fetchAdminData = async () => {
    try {
      // Fetch portfolio data
      const resData = await fetch('/api/portfolio');
      if (resData.ok) {
        const data = await resData.json();
        setPortfolioData(data);
        
        // Populate static forms
        if (data.profile) {
          setHeroForm({
            statusText: data.profile.hero?.statusText || '',
            greeting: data.profile.hero?.greeting || '',
            name: data.profile.hero?.name || '',
            subtitle: data.profile.hero?.subtitle || '',
            description: data.profile.hero?.description || '',
            location: data.profile.hero?.location || '',
            resumeUrl: data.profile.hero?.resumeUrl || '',
            socials: {
              github: data.profile.hero?.socials?.github || '',
              linkedin: data.profile.hero?.socials?.linkedin || '',
              twitter: data.profile.hero?.socials?.twitter || '',
              email: data.profile.hero?.socials?.email || ''
            }
          });

          setAboutForm({
            title: data.profile.about?.title || '',
            bioLines: (data.profile.about?.bioLines || []).join('\n\n'),
            traits: data.profile.about?.traits || []
          });

          setSkillsForm({
            categories: data.profile.skills?.categories || [],
            learningSummary: data.profile.skills?.learningSummary || ''
          });
        }
      }

      // Fetch messages
      const resMsg = await fetch('/api/messages', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (resMsg.ok) {
        const msgs = await resMsg.json();
        setMessages(msgs);
      } else if (resMsg.status === 401) {
        handleLogout();
      }
    } catch (err) {
      console.error("Error fetching admin data:", err);
    }
  };

  const showStatus = (type, text) => {
    setStatusMsg({ type, text });
    setTimeout(() => setStatusMsg({ type: '', text: '' }), 5000);
  };

  // Login handler
  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('adminToken', data.token);
        setToken(data.token);
        setUsername('');
        setPassword('');
      } else {
        setAuthError(data.message || 'Login failed. Please try again.');
      }
    } catch (err) {
      setAuthError('Connection error. Is the server running?');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setToken('');
    setPortfolioData(null);
  };

  // Safe fetch helper for authenticated requests
  const apiCall = async (url, method, bodyObj) => {
    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(bodyObj)
      });
      
      if (response.status === 401) {
        handleLogout();
        return { error: 'Session expired. Please log in again.' };
      }
      
      const data = await response.json();
      if (response.ok) {
        return { data };
      } else {
        return { error: data.message || 'Action failed' };
      }
    } catch (err) {
      return { error: 'Network error. Please try again.' };
    }
  };

  // --- SUBMISSIONS ---

  // Update Hero Section
  const handleHeroSubmit = async (e) => {
    e.preventDefault();
    const res = await apiCall('/api/portfolio/hero', 'PUT', heroForm);
    if (res.error) {
      showStatus('error', res.error);
    } else {
      showStatus('success', 'Hero details updated successfully!');
      onUpdate(); // update front-end state
    }
  };

  // Upload Resume to Cloudinary
  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      showStatus('error', 'Please upload a PDF file only.');
      return;
    }

    setIsUploadingResume(true);
    const formData = new FormData();
    formData.append('resume', file);

    try {
      const response = await fetch('/api/portfolio/resume', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const resData = await response.json();
      if (response.ok) {
        showStatus('success', 'Resume uploaded to Cloudinary successfully!');
        setHeroForm(prev => ({ ...prev, resumeUrl: resData.resumeUrl }));
        onUpdate();
      } else {
        showStatus('error', resData.message || 'Resume upload failed');
      }
    } catch (err) {
      showStatus('error', 'Network error during resume upload.');
    } finally {
      setIsUploadingResume(false);
      e.target.value = '';
    }
  };

  // Update About Section
  const handleAboutSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      title: aboutForm.title,
      bioLines: aboutForm.bioLines.split('\n\n').filter(l => l.trim() !== ''),
      traits: aboutForm.traits
    };
    const res = await apiCall('/api/portfolio/about', 'PUT', payload);
    if (res.error) {
      showStatus('error', res.error);
    } else {
      showStatus('success', 'About details updated successfully!');
      onUpdate();
    }
  };

  // Update Skills categories
  const handleSkillsSubmit = async (e) => {
    e.preventDefault();
    const res = await apiCall('/api/portfolio/skills', 'PUT', skillsForm);
    if (res.error) {
      showStatus('error', res.error);
    } else {
      showStatus('success', 'Skills catalog updated successfully!');
      onUpdate();
    }
  };

  // Edit Skills categories items
  const handleSkillItemChange = (catIndex, val) => {
    const updated = { ...skillsForm };
    updated.categories[catIndex].skills = val.split(',').map(s => s.trim()).filter(s => s !== '');
    setSkillsForm(updated);
  };

  const addSkillCategory = () => {
    const updated = { ...skillsForm };
    updated.categories.push({ title: 'New Category', iconName: 'Compass', skills: [] });
    setSkillsForm(updated);
  };

  const removeSkillCategory = (catIndex) => {
    const updated = { ...skillsForm };
    updated.categories.splice(catIndex, 1);
    setSkillsForm(updated);
  };

  // Projects CRUD
  const saveProject = async (e) => {
    e.preventDefault();
    const payload = {
      ...projectForm,
      tech: projectForm.tech.split(',').map(t => t.trim()).filter(t => t !== '')
    };

    let url = '/api/projects';
    let method = 'POST';

    if (editingProject && editingProject !== 'new') {
      url = `/api/projects/${editingProject._id}`;
      method = 'PUT';
    }

    const res = await apiCall(url, method, payload);
    if (res.error) {
      showStatus('error', res.error);
    } else {
      showStatus('success', `Project ${method === 'POST' ? 'added' : 'updated'} successfully!`);
      setEditingProject(null);
      fetchAdminData();
      onUpdate();
    }
  };

  const deleteProject = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    const res = await apiCall(`/api/projects/${id}`, 'DELETE');
    if (res.error) {
      showStatus('error', res.error);
    } else {
      showStatus('success', 'Project deleted successfully!');
      fetchAdminData();
      onUpdate();
    }
  };

  // Experience CRUD
  const saveExperience = async (e) => {
    e.preventDefault();
    const payload = {
      ...experienceForm,
      bullets: experienceForm.bullets.split('\n').filter(b => b.trim() !== ''),
      tech: experienceForm.tech.split(',').map(t => t.trim()).filter(t => t !== '')
    };

    let url = '/api/experience';
    let method = 'POST';

    if (editingExperience && editingExperience !== 'new') {
      url = `/api/experience/${editingExperience._id}`;
      method = 'PUT';
    }

    const res = await apiCall(url, method, payload);
    if (res.error) {
      showStatus('error', res.error);
    } else {
      showStatus('success', `Experience ${method === 'POST' ? 'added' : 'updated'} successfully!`);
      setEditingExperience(null);
      fetchAdminData();
      onUpdate();
    }
  };

  const deleteExperience = async (id) => {
    if (!window.confirm('Are you sure you want to delete this experience entry?')) return;
    const res = await apiCall(`/api/experience/${id}`, 'DELETE');
    if (res.error) {
      showStatus('error', res.error);
    } else {
      showStatus('success', 'Experience deleted successfully!');
      fetchAdminData();
      onUpdate();
    }
  };

  // Education CRUD
  const saveEducation = async (e) => {
    e.preventDefault();
    const payload = {
      ...educationForm,
      highlights: educationForm.highlights.split('\n').filter(h => h.trim() !== '')
    };

    let url = '/api/education';
    let method = 'POST';

    if (editingEducation && editingEducation !== 'new') {
      url = `/api/education/${editingEducation._id}`;
      method = 'PUT';
    }

    const res = await apiCall(url, method, payload);
    if (res.error) {
      showStatus('error', res.error);
    } else {
      showStatus('success', `Education degree ${method === 'POST' ? 'added' : 'updated'} successfully!`);
      setEditingEducation(null);
      fetchAdminData();
      onUpdate();
    }
  };

  const deleteEducation = async (id) => {
    if (!window.confirm('Delete this education entry?')) return;
    const res = await apiCall(`/api/education/${id}`, 'DELETE');
    if (res.error) {
      showStatus('error', res.error);
    } else {
      showStatus('success', 'Education entry deleted successfully!');
      fetchAdminData();
      onUpdate();
    }
  };

  // Certification CRUD
  const saveCertification = async (e) => {
    e.preventDefault();
    let url = '/api/certification';
    let method = 'POST';

    if (editingCertification && editingCertification !== 'new') {
      url = `/api/certification/${editingCertification._id}`;
      method = 'PUT';
    }

    const res = await apiCall(url, method, certificationForm);
    if (res.error) {
      showStatus('error', res.error);
    } else {
      showStatus('success', `Certification ${method === 'POST' ? 'added' : 'updated'} successfully!`);
      setEditingCertification(null);
      fetchAdminData();
      onUpdate();
    }
  };

  const deleteCertification = async (id) => {
    if (!window.confirm('Delete this certification?')) return;
    const res = await apiCall(`/api/certification/${id}`, 'DELETE');
    if (res.error) {
      showStatus('error', res.error);
    } else {
      showStatus('success', 'Certification deleted successfully!');
      fetchAdminData();
      onUpdate();
    }
  };

  // Testimonials CRUD
  const saveTestimonial = async (e) => {
    e.preventDefault();
    let url = '/api/testimonials';
    let method = 'POST';

    if (editingTestimonial && editingTestimonial !== 'new') {
      url = `/api/testimonials/${editingTestimonial._id}`;
      method = 'PUT';
    }

    const res = await apiCall(url, method, testimonialForm);
    if (res.error) {
      showStatus('error', res.error);
    } else {
      showStatus('success', `Testimonial ${method === 'POST' ? 'added' : 'updated'} successfully!`);
      setEditingTestimonial(null);
      fetchAdminData();
      onUpdate();
    }
  };

  const deleteTestimonial = async (id) => {
    if (!window.confirm('Delete this testimonial?')) return;
    const res = await apiCall(`/api/testimonials/${id}`, 'DELETE');
    if (res.error) {
      showStatus('error', res.error);
    } else {
      showStatus('success', 'Testimonial deleted successfully!');
      fetchAdminData();
      onUpdate();
    }
  };

  // Message Actions
  const toggleMessageRead = async (id, currentReadStatus) => {
    const res = await apiCall(`/api/messages/${id}/read`, 'PUT', { read: !currentReadStatus });
    if (res.error) {
      showStatus('error', res.error);
    } else {
      fetchAdminData();
    }
  };

  const deleteMessage = async (id) => {
    if (!window.confirm('Delete this message?')) return;
    const res = await apiCall(`/api/messages/${id}`, 'DELETE');
    if (res.error) {
      showStatus('error', res.error);
    } else {
      showStatus('success', 'Message deleted successfully!');
      fetchAdminData();
    }
  };

  // Security Settings
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showStatus('error', 'New passwords do not match');
      return;
    }

    const res = await apiCall('/api/auth/change-password', 'POST', {
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword
    });

    if (res.error) {
      showStatus('error', res.error);
    } else {
      showStatus('success', 'Password updated successfully!');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    }
  };

  // --- RENDERS ---

  // If not authenticated, show LOGIN
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-indigo/15 via-transparent to-brand-cyan/15 pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md p-8 rounded-2xl glass border border-slate-800 shadow-2xl relative z-10"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto mb-4 text-brand-cyan">
              <Lock className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-bold text-white font-sans">CMS Admin Login</h2>
            <p className="text-slate-400 text-xs mt-1.5 font-sans">Enter credentials to edit your portfolio</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {authError && (
              <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2 font-sans">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 font-sans">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-brand-indigo transition-colors font-sans"
                  placeholder="admin"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 font-sans">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
                <input
                  type={showLoginPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-brand-indigo transition-colors font-sans"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute right-3 top-3.5 text-slate-500 hover:text-slate-350 cursor-pointer"
                  title={showLoginPassword ? "Hide password" : "Show password"}
                >
                  {showLoginPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-6 py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-brand-indigo to-brand-purple hover:from-brand-indigo hover:to-brand-cyan shadow-lg shadow-brand-indigo/25 hover:shadow-brand-cyan/25 hover:scale-101 transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin mr-2" />
                  <span>Logging in...</span>
                </>
              ) : (
                <span>Log In Securely</span>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  // Dashboard Header
  const renderDashboardHeader = () => (
    <header className="flex flex-col sm:flex-row items-center justify-between border-b border-slate-800/80 pb-6 mb-8 gap-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white font-sans flex items-center gap-2.5">
          <Settings className="w-7 h-7 text-brand-cyan animate-spin-slow" />
          <span>Portfolio CMS Control</span>
          {portfolioData?.fallbackMode && (
            <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400">
              Fallback DB Mode
            </span>
          )}
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm mt-1 font-sans">Manage portfolio items and incoming messages</p>
      </div>
      <div className="flex items-center space-x-4">
        <a 
          href="/" 
          target="_blank" 
          className="px-4 py-2 rounded-xl border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white glass hover:bg-slate-900 transition-all font-sans cursor-pointer"
        >
          View Live Site
        </a>
        <button
          onClick={handleLogout}
          className="px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-xs font-bold text-red-400 flex items-center gap-1.5 transition-all font-sans cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );

  return (
    <div className="min-h-screen bg-slate-950/80 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        {renderDashboardHeader()}

        {/* Global Toast Alert */}
        <AnimatePresence>
          {statusMsg.text && (
            <motion.div
              initial={{ opacity: 0, y: -25, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -25, scale: 0.95 }}
              className={`fixed top-8 left-1/2 -translate-x-1/2 p-4 rounded-xl border z-50 text-sm font-semibold shadow-2xl flex items-center gap-2.5 font-sans ${
                statusMsg.type === 'success' 
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                  : 'bg-red-500/10 border-red-500/30 text-red-400'
              }`}
            >
              {statusMsg.type === 'success' ? <Check className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
              <span>{statusMsg.text}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Side Tabs (Left) */}
          <nav className="lg:col-span-3 flex flex-col space-y-2.5 rounded-2xl glass p-4 border border-slate-805">
            {[
              { id: 'hero', label: 'Hero Section', icon: <Compass className="w-4 h-4" /> },
              { id: 'about', label: 'About Info', icon: <User className="w-4 h-4" /> },
              { id: 'skills', label: 'Skills Grid', icon: <Braces className="w-4 h-4" /> },
              { id: 'projects', label: 'Projects (CRUD)', icon: <Layers className="w-4 h-4" /> },
              { id: 'experience', label: 'Experience (CRUD)', icon: <Briefcase className="w-4 h-4" /> },
              { id: 'education', label: 'Education & Certs', icon: <GraduationCap className="w-4 h-4" /> },
              { id: 'testimonials', label: 'Testimonials', icon: <MessageSquare className="w-4 h-4" /> },
              { id: 'messages', label: `Messages (${messages.filter(m => !m.read).length})`, icon: <Mail className="w-4 h-4" /> },
              { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> }
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`w-full px-4 py-3 rounded-xl text-left text-xs sm:text-sm font-semibold flex items-center space-x-3 transition-all cursor-pointer ${
                  activeTab === t.id 
                    ? 'bg-gradient-to-r from-brand-indigo/25 to-brand-cyan/25 border-l-4 border-brand-cyan text-white glass font-bold' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                {t.icon}
                <span>{t.label}</span>
              </button>
            ))}
          </nav>

          {/* Editor Panel (Right) */}
          <div className="lg:col-span-9 p-8 rounded-2xl glass border border-slate-800 shadow-xl min-h-[500px]">
            
            {/* TAB: HERO */}
            {activeTab === 'hero' && (
              <form onSubmit={handleHeroSubmit} className="space-y-6">
                <h3 className="text-xl font-bold text-white font-sans border-b border-slate-900 pb-3">Edit Hero Section</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 font-sans">Availability Status Text</label>
                    <input
                      type="text"
                      value={heroForm.statusText}
                      onChange={e => setHeroForm({ ...heroForm, statusText: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-brand-indigo transition-colors font-sans"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 font-sans">Greeting</label>
                    <input
                      type="text"
                      value={heroForm.greeting}
                      onChange={e => setHeroForm({ ...heroForm, greeting: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-brand-indigo transition-colors font-sans"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 font-sans">Name</label>
                  <input
                    type="text"
                    value={heroForm.name}
                    onChange={e => setHeroForm({ ...heroForm, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-brand-indigo transition-colors font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 font-sans">Location (displayed in Contact section)</label>
                  <input
                    type="text"
                    value={heroForm.location}
                    onChange={e => setHeroForm({ ...heroForm, location: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-brand-indigo transition-colors font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 font-sans">Subtitle Description</label>
                  <input
                    type="text"
                    value={heroForm.subtitle}
                    onChange={e => setHeroForm({ ...heroForm, subtitle: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-brand-indigo transition-colors font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 font-sans">Elevator Pitch Description</label>
                  <textarea
                    rows="3"
                    value={heroForm.description}
                    onChange={e => setHeroForm({ ...heroForm, description: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-brand-indigo transition-colors font-sans resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-slate-900 pt-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 font-sans">GitHub URL</label>
                    <input
                      type="text"
                      value={heroForm.socials.github}
                      onChange={e => setHeroForm({ ...heroForm, socials: { ...heroForm.socials, github: e.target.value } })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-brand-indigo transition-colors font-sans"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 font-sans">LinkedIn URL</label>
                    <input
                      type="text"
                      value={heroForm.socials.linkedin}
                      onChange={e => setHeroForm({ ...heroForm, socials: { ...heroForm.socials, linkedin: e.target.value } })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-brand-indigo transition-colors font-sans"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 font-sans">Twitter URL</label>
                    <input
                      type="text"
                      value={heroForm.socials.twitter}
                      onChange={e => setHeroForm({ ...heroForm, socials: { ...heroForm.socials, twitter: e.target.value } })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-brand-indigo transition-colors font-sans"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 font-sans">Email Address</label>
                    <input
                      type="email"
                      value={heroForm.socials.email}
                      onChange={e => setHeroForm({ ...heroForm, socials: { ...heroForm.socials, email: e.target.value } })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-brand-indigo transition-colors font-sans"
                    />
                  </div>
                </div>

                {/* Resume Upload / PDF Link */}
                <div className="border-t border-slate-900 pt-6">
                  <h4 className="text-sm font-bold text-slate-300 font-sans mb-4">Portfolio Resume / CV</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 font-sans">
                        Resume URL
                      </label>
                      <input
                        type="text"
                        value={heroForm.resumeUrl}
                        onChange={e => setHeroForm({ ...heroForm, resumeUrl: e.target.value })}
                        placeholder="Paste Google Drive/Dropbox link or upload a file"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-brand-indigo transition-colors font-sans"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 font-sans">
                        Upload New Resume (PDF)
                      </label>
                      <div className="flex items-center space-x-3">
                        <label className="flex-1 flex flex-col items-center justify-center px-4 py-2.5 bg-slate-950/80 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 rounded-xl cursor-pointer transition-all text-xs font-semibold font-sans">
                          <span>{isUploadingResume ? 'Uploading...' : 'Choose PDF File'}</span>
                          <input
                            type="file"
                            accept=".pdf,application/pdf"
                            onChange={handleResumeUpload}
                            disabled={isUploadingResume}
                            className="hidden"
                          />
                        </label>
                        {heroForm.resumeUrl && (
                          <a
                            href={heroForm.resumeUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="px-4 py-2.5 bg-brand-cyan/10 hover:bg-brand-cyan/20 border border-brand-cyan/20 hover:border-brand-cyan/40 text-brand-cyan rounded-xl text-xs font-semibold transition-all font-sans cursor-pointer flex items-center justify-center shrink-0"
                          >
                            Test Link
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-brand-indigo to-brand-purple hover:scale-103 shadow-lg shadow-brand-indigo/15 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Hero Section</span>
                </button>
              </form>
            )}

            {/* TAB: ABOUT */}
            {activeTab === 'about' && (
              <form onSubmit={handleAboutSubmit} className="space-y-6">
                <h3 className="text-xl font-bold text-white font-sans border-b border-slate-900 pb-3">Edit About Section</h3>
                
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 font-sans">About Section Header</label>
                  <input
                    type="text"
                    value={aboutForm.title}
                    onChange={e => setAboutForm({ ...aboutForm, title: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-brand-indigo transition-colors font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 font-sans">Biographical Paragraphs (Separate paragraphs with double enter)</label>
                  <textarea
                    rows="8"
                    value={aboutForm.bioLines}
                    onChange={e => setAboutForm({ ...aboutForm, bioLines: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-brand-indigo transition-colors font-sans font-mono"
                  />
                </div>

                <div className="border-t border-slate-900 pt-6">
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 font-sans">Core Traits (Values grid)</h4>
                  <div className="space-y-4">
                    {aboutForm.traits.map((trait, idx) => (
                      <div key={idx} className="p-4 rounded-xl bg-slate-950/60 border border-slate-900 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-brand-indigo">Trait #{idx + 1}</span>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = { ...aboutForm };
                              updated.traits.splice(idx, 1);
                              setAboutForm(updated);
                            }}
                            className="p-1 text-red-400 hover:text-red-300 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 font-sans">Icon (Lucide name)</label>
                            <input
                              type="text"
                              value={trait.iconName}
                              onChange={e => {
                                const updated = { ...aboutForm };
                                updated.traits[idx].iconName = e.target.value;
                                setAboutForm(updated);
                              }}
                              className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-850 text-slate-200 text-xs focus:outline-none focus:border-brand-indigo"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 font-sans">Title</label>
                            <input
                              type="text"
                              value={trait.title}
                              onChange={e => {
                                const updated = { ...aboutForm };
                                updated.traits[idx].title = e.target.value;
                                setAboutForm(updated);
                              }}
                              className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-850 text-slate-200 text-xs focus:outline-none"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 font-sans">Description</label>
                          <textarea
                            rows="2"
                            value={trait.description}
                            onChange={e => {
                              const updated = { ...aboutForm };
                              updated.traits[idx].description = e.target.value;
                              setAboutForm(updated);
                            }}
                            className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-850 text-slate-200 text-xs focus:outline-none resize-none"
                          />
                        </div>
                      </div>
                    ))}
                    
                    <button
                      type="button"
                      onClick={() => {
                        const updated = { ...aboutForm };
                        updated.traits.push({ iconName: 'Sparkles', title: 'New Trait', description: '' });
                        setAboutForm(updated);
                      }}
                      className="px-3.5 py-1.5 rounded-xl border border-slate-850 text-xs font-semibold text-slate-400 hover:text-slate-200 glass hover:bg-slate-900/80 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Trait Card</span>
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-brand-indigo to-brand-purple hover:scale-103 shadow-lg shadow-brand-indigo/15 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save About Section</span>
                </button>
              </form>
            )}

            {/* TAB: SKILLS */}
            {activeTab === 'skills' && (
              <form onSubmit={handleSkillsSubmit} className="space-y-6">
                <h3 className="text-xl font-bold text-white font-sans border-b border-slate-900 pb-3">Edit Skills Section</h3>
                
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 font-sans">Bottom Learning Summary Footer</label>
                  <input
                    type="text"
                    value={skillsForm.learningSummary}
                    onChange={e => setSkillsForm({ ...skillsForm, learningSummary: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-brand-indigo transition-colors font-sans"
                  />
                </div>

                <div className="space-y-6 border-t border-slate-900 pt-6">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider font-sans">Skill Categories</h4>
                    <button
                      type="button"
                      onClick={addSkillCategory}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold text-brand-cyan border border-brand-cyan/25 glass hover:bg-brand-cyan/5 transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Category</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {skillsForm.categories.map((cat, idx) => (
                      <div key={idx} className="p-5 rounded-xl bg-slate-950/60 border border-slate-900 space-y-4 relative">
                        <button
                          type="button"
                          onClick={() => removeSkillCategory(idx)}
                          className="absolute top-4 right-4 p-1.5 text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Category Title</label>
                            <input
                              type="text"
                              value={cat.title}
                              onChange={e => {
                                const updated = { ...skillsForm };
                                updated.categories[idx].title = e.target.value;
                                setSkillsForm(updated);
                              }}
                              className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-850 text-slate-200 text-xs focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Lucide Icon name</label>
                            <input
                              type="text"
                              value={cat.iconName}
                              onChange={e => {
                                const updated = { ...skillsForm };
                                updated.categories[idx].iconName = e.target.value;
                                setSkillsForm(updated);
                              }}
                              className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-850 text-slate-200 text-xs focus:outline-none"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                            Skills Names (Only names, separated by commas. No levels!)
                          </label>
                          <input
                            type="text"
                            value={cat.skills.join(', ')}
                            onChange={e => handleSkillItemChange(idx, e.target.value)}
                            placeholder="React, Next.js, Redux, Tailwind"
                            className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-850 text-slate-200 text-xs focus:outline-none"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-brand-indigo to-brand-purple hover:scale-103 shadow-lg shadow-brand-indigo/15 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Skills Grid</span>
                </button>
              </form>
            )}

            {/* TAB: PROJECTS CRUD */}
            {activeTab === 'projects' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                  <h3 className="text-xl font-bold text-white font-sans">Manage Projects</h3>
                  {!editingProject && (
                    <button
                      onClick={() => {
                        setProjectForm({ title: '', description: '', tech: '', github: '', live: '', iconName: 'Compass', color: 'from-blue-500/20 to-indigo-500/20' });
                        setEditingProject('new');
                      }}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-brand-indigo to-brand-purple hover:scale-102 shadow transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Project</span>
                    </button>
                  )}
                </div>

                {editingProject ? (
                  // Edit Form
                  <form onSubmit={saveProject} className="p-6 rounded-xl bg-slate-950/60 border border-slate-900 space-y-4">
                    <h4 className="text-sm font-bold text-slate-350">{editingProject === 'new' ? 'Add New Project' : `Edit: ${editingProject.title}`}</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Project Title</label>
                        <input
                          type="text"
                          required
                          value={projectForm.title}
                          onChange={e => setProjectForm({ ...projectForm, title: e.target.value })}
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-850 text-slate-200 text-xs focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Lucide Icon (e.g. Compass, BarChart3)</label>
                        <input
                          type="text"
                          required
                          value={projectForm.iconName}
                          onChange={e => setProjectForm({ ...projectForm, iconName: e.target.value })}
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-850 text-slate-200 text-xs focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Description</label>
                      <textarea
                        rows="3"
                        required
                        value={projectForm.description}
                        onChange={e => setProjectForm({ ...projectForm, description: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-850 text-slate-200 text-xs focus:outline-none resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Tech Stack Tags (Comma separated)</label>
                      <input
                        type="text"
                        required
                        value={projectForm.tech}
                        onChange={e => setProjectForm({ ...projectForm, tech: e.target.value })}
                        placeholder="React, Next.js, CSS Variables"
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-850 text-slate-200 text-xs focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">GitHub Repo URL</label>
                        <input
                          type="text"
                          value={projectForm.github}
                          onChange={e => setProjectForm({ ...projectForm, github: e.target.value })}
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-850 text-slate-200 text-xs focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Live Demo URL</label>
                        <input
                          type="text"
                          value={projectForm.live}
                          onChange={e => setProjectForm({ ...projectForm, live: e.target.value })}
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-850 text-slate-200 text-xs focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Card Background Gradient (Tailwind from-to)</label>
                      <input
                        type="text"
                        value={projectForm.color}
                        onChange={e => setProjectForm({ ...projectForm, color: e.target.value })}
                        placeholder="from-blue-500/20 to-indigo-500/20"
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-850 text-slate-200 text-xs focus:outline-none"
                      />
                    </div>

                    <div className="flex space-x-3 pt-2">
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-emerald-500 hover:bg-emerald-600 transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Save Project</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingProject(null)}
                        className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-400 border border-slate-800 hover:text-slate-200 transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Cancel</span>
                      </button>
                    </div>
                  </form>
                ) : (
                  // List Projects
                  <div className="space-y-3">
                    {portfolioData?.projects.map(p => (
                      <div key={p._id} className="p-4 rounded-xl bg-slate-950/60 border border-slate-900 flex items-center justify-between gap-4">
                        <div>
                          <h4 className="text-sm font-bold text-white">{p.title}</h4>
                          <p className="text-xs text-slate-400 mt-1 max-w-xl truncate">{p.description}</p>
                        </div>
                        <div className="flex space-x-2 shrink-0">
                          <button
                            onClick={() => {
                              setProjectForm({
                                title: p.title,
                                description: p.description,
                                tech: p.tech.join(', '),
                                github: p.github || '',
                                live: p.live || '',
                                iconName: p.iconName || 'Compass',
                                color: p.color || 'from-blue-500/20 to-indigo-500/20'
                              });
                              setEditingProject(p);
                            }}
                            className="p-1.5 text-brand-cyan hover:bg-brand-cyan/10 rounded-lg transition-all"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteProject(p._id)}
                            className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB: EXPERIENCE CRUD */}
            {activeTab === 'experience' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                  <h3 className="text-xl font-bold text-white font-sans">Manage Experience</h3>
                  {!editingExperience && (
                    <button
                      onClick={() => {
                        setExperienceForm({ role: '', company: '', duration: '', iconName: 'Briefcase', bullets: '', tech: '' });
                        setEditingExperience('new');
                      }}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-brand-indigo to-brand-purple hover:scale-102 shadow transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Experience</span>
                    </button>
                  )}
                </div>

                {editingExperience ? (
                  // Edit Form
                  <form onSubmit={saveExperience} className="p-6 rounded-xl bg-slate-950/60 border border-slate-900 space-y-4">
                    <h4 className="text-sm font-bold text-slate-350">{editingExperience === 'new' ? 'Add New Experience' : `Edit: ${editingExperience.role}`}</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Role / Job Title</label>
                        <input
                          type="text"
                          required
                          value={experienceForm.role}
                          onChange={e => setExperienceForm({ ...experienceForm, role: e.target.value })}
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-850 text-slate-200 text-xs focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Company / Organization</label>
                        <input
                          type="text"
                          required
                          value={experienceForm.company}
                          onChange={e => setExperienceForm({ ...experienceForm, company: e.target.value })}
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-850 text-slate-200 text-xs focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Duration (e.g. May 2026 - Present)</label>
                        <input
                          type="text"
                          required
                          value={experienceForm.duration}
                          onChange={e => setExperienceForm({ ...experienceForm, duration: e.target.value })}
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-850 text-slate-200 text-xs focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Lucide Icon (e.g. Briefcase, Globe)</label>
                        <input
                          type="text"
                          value={experienceForm.iconName}
                          onChange={e => setExperienceForm({ ...experienceForm, iconName: e.target.value })}
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-850 text-slate-200 text-xs focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Job Bullet Points (One per line)</label>
                      <textarea
                        rows="4"
                        required
                        value={experienceForm.bullets}
                        onChange={e => setExperienceForm({ ...experienceForm, bullets: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-850 text-slate-200 text-xs focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Technologies Used (Comma separated)</label>
                      <input
                        type="text"
                        value={experienceForm.tech}
                        onChange={e => setExperienceForm({ ...experienceForm, tech: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-850 text-slate-200 text-xs focus:outline-none"
                      />
                    </div>

                    <div className="flex space-x-3 pt-2">
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-emerald-500 hover:bg-emerald-600 transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Save Experience</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingExperience(null)}
                        className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-400 border border-slate-800 hover:text-slate-200 transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Cancel</span>
                      </button>
                    </div>
                  </form>
                ) : (
                  // List Experience
                  <div className="space-y-3">
                    {portfolioData?.experiences.map(e => (
                      <div key={e._id} className="p-4 rounded-xl bg-slate-950/60 border border-slate-900 flex items-center justify-between gap-4">
                        <div>
                          <h4 className="text-sm font-bold text-white">{e.role}</h4>
                          <p className="text-xs text-brand-indigo mt-0.5">{e.company} • {e.duration}</p>
                        </div>
                        <div className="flex space-x-2 shrink-0">
                          <button
                            onClick={() => {
                              setExperienceForm({
                                role: e.role,
                                company: e.company,
                                duration: e.duration,
                                iconName: e.iconName || 'Briefcase',
                                bullets: e.bullets.join('\n'),
                                tech: e.tech.join(', ')
                              });
                              setEditingExperience(e);
                            }}
                            className="p-1.5 text-brand-cyan hover:bg-brand-cyan/10 rounded-lg transition-all"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteExperience(e._id)}
                            className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB: EDUCATION & CERTS */}
            {activeTab === 'education' && (
              <div className="space-y-8">
                {/* 1. Academic Degrees */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                    <h3 className="text-xl font-bold text-white font-sans flex items-center gap-2">
                      <GraduationCap className="w-5 h-5 text-brand-indigo" />
                      <span>Academic Degrees</span>
                    </h3>
                    {!editingEducation && (
                      <button
                        onClick={() => {
                          setEducationForm({ degree: '', institution: '', duration: '', gpa: '', highlights: '' });
                          setEditingEducation('new');
                        }}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-brand-indigo to-brand-purple hover:scale-102 transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Degree</span>
                      </button>
                    )}
                  </div>

                  {editingEducation ? (
                    <form onSubmit={saveEducation} className="p-5 rounded-xl bg-slate-950/60 border border-slate-900 space-y-4">
                      <h4 className="text-xs font-bold text-slate-350">{editingEducation === 'new' ? 'Add New Degree' : 'Edit Degree'}</h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Degree Title</label>
                          <input
                            type="text" required
                            value={educationForm.degree}
                            onChange={e => setEducationForm({ ...educationForm, degree: e.target.value })}
                            className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-850 text-slate-200 text-xs focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Institution</label>
                          <input
                            type="text" required
                            value={educationForm.institution}
                            onChange={e => setEducationForm({ ...educationForm, institution: e.target.value })}
                            className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-850 text-slate-200 text-xs focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Duration (e.g. 2022 - 2026)</label>
                          <input
                            type="text" required
                            value={educationForm.duration}
                            onChange={e => setEducationForm({ ...educationForm, duration: e.target.value })}
                            className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-850 text-slate-200 text-xs focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">GPA (optional)</label>
                          <input
                            type="text"
                            value={educationForm.gpa}
                            onChange={e => setEducationForm({ ...educationForm, gpa: e.target.value })}
                            placeholder="3.8 / 4.0 GPA"
                            className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-850 text-slate-200 text-xs focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Highlights (One per line)</label>
                        <textarea
                          rows="3"
                          value={educationForm.highlights}
                          onChange={e => setEducationForm({ ...educationForm, highlights: e.target.value })}
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-850 text-slate-200 text-xs focus:outline-none"
                        />
                      </div>

                      <div className="flex space-x-3">
                        <button type="submit" className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-emerald-500 hover:bg-emerald-600 transition-colors flex items-center gap-1 cursor-pointer">
                          <Check className="w-3.5 h-3.5" />
                          <span>Save Degree</span>
                        </button>
                        <button type="button" onClick={() => setEditingEducation(null)} className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-400 border border-slate-800 transition-colors cursor-pointer">Cancel</button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-3">
                      {portfolioData?.educations.map(edu => (
                        <div key={edu._id} className="p-4 rounded-xl bg-slate-950/60 border border-slate-900 flex items-center justify-between gap-4">
                          <div>
                            <h4 className="text-sm font-bold text-white">{edu.degree}</h4>
                            <p className="text-xs text-slate-400 mt-0.5">{edu.institution} • {edu.duration}</p>
                          </div>
                          <div className="flex space-x-2 shrink-0">
                            <button
                              onClick={() => {
                                setEducationForm({
                                  degree: edu.degree,
                                  institution: edu.institution,
                                  duration: edu.duration,
                                  gpa: edu.gpa || '',
                                  highlights: edu.highlights.join('\n')
                                });
                                setEditingEducation(edu);
                              }}
                              className="p-1.5 text-brand-cyan hover:bg-brand-cyan/10 rounded-lg transition-all"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button onClick={() => deleteEducation(edu._id)} className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg transition-all">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 2. Certifications */}
                <div className="space-y-6 pt-6 border-t border-slate-900">
                  <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                    <h3 className="text-xl font-bold text-white font-sans flex items-center gap-2">
                      <Award className="w-5 h-5 text-brand-cyan" />
                      <span>Certifications</span>
                    </h3>
                    {!editingCertification && (
                      <button
                        onClick={() => {
                          setCertificationForm({ title: '', issuer: '', date: '', credentialId: '' });
                          setEditingCertification('new');
                        }}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-brand-indigo to-brand-purple hover:scale-102 transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Certification</span>
                      </button>
                    )}
                  </div>

                  {editingCertification ? (
                    <form onSubmit={saveCertification} className="p-5 rounded-xl bg-slate-950/60 border border-slate-900 space-y-4">
                      <h4 className="text-xs font-bold text-slate-350">{editingCertification === 'new' ? 'Add New Certificate' : 'Edit Certificate'}</h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Certificate Title</label>
                          <input
                            type="text" required
                            value={certificationForm.title}
                            onChange={e => setCertificationForm({ ...certificationForm, title: e.target.value })}
                            className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-850 text-slate-200 text-xs focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Issuer (e.g. Meta, Google, freeCodeCamp)</label>
                          <input
                            type="text" required
                            value={certificationForm.issuer}
                            onChange={e => setCertificationForm({ ...certificationForm, issuer: e.target.value })}
                            className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-850 text-slate-200 text-xs focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Date (e.g. Dec 2025)</label>
                          <input
                            type="text" required
                            value={certificationForm.date}
                            onChange={e => setCertificationForm({ ...certificationForm, date: e.target.value })}
                            className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-850 text-slate-200 text-xs focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Credential ID (optional)</label>
                          <input
                            type="text"
                            value={certificationForm.credentialId}
                            onChange={e => setCertificationForm({ ...certificationForm, credentialId: e.target.value })}
                            className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-850 text-slate-200 text-xs focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="flex space-x-3">
                        <button type="submit" className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-emerald-500 hover:bg-emerald-600 transition-colors flex items-center gap-1 cursor-pointer">
                          <Check className="w-3.5 h-3.5" />
                          <span>Save Certification</span>
                        </button>
                        <button type="button" onClick={() => setEditingCertification(null)} className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-400 border border-slate-800 transition-colors cursor-pointer">Cancel</button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-3">
                      {portfolioData?.certifications.map(cert => (
                        <div key={cert._id} className="p-4 rounded-xl bg-slate-950/60 border border-slate-900 flex items-center justify-between gap-4">
                          <div>
                            <h4 className="text-sm font-bold text-white">{cert.title}</h4>
                            <p className="text-xs text-brand-cyan mt-0.5">{cert.issuer} • {cert.date}</p>
                          </div>
                          <div className="flex space-x-2 shrink-0">
                            <button
                              onClick={() => {
                                setCertificationForm({
                                  title: cert.title,
                                  issuer: cert.issuer,
                                  date: cert.date,
                                  credentialId: cert.credentialId || ''
                                });
                                setEditingCertification(cert);
                              }}
                              className="p-1.5 text-brand-cyan hover:bg-brand-cyan/10 rounded-lg transition-all"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button onClick={() => deleteCertification(cert._id)} className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg transition-all">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB: TESTIMONIALS */}
            {activeTab === 'testimonials' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-slate-900 pb-3">
                  <h3 className="text-xl font-bold text-white font-sans">Manage Testimonials</h3>
                  {editingTestimonial === null && (
                    <button
                      onClick={() => {
                        setEditingTestimonial('new');
                        setTestimonialForm({ name: '', role: '', company: '', text: '', avatarUrl: '', rating: 5, order: portfolioData?.testimonials?.length || 0 });
                      }}
                      className="px-3 py-1.5 rounded-lg bg-brand-indigo/10 border border-brand-indigo/30 hover:border-brand-cyan text-brand-cyan hover:text-white transition-all text-xs font-semibold flex items-center gap-1.5 cursor-pointer font-sans"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Testimonial</span>
                    </button>
                  )}
                </div>

                {editingTestimonial !== null ? (
                  <form onSubmit={saveTestimonial} className="space-y-4 max-w-2xl bg-slate-900/20 p-6 rounded-xl border border-slate-900">
                    <h4 className="text-sm font-bold text-slate-350 uppercase tracking-widest mb-2 font-sans">
                      {editingTestimonial === 'new' ? 'Add New Testimonial' : 'Edit Testimonial'}
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 font-sans">Name</label>
                        <input
                          type="text"
                          required
                          value={testimonialForm.name}
                          onChange={e => setTestimonialForm({ ...testimonialForm, name: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-brand-indigo transition-colors font-sans"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 font-sans">Role / Title</label>
                        <input
                          type="text"
                          required
                          value={testimonialForm.role}
                          onChange={e => setTestimonialForm({ ...testimonialForm, role: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-brand-indigo transition-colors font-sans"
                          placeholder="e.g. Senior Software Engineer"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 font-sans">Company</label>
                        <input
                          type="text"
                          required
                          value={testimonialForm.company}
                          onChange={e => setTestimonialForm({ ...testimonialForm, company: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-brand-indigo transition-colors font-sans"
                          placeholder="e.g. Google"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 font-sans">Rating (1-5 Stars)</label>
                        <select
                          value={testimonialForm.rating}
                          onChange={e => setTestimonialForm({ ...testimonialForm, rating: parseInt(e.target.value) })}
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-brand-indigo transition-colors font-sans"
                        >
                          <option value={5}>5 Stars</option>
                          <option value={4}>4 Stars</option>
                          <option value={3}>3 Stars</option>
                          <option value={2}>2 Stars</option>
                          <option value={1}>1 Star</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 font-sans">Avatar URL (Optional, leave blank for Initials Fallback)</label>
                      <input
                        type="text"
                        value={testimonialForm.avatarUrl}
                        onChange={e => setTestimonialForm({ ...testimonialForm, avatarUrl: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-brand-indigo transition-colors font-sans"
                        placeholder="e.g. https://images.unsplash.com/photo-..."
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 font-sans">Testimonial Text</label>
                      <textarea
                        rows="4"
                        required
                        value={testimonialForm.text}
                        onChange={e => setTestimonialForm({ ...testimonialForm, text: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-brand-indigo transition-colors font-sans resize-none"
                        placeholder="Write testimonial message..."
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 font-sans">Display Order</label>
                      <input
                        type="number"
                        value={testimonialForm.order}
                        onChange={e => setTestimonialForm({ ...testimonialForm, order: parseInt(e.target.value) || 0 })}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-brand-indigo transition-colors font-sans"
                      />
                    </div>

                    <div className="flex items-center space-x-3 pt-2">
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-brand-indigo to-brand-purple hover:from-brand-indigo hover:to-brand-cyan text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-brand-indigo/15 hover:scale-102 cursor-pointer"
                      >
                        <Save className="w-4 h-4" />
                        <span>Save Testimonial</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingTestimonial(null)}
                        className="px-4 py-2 rounded-xl border border-slate-850 bg-slate-950 hover:bg-slate-900 text-slate-400 hover:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                        <span>Cancel</span>
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    {!portfolioData?.testimonials || portfolioData.testimonials.length === 0 ? (
                      <div className="py-12 text-center text-slate-500 border border-dashed border-slate-800 rounded-2xl font-sans">
                        No testimonials configured yet. Click "Add Testimonial" to create one.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {portfolioData.testimonials.map(testi => (
                          <div key={testi._id} className="p-5 rounded-xl bg-slate-950/80 border border-slate-900 flex flex-col justify-between hover:border-slate-800 transition-all">
                            <div>
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center space-x-1">
                                  {[...Array(5)].map((_, idx) => (
                                    <Star
                                      key={idx}
                                      className={`w-3.5 h-3.5 ${
                                        idx < (testi.rating || 5)
                                          ? 'text-amber-400 fill-amber-400'
                                          : 'text-slate-700'
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-[10px] text-slate-500 font-sans font-bold">Order: {testi.order}</span>
                              </div>
                              <p className="text-slate-300 text-xs italic line-clamp-3 mb-4 font-sans">
                                "{testi.text}"
                              </p>
                            </div>
                            <div className="flex items-center justify-between border-t border-slate-900/60 pt-4 mt-auto">
                              <div className="flex items-center space-x-2.5">
                                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-350 overflow-hidden uppercase">
                                  {testi.avatarUrl ? (
                                    <img src={testi.avatarUrl} className="w-full h-full object-cover" alt="" />
                                  ) : (
                                    <span>{testi.name.slice(0, 2).toUpperCase()}</span>
                                  )}
                                </div>
                                <div>
                                  <h5 className="text-xs font-bold text-white font-sans">{testi.name}</h5>
                                  <p className="text-[10px] text-slate-500 font-sans">{testi.role} at {testi.company}</p>
                                </div>
                              </div>
                              <div className="flex space-x-1">
                                <button
                                  onClick={() => {
                                    setEditingTestimonial(testi);
                                    setTestimonialForm({
                                      name: testi.name,
                                      role: testi.role,
                                      company: testi.company,
                                      text: testi.text,
                                      avatarUrl: testi.avatarUrl || '',
                                      rating: testi.rating || 5,
                                      order: testi.order || 0
                                    });
                                  }}
                                  className="p-1.5 text-brand-cyan hover:bg-brand-cyan/10 rounded-lg transition-all cursor-pointer"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => deleteTestimonial(testi._id)}
                                  className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg transition-all cursor-pointer"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* TAB: MESSAGES INBOX */}
            {activeTab === 'messages' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-white font-sans border-b border-slate-900 pb-3 flex items-center justify-between">
                  <span>Messages Inbox</span>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-brand-indigo/15 text-brand-cyan border border-brand-indigo/25">
                    {messages.length} Total Messages
                  </span>
                </h3>

                <div className="space-y-4">
                  {messages.length === 0 ? (
                    <div className="py-16 text-center text-slate-500 font-sans">
                      <Mail className="w-12 h-12 mx-auto mb-3 text-slate-650 opacity-40 animate-pulse" />
                      <p className="text-sm font-semibold">Your inbox is empty</p>
                      <p className="text-xs text-slate-600 mt-1">Contact form inquiries will appear here</p>
                    </div>
                  ) : (
                    messages.map(msg => (
                      <div 
                        key={msg._id} 
                        className={`p-6 rounded-xl border transition-all duration-300 ${
                          msg.read 
                            ? 'bg-slate-950/40 border-slate-900/60 opacity-75' 
                            : 'bg-slate-900/80 border-slate-800 shadow-md ring-1 ring-brand-cyan/10'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-bold text-white font-sans">{msg.name}</h4>
                              {!msg.read && (
                                <span className="text-[9px] uppercase font-black tracking-wider px-2 py-0.5 rounded-full bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/20">
                                  New
                                </span>
                              )}
                            </div>
                            <a href={`mailto:${msg.email}`} className="text-xs text-brand-indigo hover:text-brand-cyan transition-colors mt-0.5 block">
                              {msg.email}
                            </a>
                          </div>
                          <div className="flex items-center space-x-3.5">
                            <span className="text-[10px] text-slate-500">
                              {new Date(msg.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                            </span>
                            <div className="flex space-x-1">
                              <button
                                onClick={() => toggleMessageRead(msg._id, msg.read)}
                                className={`p-1.5 rounded-lg transition-all ${
                                  msg.read 
                                    ? 'text-slate-500 hover:text-slate-300 hover:bg-slate-800' 
                                    : 'text-brand-cyan hover:text-cyan-300 hover:bg-brand-cyan/10'
                                }`}
                                title={msg.read ? "Mark Unread" : "Mark Read"}
                              >
                                {msg.read ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                              <button
                                onClick={() => deleteMessage(msg._id)}
                                className="p-1.5 text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                                title="Delete message"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                        <p className="text-slate-350 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-sans bg-slate-950/60 p-4 rounded-lg border border-slate-900">
                          {msg.message}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* TAB: SETTINGS (SECURITY) */}
            {activeTab === 'settings' && (
              <form onSubmit={handlePasswordChange} className="space-y-6">
                <h3 className="text-xl font-bold text-white font-sans border-b border-slate-900 pb-3">Change Administrator Password</h3>
                
                <div className="max-w-md space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 font-sans">Current Password</label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? "text" : "password"}
                        required
                        value={passwordForm.currentPassword}
                        onChange={e => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                        className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-brand-indigo transition-colors font-sans"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-3 text-slate-500 hover:text-slate-350 cursor-pointer"
                        title={showCurrentPassword ? "Hide password" : "Show password"}
                      >
                        {showCurrentPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 font-sans">New Password</label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        required
                        value={passwordForm.newPassword}
                        onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                        className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-brand-indigo transition-colors font-sans"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-3 text-slate-500 hover:text-slate-350 cursor-pointer"
                        title={showNewPassword ? "Hide password" : "Show password"}
                      >
                        {showNewPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 font-sans">Confirm New Password</label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        value={passwordForm.confirmPassword}
                        onChange={e => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                        className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-brand-indigo transition-colors font-sans"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-3 text-slate-500 hover:text-slate-350 cursor-pointer"
                        title={showConfirmPassword ? "Hide password" : "Show password"}
                      >
                        {showConfirmPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-brand-indigo to-brand-purple hover:scale-103 shadow-lg shadow-brand-indigo/15 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Update Password</span>
                </button>
              </form>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
