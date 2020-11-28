const express = require('express');
const app = express();
const port = 3000;
const MongoClient = require('mongodb').MongoClient;
const url = "foo";

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
    let day = d.getUTCDate();
    let month = d.getUTCMonth();
    let year = d.getUTCFullYear();
    let hh = d.getUTCHours();
    let mm = d.getUTCMinutes();
    let utcdate = day + "." + month + "." +year + " " + hh + ":" + mm;

    const activityDocument = {
      user: use,
      duration: dur,
      distance: dist,
      date: utcdate
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
        res.end(JSON.stringify(results));
      })
    .catch(error => console.error(error))
    })
 });
