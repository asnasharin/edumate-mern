import mongoose from 'mongoose'
import app from './app'
import dotenv from 'dotenv'

dotenv.config()


mongoose.connect(process.env.MONGO_URL as string)
  .then(() => {
    console.log("Database connected");

    const port = process.env.PORT || 5000;
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error(" Failed to connect to DB:", err);
    process.exit(1); 
  });

