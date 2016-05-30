// MT generator
var MersenneTwister = require('mersenne-twister');
var generator = new MersenneTwister();

// LC generator
var lcg = require ('lcg-rnd');
lcg.srand = 10;

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
    return Math.pow(minimum, 2)
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

console.log('Mersenne Twister')
console.log('----------------')
console.log('PI test                ', pi(2000, MT))
console.log('Parking lot test       ', parking(MT))
console.log('Minimum distance test  ', minimumDistance(MT))
console.log('Random spheres test    ', randomSpheres(MT))


console.log('\nLinear Congruential Generator')
console.log('-----------------------------')
console.log('PI test                ', pi(2000, LCG))
console.log('Parking lot test       ', parking(LCG))
console.log('Minimum distance test  ', minimumDistance(LCG))
console.log('Random spheres test    ', randomSpheres(LCG))


console.log(`\nJavaScript's Math.random`)
console.log('------------------------')
console.log('PI test                ', pi(2000, Math.random))
console.log('Parking lot test       ', parking(Math.random))
console.log('Minimum distance test  ', minimumDistance(Math.random))
console.log('Random spheres test    ', randomSpheres(Math.random))
