import express from "express";
import { getUsers, oneUser, updateUser, deleteUser } from "../controllers/users.js";
import multer from "multer";
const router = express.Router();
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/profile/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});
const upload = multer({ storage });

router.get("/", getUsers);
router.get("/:id", oneUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
router.patch("/:id/profileImage", upload.single("image"), updateProfileImage);

export default router;
