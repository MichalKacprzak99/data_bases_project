import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import cookieParser from "cookie-parser";
import bodyParser from 'body-parser';
import swaggerJSDoc from "swagger-jsdoc"
import swaggerUi from "swagger-ui-express"

import recipeRouter from './routes/recipeRouter.js';
import adminRouter from './routes/adminRouter.js';
import userRouter from './routes/userRouter.js';
import forumRouter from './routes/forumRouter.js';

dotenv.config();



const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Express API for data base project',
    version: '1.0.0',
  },
};

const options = {
  swaggerDefinition,
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

const app = express();
const PORT = process.env.DB_PORT || 8000;

app.use(cookieParser());
app.use(cors())
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(express.urlencoded({extended: true}));
app.use(express.json({extended: true}));
app.use(bodyParser.json());



app.use('/recipes', recipeRouter)
app.use('/admin', adminRouter)
app.use('/user', userRouter)
app.use('/forum', forumRouter)

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

