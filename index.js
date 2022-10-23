import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import userRouter from "./app/routers/userRouter.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

mongoose.connection.on("connected", () => {
    console.log("connected to mongo");
});

mongoose.connection.on("error", (err) => {
    console.log("connected to mongo", err);
});

app.use("/api/user", userRouter);

app.get("/", (req, res) => {
    res.send("Server is ready");
});

app.use((err, req, res, next) => {
    res.status(500).send({ message: err.message });
});

const port = process.env.PORT || 6000;
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
