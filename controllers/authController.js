import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";


// Register controller

const register = async (req, res) => {

    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.json({
            message: "All fields are required"
        });
    }

    try {

        const existingUser = await User.findOne({
        username: username
        });

        if (existingUser) {
            return res.json({
                message: "Username or email already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            username,
            email,
            password: hashedPassword
        });

        return res.json({
            message: "User registered successfully",
            data: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email
            }
        });

    } catch (error) {

        return res.json({
            message: "Error registering user",
            error: error.message
        });

    }
};



// Login controller

const login = async (req, res) => {

    const { username, password } = req.body;

    if (!username || !password) {
        return res.json({
            message: "Username and password are required"
        });
    }

    try {

        const user = await User.findOne({
            username: username
        });

        if (!user) {
            return res.json({
                message: "Invalid credentials"
            });
        }

        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordCorrect) {
            return res.json({
                message: "Invalid credentials"
            });
        }

        const token = jwt.sign(
            {
                username: user.username
            },
            process.env.JWT_SECRET
        );

        return res.json({
            message: "Login successful",
            token
        });

    } catch (error) {

        return res.json({
            message: "Error Can't login",
            error: error.message
        });

    }

};


export { register, login };