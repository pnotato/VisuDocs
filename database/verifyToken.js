import jwt from "jsonwebtoken";
import { throwError } from "./error.js";

export const verifyToken = (req, res, next) => {
    // console.log("Cookies received:", req.cookies);
    const token = req.cookies.access_token;
    if(!token) return next(throwError(401, "You are not authenticated!"))

    jwt.verify(token, process.env.JWT, (err, user)=>{
        if(err) return next(throwError(401, "Token is not valid!"))
        req.user = user; 
        next()
    });
}