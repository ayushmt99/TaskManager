// CRUD opertations Create Read Update Delete
const mongodb = require("mongodb");
const mongoClient = mongodb.MongoClient;
const ObjectID = mongodb.ObjectID;


const connectionURL = "mongodb://127.0.0.1:27017" 
const databaseName = "Task-Manager"
const id = new ObjectID();
// console.log(id);
// console.log(id.getTimestamp());

                                                // CREATE TASK //
// mongoClient.connect(connectionURL, { useUnifiedTopology : true } , (error, client) => {
//     if(error){
//         return console.log("Error connecting to the database");
//     }

    // const db= client.db(databaseName);

    // db.collection("users").insertOne({
    //     _id : id,
    //     name : "Arjit",
    //     age : 24
    // }, (error, result) => {
    //     if(error){
    //         return console.log("Unable to insert documnet");
    //     }

    //     console.log(result.ops); 
    // });



    // db.collection("users").insertMany([
    //     {
    //         name : "Ayushmaan",
    //         age : 21
    //     },
    //     {
    //         name : "Aman",
    //         age : 21   
    //     }
    // ], (error, result) => {
    //     if(error){
    //         return console.log("Unable to insert the document(s)");
    //     }

    //     console.log(result.ops);
    // });


    // db.collection("Tasks").insertMany([
    //     {
    //     task : "Is the server running?",
    //     completed : true
    //     },
    //     {
    //     task : "Is the Data collected?",
    //     completed : false
    //     },
    //     {
    //         task: "Are the calculations complete?",
    //         completed : false
    //     }], (error, reuslt) => {
    //         if(error){
    //             return console.log("Unable to load in the data");
    //         }

    //         console.log(reuslt.ops);
    //     });
// } );



                                            // READ TASKS

// mongoClient.connect(connectionURL, { useUnifiedTopology : true } , (error, client) => {
//     if(error){
//         return console.log("Error connecting to the database");
//     }

//     const db= client.db(databaseName);

//     // db.collection('users').findOne({name : "Arjit"}, (error,user) => {
//     //     if(error){
//     //         return console.log("Unable to retriver data");
//     //     }

//     //     console.log(user);
//     // });

   
//     // db.collection('users').find({ age : 21 }).toArray((error, user) => {
//     //     if(error){
//     //         return console.log("Unable to retrieve out the data");
//     //     }

//     //     console.log(user);
//     // });

    
//     // db.collection('users').find({ age : 21 }).count((error,user) => {
//     //         if(error){
//     //             return console.log("Could not count the data");
//     //         }
            
//     //     console.log(user);
//     // })

//     // db.collection('Tasks').findOne({  _id : new ObjectID("60b291899f0172390c5571f3") }, (error,user) => {
//     //     if(error){
//     //         return console.log("Error");
//     //     }

//     //     console.log(user);
//     // });


//     // db.collection("Tasks").find( { completed : false } ).toArray((error,user) => {
//     //     if(error){
//     //         return console.log("Error");
//     //     }

//     //     console.log(user);
//     // });
// });