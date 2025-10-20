import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import DB from './configration/database.js';
import authRoutes from './routes/authRoute.js';
import blogRoutes from './routes/blogRoute.js';

dotenv.config();


const app = express();
app.use(cors({
  origin: "http://localhost:5173", // frontend URL
  credentials: true, // required if using cookies
}));
app.use(express.json());
DB();
app.use('/auth', authRoutes);
app.use("/blogs", blogRoutes);




app.listen(process.env.PORT, () => { console.log(`Server running on PORT ${process.env.PORT}`) })