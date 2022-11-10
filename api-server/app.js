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
    let name = req.body.name;
    let title = req.body.title;
    console.log(req.body)
    if(name && title){
      client.query(`INSERT INTO streaming_service (name) 
      VALUES ((COALESCE(NULLIF('${name}',(SELECT name FROM streaming_service WHERE name = '${name}')),'END'))); 
      DELETE FROM streaming_service WHERE name LIKE '%END%'; INSERT INTO movies (title, streamer_id) 
      VALUES ('${title}', (SELECT id FROM streaming_service WHERE '${name}' = name)); 
      `)
      .then(result =>{
        console.log(result.rows)
        res.send(result.rows)
      })
      .catch(e => console.log(e.stack))
    }
  })

  app
    .route('/api/movies/:name')
    .get((req,res)=>{
      console.log(req.params.id)
      client.query(`SELECT name, base_price, title FROM streaming_service, movies WHERE name ILIKE '%${req.params.name}%' AND streaming_service.id = streamer_id;`)
      .then(result=>{
        res.send(result.rows)
      })
      .catch(e => console.log(e.stack))
    })
    .patch((req,res)=>{
      let price = req.body.base_price
      console.log(price)
      console.log(req.params.id)
      client.query(`UPDATE streaming_service SET base_price = ${price} WHERE name ILIKE '%${req.params.name}%';`)
      .then(result=>{
        console.log((req.params.id))
        res.send(result.rows)
      })
      .catch(e => console.log(e.stack))
    })
    .delete((req,res)=>{
      let movies = req.body;
      let title = movies.title;
      client.query(`DELETE FROM movies WHERE title = '${title}';`)
      .then(result=>{
        console.log(JSON.stringify(result.rows))
        res.send(result.rows)
      })
      .catch(e => console.log(e.stack))
    })

  app.listen(PORT, ()=>{
    console.log(`Listening on port ${PORT}`)
  });





