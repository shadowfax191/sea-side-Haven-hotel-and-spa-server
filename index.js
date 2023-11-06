const express = require('express');
const cors = require('cors');

const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json());




const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://shahariarhossain0599:6yl89pNgpLdY50iL@my-hotel.rge90y4.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
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
        // Ensures that the client will close when you finish/error

    }
}
run().catch(console.dir);







app.get('/', (req, res) => {
    res.send('server running')
})

app.listen(port, () => {
    console.log(`server is running on port: ${port}`);
})