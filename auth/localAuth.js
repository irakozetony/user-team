import passport from "passport";
import { Strategy as localStrategy } from "passport-local";
import models from '../database/models/index';
import bcrypt, { hash } from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const genToken = (user) => {
    return jwt.sign(
        {
            id: user.id,
            email: user.email,
        },
        process.env.SECRET
    );
};
const localSignupStrategy = new localStrategy(
    {
        usernameField: "email",
        passwordField: "password",
    },
    async (email, password, done) => {
        try {
            const user = await models.User.findOne({
                where: { email: email },
            });
            if (user) {
                return done({ message: user.email + " is already registered" });
            }
            console.log(user);
            bcrypt.genSalt(10, (err, salt) => {
                if (err) return next(JSON.stringify(err));
                bcrypt.hash(password, salt, async (err, hash) => {
                    if (err) return next(err);

                    const newUser = await models.User.create({
                        email: email,
                        password: hash,
                    });
                    const token = genToken(newUser);
                    return done(null, token);
                });
            });
        } catch (err) {
            done({ error: JSON.stringify(err) });
        }
    }
);

export const authenticate = (req, res, next) => {
    const authorizationHeader = req.header("Authorization");

    if (!authorizationHeader)
        res.status(403).json({ error: "Uanauthorized request" });
    try {
        const token = authorizationHeader.substring("Bearer ".length);
        jwt.verify(token, process.env.SECRET, (err, user) => {
            if (err)
                return res
                    .status(403)
                    .json({ error: err, message: "Invalid credentials" });
            req.user = user;
            next();
        });
    } catch (err) {
        res.status(403).json({ error: err });
    }
};
export const localSignup = passport.use("localSignup", localSignupStrategy);
