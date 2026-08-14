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
        owner: user._id,
        isDeleted: false
    });

    return res.json({
        message: "Files fetched successfully",
        data: files
    });

};


// get file by id controller

const getFileById = async (req, res) => {

    const id = req.params.id;

    const user = await User.findOne({
        username: req.username
    });

    if (!user) {
        return res.json({
            message: "User not found"
        });
    }

    const file = await File.findOne({
        _id: id,
        owner: user._id,
        isDeleted: false
    });

    if (!file) {
        return res.json({
            message: "File not found"
        });
    }

    return res.json({
        message: "File fetched successfully",
        data: file
    });

};


export {
    createFile,
    getAllFiles,
    getFileById
};