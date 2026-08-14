import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import connectDB from "./db.js";

connectDB()
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`Server is started at ${process.env.PORT}`);
        });
    })
    .catch(() => {
        console.log("ERR! Couldn't start the server!");
    });