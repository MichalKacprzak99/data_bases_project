import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import cookieParser from "cookie-parser";
import bodyParser from 'body-parser';

dotenv.config();


const app = express();
const PORT = process.env.PORT || 8000;

app.use(cookieParser());
app.use(cors())
app.use(express.urlencoded({extended: true}));
app.use(express.json({extended: true}));
app.use(bodyParser.json());

import recipeRouter from './routes/recipeRouter.js';
import adminRouter from './routes/adminRouter.js';
import userRouter from './routes/userRouter.js';
import forumRouter from './routes/forumRouter.js';

app.use('/recipes', recipeRouter)
app.use('/admin', adminRouter)
app.use('/user', userRouter)
app.use('/forum', forumRouter)
app.get('/', (req, res) => {
  res.send(`<h1>Hello World! ${process.env.DB_USER}</h1>`)
})
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

