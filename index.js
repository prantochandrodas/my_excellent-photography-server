const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000;
const app = express();

require('dotenv').config();
app.use(cors());
app.use(express.json());
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.pbafkul.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



async function run() {
    try {
        const servicesCollection = client.db('excelientPhotography').collection('services');
        const reviewCollection = client.db('reviewsdb').collection('reviews');
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


        app.get('/myreviews', async (req, res) => {
            let query = {};
            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }
            console.log(req.query.email);
            const cursor = reviewCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        });


        // app.get('/orders',async(req,res)=>{
        //     let query={};
        //     if(req.query.email){
        //         query={
        //             email:req.query.email
        //         }
        //     }
        //     const cursor=orderCollection.find(query);
        //     const orders=await cursor.toArray();
        //     res.send(orders);
        // });
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


