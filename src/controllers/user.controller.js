import bcrypt from 'bcrypt';
import { signupSchema } from '../schemas/signup.schema.js';
import { signInSchema } from '../schemas/signin.schema.js';
import {db} from '../database/database.connection.js'
import { v4 as uuid } from 'uuid';

export async function signUp(req, res) {
    const {name, email, password} = req.body;
    const validation = signupSchema.validate(req.body, {abortEarly: false});
    const cryptoPass = bcrypt.hashSync(password, 10);
    const user = {
        name,
        email,
        password: cryptoPass
    }

    try {
        const alreadyExists = await db.collection('users').findOne({email})

        if (alreadyExists) {
            return res.sendStatus(409);
        }

        if (validation.error) {
            const errors = validation.error.details.map(detail => detail.message);
            return res.status(422).send(errors);
        } else {
            await db.collection('users').insertOne(user);
            await db.collection("users").find().toArray()
                .then(users => {
                    console.log(users); // array de usuários
                })
            res.sendStatus(201);
        }
    } catch (err) {
        res.send(err).status(500);
    }
}

export async function signIn(req, res) {
    const {email, password} = req.body;
    const user = await db.collection('users').findOne({email});
    const username = user.name;
    const validation = signInSchema.validate(req.body, {abortEarly: false});

    try {
        if (!user) {
            return res.sendStatus(404);
        }

        if (!bcrypt.compareSync(password, user.password)) {
            return res.sendStatus(401);
        }
        
        if (validation.error) {
            const errors = validation.error.details.map(detail => detail.message);
            return res.send(errors).status(422);
        }

        if (user && bcrypt.compareSync(password, user.password)) {
            const token = uuid();
            const data = [{token: token, name: user.name}]
            await db.collection('sessions').insertOne({userId: user._id, token});
            res.send(data).status(200);
        }
    } catch (err) {
        res.send(err).status(500);
    }
}
