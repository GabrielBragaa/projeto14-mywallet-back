import { Router } from "express";
import { signUp } from "../controllers/user.controller.js";

const signupRouter = Router();

signupRouter.post('/cadastro', signUp)

export default signupRouter;