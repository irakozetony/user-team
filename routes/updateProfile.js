import express from "express";
import { updateUser } from "../controllers/localAuthController";

const updateRoute = express.Router();

updateRoute.patch('/', updateUser);
export default updateRoute;