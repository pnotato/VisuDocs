import express from 'express'
import { getUser, deleteUser, updateUser } from '../Controllers/users.js'
import { verifyToken } from '../verifyToken.js'

const router = express.Router()

router.get("/find/:id", getUser)
router.delete("/:id", verifyToken, deleteUser)
router.put("/:id", verifyToken, updateUser)

// need get all projects as well.

export default router;