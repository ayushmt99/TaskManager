const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const Task = require("./task")

mongoose.connect(process.env.MONGO_URL , {
    useUnifiedTopology : true,
    useCreateIndex : true,
    useNewUrlParser: true,
    useFindAndModify : false,
});

const userSchema = new mongoose.Schema(
    {
        name : {
            type : String,
            required : true,
            trim : true,
            lowercase : true,
        },
        password : {
            type : String,
            trim : true,
            required : true,
            minlength : 7,
            validate(value){
                if(value.toLowerCase().includes("password")){
                    throw new Error("The password must not contain the word 'password'");
                }
            },
            },
    
        email : {
            type : String,
            unique : true,
            required : true,
            trim : true,
            lowercase : true,
            validate(value){
                if(!validator.isEmail(value)){
                    throw new Error("Invalid Email")
                }
            }
        },
        age : {
            type : Number,
            default : 0,
            validate(value){
                if(value < 0){
                    throw new Error("Age must be greater than 0")
                }
            }
        },
        tokens : [{
            token:{
                type : String,
                required: true
            }
        }],
        avatar : {
            type : Buffer
        }
    },{
        timestamps:true
    })

//Creating Virtual Property
userSchema.virtual("tasks",{
    ref : "Task",
    localField : "_id",
    foreignField : "owner"
})

//Hiding the Sensitive data
userSchema.methods.toJSON = function(){
    const user = this;

    const userObject = user.toObject()

    delete userObject.password;
    delete userObject.tokens;
    delete userObject.avatar;
    return userObject
}

//Generating Auth Token
userSchema.methods.getAuthToken = async function() {
    const user = this
    const token = jwt.sign({id : user._id.toString()}, process.env.JWT_SECRET)

    user.tokens = user.tokens.concat({ token })
    await user.save()
    
    return(token)

}

//Checking the login data
userSchema.statics.findByCredentials= async (email,password)=>{
    const user = await User.findOne({email : email})

    if(!user){
        throw new Error("Could not find the email to login")
    }

    const isMatch = await bcrypt.compare(password,user.password)
    if(!isMatch){
        throw new Error("Password did not match. Try Again!")
    }
    return user
}

//Hashing of the plain text password
userSchema.pre("save", async function(next){
    const user = this

    if(user.isModified("password")){
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

//Delete user task when user is removed
userSchema.pre("remove", async function(req,res,next){
    const user = this;
    await Task.deleteMany({owner : user._id})
    next();
})
const User = mongoose.model("Users",userSchema);

module.exports = User;