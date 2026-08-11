import connectDB from "./database/connectDB.js";
import app from "./app.js";
import seedAdmin from "./seed/seedAdmin.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    // Create first admin if database is empty
    await seedAdmin();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error(error);
  }
};

startServer();