import bcrypt from "bcryptjs";
import User from "../models/user.model.js";

const seedAdmin = async () => {
  try {
    const userCount = await User.countDocuments();

    // Only create if database has no users
    if (userCount > 0) {
      console.log("✅ Users already exist. Skipping admin seed.");
      return;
    }

    const hashedPassword = await bcrypt.hash("123456mr", 10);

    await User.create({
      fullName: "Mr Taif",
      email: "mrtaif@admin.com",
      password: hashedPassword,
      role: "admin",
      isActive: true,
    });

    console.log("✅ Default admin created.");
    console.log("Email: mrtaif@admin.com");
    console.log("Password: 123456mr");
  } catch (error) {
    console.error("❌ Seed Error:", error.message);
  }
};

export default seedAdmin;