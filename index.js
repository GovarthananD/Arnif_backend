import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import DB from './configration/database.js';
import authRoutes from './routes/authRoute.js';
import blogRoutes from './routes/blogRoute.js';

dotenv.config();


const app = express();
app.use(cors({
  origin: [
    "http://localhost:5173",            // for local dev
    "https://arnifblogs.netlify.app"    // ✅ your deployed frontend
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));
app.use(express.json());
DB();
app.use('/auth', authRoutes);
app.use("/blogs", blogRoutes);




app.listen(process.env.PORT, () => { console.log(`Server running on PORT ${process.env.PORT}`) })