const express = require('express');
const cors = require('cors');
const {Client} = require('pg');

const config = require('./config.js')[process.env.NODE_ENV||"dev"]
const PORT = config.port;

const client = new Client({
  connectionString: config.connectionString
});

client.connect();

const app = express();
app.use(cors());
app.use(express.json());

app
  .route('/api/movies')
  .get((req,res)=>{
    client.query(`SELECT name, base_price, title FROM streaming_service LEFT JOIN movies ON streaming_service.id = movies.streamer_id ORDER BY name ASC`)
    .then(result =>{
      res.send(result.rows)
    })
    .catch(e => console.error(e.stack))
  })

  .post((req,res)=>{
    let movieItem = req.body;
    let name = req.body.name;
    let title = req.body.title;
    //let streamer_id = `streaming_service.id WHERE '${name} = streaming_service.name`;
    if(name && title){
      client.query(`INSERT INTO movies (title, streamer_id) 
      VALUES ('${title}', (SELECT id FROM streaming_service WHERE '${name}' = name)); 
      INSERT INTO streaming_service (name) 
      VALUES ((COALESCE(NULLIF((SELECT name FROM streaming_service WHERE name = '${name}'),'${name}')),'END')); 
      DELETE FROM streaming_service WHERE name LIKE '%END%';`)
      .then(result =>{
        res.send(result.rows)
      })
      .catch(e => console.log(e.stack))
    }
  })

  app.listen(PORT, ()=>{
    console.log(`Listening on port ${PORT}`)
  });





