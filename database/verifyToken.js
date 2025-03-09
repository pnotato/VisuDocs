import jwt from "jsonwebtoken";
import { throwErrorError } from "./error.js";

export const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token;
    if(!token) return next(createError(401, "You are not authenticated!"))

    jwt.verify(token, process.env.JWT, (err, user)=>{
        if(err) return next(createError(401, "Token is not valid!"))
        req.user = user; // return the payload
        next()
    });
}