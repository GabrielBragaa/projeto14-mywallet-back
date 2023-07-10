import joi from 'joi';

export const transactionSchema = joi.object({
    value: joi.number().required().positive(),
    description: joi.string().required()
})