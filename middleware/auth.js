import jwt from "jsonwebtoken";

const auth = (req, res, next) => {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.json({
            message: "Token is required"
        });
    }

    const token = authHeader.split(" ")[1];

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.username = decoded.username;

        next();

    } catch (error) {

        return res.json({
            message: "Invalid Token"
        });

    }
};

export default auth;