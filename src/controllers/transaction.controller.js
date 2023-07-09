import {db} from '../database/database.connection.js'
import {transactionSchema} from '../schemas/transaction.schema.js'

export async function input(req, res) {
    const {value, description, type} = req.body;
    const validation = transactionSchema.validate(req.body, {abortEarly: false});
    const input = {
        value,
        description,
        type
    }

    try {
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
        
        if (input.type !== 'entrada') {
            return res.status(422).send('Você não pode enviar algo que não seja uma entrada na rota de entradas.');
        }
        
        if (validation.error) {
            const errors = validation.error.details.map(detail => detail.message);
            return send(errors).status(422);
        }

        await db.collection('transactions').insertOne({input});
        res.sendStatus(201);

    } catch (err) {

    }
}