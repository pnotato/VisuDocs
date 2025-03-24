import Project from "../Models/Project.js";
import User from "../Models/User.js";
import { throwError } from "../error.js";

// create a project
export const createProject = async (req, res, next) => {
    try {
        const proj = new Project({...req.body});
        console.log(req.body);

        const savedProj = await proj.save();

        const userId = req.user?.id || req.body.ownerId;
        if (!userId) {
            return next(throwError(400, "User ID is required"));
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId, 
            { $push: { projects: savedProj._id } }, 
            { new: true }
        );

        if (!updatedUser) {
            return next(throwError(404, "User not found"));
        }

        res.status(200).send(savedProj);
    } catch (err) {
        next(err);
    }
};

// delete a project
export const deleteProject = async (req, res, next) => {
    try {
        const proj = await Project.findById(req.params.id)
        if (req.user.id === proj.ownerId) {
            await Project.findByIdAndDelete(
                req.params.id
            ); 
            res.status(200).json("Project has been deleted")
        } else {
            return next(throwError(403, "You can only delete your own projects."))
        }
    }catch(error) {
        next(error)
    }
}

// rename a project
export const updateProject = async (req, res, next) => {
    try {
        const proj = await Project.findById(req.params.id)
        if (!proj) return next(throwError(404, "Project not found!"))
        if (req.body.ownerId === proj.ownerId) {
            const updatedProj = await Project.findByIdAndUpdate(req.params.id, {
                code: req.body.code
            });
        res.status(200).json("Project has been updated");
        }
        else {
            return next(throwError(403, "You can only update your own projects."))
        }
    }catch(err){
        next(err)
    }  
}

// load a project
export const getProject = async (req, res, next) => {
    try {
        const proj = await Project.findById(req.params.id)
        res.status(200).json(proj)
    }catch(err){
        next(err)
    }
}

// list all projects by user

// add users to project, might not be used for now. may be easier just to know the room code.