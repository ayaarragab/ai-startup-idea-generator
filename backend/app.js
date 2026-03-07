import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from './auth/passport.auth.js';
import dotenv from 'dotenv';
import morgan from 'morgan';
import { requestId } from "./middlewares/requestId.js";

import authRouter from './routers/auth.router.js';
import userRouter from './routers/user.router.js';
import chatRouter from './routers/chat.router.js';
import conversationRouter from "./routers/conversation.router.js";
import ideaRouter from './routers/idea.router.js';
import feedbackRouter from './routers/feedback.router.js';
import sectorsRouter from './routers/sector.router.js';

dotenv.config();

const app = express();

app.use(cors({
  origin: `http://localhost:${process.env.FRONTEND_PORT}`,
  credentials: true,
}));

app.use(express.json());
app.use(requestId);
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
app.use('/chat', chatRouter);
app.use('/conversation', conversationRouter);
app.use('/idea', ideaRouter);
app.use('/feedback', feedbackRouter);
app.use('/sector', sectorsRouter);

export default app;