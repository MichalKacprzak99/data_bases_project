import { pool } from '../db/index.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const PrivateKey = process.env.PRIVATE_KEY

const getTopics = async(request, response) =>{

    pool.query('SELECT * FROM temat_forum;', (error, results) => {
        if (error) {
        console.log(error.stack)
        response.status(409).json({ status: 'failed', message: error.stack });
        } else {
        response.status(200).json(results.rows);
        }
    });
}

const getComments = async(request, response) =>{
    const id_topic = request.query.id_topic
    pool.query('SELECT * FROM wpis WHERE id_temat=$1;',[id_topic], (error, results) => {
        if (error) {
            response.status(409).json({ status: 'failed', message: error.stack });
        } else {
            response.status(200).json(results.rows);
        }
    });
}

const addComment = async(request, response) => {
    const id_topic = request.query.id_topic
    const description = request.body.description;
  
    const token = request.body.token;
    const decode = jwt.verify(token, PrivateKey);
    const user_id = decode._id;
  
    const query =  `SELECT dodaj_wpis($1,$2,$3);`
    pool.query(query,[id_topic, user_id, description], async(error, results) => {
      if (error) {
        console.log(error.stack)
        return response.status(409).json({ status: 'failed', message: error.stack });
      } else {
        return response.status(200).json(true);
      }
    });
  
  };

export default {
    getTopics,
    getComments,
    addComment,

}