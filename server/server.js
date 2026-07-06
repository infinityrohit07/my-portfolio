import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';

// Schemas
import User from './models/User.js';
import Profile from './models/Profile.js';
import Project from './models/Project.js';
import Experience from './models/Experience.js';
import Education from './models/Education.js';
import Certification from './models/Certification.js';
import Message from './models/Message.js';
import Testimonial from './models/Testimonial.js';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';

// Auth Middleware
import auth from './middleware/auth.js';

// Paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const FALLBACK_DB_PATH = path.join(__dirname, 'fallback_db.json');

dotenv.config({ path: path.join(__dirname, '.env') });

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_portfolio_key_for_admin_login_security_2026';

// Middleware
app.use(cors());
app.use(express.json());

// State
let isFallbackMode = false;

// Initialize Fallback DB if it doesn't exist
const initFallbackDb = () => {
  if (!fs.existsSync(FALLBACK_DB_PATH)) {
    // Generate default password hash
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync('admin123', salt);

    const defaultData = {
      users: [
        {
          _id: 'user_default',
          username: 'admin',
          password: hashedPassword
        }
      ],
      profile: {
        hero: {
          statusText: 'Available for Full-time Roles & Internships',
          greeting: "Hi, I'm",
          name: 'Alex Carter',
          subtitle: 'Frontend Engineer specializing in building beautiful, performant, and responsive web experiences.',
          description: 'A self-taught enthusiast and fresh graduate with solid fundamentals in JavaScript, React, and CSS architectures. Turning UI designs into semantic, accessible, and high-performance production code.',
          socials: {
            github: 'https://github.com',
            linkedin: 'https://linkedin.com',
            twitter: 'https://twitter.com',
            email: 'alexcarter.dev@gmail.com'
          },
          resumeUrl: ''
        },
        about: {
          title: 'A curious mind crafting digital interfaces.',
          bioLines: [
            "Hello! I'm Alex Carter, a fresh graduate in Computer Science who discovered a deep passion for the visual and interactive aspects of programming. I specialize in frontend engineering, blending analytical coding logic with the design considerations of a UI developer.",
            "My journey began building simple layouts, which quickly evolved into crafting complex client-side applications with modern frameworks. I focus on developing clean, modular component structures, state management architectures, and interactive components that bring websites to life.",
            "I am constantly learning new design systems and modern frameworks (like React, Tailwind, and Next.js) to stay at the cutting edge of modern web guidelines. My goal is to build web apps that are as beautiful under the hood as they are in the browser."
          ],
          traits: [
            { _id: 'trait_1', iconName: 'Code', title: 'Clean & Semantic HTML', description: 'I write highly readable, maintainable, and SEO-friendly semantic markup that forms a solid base for complex apps.' },
            { _id: 'trait_2', iconName: 'Zap', title: 'Performance Optimized', description: 'Minimizing render cycles, optimizing bundles, and maintaining smooth 60fps animations are core to my work.' },
            { _id: 'trait_3', iconName: 'Smartphone', title: 'Responsive Design', description: 'Providing a seamless, fluid experience across all screen sizes, from mobile screens to large desktop monitors.' },
            { _id: 'trait_4', iconName: 'Sparkles', title: 'Attention to Detail', description: 'Converting Figma mockups into pixel-perfect components, respecting grid structures, line heights, and micro-interactions.' }
          ]
        },
        skills: {
          categories: [
            { _id: 'skill_cat_1', title: 'Languages', iconName: 'Braces', skills: ['JavaScript (ES6+)', 'TypeScript', 'HTML5', 'CSS3', 'Python', 'SQL'] },
            { _id: 'skill_cat_2', title: 'Libraries & Frameworks', iconName: 'Layers', skills: ['React', 'Next.js', 'Redux Toolkit', 'Tailwind CSS', 'Express.js', 'Jest / React Testing Library'] },
            { _id: 'skill_cat_3', title: 'Tools & Ecosystem', iconName: 'Terminal', skills: ['Git & GitHub', 'Vite / Webpack', 'npm / Yarn', 'Postman', 'Chrome DevTools', 'Vercel / Netlify'] },
            { _id: 'skill_cat_4', title: 'Design & UI/UX Principles', iconName: 'Compass', skills: ['Figma', 'Responsive Web Design', 'Web Accessibility (a11y)', 'CSS Grid & Flexbox', 'Framer Motion', 'UI/UX Prototypes'] }
          ],
          learningSummary: 'Always learning. Current exploration: React Compiler & WebGPU.'
        }
      },
      projects: [
        {
          _id: 'proj_1',
          title: 'DevFlow Workspace',
          description: 'A productivity dashboard for developer teams featuring real-time project boards, task management, document sharing, and keyboard shortcut navigation.',
          tech: ['React', 'Redux Toolkit', 'Tailwind CSS', 'Framer Motion'],
          github: 'https://github.com',
          live: 'https://example.com',
          iconName: 'Compass',
          color: 'from-blue-500/20 to-indigo-500/20',
          borderColor: 'group-hover:border-brand-indigo/50',
          tagColor: 'bg-brand-indigo/10 text-brand-indigo border-brand-indigo/20',
          order: 0
        },
        {
          _id: 'proj_2',
          title: 'CryptoTracker Dashboard',
          description: 'Real-time cryptocurrency analytics tracking over 100+ tokens. Built with interactive price charting, portfolio simulations, and news aggregation.',
          tech: ['Next.js', 'Chart.js', 'Tailwind CSS', 'CoinGecko API'],
          github: 'https://github.com',
          live: 'https://example.com',
          iconName: 'BarChart3',
          color: 'from-cyan-500/20 to-teal-500/20',
          borderColor: 'group-hover:border-brand-cyan/50',
          tagColor: 'bg-brand-cyan/10 text-brand-cyan border-brand-cyan/20',
          order: 1
        },
        {
          _id: 'proj_3',
          title: 'OmniChat Interface',
          description: 'A beautiful glassmorphic messaging interface utilizing mock servers for chat simulation. Features responsive threads, media sharing, and dark mode customization.',
          tech: ['React', 'CSS Variables', 'Framer Motion', 'Tailwind CSS'],
          github: 'https://github.com',
          live: 'https://example.com',
          iconName: 'MessageSquare',
          color: 'from-purple-500/20 to-pink-500/20',
          borderColor: 'group-hover:border-purple-400/50',
          tagColor: 'bg-purple-400/10 text-purple-300 border-purple-400/20',
          order: 2
        }
      ],
      experiences: [
        {
          _id: 'exp_1',
          role: 'Frontend Developer Intern',
          company: 'DevFlow Tech Solutions',
          duration: 'May 2026 - Present',
          iconName: 'Briefcase',
          bullets: [
            'Migrated legacy codebase (HTML/CSS) to React component structures, improving page load speed by 25%.',
            'Collaborated closely with UI/UX designers to translate Figma frames into fully responsive components using Tailwind CSS.',
            'Developed utility functions in JavaScript (ES6) for filtering and sorting database results within dashboards.'
          ],
          tech: ['React', 'Tailwind CSS', 'Git', 'Figma'],
          order: 0
        },
        {
          _id: 'exp_2',
          role: 'Open Source Contributor',
          company: 'FreeCodeCamp & Dev Communities',
          duration: 'Nov 2025 - Apr 2026',
          iconName: 'Globe',
          bullets: [
            'Contributed documentation patches and layout accessibility fixes to popular community projects.',
            'Resolved CSS layout alignment issues across multiple browsers (Firefox, Safari, Chrome) in response to GitHub issues.',
            'Collaborated on code reviews, focusing on clean semantic markup and structural styling.'
          ],
          tech: ['Semantic HTML', 'CSS Flexbox/Grid', 'Markdown', 'GitHub Actions'],
          order: 1
        },
        {
          _id: 'exp_3',
          role: 'Frontend Hackathon Lead',
          company: 'TechNovation Hackathon',
          duration: 'Oct 2025',
          iconName: 'Award',
          bullets: [
            'Led a 3-member team to construct a real-time web mock prototype inside a 36-hour sprint.',
            'Developed the core landing page layout, side navigations, and dynamic interactive chart views.',
            'Won "Best UI Design" award for aesthetics, interactive elements, and layout consistency.'
          ],
          tech: ['React', 'Chart.js', 'Framer Motion', 'Vite'],
          order: 2
        }
      ],
      educations: [
        {
          _id: 'edu_1',
          degree: 'Bachelor of Science in Computer Science',
          institution: 'State University of Technology',
          duration: '2022 - 2026',
          gpa: '3.8 / 4.0 GPA',
          highlights: [
            'Focus areas: Modern Web Systems, User Interface Design, Algorithms, Database Management.',
            'Active member of the Student Web Development Club (built responsive templates for campus events).',
            'Completed graduation project: "A collaborative Kanban workspace for campus hackathons".'
          ],
          order: 0
        }
      ],
      certifications: [
        {
          _id: 'cert_1',
          title: 'Meta Frontend Developer Professional Certificate',
          issuer: 'Coursera / Meta',
          date: 'Dec 2025',
          credentialId: 'CRED-META-7829',
          order: 0
        },
        {
          _id: 'cert_2',
          title: 'Responsive Web Design Certification',
          issuer: 'freeCodeCamp',
          date: 'Aug 2025',
          credentialId: 'CRED-FCC-9382',
          order: 1
        }
      ],
      testimonials: [
        {
          _id: 'testi_1',
          name: 'Sarah Jenkins',
          role: 'Tech Lead',
          company: 'DevFlow Tech Solutions',
          text: 'Alex is an exceptional developer who is incredibly detail-oriented. He translated our complex Figma designs into responsive React code effortlessly. Highly recommended!',
          avatarUrl: '',
          rating: 5,
          order: 0
        },
        {
          _id: 'testi_2',
          name: 'Michael Chen',
          role: 'Senior Project Manager',
          company: 'TechNovation',
          text: 'During the hackathon, Alex demonstrated high efficiency and stellar UI design skills. He worked under pressure and delivered an award-winning layout.',
          avatarUrl: '',
          rating: 5,
          order: 1
        }
      ],
      messages: []
    };
    fs.writeFileSync(FALLBACK_DB_PATH, JSON.stringify(defaultData, null, 2));
  }
};

// Fallback Helper Functions
const readFallbackDb = () => {
  initFallbackDb();
  return JSON.parse(fs.readFileSync(FALLBACK_DB_PATH, 'utf-8'));
};

const writeFallbackDb = (data) => {
  fs.writeFileSync(FALLBACK_DB_PATH, JSON.stringify(data, null, 2));
};

// Connect to MongoDB
const connectDb = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri || uri.includes('<username>')) {
    console.log('MongoDB Atlas URI not set or not configured. Starting in local Fallback JSON mode.');
    isFallbackMode = true;
    initFallbackDb();
    return;
  }

  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log('Successfully connected to MongoDB Atlas!');
  } catch (err) {
    console.error('Failed to connect to MongoDB Atlas. Error:', err.message);
    console.log('Falling back to local Fallback JSON mode.');
    isFallbackMode = true;
    initFallbackDb();
  }
};

await connectDb();

// --- API ROUTES ---

// 1. AUTHENTICATION

// POST Login
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    let user = null;
    if (isFallbackMode) {
      const db = readFallbackDb();
      user = db.users.find(u => u.username === username);
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
      const isMatch = bcrypt.compareSync(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
    } else {
      user = await User.findOne({ username });
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
    }

    const payload = { id: user._id || user.id, username: user.username };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });

    res.json({
      token,
      user: { id: user._id || user.id, username: user.username }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error during login', error: err.message });
  }
});

// POST Change Password
app.post('/api/auth/change-password', auth, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'Current password and new password are required' });
  }

  try {
    if (isFallbackMode) {
      const db = readFallbackDb();
      const userIndex = db.users.findIndex(u => u.username === req.user.username);
      if (userIndex === -1) {
        return res.status(404).json({ message: 'User not found' });
      }
      const user = db.users[userIndex];
      const isMatch = bcrypt.compareSync(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Incorrect current password' });
      }
      user.password = bcrypt.hashSync(newPassword, bcrypt.genSaltSync(10));
      writeFallbackDb(db);
    } else {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Incorrect current password' });
      }
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
      await user.save();
    }

    res.json({ message: 'Password updated successfully!' });
  } catch (err) {
    res.status(500).json({ message: 'Server error changing password', error: err.message });
  }
});

// 2. PORTFOLIO DATA

// GET All Portfolio Data
app.get('/api/portfolio', async (req, res) => {
  try {
    if (isFallbackMode) {
      const db = readFallbackDb();
      return res.json({
        profile: db.profile,
        projects: db.projects,
        experiences: db.experiences,
        educations: db.educations,
        certifications: db.certifications,
        testimonials: db.testimonials || [],
        fallbackMode: true
      });
    }

    let profile = await Profile.findOne();
    if (!profile) {
      // Create empty profile if none exists
      profile = await Profile.create({});
    }

    const projects = await Project.find().sort({ order: 1 });
    const experiences = await Experience.find().sort({ order: 1 });
    const educations = await Education.find().sort({ order: 1 });
    const certifications = await Certification.find().sort({ order: 1 });
    const testimonials = await Testimonial.find().sort({ order: 1 });

    res.json({
      profile,
      projects,
      experiences,
      educations,
      certifications,
      testimonials,
      fallbackMode: false
    });
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving portfolio data', error: err.message });
  }
});

// PUT Hero Details
app.put('/api/portfolio/hero', auth, async (req, res) => {
  try {
    if (isFallbackMode) {
      const db = readFallbackDb();
      db.profile.hero = { ...db.profile.hero, ...req.body };
      writeFallbackDb(db);
      return res.json(db.profile.hero);
    }

    let profile = await Profile.findOne();
    if (!profile) profile = new Profile();
    profile.hero = { ...profile.hero, ...req.body };
    await profile.save();
    res.json(profile.hero);
  } catch (err) {
    res.status(500).json({ message: 'Error updating hero', error: err.message });
  }
});

// POST Upload Resume to Cloudinary
const upload = multer({ storage: multer.memoryStorage() });

app.post('/api/portfolio/resume', auth, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET || process.env.CLOUDINARY_CLOUD_NAME === 'your_cloud_name') {
      return res.status(400).json({ message: 'Cloudinary is not configured. Please configure CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in your backend .env file.' });
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'portfolio_resumes',
        resource_type: 'raw',
        public_id: 'resume_' + Date.now() + '.pdf'
      },
      async (error, result) => {
        if (error) {
          return res.status(500).json({ message: 'Cloudinary upload failed', error: error.message });
        }

        const resumeUrl = result.secure_url;

        if (isFallbackMode) {
          const db = readFallbackDb();
          db.profile.hero.resumeUrl = resumeUrl;
          writeFallbackDb(db);
        } else {
          let profile = await Profile.findOne();
          if (!profile) profile = new Profile();
          profile.hero.resumeUrl = resumeUrl;
          await profile.save();
        }

        res.json({ message: 'Resume uploaded successfully', resumeUrl });
      }
    );

    uploadStream.end(req.file.buffer);
  } catch (err) {
    res.status(500).json({ message: 'Error uploading resume', error: err.message });
  }
});

// PUT About Details
app.put('/api/portfolio/about', auth, async (req, res) => {
  try {
    if (isFallbackMode) {
      const db = readFallbackDb();
      db.profile.about = { ...db.profile.about, ...req.body };
      writeFallbackDb(db);
      return res.json(db.profile.about);
    }

    let profile = await Profile.findOne();
    if (!profile) profile = new Profile();
    profile.about = { ...profile.about, ...req.body };
    await profile.save();
    res.json(profile.about);
  } catch (err) {
    res.status(500).json({ message: 'Error updating about', error: err.message });
  }
});

// PUT Skills Details
app.put('/api/portfolio/skills', auth, async (req, res) => {
  try {
    if (isFallbackMode) {
      const db = readFallbackDb();
      db.profile.skills = { ...db.profile.skills, ...req.body };
      writeFallbackDb(db);
      return res.json(db.profile.skills);
    }

    let profile = await Profile.findOne();
    if (!profile) profile = new Profile();
    profile.skills = { ...profile.skills, ...req.body };
    await profile.save();
    res.json(profile.skills);
  } catch (err) {
    res.status(500).json({ message: 'Error updating skills', error: err.message });
  }
});

// 3. PROJECTS CRUD

// POST Add Project
app.post('/api/projects', auth, async (req, res) => {
  try {
    if (isFallbackMode) {
      const db = readFallbackDb();
      const newProj = {
        _id: 'proj_' + Date.now(),
        ...req.body,
        order: db.projects.length
      };
      db.projects.push(newProj);
      writeFallbackDb(db);
      return res.status(201).json(newProj);
    }

    const order = await Project.countDocuments();
    const project = new Project({ ...req.body, order });
    await project.save();
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: 'Error creating project', error: err.message });
  }
});

// PUT Update Project
app.put('/api/projects/:id', auth, async (req, res) => {
  try {
    if (isFallbackMode) {
      const db = readFallbackDb();
      const idx = db.projects.findIndex(p => p._id === req.params.id);
      if (idx === -1) return res.status(404).json({ message: 'Project not found' });
      db.projects[idx] = { ...db.projects[idx], ...req.body };
      writeFallbackDb(db);
      return res.json(db.projects[idx]);
    }

    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: 'Error updating project', error: err.message });
  }
});

// DELETE Project
app.delete('/api/projects/:id', auth, async (req, res) => {
  try {
    if (isFallbackMode) {
      const db = readFallbackDb();
      const filtered = db.projects.filter(p => p._id !== req.params.id);
      db.projects = filtered;
      writeFallbackDb(db);
      return res.json({ message: 'Project deleted successfully' });
    }

    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json({ message: 'Project deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting project', error: err.message });
  }
});

// 4. EXPERIENCE CRUD

// POST Add Experience
app.post('/api/experience', auth, async (req, res) => {
  try {
    if (isFallbackMode) {
      const db = readFallbackDb();
      const newExp = {
        _id: 'exp_' + Date.now(),
        ...req.body,
        order: db.experiences.length
      };
      db.experiences.push(newExp);
      writeFallbackDb(db);
      return res.status(201).json(newExp);
    }

    const order = await Experience.countDocuments();
    const exp = new Experience({ ...req.body, order });
    await exp.save();
    res.status(201).json(exp);
  } catch (err) {
    res.status(500).json({ message: 'Error creating experience', error: err.message });
  }
});

// PUT Update Experience
app.put('/api/experience/:id', auth, async (req, res) => {
  try {
    if (isFallbackMode) {
      const db = readFallbackDb();
      const idx = db.experiences.findIndex(e => e._id === req.params.id);
      if (idx === -1) return res.status(404).json({ message: 'Experience not found' });
      db.experiences[idx] = { ...db.experiences[idx], ...req.body };
      writeFallbackDb(db);
      return res.json(db.experiences[idx]);
    }

    const exp = await Experience.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!exp) return res.status(404).json({ message: 'Experience not found' });
    res.json(exp);
  } catch (err) {
    res.status(500).json({ message: 'Error updating experience', error: err.message });
  }
});

// DELETE Experience
app.delete('/api/experience/:id', auth, async (req, res) => {
  try {
    if (isFallbackMode) {
      const db = readFallbackDb();
      db.experiences = db.experiences.filter(e => e._id !== req.params.id);
      writeFallbackDb(db);
      return res.json({ message: 'Experience deleted successfully' });
    }

    const exp = await Experience.findByIdAndDelete(req.params.id);
    if (!exp) return res.status(404).json({ message: 'Experience not found' });
    res.json({ message: 'Experience deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting experience', error: err.message });
  }
});

// 5. EDUCATION CRUD

// POST Add Education
app.post('/api/education', auth, async (req, res) => {
  try {
    if (isFallbackMode) {
      const db = readFallbackDb();
      const newEdu = {
        _id: 'edu_' + Date.now(),
        ...req.body,
        order: db.educations.length
      };
      db.educations.push(newEdu);
      writeFallbackDb(db);
      return res.status(201).json(newEdu);
    }

    const order = await Education.countDocuments();
    const edu = new Education({ ...req.body, order });
    await edu.save();
    res.status(201).json(edu);
  } catch (err) {
    res.status(500).json({ message: 'Error creating education', error: err.message });
  }
});

// PUT Update Education
app.put('/api/education/:id', auth, async (req, res) => {
  try {
    if (isFallbackMode) {
      const db = readFallbackDb();
      const idx = db.educations.findIndex(e => e._id === req.params.id);
      if (idx === -1) return res.status(404).json({ message: 'Education not found' });
      db.educations[idx] = { ...db.educations[idx], ...req.body };
      writeFallbackDb(db);
      return res.json(db.educations[idx]);
    }

    const edu = await Education.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!edu) return res.status(404).json({ message: 'Education not found' });
    res.json(edu);
  } catch (err) {
    res.status(500).json({ message: 'Error updating education', error: err.message });
  }
});

// DELETE Education
app.delete('/api/education/:id', auth, async (req, res) => {
  try {
    if (isFallbackMode) {
      const db = readFallbackDb();
      db.educations = db.educations.filter(e => e._id !== req.params.id);
      writeFallbackDb(db);
      return res.json({ message: 'Education deleted successfully' });
    }

    const edu = await Education.findByIdAndDelete(req.params.id);
    if (!edu) return res.status(404).json({ message: 'Education not found' });
    res.json({ message: 'Education deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting education', error: err.message });
  }
});

// 6. CERTIFICATIONS CRUD

// POST Add Certification
app.post('/api/certification', auth, async (req, res) => {
  try {
    if (isFallbackMode) {
      const db = readFallbackDb();
      const newCert = {
        _id: 'cert_' + Date.now(),
        ...req.body,
        order: db.certifications.length
      };
      db.certifications.push(newCert);
      writeFallbackDb(db);
      return res.status(201).json(newCert);
    }

    const order = await Certification.countDocuments();
    const cert = new Certification({ ...req.body, order });
    await cert.save();
    res.status(201).json(cert);
  } catch (err) {
    res.status(500).json({ message: 'Error creating certification', error: err.message });
  }
});

// PUT Update Certification
app.put('/api/certification/:id', auth, async (req, res) => {
  try {
    if (isFallbackMode) {
      const db = readFallbackDb();
      const idx = db.certifications.findIndex(c => c._id === req.params.id);
      if (idx === -1) return res.status(404).json({ message: 'Certification not found' });
      db.certifications[idx] = { ...db.certifications[idx], ...req.body };
      writeFallbackDb(db);
      return res.json(db.certifications[idx]);
    }

    const cert = await Certification.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!cert) return res.status(404).json({ message: 'Certification not found' });
    res.json(cert);
  } catch (err) {
    res.status(500).json({ message: 'Error updating certification', error: err.message });
  }
});

// DELETE Certification
app.delete('/api/certification/:id', auth, async (req, res) => {
  try {
    if (isFallbackMode) {
      const db = readFallbackDb();
      db.certifications = db.certifications.filter(c => c._id !== req.params.id);
      writeFallbackDb(db);
      return res.json({ message: 'Certification deleted successfully' });
    }

    const cert = await Certification.findByIdAndDelete(req.params.id);
    if (!cert) return res.status(404).json({ message: 'Certification not found' });
    res.json({ message: 'Certification deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting certification', error: err.message });
  }
});

// 6.5. TESTIMONIALS CRUD

// POST Add Testimonial
app.post('/api/testimonials', auth, async (req, res) => {
  try {
    if (isFallbackMode) {
      const db = readFallbackDb();
      const newTesti = {
        _id: 'testi_' + Date.now(),
        ...req.body,
        order: db.testimonials ? db.testimonials.length : 0
      };
      if (!db.testimonials) db.testimonials = [];
      db.testimonials.push(newTesti);
      writeFallbackDb(db);
      return res.status(201).json(newTesti);
    }

    const order = await Testimonial.countDocuments();
    const testi = new Testimonial({ ...req.body, order });
    await testi.save();
    res.status(201).json(testi);
  } catch (err) {
    res.status(500).json({ message: 'Error creating testimonial', error: err.message });
  }
});

// PUT Update Testimonial
app.put('/api/testimonials/:id', auth, async (req, res) => {
  try {
    if (isFallbackMode) {
      const db = readFallbackDb();
      if (!db.testimonials) db.testimonials = [];
      const idx = db.testimonials.findIndex(t => t._id === req.params.id);
      if (idx === -1) return res.status(404).json({ message: 'Testimonial not found' });
      db.testimonials[idx] = { ...db.testimonials[idx], ...req.body };
      writeFallbackDb(db);
      return res.json(db.testimonials[idx]);
    }

    const testi = await Testimonial.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!testi) return res.status(404).json({ message: 'Testimonial not found' });
    res.json(testi);
  } catch (err) {
    res.status(500).json({ message: 'Error updating testimonial', error: err.message });
  }
});

// DELETE Testimonial
app.delete('/api/testimonials/:id', auth, async (req, res) => {
  try {
    if (isFallbackMode) {
      const db = readFallbackDb();
      if (!db.testimonials) db.testimonials = [];
      db.testimonials = db.testimonials.filter(t => t._id !== req.params.id);
      writeFallbackDb(db);
      return res.json({ message: 'Testimonial deleted successfully' });
    }

    const testi = await Testimonial.findByIdAndDelete(req.params.id);
    if (!testi) return res.status(404).json({ message: 'Testimonial not found' });
    res.json({ message: 'Testimonial deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting testimonial', error: err.message });
  }
});

// 7. PUBLIC CONTACT FORM SUBMISSION

// Send email notification via SMTP/Nodemailer
const sendEmailNotification = async (messageData) => {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, EMAIL_TO } = process.env;

  // If SMTP configurations are missing, skip email sending
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !EMAIL_TO) {
    console.log('SMTP configuration or EMAIL_TO is not fully defined in .env. Skipping email notification.');
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: parseInt(SMTP_PORT) || 587,
      secure: SMTP_PORT === '465', // true for 465, false for other ports
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });

    const mailOptions = {
      from: `"${messageData.name}" <${SMTP_USER}>`, // Send using verified user email but show name
      replyTo: messageData.email, // Allow replying directly to sender
      to: EMAIL_TO,
      subject: `New Portfolio Message from ${messageData.name}`,
      text: `You have received a new message from your portfolio contact form.\n\n` +
        `Name: ${messageData.name}\n` +
        `Email: ${messageData.email}\n\n` +
        `Message:\n${messageData.message}\n`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #6366f1; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">New Portfolio Message</h2>
          <p><strong>Name:</strong> ${messageData.name}</p>
          <p><strong>Email:</strong> <a href="mailto:${messageData.email}">${messageData.email}</a></p>
          <div style="background-color: #f8fafc; padding: 15px; border-radius: 6px; margin-top: 15px; border-left: 4px solid #6366f1;">
            <p style="margin: 0; white-space: pre-wrap;">${messageData.message}</p>
          </div>
          <p style="font-size: 11px; color: #64748b; margin-top: 25px; border-top: 1px solid #e2e8f0; padding-top: 10px;">
            This email was sent automatically from your portfolio contact form.
          </p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email notification sent successfully:', info.messageId);
  } catch (err) {
    console.error('Error sending email notification:', err.message);
  }
};

// POST Submit Contact Form Message
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Name, email and message are required fields' });
  }

  const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
  if (!gmailRegex.test(email.trim().toLowerCase())) {
    return res.status(400).json({ message: 'Only valid Gmail addresses (@gmail.com) are accepted for contact submissions.' });
  }

  try {
    if (isFallbackMode) {
      const db = readFallbackDb();
      const newMsg = {
        _id: 'msg_' + Date.now(),
        name,
        email,
        message,
        read: false,
        createdAt: new Date().toISOString()
      };
      db.messages.push(newMsg);
      writeFallbackDb(db);

      // Send email notification in the background
      sendEmailNotification(newMsg);

      return res.status(201).json({ message: 'Message sent successfully!', data: newMsg });
    }

    const newMsg = new Message({ name, email, message });
    await newMsg.save();

    // Send email notification in the background
    sendEmailNotification(newMsg);

    res.status(201).json({ message: 'Message sent successfully!', data: newMsg });
  } catch (err) {
    res.status(500).json({ message: 'Error saving your message', error: err.message });
  }
});

// 8. MESSAGES INBOX MANAGEMENT (SECURE)

// GET All Messages
app.get('/api/messages', auth, async (req, res) => {
  try {
    if (isFallbackMode) {
      const db = readFallbackDb();
      // Sort in reverse order (newest first)
      const sortedMsgs = [...db.messages].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return res.json(sortedMsgs);
    }

    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving messages', error: err.message });
  }
});

// PUT Mark Message Read/Unread
app.put('/api/messages/:id/read', auth, async (req, res) => {
  try {
    const { read } = req.body;
    if (isFallbackMode) {
      const db = readFallbackDb();
      const idx = db.messages.findIndex(m => m._id === req.params.id);
      if (idx === -1) return res.status(404).json({ message: 'Message not found' });
      db.messages[idx].read = read;
      writeFallbackDb(db);
      return res.json(db.messages[idx]);
    }

    const message = await Message.findByIdAndUpdate(req.params.id, { read }, { new: true });
    if (!message) return res.status(404).json({ message: 'Message not found' });
    res.json(message);
  } catch (err) {
    res.status(500).json({ message: 'Error updating message status', error: err.message });
  }
});

// DELETE Message
app.delete('/api/messages/:id', auth, async (req, res) => {
  try {
    if (isFallbackMode) {
      const db = readFallbackDb();
      db.messages = db.messages.filter(m => m._id !== req.params.id);
      writeFallbackDb(db);
      return res.json({ message: 'Message deleted successfully' });
    }

    const message = await Message.findByIdAndDelete(req.params.id);
    if (!message) return res.status(404).json({ message: 'Message not found' });
    res.json({ message: 'Message deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting message', error: err.message });
  }
});

// Serve static assets in production
const distPath = path.join(__dirname, '../dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(distPath, 'index.html'));
  });
}

// Start Server
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server is running in ${isFallbackMode ? 'FALLBACK' : 'MONGODB ATLAS'} mode on port ${PORT}`);
  });
}

export default app;
