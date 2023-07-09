import { Router } from "express";
import { input } from "../controllers/transaction.controller.js";

const transactionRouter = Router();

transactionRouter.post('/nova-transacao/:tipo', input);

export default transactionRouter;