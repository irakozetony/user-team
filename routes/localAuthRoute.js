import express from "express";
import passport from "passport";
import { authenticate } from "../auth/localAuth";
import {
    local_user_signup,
    local_user_login,
} from "../controllers/localAuthController";

const localAuthRouter = express.Router();

localAuthRouter.post(
    "/signup",
    passport.authenticate("localSignup", { session: false }),
    local_user_signup
);
localAuthRouter.post("/login", local_user_login);

export default localAuthRouter;
