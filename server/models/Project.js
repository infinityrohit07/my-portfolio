import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  tech: [{ type: String }],
  github: { type: String, default: '' },
  live: { type: String, default: '' },
  iconName: { type: String, default: 'Compass' },
  color: { type: String, default: 'from-blue-500/20 to-indigo-500/20' },
  borderColor: { type: String, default: 'group-hover:border-brand-indigo/50' },
  tagColor: { type: String, default: 'bg-brand-indigo/10 text-brand-indigo border-brand-indigo/20' },
  order: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('Project', projectSchema);
