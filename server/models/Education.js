import mongoose from 'mongoose';

const educationSchema = new mongoose.Schema({
  degree: { type: String, required: true },
  institution: { type: String, required: true },
  duration: { type: String, required: true },
  gpa: { type: String, default: '' },
  highlights: [{ type: String }],
  order: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('Education', educationSchema);
