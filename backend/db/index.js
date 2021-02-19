import postgre from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = postgre;

const connectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`

export const pool = new Pool({
  connectionString: connectionString ,
  ssl: true,
  max: 5,
})

