import { pool } from '../db/index.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const PrivateKey = process.env.PRIVATE_KEY
  
const addRecipe = async(request, response) => {

  const token = request.body.token;
  try{
    const decode = jwt.verify(token, PrivateKey);
    const user_id = decode._id;

    const products = JSON.stringify(request.body.products);
    const categories = JSON.stringify(request.body.categories);
    const name = request.body.name;
    const description = request.body.description;
  
    pool.query(`SELECT * FROM dodaj_przepis($1,NOW()::timestamp,$2, $3, $4, $5)`,[user_id, name, description, products, categories], async(error, results) => {
      if (error) {
        return response.status(409).json({ status: 'failed', message: error.stack });
      } else {
        return response.status(200).json(true);
      }
    });
  } catch(err) {
    return response.status(408).json({ status: 'failed', message: err.stack });
  }
  

};

const getRecipes = async(request, response) => {
  const token = request.body.token;
  // const id_recipe = request.query.id_recipe
  const status = request.body.status;
  try {
    const decode = jwt.verify(token, PrivateKey);
    const user_id = decode._id;
    
    const query =`SELECT *, exists(select * from polubione_przepisy WHERE "id_przepis"=przepis.id_przepis AND "id_uzytkownika"=$2) as polubiony FROM przepis 
      JOIN akceptacja_przepisu USING(id_przepis)
      WHERE status=$1`
    pool.query(query,[status, user_id], async(error, results) => {
      if (error) {
        console.log(erros.stack)
        return response.status(409).json({ status: 'failed', message: error.stack });
      } else {
        return response.status(200).json(results.rows);
      }
    });
  } catch(err) {
    const query = `SELECT *, false as polubiony FROM przepis 
    JOIN akceptacja_przepisu USING(id_przepis)
    WHERE status=$1`
    pool.query(query,[status], async(error, results) => {
      if (error) {
        return response.status(409).json({ status: 'failed', message: error.stack });
      } else {
        return response.status(200).json(results.rows);
      }
  });
  }


  

};

const getRecipe = async(request, response) => {
  const token = request.body.token;
  const id_recipe = request.query.id_recipe
  try{
    const decode = jwt.verify(token, PrivateKey);
    const user_id = decode._id;
    const query = `SELECT nazwa, opis, data_dodania, exists(select * from polubione_przepisy WHERE "id_przepis"=$1 AND "id_uzytkownika"=$2) as polubiony
  
      FROM przepis
      JOIN akceptacja_przepisu USING (id_przepis)
      WHERE id_przepis=$1 AND status='zaakceptowany'`
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
    WHERE id_przepis=$1`
    pool.query(query,[id_recipe], async(error, results) => {
      if (error) {
        return response.status(409).json({ status: 'failed', message: error.stack });
      } else {
        return response.status(200).json(results.rows[0]);
      }
    });
  }  

};

const getRecipeProducts = async(request, response) => {
  const id_recipe = request.query.id_recipe

  const query =  `SELECT *, kategoria_produkt.nazwa as kategoria, produkt.nazwa FROM przepis_produkt
  JOIN produkt USING (id_produkt)
  JOIN kategoria_produkt ON produkt.id_kategoria_produkt = kategoria_produkt.id_kategoria_produkt
  WHERE id_przepis=$1`
  
  pool.query(query,[id_recipe], async(error, results) => {
    if (error) {
      console.log(error.stack)
      return response.status(409).json({ status: 'failed', message: error.stack });
    } else {
      return response.status(200).json(results.rows);
    }
  });

};

const getRecipeCategories = async(request, response) => {
  const id_recipe = request.query.id_recipe

  const query =  `SELECT kategoria_przepis.nazwa FROM kategoria_przepis 
  JOIN asocjacja_kategoria_przepis USING (id_kategoria_przepis)
  WHERE "id_przepis"=$1;
  `
  pool.query(query,[id_recipe], async(error, results) => {
    if (error) {
      console.log(error.stack)
      return response.status(409).json({ status: 'failed', message: error.stack });
    } else {
      return response.status(200).json(results.rows);
    }
  });

};

const likeRecipe = async(request, response) => {
  const id_recipe = request.query.id_recipe
  const description = request.body.description;

  const token = request.body.token;
  const decode = jwt.verify(token, PrivateKey);
  const user_id = decode._id;

  const query =  `INSERT INTO polubione_przepisy VALUES ($1,$2,$3,to_timestamp($4));
  `
  pool.query(query,[id_recipe,user_id ,description, Date.now()/1000,], async(error, results) => {
    if (error) {
      console.log(error.stack)
      return response.status(409).json({ status: 'failed', message: error.stack });
    } else {
      return response.status(200).json(true);
    }
  });

};


const dislikeRecipe = async(request, response) => {
  const id_recipe = request.query.id_recipe
  const token = request.body.token;
  const decode = jwt.verify(token, PrivateKey);
  const user_id = decode._id;
  const query =  `DELETE FROM  polubione_przepisy
  WHERE id_przepis=$1 and id_uzytkownika=$2;
  `
  pool.query(query,[id_recipe, user_id], async(error, results) => {
    if (error) {
      console.log(error.stack)
      return response.status(409).json({ status: 'failed', message: error.stack });
    } else {
      return response.status(200).json(true);
    }
  });

};

const addComment = async(request, response) => {
  const id_recipe = request.query.id_recipe
  const description = request.body.description;

  const token = request.body.token;
  const decode = jwt.verify(token, PrivateKey);
  const user_id = decode._id;

  const query =  `INSERT INTO komentarz (id_uzytkownika, id_przepis, tresc, data_dodania) VALUES ($1,$2,$3,to_timestamp($4));`
  pool.query(query,[user_id, id_recipe ,description, Date.now()/1000,], async(error, results) => {
    if (error) {
      console.log(error.stack)
      return response.status(409).json({ status: 'failed', message: error.stack });
    } else {
      return response.status(200).json(true);
    }
  });

};
const getComments = async(request, response) => {
  const id_recipe = request.query.id_recipe
  const query =  `SELECT id_komentarz, uzytkownik.pseudonim, tresc FROM komentarz JOIN uzytkownik USING (id_uzytkownika) 
  WHERE id_przepis=$1`
  pool.query(query,[id_recipe], async(error, results) => {
    if (error) {
      console.log(error.stack)
      return response.status(409).json({ status: 'failed', message: error.stack });
    } else {
      return response.status(200).json(results.rows);
    }
  });

};


const acceptRecipe = async(request, response) => {
  const id_recipe = request.query.id_recipe
  const query =  `UPDATE akceptacja_przepisu SET status='zaakceptowany' WHERE id_przepis=$1  ;`
  pool.query(query,[id_recipe], async(error, results) => {
    if (error) {
      console.log(error.stack)
      return response.status(409).json({ status: 'failed', message: error.stack });
    } else {
      return response.status(200).json(true);
    }
  });

};

export default {
    addRecipe,
    acceptRecipe,
    getComments,
    addComment,
    dislikeRecipe,
    likeRecipe,
    getRecipeCategories,
    getRecipeProducts,
    getRecipes,
    getRecipe,
}