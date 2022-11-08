const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express');
const cors = require('cors');
const port=process.env.PORT || 5000;
const app=express();

require('dotenv').config();
app.use(cors());
app.use(express.json());
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.pbafkul.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



async function run(){
    try{
        const servicesCollection=client.db('excelientPhotography').collection('services');
        app.get('/services',async(req,res)=>{
            const query={};
            const cursor=servicesCollection.find(query);
            const services=await cursor.limit(3).toArray();
            console.log(services);
            res.send(services);
        });
    }finally{

    }
}
run().catch(error=>{
    console.log(error);
});

app.get('/',(req,res)=>{
    res.send('server is running');
});


app.listen(port,()=>{
    console.log('server runing on ',port);
})


