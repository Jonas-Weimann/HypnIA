import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const config = {
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.POSTGRES_PORT,
}

const dbClient = new Pool(config)

export default dbClient;
