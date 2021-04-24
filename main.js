const http = require("https");
const express=require("express");
const bodyParser = require('body-parser')
const PORT=process.env.PORT||5000

const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;
const CONNECTION_URL =process.env.PORT||"mongodb://127.0.0.1:27017/" ; //database connection
const DATABASE_NAME = "dictionary";                  //databasename


const app=express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


const app_id = "145809b2"; 
const app_key = "a30f035e113c0abe9508c8c9c986093e"; 
const fields = "pronunciations";
const strictMatch = "false";



app.post("/post",(req,res)=>{  
  const wordId= req.body.word  //the word which we want to get definitions and examples after posting in the backend
  const options = {
    host: 'od-api.oxforddictionaries.com', //api from oxford dictionary
    port: '443',
    path: '/api/v2/entries/en-gb/' + wordId ,

    method: "GET",
    headers: {
      'app_id': app_id,
      'app_key': app_key
    }
  };
  
  http.get(options, (resp) => {
      let body = '';
      resp.on('data', (d) => {
          body += d;
      });
      resp.on('end', () => {
        const data=JSON.parse(body)
        collection.insertOne(data, (error, result) => {
          if(error) {
            console.log("error")
              return res.status(500).send(error);
          }
          console.log(result.result,"asd")
          res.send(result.result);
      });
          }
      )
      });
  });
  app.get("/personnel", (request, response) => {   //sending the data from mongodb to backendapi
    collection.find({}).toArray((error, result) => {
        if(error) {
            return response.status(500).send(error);
        }
        response.send(result);
    });
});
var database, collection;
if(process.env.NODE_ENV==='production'){
  app.use(express.static('client/build'))
}

app.listen(PORT, () => {
    MongoClient.connect(CONNECTION_URL,{ useUnifiedTopology: true }, (error, client) => {
       //connecting to mongodb 
      if(error) {
            throw error;
        }
        database = client.db(DATABASE_NAME);
        collection = database.collection("personnel");
        console.log("Connected to `" + DATABASE_NAME + "`!");
    });
});