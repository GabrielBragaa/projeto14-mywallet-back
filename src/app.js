import express from 'express';
import { MongoClient } from 'mongodb';
import cors from 'cors';
import joi from 'joi';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

const app = express();
app.use(express.json());
app.use(cors());

dotenv.config();

const mongoClient = new MongoClient(process.env.DATABASE_URL);
let db;

mongoClient.connect()
.then(() => db = mongoClient.db())
.catch((err) => console.log(err.message));

const signupSchema = joi.object({
    name: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.string().min(3).required()
})

app.post('/cadastro', async (req, res) => {
    const {name, email, password} = req.body;
    const validation = signupSchema.validate(req.body, {abortEarly: false});
    const cryptoPass = bcrypt.hashSync(password, 10);
    const user = {
        name,
        email,
        password: cryptoPass
    }

    try {

        if (!name || typeof name !== 'string') {
            return res.sendStatus(422);
        }

        if (!email || typeof email !== 'string') {
            return res.sendStatus(422);
        }

        if (!password || password.length < 3) {
            return res.sendStatus(422);
        }

        const alreadyExists = await db.collection('users').findOne({email})

        if (alreadyExists) {
            return res.sendStatus(409);
        }

        await db.collection('users').insertOne(user);
        res.sendStatus(201);
    } catch {
        res.sendStatus(500);
    }
})

app.listen(5000);