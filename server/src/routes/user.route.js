// Routes -> Middleware (optional, for example auth to make sure certain actions are for qualified accounts) -> Controller
import { Router } from "express";
import { UserController } from "../controllers/user.controller";
const userRouter = Router();

export default userRouter;
