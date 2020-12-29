import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { pool } from './db/index.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cookieParser from "cookie-parser";
import bodyParser from 'body-parser';

dotenv.config();


const app = express();
const PORT = process.env.DB_PORT || 8000;
const PrivateKey = process.env.PRIVATE_KEY
app.use(cookieParser());
app.use(cors())
app.use(express.urlencoded({extended: true}));
app.use(express.json({extended: true}));
app.use(bodyParser.json());

const registerUser = (request, response) => {
  const user_name = request.body.user_name;
  const name = request.body.name;
  const surname = request.body.surname;
  const email = request.body.email;
  const hashedPassword = bcrypt.hashSync(request.body.password, 10);
  pool.query('INSERT INTO "uzytkownik" ("pseudonim", "imie", "nazwisko", "email", "haslo") VALUES ($1, $2, $3, $4, $5);', [user_name, name, surname, email, hashedPassword], (error) => {
    if (error) {
      response.status(409).json({ status: 'failed', message: error.stack });
    } else {
      response.status(201).json({ status: 'success', message: 'Customer added.' });
    }
  });
};

const loginUser = async(request, response) => {
  const email = request.body.email;
  pool.query('SELECT "id_uzytkownika", "haslo" from "uzytkownik" WHERE "email"=$1;', [email], async(error, results) => {
    if (error) {
      return response.status(409).json({ status: 'failed', message: error.stack });
    } else {
      const user = results.rows[0];
      const validPassword = await bcrypt.compare(request.body.password, user.haslo);
      if(!validPassword){
        return response.status(400).json({ status: 'failed', message: "Wrong Password or Email" });
      }
      const token = jwt.sign({ _id: user.id_uzytkownika }, PrivateKey);
      return response.status(200).json({"token": token});
    }
  });
};


const loginAdmin = async(request, response) => {
  const nickname = request.body.nickname;
  pool.query('SELECT "id_admin", "haslo" from "admin" WHERE "pseudonim"=$1;', [nickname], async(error, results) => {
    if (error) {
      return response.status(409).json({ status: 'failed', message: error.stack });
    } else {
      const admin = results.rows[0];
      const validPassword = await bcrypt.compare(request.body.password, admin.haslo);
      if(!validPassword){
        return response.status(400).json({ status: 'failed', message: "Wrong Password or Email" });
      }
      const token = jwt.sign({ _id: admin.id_admin }, PrivateKey);
      return response.status(200).json({"token": token});
    }
  });
};


const getUserInfo = async(request, response) => {
  
  const token = request.body.token;
  // console.log(token)
  try {
    const decoded = jwt.verify(token, PrivateKey);
    const user_id = decoded._id
    pool.query('SELECT * from "uzytkownik" WHERE "id_uzytkownika"=$1;', [user_id], async(error, results) => {
      if (error) {
        return response.status(409).json({ status: 'failed', message: error.stack });
      } else {
        const user = results.rows[0];
        // console.log(user.imie)
        return response.status(200).json(user);
      }
    });
  } catch(err) {
    return response.status(408).json({ status: 'failed', message: err.stack });
  }
  
};


app.route('/register').post(registerUser);
app.route('/login').post(loginUser);
app.route('/user').post(getUserInfo);
app.route('/loginAdmin').post(loginAdmin);
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});