import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from './auth/passport.auth.js';
import dotenv from 'dotenv';
import morgan from 'morgan';

import authRouter from './routers/auth.router.js';
import userRouter from './routers/user.router.js';

dotenv.config();

const app = express();

app.use(cors({
  origin: `http://localhost:${process.env.FRONTEND_PORT}`,
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));
app.use(session({
  secret: process.env.SESSION_SECRET || 'default_secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Set to true if using HTTPS
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRouter);
app.use('/user', userRouter);
export default app;