// MT generator
var MersenneTwister = require('mersenne-twister');
var generator = new MersenneTwister();

// LC generator
var lcg = require ('lcg-rnd');
lcg.srand = 10;

var fs = require('fs');


function distancePoints(a,b,dimension3D) {
    var dist = 0;
    if (!dimension3D) {
        dist = Math.sqrt(Math.pow(b['x'] - a['x'],2)+ Math.pow(b['y'] - a['y'], 2))
    } else {
        dist = Math.sqrt(Math.pow(b['x'] - a['x'], 2) + Math.pow(b['y'] - a['y'], 2) + Math.pow(b['z'] - a['z'], 2))
    }
    return dist
}


// Pi test
function pi(n, randomFunction) {
    var range = 100; // [0;100
    var x, y;
    var isq = 0; // number of suggested points
    var ic = 0 // number of points satisfying the condition
    while (isq < n) {
        x = randomFunction()*100;
        y = randomFunction()*100;
        isq = isq + 1;
        if (x * x + y * y <= range * range) ic = ic + 1;
    }
    var pi = 4*ic/isq;
    return pi
}


// Parking lot test
function parking(randomFunction) {
    var array = []
    array.push({
        x: randomFunction()*100,
        y: randomFunction()*100
    })

    function parkNewPoint() {
        var newPoint = {
            x: randomFunction()*100,
            y: randomFunction()*100
        }

        var isCorrectPoint = true;

        for (var i = 0; i < array.length; i++) {
            if (distancePoints(array[i], newPoint, false) < 1) {
                isCorrectPoint = false;
                break;
            }
        }

        if (isCorrectPoint) array.push(newPoint)
    }

    for (var i = 0; i < 12000; i++) {
        parkNewPoint()
    }
    return array.length
}

// Minimum distance test
function minimumDistance(randomFunction) {
    var array = [];
    for (var i = 0; i < 8000; i++)
        array.push({
            x: randomFunction()*10000,
            y: randomFunction()*10000
        })

    var pairs = (Math.pow(8000, 2) - 8000) / 2;
    var minimum = Infinity;

    for (var i = 0; i < pairs; i++) {
        var id = Math.floor(Math.random()*(7999-1))+1;
        var id2 = Math.floor(Math.random()*(7999-1))+1;

        while (id === id2) {
            id2 = Math.floor(Math.random()*(7999-1))+1;
        }
        var distance = distancePoints(array[id], array[id2]);

        if (minimum > distance) minimum = distance;
    }
    return 1 - Math.exp(Math.pow(minimum, 2)*(-1)/0.995)
}

// Random spheres test
function randomSpheres(randomFunction) {
    var array = [];
    for (var i = 0; i < 4000; i++) {
        array.push({
            x: randomFunction()*10000,
            y: randomFunction()*10000,
            z: randomFunction()*10000
        })
    }
    var minimum = Infinity;
    for (var i = 0; i < 4000; i++) {
        for (var j = i+1; j < 4000; j++) {
            var distance = distancePoints(array[i], array[j], true);
            if (distance < minimum) minimum = distance
        }
    }
    return minimum
}

var MT = () => generator.random_incl()
var LCG = () => lcg.random()




//
// console.log('Mersenne Twister')
// console.log('----------------')
// console.log('PI test                ', pi(2000, MT))
// console.log('Parking lot test       ', parking(MT))
// console.log('Minimum distance test  ', minimumDistance(MT))
// console.log('Random spheres test    ', randomSpheres(MT))
//
//
// console.log('\nLinear Congruential Generator')
// console.log('-----------------------------')
// console.log('PI test                ', pi(2000, LCG))
// console.log('Parking lot test       ', parking(LCG))
// console.log('Minimum distance test  ', minimumDistance(LCG))
// console.log('Random spheres test    ', randomSpheres(LCG))
//
//
// console.log(`\nJavaScript's Math.random`)
// console.log('------------------------')
// console.log('PI test                ', pi(2000, Math.random))
// console.log('Parking lot test       ', parking(Math.random))
// console.log('Minimum distance test  ', minimumDistance(Math.random))
// console.log('Random spheres test    ', randomSpheres(Math.random))

var records = {
    "pi": {
        'mersenne-twister': [],
        'mersenne-twister-average': 0,
        'lcg': [],
        'lcg-avarage': 0,
        'Math.random': [],
        'Math.random-average': 0
    },
    "parking":{
        'mersenne-twister': [],
        'mersenne-twister-average': 0,
        'lcg': [],
        'lcg-avarage': 0,
        'Math.random': [],
        'Math.random-average': 0
    },
    "minimum":{
        'mersenne-twister': [],
        'mersenne-twister-average': 0,
        'lcg': [],
        'lcg-avarage': 0,
        'Math.random': [],
        'Math.random-average': 0
    },
    "spheres":{
        'mersenne-twister': [],
        'mersenne-twister-average': 0,
        'lcg': [],
        'lcg-avarage': 0,
        'Math.random': [],
        'Math.random-average': 0
    }

}

for (var i = 0; i < 100; i++) {
    records['pi']['mersenne-twister'].push(pi(2000, MT))
    records['pi']['lcg'].push(pi(2000, LCG))
    records['pi']['Math.random'].push(pi(2000, Math.random))
    if (i % 10 === 0) {
        console.log('pi', i)
    }
}

for (var i = 0; i < 10; i++) {
    records['parking']['mersenne-twister'].push(parking(MT))
    records['parking']['lcg'].push(parking(LCG))
    records['parking']['Math.random'].push(parking(Math.random))
    console.log('parking', i)
}


for (var i = 0; i < 20; i++) {
    records['spheres']['mersenne-twister'].push(randomSpheres(MT))
    records['spheres']['lcg'].push(randomSpheres(LCG))
    records['spheres']['Math.random'].push(recordsrandomSpheres(Math.random))
    console.log('randomSpheres', i)
}

for (var i = 0; i < 100; i++) {
    records['minimum']['mersenne-twister'].push(minimumDistance(MT))
    records['minimum']['lcg'].push(minimumDistance(LCG))
    records['minimum']['Math.random'].push(minimumDistance(Math.random))
    if (i % 10 === 0) {
        console.log('minimumDistance', i)
    }
}

for (var key in records) {
    for (var subkey in records[key]) {
        var array = records[key][subkey];
        var sum = 0;
        if (Array.isArray(array)) {
            for (var i = 0; i < array.length; i++) {
                sum = sum + array[i];
            }
            var average_key = subkey+"-average"
            records[key][average_key] = sum / array.length;
        }
    }
}

console.log(records)

fs.writeFile("results.log",JSON.stringify(records), function(err) {
    if(err) {
        return console.log(err);
    }

    console.log("The file was saved!");
});
