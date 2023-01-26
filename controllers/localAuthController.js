import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import models from '../database/models/index';


const compare = bcrypt.compare;
const sign = jwt.sign;

export const local_user_signup = async (req, res, next) => {
    console.log(req.user)
    if(req.user.status === 400){
        return res.status(400).json({message: req.user.message})
    }
    res.status(200).json({ message: "Signup succesful", user_token: req.user });
};

export const local_user_login = async (req, res, next) => {
    const email = req.body.email;

    try {
        const user = await models.User.findOne({ where: { email: email } });
        if (!user) return res.status(400).json({ error: "User not found" });
        if (await compare(req.body.password, user.password)) {
            const userData = { id: user.id, email: user.email };
            const token = sign(userData, process.env.SECRET);
            res.json({
                user_token: token,
                message: "Log in succesful",
                email: user.email,
            });
        } else return res.status(400).json({ error: "Wrong credentials" });
    } catch (err) {
        return res.status(400).json({ error: err });
    }
};
