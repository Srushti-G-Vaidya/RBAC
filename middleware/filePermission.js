import File from "../models/File.js";
import User from "../models/User.js";


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
    });

    if (!file) {
        return res.json({
            message: "File not found"
        });
    }


    // Check owner

    if (file.owner.toString() === user._id.toString()) {

        req.file = file;
        req.permission = "owner";

        return next();

    }


    // check editor

    const isEditor = file.editors.some((editor) => {
        return editor.toString() === user._id.toString();
    });

    if (isEditor) {

        req.file = file;
        req.permission = "editor";

        return next();

    }


    // check viewer

    const isViewer = file.viewers.some((viewer) => {
        return viewer.toString() === user._id.toString();
    });

    if (isViewer) {

        req.file = file;
        req.permission = "viewer";

        return next();

    }


    // no permission

    return res.json({
        message: "You don't have permission to access this file"
    });

};


export default filePermission;