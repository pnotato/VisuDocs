import User from "../Models/User.js";
import { throwError } from "../error.js";

// get a user
export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id)
        res.status(200).json(user)
    }catch(err) {
        next(err)
    }

};

// delete user
export const deleteUser = async (req, res, next) => {
    if (req.params.id === req.user.id) {
        try {
            await User.findByIdAndDelete(
                req.params.id
            ); 
            res.status(200).json("User has been deleted")
        }catch(err){
            next(err)
        }
    }
    else {
        return next(throwError(403, "You can only delete your own account!"))
    }
}

// update user
export const updateUser = async (req, res, next) => {
    if (req.params.id === req.user.id) {
        try {
            const updatedUser = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body
            }, 
            { new: true }); // will return the new result
            res.status(200).json(updatedUser)
        }catch(err){
            next(err)
        }
    }
    else {
        return next(throwError(403, "You can only update your own account!"))
    }
};