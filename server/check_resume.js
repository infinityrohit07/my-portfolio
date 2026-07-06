import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const ProfileSchema = new mongoose.Schema({
  hero: {
    name: String,
    resumeUrl: String
  }
});

const Profile = mongoose.model('Profile', ProfileSchema);

async function run() {
  try {
    console.log("Connecting to:", process.env.MONGODB_URI);
    await mongoose.connect(process.env.MONGODB_URI);
    const profile = await Profile.findOne();
    console.log("Profile Hero Data:", JSON.stringify(profile?.hero, null, 2));
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await mongoose.disconnect();
  }
}

run();
