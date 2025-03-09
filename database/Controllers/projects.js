import User from "../Models/User";
import Project from "../Models/Project";
import { throwError } from "../error";

// create a project
export const createProject = async (req, res, next) => {
    const proj = new Project({...req.body, ownerId: req.user.id})
    try {
        const savedProj = await proj.save()
        res.status(200).send(savedProj)
    } catch(err) {
        next(err);
    }
}

// delete a project
export const deleteProject = async (req, res, next) => {
    if (req.params.id === req.user.id) {
        try {
            await Project.findByIdAndDelete(
                req.params.id
            ); 
            res.status(200).json("Project has been deleted")
        }catch(err){
            next(err)
        }
    }
    else {
        return next(createError(403, "You can only delete your own projects."))
    }
}

// rename a project
export const renameProject = async (req, res, next) => {
    try {
        const proj = await Project.findById(req.params.id)
        if (!proj) return next(createError(404, "Project not found!"))
        if (req.user.id === proj.userId) {
            const updatedProj = await Project.findByIdAndUpdate({
                title: req.params.id
            });
        res.status(200).json("Project has been renamed");
        }
        else {
            return next(createError(403, "You can only update your own projects."))
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