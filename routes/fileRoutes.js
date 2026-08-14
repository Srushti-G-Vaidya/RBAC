import express from "express";
import auth from "../middleware/auth.js";
import filePermission from "../middleware/filePermission.js"

import {
    createFile,
    getAllFiles,
    getFileById,
    updateFile,
    deleteFile,
    addEditor,
    removeEditor,
    addViewer,
    removeViewer
} from "../controllers/fileController.js";

const router = express.Router();

router.post("/", auth, createFile);
router.get("/", auth, getAllFiles);
router.get("/:id", auth, filePermission, getFileById);
router.put("/:id", auth, filePermission, updateFile);
router.delete("/:id", auth, filePermission, deleteFile);
router.post("/:id/editors", auth, filePermission, addEditor);
router.delete("/:id/editors", auth, filePermission, removeEditor);
router.post("/:id/viewers", auth, filePermission, addViewer);
router.delete("/:id/viewers", auth, filePermission, removeViewer);


export default router;