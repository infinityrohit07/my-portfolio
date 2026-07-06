import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  company: { type: String, required: true },
  text: { type: String, required: true },
  avatarUrl: { type: String, default: '' },
  rating: { type: Number, default: 5 },
  order: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('Testimonial', testimonialSchema);
