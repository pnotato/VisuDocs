import mongoose from "mongoose";
import User from "../Models/User.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


// sign up
export const signUp = async (req, res, next) => {
    try {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);
        const newUser = new User({...req.body, password: hash}) // Change this line later. I'm not sure if the request body will be different.

        await newUser.save()
        res.status(200).send("User has been created!")
    } catch(err) {
        next(err)
    }
}

// sign in
export const signIn = async (req, res, next) => {
    try {
        const user = await User.findOne({name: req.body.name});
        if (!user) return next("No user found") // createError(404, "User not found")
    } catch(error) {
        next(error)
    }
}

// sign in google auth