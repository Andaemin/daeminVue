import express from "express";
import { getUsers, oneUser, updateUser, deleteUser } from "../controllers/users.js";
const router = express.Router();

router.get("/", getUsers);
router.get("/:id", oneUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
export default router;
