const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const MongoClient = require('mongodb').MongoClient;
const url = process.env.DATABASE_URI;
const assert = require('assert');

const dbName = process.env.databaseName;
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
    let alreadyInsert = false;
    let use = req.body.user;
    let dur = req.body.duration;
    let dist = Number(req.body.distance);
    let d = new Date();
    let day = d.getDate();
    let month = d.getUTCMonth();
    let year = d.getUTCFullYear();
    let hh = d.getHours();
    
    let mm = d.getUTCMinutes();
    let utcdateWithouthhmm = day + "." + month + "." +year;
    let utcdate = day + "." + month + "." +year + " " + hh + ":" + mm;
    
    activitesCollection.find({"user": use}).toArray()
    .then(results => {
      for (let i = 0; i < results.length; i++){
        let splittedArr = results[i].date.split(" ");
        if(splittedArr[0] === utcdateWithouthhmm){
          alreadyInsert = true; 
          break;
        }
      }

      if(!(alreadyInsert)){
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
      }else{
        res.end(new Error("Has Already Inserted Today"));
      }
      

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
