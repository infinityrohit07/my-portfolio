import mongoose from 'mongoose';

const traitSchema = new mongoose.Schema({
  iconName: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true }
});

const skillCategorySchema = new mongoose.Schema({
  title: { type: String, required: true },
  iconName: { type: String, required: true },
  skills: [{ type: String, required: true }] // Array of skill names (no levels)
});

const profileSchema = new mongoose.Schema({
  hero: {
    statusText: { type: String, default: 'Available for Full-time Roles & Internships' },
    greeting: { type: String, default: "Hi, I'm" },
    name: { type: String, default: 'Alex Carter' },
    subtitle: { type: String, default: 'Frontend Engineer specializing in building beautiful, performant, and responsive web experiences.' },
    description: { type: String, default: 'A self-taught enthusiast and fresh graduate with solid fundamentals in JavaScript, React, and CSS architectures.' },
    location: { type: String, default: 'San Francisco Bay Area, CA' },
    socials: {
      github: { type: String, default: 'https://github.com' },
      linkedin: { type: String, default: 'https://linkedin.com' },
      twitter: { type: String, default: 'https://twitter.com' },
      email: { type: String, default: 'alexcarter.dev@gmail.com' }
    },
    resumeUrl: { type: String, default: '' }
  },
  about: {
    title: { type: String, default: 'A curious mind crafting digital interfaces.' },
    bioLines: [{ type: String }],
    traits: [traitSchema]
  },
  skills: {
    categories: [skillCategorySchema],
    learningSummary: { type: String, default: 'Always learning. Current exploration: React Compiler & WebGPU.' }
  }
}, { timestamps: true });

export default mongoose.model('Profile', profileSchema);
