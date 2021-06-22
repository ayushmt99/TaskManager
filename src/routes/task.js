const express = require("express");
const Task = require("../models/task.js");
const auth = require("../middleware/auth")
const route = new express.Router();

route.post('/tasks', auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })

    try {
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

//Get /tasks?completed=true
//Get /tasks?limit=2&skip=2
//Get /tasks?sortBy=createdAt:dsc
route.get('/tasks', auth, async (req, res) => {
      const match = {}
      const sort = {}

    if(req.query.sortBy){
        const part = req.query.sortBy.split(":")
        sort[part[0]] = part[1] === "desc" ? -1 : 1;
    }

    if (req.query.completed) {
        match.completed = req.query.completed === 'true'
    }
    try {
        await req.user.populate({
            path : "tasks",
            match,
            options : {
                limit : parseInt(req.query.limit),
                skip : parseInt(req.query.skip),
                sort,
            }
        }).execPopulate()
        res.send(req.user.tasks)
    } catch (e) {
        res.status(500).send()
    }
})


route.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id

    try {
        const task = await Task.findOne({ _id, owner: req.user._id })
        console.log(_id);
        console.log(req.user._id);
        if (!task) {
            return res.status(404).send()
        }

        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})


route.patch("/tasks/:id",auth, async (req,res)=>{
    const taskUpdate = Object.keys(req.body)
    const canUpdate = ["task", "completed"]

    const isValid = taskUpdate.every((update) => canUpdate.includes(update))

    if(!isValid){
        return res.status(400).send({ error : "Cannot find field to Update"})
    }
    
    try {
        // const task = await Task.findById(req.params.id)
        const task = await Task.findOne({_id : req.params.id, owner : req.user._id})
       
        if(!task){
            return res.status(400).send({ error : "Could not find task "})
        }
        
        taskUpdate.forEach((update)=>{
            task[update]=req.body[update]
        })
        
        await task.save()
        
        //const task = await Task.findByIdAndUpdate(req.params.id , req.body , { new : true ,  runValidators : true})


        res.send(task)
    } catch (e) {
        res.status(404).send({ error : "Could not update data "})
    }
})

route.delete("/tasks/:id" ,auth, async (req,res)=>{
    try {
        //const task = await Task.findByIdAndDelete(req.params.id)
        const task = await Task.findOne({_id:req.params.id, owner : req.user._id })
        if(!task){
            res.status(404).send("No user found")
        }

        res.send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})


module.exports = route;