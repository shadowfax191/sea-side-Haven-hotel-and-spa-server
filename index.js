const express = require('express');
const cors = require('cors');
const jwt =require('jsonwebtoken')
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.userId}:${process.env.password}@my-hotel.rge90y4.mongodb.net/?retryWrites=true&w=majority`;


const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});




async function run() {
    try {

        const RoomCollection = client.db('hotel').collection('roomData')
        const BookingCollection = client.db('hotel').collection('bookingData')
        const ReviewCollection = client.db('hotel').collection('reviewData')


       //room collection 

        app.get('/rooms', async (req, res) => {
            const result = await RoomCollection.find().toArray()
            res.send(result)
        })
        app.get('/rooms/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await RoomCollection.findOne(query)
            res.send(result)
        })

        //jwt Auth

        app.post('/jwt',async(req,res)=>{
            const user =req.body
            console.log(usr);
            res.send(user)
        })





        //booking details collection
        app.post('/bookingData', async (req, res) => {
            const booking = req.body
            const result = await BookingCollection.insertOne(booking)
            res.send(result)                                                                                                                                                            
        })

        app.get('/bookingData', async (req, res) => {
            const result = await BookingCollection.find().toArray()
            res.send(result)
        })

        app.get('/bookingData/:userId', async (req, res) => {
            const userId =req.params.userId
            const query ={userId:userId}
            const result = await BookingCollection.find(query).toArray()
            res.send(result)
        })



        //review detail collection 
        app.post('/reviewData', async (req, res) => {
            const booking = req.body
            const result = await ReviewCollection.insertOne(booking)
            res.send(result)                                                                                                                                                            
        })
        app.get('/reviewData', async (req, res) => {
            const result = await ReviewCollection.find().toArray()
            res.send(result)
        })

        //Delete booking
        app.delete('/bookingData/delete/:id',async(req,res)=>{
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await BookingCollection.deleteOne(query)
            res.send(result)
        })

        //update booking date
        app.put('/booking/update/:id',async(req,res)=>{
            const data = req.body
            const id =req.params.id
            const filter={
                _id: new ObjectId(id)
            }
            const options ={upsert:true}
            const updateData = {
                $set:{
                    date: data.date
                }
            }

            const result = await BookingCollection.updateOne(
                filter,
                updateData,
                options
            )
            res.send(result)
        })

        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {

    }
}
run().catch(console.dir);







app.get('/', (req, res) => {
    res.send('server running')
})

app.listen(port, () => {
    console.log(`server is running on port: ${port}`);
})