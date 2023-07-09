import bcrypt from 'bcrypt';
import { signupSchema } from '../schemas/signup.schema.js';
import {db} from '../database/database.connection.js'

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
    } catch {
        res.sendStatus(500);
    }
}