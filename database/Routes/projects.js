import express from 'express';
import { createProject, deleteProject, updateProject, getProject } from '../Controllers/projects.js';
import { verifyToken } from '../verifyToken.js';

const router = express.Router()

router.post("/", createProject)
router.delete("/:id", verifyToken, deleteProject)
router.put("/:id", updateProject)
router.get("/:id", getProject)

export default router;
