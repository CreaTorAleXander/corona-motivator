
async function getWorkouts(){
    let res = await fetch('/API/getWorkouts')
    let data = await res.text();
    let arr = JSON.parse(data);
    

    let content = "";
    for(let i = 0; i < arr.length; i++){
        content += `<div class="workoutCard">
        <span>User: ${arr[i].user}</span><br>
        <span>Distanz: ${arr[i].distance}</span><br>
        <span>Dauer: ${arr[i].duration}</span>
        </div>`
    }

    document.getElementById("displayWorkouts").innerHTML = content;
}

async function addWorkout(){

    let user = document.getElementById('user').value;
    let distance = document.getElementById('distance').value;
    distance = Number(String(distance).replace(",", "."))
     
    let duration = document.getElementById('duration').value;
    console.log(user + " " + distance + " " + duration)

    const data = {user, duration, distance};
    const options = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    };
    await fetch('/API/addWorkout', options);
}


async function fastestWorkout(){

    let res = await fetch('/API/getWorkouts')
    let data = await res.text();
    let arr = JSON.parse(data);
    let structure = [];
    console.log(arr);  
    
    for(let i = 0; i < arr.length; i++){
        if(arr[i].distance >= 10){

        min= 0;
        let splittedArr = arr[i].duration.split(":");
        let hh = Number(splittedArr[0]);
        let mm = Number(splittedArr[1]);
        let ss = Number(splittedArr[2]);
        
        min += ss / 60;
        min += mm ;
        min += hh * 60;

        let minPerKm = min / arr[i].distance;
        let seconds = (minPerKm % 1) * 60;
        restSeconds = seconds % 1;
        seconds -= restSeconds;
        minPerKm = minPerKm - (minPerKm % 1);
        let stringminPerKm = minPerKm + ":" + seconds;
        
    
        let obj = {}
        obj["user"] = arr[i].user;
        obj["distance"] = arr[i].distance;
        obj["minPerKm"] = stringminPerKm;
        structure.push(obj);
    }
}



for(let y = 0; y < structure.length; y++){
  structure[y].minPerKm = structure[y].minPerKm.replace(":", ".");
  structure[y].minPerKm = parseFloat(structure[y].minPerKm)


  console.log(typeof(structure[y].minPerKm))
}

for(let x = 0; x < structure.length; x++){
    console.log(structure[x])
}

// Now sort the array from small to big
structure.sort((a, b) => {
    if (a.minPerKm > b.minPerKm){
        return 1;
    }else{
        return -1;
    }
})

for(let y = 0; y < structure.length; y++){
    structure[y].minPerKm = structure[y].minPerKm + " ";
    structure[y].minPerKm = structure[y].minPerKm.replace(".", ":");
  }

let content = "";
for(let z = 0; z < structure.length; z++){
    
    content += `<div class="workoutCard">
    <span class="platzierung">${z+1}. </span>
    <span class="username">${structure[z].user}</span><br>
    <span class="distance">Distanz: ${structure[z].distance} km</span><br>
    <span class="distance"> <span class="value">${structure[z].minPerKm} </span> min/km </span>
    </div>`
}
document.getElementById("displayFastestDistance").innerHTML = content;
}

async function entireDistanceFromUser(){
    let res = await fetch('/API/getWorkouts')
    let data = await res.text();
    let arr = JSON.parse(data);
    let structure = [];

    let uniqueUsers = [];
    for (let i = 0; i < arr.length; i++){
        if(!uniqueUsers.includes(arr[i].user)){
            uniqueUsers.push(arr[i].user);
        }
    }
    let sumDistance;
    for (let i = 0; i < uniqueUsers.length; i++){
        sumDistance = 0;
        for(let j = 0; j < arr.length; j++){
            if(uniqueUsers[i] === arr[j].user){
                sumDistance += arr[j].distance
            }
        }
        
        let obj = {};
        obj["user"] = uniqueUsers[i];
        obj["entireDistance"] = sumDistance
        structure.push(obj)
    }

    structure.sort((a, b) => {
        if (a.entireDistance > b.entireDistance){
            return -1;
        }else{
            return 1;
        }
    })

    let content = "";
    for(let z = 0; z < structure.length; z++){
       
        content += `<div class="workoutCard">
        <span class="platzierung">${z+1}. </span>
        <span class="username">${structure[z].user}</span><br>
        <span class="distance">Gesamtdistanz: <span class="value">${structure[z].entireDistance.toFixed(2)}</span> km</span><br>
        </div>`
    }
    document.getElementById("displayFullDistance").innerHTML = content;

}


async function longestDistance(){
    let res = await fetch('/API/getWorkouts')
    let data = await res.text();
    let arr = JSON.parse(data);

    arr.sort((a, b) => {
        if (a.distance > b.distance){
            return -1;
        }else{
            return 1;
        }
    })

    let content = "";
    for(let i = 0; i < arr.length; i++){
        
        content += `<div class="workoutCard">
        <span class="platzierung">${i+1}. </span> 
        <span class="username">${arr[i].user}</span><br>
        <span class="distance">Distanz: <span class="value">${arr[i].distance}</span> km</span><br>
        </div>`
    }

    document.getElementById("displayLongestDistance").innerHTML = content;
}
    


