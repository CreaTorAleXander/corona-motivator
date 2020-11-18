const express = require('express');
const app = express();
const port = 3000;


// data structure to store the user input
// example data
let arr = [];
arr[0] = {"user": "Moritz", "duration": "20:32:22", "distance": 5.56};
arr[1] = {"user": "Christian", "duration": "32:44:43", "distance": 3.21};
arr[2] = {"user": "Max", "duration": "32:44:55", "distance": 3.21};
arr[3] = {"user": "Alex", "duration": "03:44:04", "distance": 23.50};
arr[4] = {"user": "Moritz", "duration": "02:44:03", "distance": 25.56};
arr[5] = {"user": "Alex", "duration": "01:44:04", "distance": 13.50};
arr[6] = {"user": "Alex", "duration": "01:00:00", "distance": 10.00};






// parse incoming data as json IMPORTANT!
app.use(express.json({limit: '1mb'}));
app.use(express.static('public'));

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })


  app.post('/API/addWorkout', (req, res) => {
    console.log("Inside addWorkout")
    let user = req.body.user;
    let duration = req.body.duration;
    let distance = Number(req.body.distance);
    // duration is not a number how to parse it
    // to work with the duration
    // split at the columns and calculate the seconds
    // thats it 
    console.log(duration);
    
    arr.push({"user": user,  "distance": distance, "duration": duration});

   
   
    //   let user = 
    //   let distance = req.body.distance;
    //   let duration = req.body.duration; 
    //   console.log("user" + user +  "distance:" + distance + "time:" + duration)
    //   arr.push({"user": user, "distance": distance, "time": duration});
      
})

app.get('/API/getWorkouts', (req, res) => {
    console.log("Inside getWorkouts " , arr)
    res.end(JSON.stringify(arr))
})