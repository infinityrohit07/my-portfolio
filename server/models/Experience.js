import mongoose from 'mongoose';

const experienceSchema = new mongoose.Schema({
  role: { type: String, required: true },
  company: { type: String, required: true },
  duration: { type: String, required: true },
  iconName: { type: String, default: 'Briefcase' },
  bullets: [{ type: String }],
  tech: [{ type: String }],
  order: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('Experience', experienceSchema);
