import express from 'express';
import { createProject, deleteProject, renameProject, getProject } from '../Controllers/projects.js';
import { verifyToken } from '../verifyToken.js';

const router = express.Router()

router.post("/", verifyToken, createProject)
router.delete("/:id", verifyToken, deleteProject)
router.put("/:id", renameProject)
router.get("/", getProject)

// still might need get all projects by user.

export default router;
