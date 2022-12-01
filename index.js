const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
const jwt=require('jsonwebtoken');
const port = process.env.PORT || 5000;
const app = express();

require('dotenv').config();
app.use(cors());
app.use(express.json());
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.pbafkul.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

function verifyJWT(req,res,next){
    console.log(req.query.email);
    const authHeader=req.headers.authorization;
    if(!authHeader){
        return res.status(401).send({message:'unauthorized access'});
    }
    const token=authHeader.split(' ')[1];
    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET, function(err,decoded){
        if(err){
            return res.status(401).send({message:'unauthorized access'});
        }
        req.decoded=decoded;
        next();
    })
}
async function run() {
    try {
        const servicesCollection = client.db('excelientPhotography').collection('services');
        const reviewCollection = client.db('reviewsdb').collection('reviews');
       app.post('/jwt',(req,res)=>{
        const user=req.body;
        const token=jwt.sign(user,process.env.ACCESS_TOKEN_SECRET,{expiresIn:'1h'})
        res.send({token})
       })
       // add
        app.get('/services/home', async (req, res) => {
            const query = {};
            const cursor = servicesCollection.find(query);
            const services = await cursor.limit(3).toArray();

            res.send(services);
        });
        app.get('/services', async (req, res) => {

            const query = {};
            const cursor = servicesCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        });
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);
            res.send(service);
        });


        app.post('/reviews', async (req, res) => {
            const reviews = req.body;
            const result = await reviewCollection.insertOne(reviews);
            res.send(result);
        });


        app.get('/reviews', async (req, res) => {
            let query = {};
            if (req.query.review_id) {
                query = {

                    review_id: req.query.review_id
                }
            }
            const cursor = reviewCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews);
        });


        app.get('/myreviews',verifyJWT, async (req, res) => {
            const decoded =req.decoded;
            console.log(req.query.email);
            console.log('inside myreview api',decoded);
            if(decoded.email !== req.query.email){

               return res.status(403).send({message:'unauthorized access'})
            }
            let query = {};
            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }
          
           
            const cursor = reviewCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        });
        // app.get('/abcd',(req,res)=>{
        //     res.send({name:'pranto'})
        // })
        app.delete('/reviews/:id',async(req,res)=>{
            const id = req.params.id;
            const query={_id:ObjectId(id)};
            const result=await reviewCollection.deleteOne(query);
            res.send(result);
        });

        app.post('/addServices', async(req,res)=>{
            const order=req.body;
            const result=await servicesCollection.insertOne(order);
            res.send(result);
        });

    
    } finally {

    }
}
run().catch(error => {
    console.log(error);
});

app.get('/', (req, res) => {
    res.send('server is running');
});


app.listen(port, () => {
    console.log('server runing on ', port);
})


