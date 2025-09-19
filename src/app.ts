import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import sweetsRoutes from './routes/sweets';
import { authenticate } from './middleware/auth';
import purchasesRoutes from './routes/purchases';


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Public
app.use('/api/auth', authRoutes);

// Protected inside sweets routes
app.use('/api/sweets', sweetsRoutes);
app.use('/api/purchases', purchasesRoutes);


export default app;
