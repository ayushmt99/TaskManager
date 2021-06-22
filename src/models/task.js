const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URL , {
    useUnifiedTopology : true,
    useCreateIndex : true,
    useNewUrlParser: true,
    useFindAndModify : false,
});

const taskSchema = new mongoose.Schema({
    task : {
        type : String,
        required : true,
        trim : true,
    },
    completed : {
        type : Boolean,
        default : false,
    },
    owner : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : "Users"
    }
},
{
    timestamps : true
})

const Task = mongoose.model("Task", taskSchema);
module.exports = Task;