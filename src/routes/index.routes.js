import { Router } from "express";
import signupRouter from './signup.routes.js';

const router = Router();

router.use(signupRouter);

export default router;