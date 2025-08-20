// This script creates an admin user in the MongoDB database.
// Usage: node scripts/createAdmin.js [email] [name] [password]
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import User from "../src/models/User.js";

const mongoUri = process.env.MONGODB_URI; // pastikan ini sesuai nama di .env
if (!mongoUri) throw new Error("MONGODB_URI needed");
await mongoose.connect(mongoUri);

const run = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  const email = process.argv[2] || "admin@mindwealth.local";
  const name = process.argv[3] || "Admin";
  const pass = process.argv[4] || "password123";

  const exists = await User.findOne({ email });
  if (exists) {
    console.log("Admin already exists");
    process.exit(0);
  }

  const user = await User.create({ name, email, password: pass, isAdmin: true });
  console.log("Created admin:", user.email);
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
