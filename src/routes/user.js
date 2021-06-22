const express = require("express");
const User = require("../models/user");
const router = new express.Router();
const sharp = require("sharp")
const { sendWelcomeEmail, sendGoodbyeMail } = require("../emails/account")
const auth = require("../middleware/auth")
const multer = require("multer");

router.get("/users/me" ,auth ,async (req,res)=>{
    res.send(req.user)
})

router.post("/users/login",async (req,res)=>{
    try {
        const user = await User.findByCredentials(req.body.email,req.body.password)
        const token = await user.getAuthToken()
        res.send({user , token})
    } catch (error) {
        res.status(400).send({error : "Could not attempt the login"})
    }
})


router.post("/users/logout", auth, async (req,res)=>{
    try {
        req.user.tokens = req.user.tokens.filter((token)=>{
            return (token.token !== req.tokene)
        })
        await req.user.save();

        res.status(200).send(req.user.tokens)
    } catch (e) {
        res.status(501).send()
    }
})

router.post("/users/logoutAll", auth, async(req,res)=>{
    try {
        req.user.tokens=[];
        await req.user.save();
        res.status(200).send()
    } catch (e) {
        req.status(501).send()
    }
})

router.post("/users" ,async (req, res) => {
    const user = new User(req.body);
    try {
        await user.save()
        sendWelcomeEmail(user.email, user.name)
        const token =await user.getAuthToken()
        res.status(201).send({ user, token })
    } catch (e) {
        res.status(400).send(e.message)
    }
})

router.patch("/users/me",auth, async (req,res) => {
    const allowedUpadtes = ["name" , "email" , "password" , "age"]
    const updates = Object.keys(req.body);

    const isValidUpdate = updates.every((update) => allowedUpadtes.includes(update));

    if(!isValidUpdate){
        return res.status(400).send({ error : "Invalid Parameter to be updated "})
    }

    try {

        updates.forEach((update) => {
            req.user[update] = req.body[update]
        });

        await req.user.save()

        res.send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete("/users/me" ,auth, async (req,res)=>{
    try {
        // const user = await User.findByIdAndDelete(req.user._id)

        // if(!user){
        //     res.status(404).send("No user found")
        // }

        await req.user.remove()
        sendGoodbyeMail(req.user.email, req.user.name)
        res.send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }
})

const upload = multer({
    limits : {
        fileSize : 1000000
    },
    fileFilter (req, file, cb){
        if(!file.originalname.match(/\.(jpg|pdf|png)$/)){
            return cb(new Error("Upload a JPG,PDF or PNG file"))
        }
        cb(undefined, true)
    }
})

router.post("/users/me/avatar",auth,upload.single("avatar"), async (req,res)=>{
    const buffer = await sharp(req.file.buffer).resize({width:250,  height:250}).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
},(error , req, res, next)=>{
    res.status(400).send({ error : error.message })
})

router.delete("/users/me/avatar",auth,upload.single("avatar"), async (req,res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send();
}, (error,req,res,next)=>{
    res.status(400).send({ error : "Could not delete "})
})

router.get("/users/:id/avatar", async(req,res)=>{
    try {
        const Uid = req.params.id;
        const user = await User.findById(Uid)

        if(!user || !user.avatar){
            throw new Error()
        }

        res.set("Content-Type","image/png")
        res.send(user.avatar)
    } catch (e) {
        res.status(400).send({ error : "Could not get you picture "})
    }
})

module.exports = router;
