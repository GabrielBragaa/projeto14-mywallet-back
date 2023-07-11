import { ObjectId } from 'mongodb';
import {db} from '../database/database.connection.js'
import {transactionSchema} from '../schemas/transaction.schema.js'

export async function input(req, res) {
    const {authorization} = req.headers;
    const token = authorization?.replace('Bearer ', '');
    let {value, description} = req.body;
    value = Number(value);
    const type = req.params.tipo;
    const validation = transactionSchema.validate(req.body, {abortEarly: false});
    const input = {
        value,
        description,
        type,
        token
    }
    
    try {
        if (!token) {
            return res.status(401).send('Faça login novamente.')
        }

        const alreadyExists = await db.collection('transactions').findOne({input});

        if (alreadyExists) {
            return res.status(409).send('Você já criou essa transação.')
        }

        if (typeof value !== 'number') {
            return res.status(422).send('O valor precisa ser um número.')
        }

        if (!value || !description || !type) {
            return res.status(422).send('Preencha todos os campos.')
        }
        
        if (validation.error) {
            const errors = validation.error.details.map(detail => detail.message);
            return send(errors).status(422);
        }

        await db.collection('transactions').insertOne({input});

        res.send(db.collection('transactions').findOne({input}));

    } catch (err) {
        return res.status(500).send(err);
    }
}

export async function output(req, res) {
    const {authorization} = req.headers;
    const token = authorization?.replace('Bearer ', '');

    try {
        const transactions = await db.collection('transactions').find({'input.token': token}).toArray();
        res.send(transactions);
    } catch (err) {
        console.log(err);
    }
}