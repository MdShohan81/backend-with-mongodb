const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = process.env.PORT || 5000;

//use middleware
app.use(cors());
app.use(express.json());

//user: shohan81
//password: Shohan81@



const uri = "mongodb+srv://shohan81:VuTkFsS7peuWYCcm@cluster0.zmw0j.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        await client.connect();
        const userCollection = client.db("foodexpress").collection("user");
        //get users
        app.get('/user', async (req, res) =>{
            const query = {};
            const cursor = userCollection.find(query);
            const users = await cursor.toArray();
            res.send(users);
        })

        //get update users
        app.get('/user/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await userCollection.findOne(query);
            res.send(result);
        });

        //Update user
        app.put('/user/:id', async(req, res) => {
            const id = req.params.id;
            const updateUser = req.body;
            const filter = {_id: ObjectId(id)};
            const options =  {upsert: true};
            const updateDoc = {
               $set: {
                name: updateUser.name,
                email: updateUser.email
               }
            };
            const result = await userCollection.updateOne(filter, updateDoc, options);
            res.send(result)
        });

        //Post user : add a new user
        app.post('/user', async (req, res) =>{
            const newUser = req.body;
            console.log('adding new user', newUser);
            const result = await userCollection.insertOne(newUser)
            res.send(result);
        });

        //delete a user
        app.delete('/user/:id', async (req, res) =>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await userCollection.deleteOne(query);
            res.send(result)
        });

    }
    finally{
        // await client.close();
    }

}
run().catch(console.dir);


app.get('/', (req, res) =>{
    res.send('Running My Node CRUD Server');
});

app.listen(port, () =>{
    console.log('Crud Server is running');
});