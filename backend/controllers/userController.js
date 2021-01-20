import { pool } from '../db/index.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const PrivateKey = process.env.PRIVATE_KEY;


const registerUser = (request, response) => {
    const user_name = request.body.user_name;
    const name = request.body.name;
    const surname = request.body.surname;
    const email = request.body.email;
    const hashedPassword = bcrypt.hashSync(request.body.password, 10);
    pool.query('INSERT INTO "uzytkownik" ("pseudonim", "imie", "nazwisko", "email", "haslo") VALUES ($1, $2, $3, $4, $5);', [user_name, name, surname, email, hashedPassword], (error, results) => {
      if (error) {
        console.log(error.message)
        response.status(409).json({ status: 'failed', message: error.message });
      } else {
        response.status(200).json({ status: 'success', message: 'Użytkownik dodany.' });
      }
    });
  };
  

const loginUser = async(request, response) => {
  const email = request.body.email;
  pool.query('SELECT "id_uzytkownika", "haslo", "zablokowany" FROM "uzytkownik" WHERE "email"=$1;', [email], async(error, results) => {
    if (error) {
      return response.status(409).json({ status: 'failed', message: error.stack });
    } else {
      if(typeof results == 'undefined'){
        return response.status(400).json({ status: 'failed', message: "Wrong Password or Email" });
      }
      const user = results.rows[0];
      const validPassword = await bcrypt.compare(request.body.password, user.haslo);
      if(!validPassword){
        return response.status(400).json({ status: 'failed', message: "Wrong Password or Email" });
      }
      if(user.zablokowany){
        return response.status(400).json({ status: 'failed', message: "You are blocked" });
      }
      const token = jwt.sign({ _id: user.id_uzytkownika }, PrivateKey);
      return response.status(200).json({"token": token});
    }
  });
};


const getUserInfo = async(request, response) => {
  
  const token = request.body.token;
  try {
    const decoded = jwt.verify(token, PrivateKey);
    const user_id = decoded._id
    pool.query('SELECT * FROM "uzytkownik" WHERE "id_uzytkownika"=$1;', [user_id], async(error, results) => {
      if (error) {
        console.log(error.stack)
        return response.status(409).json({ status: 'failed', message: error.stack });
      } else {
        const user = results.rows[0];
        return response.status(200).json(user);
      }
    });
  } catch(err) {
    return response.status(408).json({ status: 'failed', message: err.stack });
  }
  
};


const getInfo = async(request, response) => {
  const token = request.body.token;
  const category = request.body.category;

  try{
    jwt.verify(token, PrivateKey);

  } catch(err) {
    return response.status(408).json({ status: 'failed', message: err.stack });
  }
  pool.query(`SELECT * FROM ${category};`, async(error, results) => {
    if (error) {
      console.log(error.stack)
      return response.status(409).json({ status: 'failed', message: error.stack });
    } else {

      return response.status(200).json(results.rows);
    }
  });

};


const sendMessage = async(request, response) => {

  const token = request.body.token;
  const message= request.body.message;
  try{
    const decode = jwt.verify(token, PrivateKey);
    pool.query(`INSERT INTO "wiadomosc_do_administracji" ("id_uzytkownika", "data_dodania", "tresc") VALUES ($1,  to_timestamp($2), $3);`, [decode._id,  Date.now()/1000, message], async(error, results) => {
      if (error) {

        return response.status(409).json({ status: 'failed', message: error.stack });
      } else {
  
        return response.status(200).json({ status: 'done', message: "Message is send"});
      }
    });
  } catch(err) {

    return response.status(408).json({ status: 'failed', message: err.stack });
  }
  

};

const addTrackedProduct = async(request, response) => {

  const token = request.body.token;
  const product= request.body.product;
  try{
    const decode = jwt.verify(token, PrivateKey);
    pool.query(`SELECT dodaj_sledzony_produkt($1,$2)`, [decode._id,  product], async(error, results) => {
      if (error) {

        return response.status(409).json({ status: 'failed', message: error.stack });
      } else {
        return response.status(200).json({ status: 'done', message: "Product is tracked"});
      }
    });
  } catch(err) {

    return response.status(408).json({ status: 'failed', message: err.stack });
  }
  

};

const getTrackedProducts = async(request, response) => {

  const token = request.body.token;

  try{
    const decode = jwt.verify(token, PrivateKey);
    pool.query(`SELECT nazwa, pasujacy_przepis, data_dodania, data_dopasowania FROM sledzone_produkty JOIN produkt USING (id_produkt) WHERE id_uzytkownika=$1`, [decode._id], async(error, results) => {
      if (error) {

        return response.status(409).json({ status: 'failed', message: error.stack });
      } else {
        return response.status(200).json(results.rows);
      }
    });
  } catch(err) {

    return response.status(408).json({ status: 'failed', message: err.stack });
  }
  

};


export default {
    sendMessage,
    loginUser,
    registerUser,
    getUserInfo,
    getInfo,
    addTrackedProduct,
    getTrackedProducts,
}


