// CRUD opertations Create Read Update Delete
const mongodb = require("mongodb");
const mongoClient = mongodb.MongoClient;
const ObjectID = mongodb.ObjectID;


const connectionURL = "mongodb://127.0.0.1:27017" 
const databaseName = "Task-Manager"
const id = new ObjectID();
// console.log(id);
// console.log(id.getTimestamp());

mongoClient.connect(connectionURL, { useUnifiedTopology : true } , (error, client) => {
    if(error){
        return console.log("Error connecting to the database");
    }

    const db= client.db(databaseName);

    // db.collection("users").updateOne({
    //     _id : new ObjectID("60b21ad7901bba3e4cdae4a9"),
    // },{
    //     $set: {
    //         name :"Sameer",
    //     }
    // }).then((result) => {
    //     console.log(result);
    // }).catch((error) => {
    //     console.log(error);
    // });

    db.collection("Tasks").updateMany({
        completed : false
    }, {
        $set: {
            completed : true
        }
    }).then((result) => {
        console.log(result);
    }).catch((error) => {
        console.log(error);
    })

});