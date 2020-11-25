const express = require('express');
const app = express();
const port = 3000;
const MongoClient = require('mongodb').MongoClient;
const url = "generic";

// Errors they may occur
const assert = require('assert');


const dbName = 'test_sample_activities';
const client = new MongoClient(url);



client.connect(function(err) {
  assert.strictEqual(null, err);
  // parse incoming data as json IMPORTANT!
  app.use(express.json({limit: '1mb'}));
  app.use(express.static('public'));
  
  app.listen(port, () => {
      console.log(`Example app listening at http://localhost:${port}`)
    })

  const db = client.db(dbName);
  const activitesCollection = db.collection('activities')

  app.post('/API/addWorkout', (req, res) => {

    let use = req.body.user;
    let dur = req.body.duration;
    let dist = Number(req.body.distance);
    let d = new Date();
     String(d);

    const activityDocument = {
      user: use,
      duration: dur,
      distance: dist,
      date: d
    };

    activitesCollection.insertOne(activityDocument)
    .then(result =>{
      console.log(result)
    })
    .catch(error => console.error(error))
    });

    app.get('/API/getWorkouts', (req, res) => {
      activitesCollection.find().toArray()
      .then(results => {
        console.log(results);
        res.end(JSON.stringify(results));
      })
    .catch(error => console.error(error))
    })
 });
