const express = require("express");
const userRouter = require("./src/routes/user")
const taskRouter = require("./src/routes/task")
//require("dotenv").config()

const app = express();
const port = process.env.PORT


app.use(express.json());
app.use(userRouter);
app.use(taskRouter)

app.listen(port , () => {
    console.log("Server is up on port "+port);
})

const Task = require("./src/models/task");
const User = require("./src/models/user")
