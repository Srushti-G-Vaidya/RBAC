import File from "../models/File.js";
import User from "../models/User.js";
import mongoose from "mongoose";

const filePermission = async (req, res, next) => {

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
        isDeleted: false
    }).populate("owner");

    if (!file) {
        return res.json({
            message: "File not found"
        });
    }


    // Check owner
    console.log(1)
    console.log(file.owner.toString())
    console.log(user._id.toString())
    if (file.owner._id.toString() === user._id.toString()) {
        console.log(2)
        
        req.file = file;
        req.permission = "owner";
        
        return next();
        
    }
    
    
    // check editor
    
    console.log(3)
    const isEditor = file.editors.some((editor) => {
        return editor.toString() === user._id.toString();
    });
    
    if (isEditor) {
        
        console.log(4)
        req.file = file;
        req.permission = "editor";
        
        return next();
        
    }
    
    
    // check viewer
    
    console.log(5)
    const isViewer = file.viewers.some((viewer) => {
        return viewer.toString() === user._id.toString();
    });
    
    if (isViewer) {
        
        console.log(6)
        req.file = file;
        req.permission = "viewer";
        
        return next();
        
    }
    
    
    // no permission
    
    console.log(7)
    return res.json({
        message: "You don't have permission to access this file"
    });

};


export default filePermission;