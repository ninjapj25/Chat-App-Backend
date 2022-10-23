import express from "express";
import expressAsyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import User from "../models/user.js";
import { generateToken } from "../utils.js";
import moment from "moment/moment.js";

const userRouter = express.Router();

userRouter.post(
    "/login",
    expressAsyncHandler(async (req, res) => {
        const user = await User.findOne({ username: req.body.username });
        if (user) {
            const samePassword = await bcrypt.compareSync(
                req.body.password,
                user.password
            );
            if (samePassword) {
                res.send({
                    id: user._id,
                    last_login: moment.now(),
                    username: user.username,
                    token: generateToken(user),
                });
                return;
            }
        }
        res.send({ error: "Invalid email or password" });
    })
);

userRouter.post(
    "/register",
    expressAsyncHandler(async (req, res) => {
        const duplicateUser = await User.findOne({
            username: req.body.username,
        });
        if (duplicateUser) {
            // error
            res.send({
                error: `Username ${req.body.username} already exist`,
            });
        } else {
            const user = new User({
                username: req.body.username,
                password: bcrypt.hashSync(req.body.password, 8),
            });
            const createdUser = await user.save();
            res.status(200).send({
                id: createdUser._id,
                username: createdUser.username,
            });
        }
    })
);

export default userRouter;
