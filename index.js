const express = require('express');
const cors = require('cors');
const jwt =require('jsonwebtoken')
const cookieParser =require('cookie-parser')
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000

app.use(cors(
    {
        origin:['http://localhost:5173'],
        credentials:true
    }
))
app.use(express.json());
app.use(cookieParser())


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.userId}:${process.env.password}@my-hotel.rge90y4.mongodb.net/?retryWrites=true&w=majority`;


const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

    const logger = async(req,res,next)=>{

    }

    const verifyToken =async(req,res,next)=>{
        const token = req.cookies?.token
      
        if(!token){
            return res.status(401).send({message: 'not Authorized'})
        }

        jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,decoded)=>{

            if(err)
            {
            return res.status(401).send({message: 'not Authorized'})

            }

            req.user=decoded
            next()

        })

        
    }


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
            const token = jwt.sign(user,process.env.ACCESS_TOKEN_SECRET,{expiresIn:'48h'})

            res
            .cookie('token',token,{
                httpOnly:true,
                secure:false
            })
            .send({success:true})
        })





        //booking details collection
        app.post('/bookingData', async (req, res) => {
            const booking = req.body
            const result = await BookingCollection.insertOne(booking)
            res.send(result)                                                                                                                                                            
        })

        app.get('/bookingData',verifyToken, async (req, res) => {
            const result = await BookingCollection.find().toArray()
            // console.log('ttt token',req.cookies);
            res.send(result)
        })

        app.get('/bookingData/:userId',verifyToken, async (req, res) => {
            const userId =req.params.userId
            if(userId !== req.user.uId){
                return res.status(401).send({message: 'not Authorized'})
            }
            
            const query ={userId:userId}
            // console.log('token',req.cookies);
            const result = await BookingCollection.find(query).toArray()
            res.send(result)
        })



        //review detail collection 
        app.post('/reviewData', async (req, res) => {
            const booking = req.body
            const result = await ReviewCollection.insertOne(booking)
            res.send(result)                                                                                                                                                            
        })
        app.get('/reviewData', verifyToken, async (req, res) => {
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