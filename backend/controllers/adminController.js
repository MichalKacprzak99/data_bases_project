import { pool } from '../db/index.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const PrivateKey = process.env.PRIVATE_KEY


const loginAdmin = async(request, response) => {
    const nickname = request.body.nickname;
    pool.query('SELECT "id_admin", "haslo" FROM "admin" WHERE "pseudonim"=$1;', [nickname], async(error, results) => {
      if (error) {
        return response.status(409).json({ status: 'failed', message: error.stack });
      } else {
        if(results.rows.length ==0){
          return response.status(400).json({ status: 'failed', message: "Wrong Password or Nickname" });
        }
        const admin = results.rows[0];
        if(request.body.password != admin.haslo) {
          return response.status(400).json({ status: 'failed', message: "Wrong Password or Nickname" });
        }
        const token = jwt.sign({ _id: admin.id_admin }, PrivateKey);
        return response.status(200).json({"token": token});
      }
    });
  };


const addProduct = async(request, response) =>{
  const product = request.body.product;
  const productCategory = request.body.product_category;
  pool.query('INSERT INTO "produkt" ("id_kategoria_produkt", "nazwa") VALUES ($1, $2);', [productCategory, product], (error) => {
    if (error) {
      response.status(409).json({ status: 'failed', message: "Produkt już istnieje" });
    } else {
      response.status(201).json({ status: 'success', message: 'Dodano produkt' });
    }
  });
}

const addProductCategory = async(request, response) =>{
  const product_category = request.body.product_category;
  pool.query('INSERT INTO "kategoria_produkt" ("nazwa") VALUES ($1);', [product_category], (error) => {
    if (error) {
      response.status(409).json({ status: 'failed', message: "Kategoria produktu już istnieje" });
    } else {
      response.status(201).json({ status: 'success', message: 'Dodano kategorie produktu' });
    }
  });
}

const addRecipeCategory = async(request, response) =>{
  const recipe_category = request.body.recipe_category;
  pool.query('INSERT INTO "kategoria_przepis" ("nazwa") VALUES ($1);', [recipe_category], (error) => {
    if (error) {

      response.status(409).json({ status: 'failed', message: 'Kategoria przepisu już istnieje' });
    } else {
      response.status(201).json({ status: 'success', message: 'Dodano kategorie przepisu' });
    }
  });
}

const addForumTopic = async(request, response) =>{
  const topic = request.body.forum_topic;
  const description = request.body.description;
  const token = request.body.token;
  try{
    const decoded = jwt.verify(token, PrivateKey);
    const admin_id = decoded._id

    pool.query('INSERT INTO "temat_forum" ("id_admin", "temat", "data_dodania", "opis") VALUES ($1, $2, to_timestamp($3), $4);', [admin_id, topic, Date.now()/1000, description], (error) => {
      if (error) {

        response.status(409).json({ status: 'failed', message: 'Taki temat już istnieje' });
      } else {
        response.status(201).json({ status: 'success', message: 'Dodano temat do forum' });
      }
    });
  } catch(err) {
    return response.status(408).json({ status: 'failed', message: err.stack });
  }
  

}

const getUsers = async(request, response) => {
  const token = request.body.token;

  try{
    jwt.verify(token, PrivateKey);
  } catch(err) {
    return response.status(408).json({ status: 'failed', message: err.stack });
  }

  pool.query('SELECT "id_uzytkownika", "pseudonim", "email", "zablokowany" from "uzytkownik" ;', async(error, results) => {
    if (error) {
      return response.status(409).json({ status: 'failed', message: error.stack });
    } else {
      return response.status(200).json(results.rows);
    }
  });

};

const blockingUsers = async(request, response) => {
  const token = request.body.token;

  try{
    jwt.verify(token, PrivateKey);
  } catch(err) {
    return response.status(408).json({ status: 'failed', message: err.stack });
  }
  const userId = request.body.user_id;
  const toBlock = request.body.toBlock;

  pool.query('UPDATE "uzytkownik" SET "zablokowany"=$1 WHERE "id_uzytkownika"=$2  ;',[toBlock, userId], async(error, results) => {
    if (error) {
      return response.status(409).json({ status: 'failed', message: error.stack });
    } else {
      return response.status(200).json(true);
    }
  });

};
const getMessages = async(request, response) => {

  const token = request.body.token;
  try{
    jwt.verify(token, PrivateKey);
    pool.query(`SELECT * FROM "wiadomosc_do_administracji"`, async(error, results) => {
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

const getProductsCetegories = async(request, response) => {


    pool.query(`SELECT * FROM kategoria_produkt`, async(error, results) => {
      if (error) {

        return response.status(409).json({ status: 'failed', message: error.stack });
      } else {
  
        return response.status(200).json(results.rows);
      }
    });

  

};

const getRecipeCetegories = async(request, response) => {


    pool.query(`SELECT * FROM kategoria_przepis`, async(error, results) => {
      if (error) {
        console.log(error.stack)
        return response.status(409).json({ status: 'failed', message: error.stack });
      } else {
  
        return response.status(200).json(results.rows);
      }
    });

  

};

const getRecipe = async(request, response) => {
  
  const token = request.body.token;
    console.log("ala")
  const id_recipe = request.query.id_recipe
const status = `'zaakceptowany'`
  try{
    const decode = jwt.verify(token, PrivateKey);
    const user_id = decode._id;
    const query = `SELECT *, EXISTS(SELECT * FROM polubione_przepisy WHERE "id_przepis"=$1 AND "id_uzytkownika"=$2) as polubiony FROM
      recipes WHERE id_przepis=$1 AND status=${status}`

    pool.query(query,[id_recipe, user_id], async(error, results) => {
      if (error) {
        console.log(error.stack)
        return response.status(409).json({ status: 'failed', message: error.stack });
      } else {

        if(results.rows.length !== 0){

          return response.status(200).json(results.rows[0]);
        } else {
          return response.status(200).json(null);
        }
        
      }
  });
} catch(err) {
    const query = `SELECT nazwa, opis, data_dodania, false as polubiony FROM przepis 
    WHERE id_przepis=$1 AND status=${status}`
    console.log(query)
    pool.query(query,[id_recipe], async(error, results) => {
      if (error) {
        return response.status(409).json({ status: 'failed', message: error.stack });
      } else {
        return response.status(200).json(results.rows[0]);
      }
    });
  }  

};


export default {
  getMessages,
  blockingUsers,
  getUsers,
  addForumTopic,
  loginAdmin,
  addProductCategory,
  addProduct,
  addRecipeCategory,
  getProductsCetegories,
  getRecipeCetegories,
  getRecipe,
}