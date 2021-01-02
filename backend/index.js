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
  pool.query('SELECT "id_uzytkownika", "haslo", "zablokowany" FROM "uzytkownik" WHERE "email"=$1;', [email], async(error, results) => {
    if (error) {
      return response.status(409).json({ status: 'failed', message: error.stack });
    } else {
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


const loginAdmin = async(request, response) => {
  const nickname = request.body.nickname;
  pool.query('SELECT "id_admin", "haslo" FROM "admin" WHERE "pseudonim"=$1;', [nickname], async(error, results) => {
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
  try {
    const decoded = jwt.verify(token, PrivateKey);
    const user_id = decoded._id
    pool.query('SELECT * FROM "uzytkownik" WHERE "id_uzytkownika"=$1;', [user_id], async(error, results) => {
      if (error) {
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

const addProduct = async(request, response) =>{
  const product = request.body.product;
  pool.query('INSERT INTO "produkt" ("id_kategoria_produkt", "nazwa") VALUES ($1, $2);', [1, product], (error) => {
    if (error) {
      response.status(409).json({ status: 'failed', message: error.stack });
    } else {
      response.status(201).json({ status: 'success', message: 'Product added.' });
    }
  });
}

const addProductCategory = async(request, response) =>{
  const product_category = request.body.product_category;
  pool.query('INSERT INTO "kategoria_produkt" ("nazwa") VALUES ($1);', [product_category], (error) => {
    if (error) {
      response.status(409).json({ status: 'failed', message: error.stack });
    } else {
      response.status(201).json({ status: 'success', message: 'Product category added.' });
    }
  });
}

const addRecipeCategory = async(request, response) =>{
  const recipe_category = request.body.recipe_category;
  pool.query('INSERT INTO "kategoria_przepis" ("nazwa") VALUES ($1);', [recipe_category], (error) => {
    if (error) {

      response.status(409).json({ status: 'failed', message: error.stack });
    } else {
      response.status(201).json({ status: 'success', message: 'Recipe category added.' });
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

        response.status(409).json({ status: 'failed', message: error.stack });
      } else {
        response.status(201).json({ status: 'success', message: 'Forum topic added.' });
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
  const decode = jwt.verify(token, PrivateKey);
  const user_id = decode._id;
  const status = request.body.status;
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
  JOIN akceptacja_przepisu USING(id_przepis)
  WHERE id_przepis=$1 AND status='oczekujący'`
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

app.route('/add_product').post(addProduct);
app.route('/add_product_category').post(addProductCategory);
app.route('/add_recipe_category').post(addRecipeCategory);
app.route('/add_forum_topic').post(addForumTopic);
app.route('/register').post(registerUser);
app.route('/login').post(loginUser);
app.route('/user').post(getUserInfo);
app.route('/loginAdmin').post(loginAdmin);
app.route('/get_users').post(getUsers);
app.route('/user_blocking').post(blockingUsers);
app.route('/get_info').post( getInfo);
app.route('/sent_message').post(sendMessage);
app.route('/get_messages').post(getMessages);
app.route('/add_recipe').post(addRecipe);
app.route('/get_recipes').post(getRecipes);
app.route('/get_recipe').post(getRecipe);
app.route('/get_recipe_products').get(getRecipeProducts);
app.route('/get_recipe_categories').get(getRecipeCategories);
app.route('/like_recipe').post(likeRecipe);
app.route('/dislike_recipe').post(dislikeRecipe);
app.route('/add_comment').post(addComment);
app.route('/get_comments').get(getComments);
app.route('/accept_recipe').get(acceptRecipe);
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});