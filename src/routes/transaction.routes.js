import { Router } from "express";
import { input, output } from "../controllers/transaction.controller.js";

const transactionRouter = Router();

transactionRouter.post('/nova-transacao/:tipo', input);
transactionRouter.get('/home', output)

export default transactionRouter;