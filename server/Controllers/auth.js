import mongoose from "mongoose";
import { throwError } from '../error.js'
import User from "../Models/User.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


// sign up
export const signUp = async (req, res, next) => {
    try {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);
        const newUser = new User({...req.body, password: hash}) // Change this line later. I'm not sure if the request body will be different.

        const savedUser = await newUser.save();
        const token = jwt.sign({ id: savedUser._id }, process.env.JWT);
        const { password, ...userWithoutPassword } = savedUser._doc;

        res.cookie("access_token", token, {
            httpOnly: true,
            sameSite: "lax",
            secure: false,
        }).status(200).json(userWithoutPassword)

    } catch(err) {
        next(err)
    }
}

// sign in
export const signIn = async (req, res, next)=>{ 
    try {
        const user = await User.findOne({email:req.body.email});
        if (!user) return next(throwError(404, "User Not Found"));

        const isCorrect = await bcrypt.compare(req.body.password, user.password);
        if (!isCorrect) return next(throwError(400, "Invalid Credentials"))

        const token = jwt.sign({id: user._id}, process.env.JWT) 
        const {password, ...others} = user._doc; 

        res.cookie("access_token", token, {
            httpOnly:true,
            sameSite: "lax",
            secure: false,
        })
        .status(200)
        .json(others);
    }catch(err){
        next(err)
    }
}

// sign in google auth
export const googleAuth = async (req, res, next) => {
    try {
        const user = await User.findOne({email: req.body.email});
        if (user) { // applies if there's already an account that exists.
            const token = jwt.sign({id: user._id}, process.env.JWT);
            res.cookie("access_token", token, {
                httpOnly:true
            })
            .status(200)
            .json(user._doc);
        } else {
            const newUser = new User({
                ...req.body,
                fromGoogle: true
            })
            const savedUser = await newUser.save()
            const token = jwt.sign({id: savedUser._id}, process.env.JWT);
            res.cookie("access_token", token, {
                httpOnly:true
            })
            .status(200)
            .json(savedUser._doc);
        }
    } catch {
        next(err);
    }
}