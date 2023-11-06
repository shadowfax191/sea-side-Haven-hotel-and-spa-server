const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json());


console.log()
console.log()

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