import express from 'express';
import { createProject, deleteProject, updateProject, getProject } from '../Controllers/projects.js';
import { verifyToken } from '../verifyToken.js';

const router = express.Router()

router.post("/", createProject)
router.delete("/:id", deleteProject)
router.put("/:id", updateProject)
router.get("/:id", getProject)

// still might need get all projects by user.

export default router;
