async function addWorkout(){

    
    let user = document.getElementById('user').value;
    let distance = document.getElementById('distance').value;
    distance = Number(String(distance).replace(",", "."))
    let duration = document.getElementById('duration').value;
    
    if(user.trim().length > 2 && user.trim().length < 50 && distance > 0 && distance < 50){
        const data = {user, duration, distance};
        const options = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        };
        await fetch('/API/addWorkout', options); 
    }else{
       alert("UNGÜLTIGE EINGABE")
    }

}

async function fastestWorkout(){
    let res = await fetch('/API/getWorkouts')

    let data = await res.text();
    let arr = JSON.parse(data);


    let structure = [];
    
        for(let i = 0; i < arr.length; i++){

                if(arr[i].distance >= 10){
                    
                    let stringminPerKm = calculateMinPerKm(arr[i].duration, arr[i].distance)
 
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

  // just print the best 10 activities
let content = "";
for(let z = 0; z < 10; z++){
    if(structure[z] !== undefined){
        let resultString = formatHoursMins(structure[z].minPerKm)

        content += `<div class="workoutCard">
        <span class="platzierung">${z+1}. </span>
        <span class="username">${structure[z].user}</span><br>
        <span class="distance">Distanz: ${structure[z].distance} km</span><br>
        <span class="distance"> <span class="value">${resultString} </span> min/km </span>
        </div>`
    }else {
        break;
    }
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
    for(let z = 0; z < 10; z++){
       
        if(structure[z] !== undefined){
            content += `<div class="workoutCard">
            <span class="platzierung">${z+1}. </span>
            <span class="username">${structure[z].user}</span><br>
            <span class="distance">Gesamtdistanz: <span class="value">${structure[z].entireDistance}</span> km</span><br>
            </div>`
        }
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
    for (let i = 0; i < 10; i++){
            
        if(arr[i] !== undefined){

            content += `<div class="workoutCard">
            <span class="platzierung">${i+1}. </span> 
            <span class="username">${arr[i].user}</span><br>
            <span class="distance">Distanz: <span class="value">${arr[i].distance}</span> km</span><br>
            <span class="distance">Dauer: <span class="value">${arr[i].duration}</span></span><br>
            
            </div>`
            
        }
    }
    document.getElementById("displayLongestDistance").innerHTML = content;
}
    




async function allActivitiesByDate(){
    let res = await fetch('/API/getWorkouts')

    let data = await res.text();
    let arr = JSON.parse(data);
    let switchedArr = [];
    for (let i = arr.length-1; i >= 0; i--){
        switchedArr.push(arr[i]);
    }

    let content = "";
    for (let i = 0; i < switchedArr.length; i++){

        let stringminPerKm = calculateMinPerKm(arr[i].duration, arr[i].distance)
        resultString = formatHoursMins(stringminPerKm);
        let splittedDateArray = switchedArr[i].date.split(" ");

        result = formatHoursMins(splittedDateArray[1]);
        let dateString = splittedDateArray[0] + " " + result;


        if(switchedArr[i] !== undefined){

            content += `<div class="workoutCard">
            <span class="platzierung">${i+1}. </span> 
            <span class="username">${switchedArr[i].user}</span><br>
            <span class="distance">Distanz: <span class="value">${switchedArr[i].distance}</span> km</span><br>
            <span class="distance">Min / KM:<span class="value"> ${resultString}</span></span><br>
            <span class="distance">Datum: <span class="value">${dateString}</span></span><br>
            
            </div>`
            
        }
    }
        
    document.getElementById("activitiesByDate").innerHTML = content;
}

function formatHoursMins(stringMinPerKm){
    let resultString ="";
    let splittedArray = stringMinPerKm.split(":")
 
    if(Number(splittedArray[0]) < 10){
        resultString += splittedArray[0].trim().padStart(2, "0");
    }
    else if(splittedArray[0] === undefined){
        resultString +=  +  "00";
    }else {
        resultString +=  splittedArray[0].trim();
        
    }
    if(Number(splittedArray[1]) < 10){
        resultString += ":" + splittedArray[1].trim().padStart(2, "0");

    }else if(splittedArray[1] === undefined){
        resultString += ":" + "00";
        
    }else {
        resultString += ":" + splittedArray[1].trim();
    }
    
    return resultString;
}

function calculateMinPerKm(duration, distance){
    let min = 0;
    console.log(duration)
    console.log(typeof(duration))
        let splittedArr = duration.split(":");
                    
    let hh = Number(splittedArr[0]);
    let mm = Number(splittedArr[1]);
    let ss = Number(splittedArr[2]);
    
    min += ss / 60;
    min += mm ;
    min += hh * 60;
    console.log(distance)
    let minPerKm = min / distance;
    let seconds = (minPerKm % 1) * 60;
    restSeconds = seconds % 1;
    seconds -= restSeconds;
    minPerKm = minPerKm - (minPerKm % 1);
    let stringminPerKm = minPerKm + ":" + seconds;

    return stringminPerKm;
}