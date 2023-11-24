import express from "express"
import env from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import userAuth from "./routes/userAuth.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/user",userAuth);

env.config();

const connnectionString = process.env.DB_URL;
mongoose.connect(connnectionString)
.then(() => console.log("database connected Successfully"))
.catch((err) => console.log(err));


app.get("/",(req,res) => {
    res.send("Welcome to backend");
});

const PORT = process.env.PORT;

app.listen(PORT, console.log(`the server is running on port ${PORT}`))