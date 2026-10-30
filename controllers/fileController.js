import File from "../models/File.js";
import User from "../models/User.js";


// create file controller

const createFile = async (req, res) => {

    const { name, content } = req.body;

    if (!name || !content) {
        return res.json({
            message: "Name and content are required"
        });
    }

    const user = await User.findOne({
        username: req.username
    });

    if (!user) {
        return res.json({
            message: "User not found"
        });
    }

    const newFile = await File.create({
        name,
        content,
        owner: user._id
    });

    return res.json({
        message: "File created successfully",
        data: newFile
    });

};


// get all files controller

const getAllFiles = async (req, res) => {

    const user = await User.findOne({
        username: req.username
    });

    if (!user) {
        return res.json({
            message: "User not found"
        });
    }

    const files = await File.find({
        isDeleted: false
    });

    const userFiles = files.filter((file) => {

        if (file.owner.toString() === user._id.toString()) {
            return true;
        }

        const isEditor = file.editors.some((editor) => {
            return editor.toString() === user._id.toString();
        });

        if (isEditor) {
            return true;
        }

        const isViewer = file.viewers.some((viewer) => {
            return viewer.toString() === user._id.toString();
        });

        if (isViewer) {
            return true;
        }

        return false;
    });

    return res.json({
        message: "Files fetched successfully",
        data: userFiles
    });

};


// get file by id controller

const getFileById = (req, res) => {
    const file = req.file;

    return res.json({
        message: "File fetched successfully",
        data: {
            ...file.toObject(),
            permission: req.permission
        }
    });
};



// update file controller

const updateFile = async (req, res) => {

    const { name, content } = req.body;

    const file = req.file;

    if (req.permission === "viewer") {
        return res.json({
            message: "Viewer cannot edit the file"
        });
    }

    if (!name && !content) {
        return res.json({
            message: "Provide name or content to update"
        });
    }

    if (name) {
        file.name = name;
    }

    if (content) {
        file.content = content;
    }

    await file.save();

    return res.json({
        message: "File updated successfully",
        data: file
    });

};

// delete file controller

const deleteFile = async (req, res) => {

    const file = req.file;

    if (req.permission !== "owner") {
        return res.json({
            message: "Only owner can delete the file"
        });
    }

    file.isDeleted = true;

    await file.save();

    return res.json({
        message: "File deleted successfully"
    });

};

// add editor controller

const addEditor = async (req, res) => {

    const file = req.file;

    if (req.permission !== "owner") {
        return res.json({
            message: "Only owner can add editors"
        });
    }

    const { username } = req.body;

    if (!username) {
        return res.json({
            message: "Username is required"
        });
    }

    const user = await User.findOne({
        username
    });

    if (!user) {
        return res.json({
            message: "User not found"
        });
    }

    const alreadyEditor = file.editors.some((editor) => {
        return editor.toString() === user._id.toString();
    });

    if (alreadyEditor) {
        return res.json({
            message: "User is already an editor"
        });
    }

    file.editors.push(user._id);

    await file.save();

    return res.json({
        message: "User added as editor successfully"
    });

};


// remove editor controllerg

const removeEditor = async (req, res) => {

    const file = req.file;

    if (req.permission !== "owner") {
        return res.json({
            message: "Only owner can remove editors"
        });
    }

    const { username } = req.body;

    if (!username) {
        return res.json({
            message: "Username is required"
        });
    }

    const user = await User.findOne({
        username
    });

    if (!user) {
        return res.json({
            message: "User not found"
        });
    }

    const isEditor = file.editors.some((editor) => {
        return editor.toString() === user._id.toString();
    });

    if (!isEditor) {
        return res.json({
            message: "User is not an editor"
        });
    }

    file.editors = file.editors.filter((editor) => {
        return editor.toString() !== user._id.toString();
    });

    await file.save();

    return res.json({
        message: "Editor removed successfully"
    });

};


// add viewer controller

const addViewer = async (req, res) => {

    const file = req.file;

    if (req.permission !== "owner") {
        return res.json({
            message: "Only owner can add viewers"
        });
    }

    const { username } = req.body;

    if (!username) {
        return res.json({
            message: "Username is required"
        });
    }

    const user = await User.findOne({
        username
    });

    if (!user) {
        return res.json({
            message: "User not found"
        });
    }

    const alreadyViewer = file.viewers.some((viewer) => {
        return viewer.toString() === user._id.toString();
    });

    if (alreadyViewer) {
        return res.json({
            message: "User is already a viewer"
        });
    }

    file.viewers.push(user._id);

    await file.save();

    return res.json({
        message: "User added as viewer successfully"
    });

};


// remove viewer controller

const removeViewer = async (req, res) => {

    const file = req.file;

    if (req.permission !== "owner") {
        return res.json({
            message: "Only owner can remove viewers"
        });
    }

    const { username } = req.body;

    if (!username) {
        return res.json({
            message: "Username is required"
        });
    }

    const user = await User.findOne({
        username
    });

    if (!user) {
        return res.json({
            message: "User not found"
        });
    }

    const isViewer = file.viewers.some((viewer) => {
        return viewer.toString() === user._id.toString();
    });

    if (!isViewer) {
        return res.json({
            message: "User is not a viewer"
        });
    }

    file.viewers = file.viewers.filter((viewer) => {
        return viewer.toString() !== user._id.toString();
    });

    await file.save();

    return res.json({
        message: "Viewer removed successfully"
    });

};



export {
    createFile,
    getAllFiles,
    getFileById,
    updateFile,
    deleteFile,
    addEditor,
    removeEditor,
    addViewer,
    removeViewer
};