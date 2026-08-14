import express from "express";
import auth from "../middleware/auth.js";

import {
    createFile,
    getAllFiles,
    getFileById
} from "../controllers/fileController.js";

const router = express.Router();

router.post("/", auth, createFile);
router.get("/", auth, getAllFiles);
router.get("/:id", auth, getFileById);

export default router;