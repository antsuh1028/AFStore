import pg from 'pg';
import dotenv from 'dotenv';

const { Pool } = pg;

dotenv.config();


const connectionString = `postgresql://${process.env.DEV_DB_USERNAME}:${process.env.DEV_DB_PASSWORD}@${process.env.DEV_DB_HOSTNAME}/${process.env.DEV_DB_NAME}?sslmode=require`;

const pool = new Pool({ connectionString });


export const db = {
  query: (text, params) => pool.query(text, params),
};