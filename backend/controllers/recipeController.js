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
      if(error){

        let errorMessage
        if (error.code == 'P0001') {

          errorMessage = error.message

        }
        else {

          errorMessage = 'Nie możesz dodać dwa razy jednego produktu'
        }
        return response.status(409).json({ status: 'failed', message: errorMessage });
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
  const adminToken = request.body.adminToken;
  const status = request.body.status;
  const onlyLiked = request.body.onlyLiked;

  if(onlyLiked){
    const decode = jwt.verify(token, PrivateKey);
    const user_id = decode._id;
    
    const query =`SELECT * FROM recipes JOIN Polubione_przepisy USING (id_przepis)
      WHERE status=$1 and Polubione_przepisy.id_likujacego=$2`
    pool.query(query,[status, user_id], async(error, results) => {
      if (error) {
        console.log(error.stack)
        return response.status(409).json({ status: 'failed', message: error.stack });
      } else {
        return response.status(200).json(results.rows);
      }
    });
  } else {
        let query
        if(status =="oczekujący") {
            const decode = jwt.verify(adminToken, PrivateKey);
            const admin_id = decode._id;
            query = `SELECT * FROM recipes WHERE status=$1 and id_admin=${admin_id}`
        } else {
            query = `SELECT * FROM recipes WHERE status=$1`
        }
        
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
  const status = request.query.status

  if(status=="oczekujący"){
    const adminToken = request.body.adminToken;
    try{
      const decode = jwt.verify(adminToken, PrivateKey);
      const admin_id = decode._id;

      const query = `SELECT nazwa, opis, data_dodania, false as polubiony FROM recipes
      WHERE id_przepis=$1 AND status=$2`
  
      pool.query(query,[id_recipe,status], async(error, results) => {
        if (error) {
          console.log(error.stack)
          return response.status(409).json({ status: 'failed', message: error.stack });
        } else {
          return response.status(200).json(results.rows[0]);
        }
      });
    }
    catch {
      return response.status(200).json(null);
    }
  }else {
    try{
      const decode = jwt.verify(token, PrivateKey);
      const user_id = decode._id;
      const query = `SELECT *, EXISTS(SELECT * FROM polubione_przepisy WHERE "id_przepis"=$1 AND "id_likujacego"=$2) as polubiony FROM
        recipes WHERE id_przepis=$1 AND status=$3`

      pool.query(query,[id_recipe, user_id,status], async(error, results) => {
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
      WHERE id_przepis=$1 AND status=$2`
  
      pool.query(query,[id_recipe,status], async(error, results) => {
        if (error) {
          return response.status(409).json({ status: 'failed', message: error.stack });
        } else {
          return response.status(200).json(results.rows[0]);
        }
      });
    }  
  }
  

};

const getRecipeProducts = async(request, response) => {
  
  const id_recipe = request.query.id_recipe

  const query =  `SELECT * FROM recipe_products WHERE id_przepis=$1`
  
  pool.query(query,[id_recipe], async(error, results) => {
    if (error) {
      console.log(error)
      return response.status(409).json({ status: 'failed', message: error.stack });
    } else {
      return response.status(200).json(results.rows);
    }
  });

};

const getRecipeCategories = async(request, response) => {
  
  const id_recipe = request.query.id_recipe
  const query =  `SELECT nazwa FROM recipe_category WHERE "id_przepis"=$1;`
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

  const query =  `INSERT INTO polubione_przepisy SELECT $1, id_uzytkownika, $2,  to_timestamp($4), $3 from recipes WHERE id_przepis = $1 `
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
  const query =  `DELETE FROM  polubione_przepisy WHERE id_przepis=$1 and id_likujacego=$2;`
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
  // id_komentujacego
  const query =  `INSERT INTO komentarz(id_uzytkownika,id_przepis,id_komentujacego,tresc,data_dodania) SELECT id_uzytkownika,$1, $2, $3,  to_timestamp($4) from recipes WHERE id_przepis = $1 `
  // const query =  `INSERT INTO komentarz (id_uzytkownika, id_przepis, tresc, data_dodania) VALUES ($1,$2,$3,to_timestamp($4));`
  pool.query(query,[id_recipe, user_id ,description, Date.now()/1000,], async(error, results) => {
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
  const query =  `SELECT * FROM comments WHERE id_przepis=$1`
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

const rejectRecipe = async(request, response) => {
  const id_recipe = request.query.id_recipe
  const query =  `UPDATE akceptacja_przepisu SET status='odrzucony' WHERE id_przepis=$1  ;`
  pool.query(query,[id_recipe], async(error, results) => {
    if (error) {
      console.log(error.stack)
      return response.status(409).json({ status: 'failed', message: error.stack });
    } else {
      return response.status(200).json(true);
    }
  });

};


const filterRecipes = async(request, response) => {
    const token = request.body.token;
    const status = request.body.status;
    const date = request.body.added_date
    const name= request.body.name
    const minimumProductNumber= request.body.minimumProductNumber
    const categories= request.body.categories
    const productCategories= request.body.productCategories
    const onlyLiked = request.body.onlyLiked;
    console.log(onlyLiked)
    let query
    if(onlyLiked){

        const decode = jwt.verify(token, PrivateKey);
        const user_id = decode._id;

        query = `SELECT id_przepis,recipes.nazwa, opis, recipes.data_dodania, notatka FROM recipes
        JOIN asocjacja_kategoria_przepis USING(id_przepis)
        JOIN kategoria_przepis USING(id_kategoria_przepis)
        JOIN przepis_produkt USING(id_przepis)
        JOIN produkt USING(id_produkt)
        JOIN Polubione_przepisy USING (id_przepis)
        JOIN kategoria_produkt ON produkt.id_kategoria_produkt = kategoria_produkt.id_kategoria_produkt
        WHERE status=$1 AND kategoria_przepis.nazwa IN (${categories}) AND kategoria_produkt.nazwa in (${productCategories}) AND Polubione_przepisy.id_likujacego=$2
        GROUP BY id_przepis, opis, recipes.data_dodania,recipes.nazwa, notatka
        HAVING ${parseInt(minimumProductNumber)} <= (SELECT COUNT(*) FROM przepis_produkt WHERE id_przepis = recipes.id_przepis)
        ORDER BY  recipes.data_dodania::date ${date}, recipes.nazwa ${name}
        `
        pool.query(query,[status, user_id], async(error, results) => {
        if (error) {
            console.log(error)
            return response.status(409).json({ status: 'failed', message: error.stack });
        } else {
            console.log(results.rows)
            return response.status(200).json(results.rows);
        }
        });
    } else {
        query = `SELECT id_przepis,recipes.nazwa, opis, data_dodania FROM recipes
        JOIN asocjacja_kategoria_przepis USING(id_przepis)
        JOIN kategoria_przepis USING(id_kategoria_przepis)
        JOIN przepis_produkt USING(id_przepis)
        JOIN produkt USING(id_produkt)
        JOIN kategoria_produkt ON produkt.id_kategoria_produkt = kategoria_produkt.id_kategoria_produkt
        WHERE status=$1 AND kategoria_przepis.nazwa IN (${categories}) AND kategoria_produkt.nazwa in (${productCategories})
        GROUP BY id_przepis, opis, data_dodania,recipes.nazwa
        HAVING ${parseInt(minimumProductNumber)} <= (SELECT COUNT(*) FROM przepis_produkt WHERE id_przepis = recipes.id_przepis)
        ORDER BY  data_dodania::date ${date}, recipes.nazwa ${name}
        `
        pool.query(query,[status], async(error, results) => {
            if (error) {
                console.log(error.stack)
                return response.status(409).json({ status: 'failed', message: error.stack });
            } else {
                return response.status(200).json(results.rows);
            }
        });
    }

}

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
    filterRecipes,
    rejectRecipe,
}