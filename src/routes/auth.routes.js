import { Router } from "express";
import { signIn, signUp } from "../controllers/user.controller.js";

const authRouter = Router();

authRouter.post('/cadastro', signUp);
authRouter.post('/', signIn);

export default authRouter;