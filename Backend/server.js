const express = require('express');
const app = express()
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const mongoose = require('mongoose');
const mongoUri = "mongodb+srv://casualita-admin:vaibhav123V@cluster0.2czvc.mongodb.net/casualita?retryWrites=true&w=majority"
const bodyParser = require('body-parser');
const cors = require('cors')
const userAuth = require('./routes/auth');
const user = require('./routes/user');
const gameFunctions = require('./gameFunctions');
const Bets = require('./models/bets');
const Score = require('./models/score');
const WebSocket = require('ws')
mongoose.connect(mongoUri, {useNewUrlParser: true, useUnifiedTopology: true}, () => {console.log("Connected to DB")})
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());


//GAME LOGIC FUNCTION - Start
let numberOfActiveUsers = 0
let numberOfLoggedinUsers = 0
let roundId = 0

const time = {
    second: 0,
    minute: 0
}

setInterval(async() => {
    if(numberOfLoggedinUsers >= 1 && numberOfActiveUsers>=1){
        time.second += 1
        if(time.second == 60){
            time.second = 0
            time.minute += 1
        }
        io.emit('time-update', {time: time, roundId: roundId})
        if(time.minute == 1 && time.second == 30){
            io.emit('close-bets', true)
            gameFunctions.pickWinningNumber(roundId)
        }
        if(time.minute == 2 && time.second == 0){
            time.minute = 0
            time.second = 0
            roundId += 1
            const bets = await Bets.find({}) 
            io.emit('open-bets', {bool: false, bets: bets, roundId: roundId})
        }
    }
}, 1000)

setInterval(() => {
    io.emit('balance-update')
}, 15000)

//Socket.io Client functions - Start
io.on('connection', (socket) => {
    numberOfActiveUsers+=1
    console.log(numberOfActiveUsers)
    socket.on('login', () => {
        numberOfLoggedinUsers+=1
        console.log(numberOfActiveUsers)
    })
    socket.on('logout', () => {
        numberOfLoggedinUsers+=1
        console.log(numberOfLoggedinUsers)
        if(numberOfActiveUsers==0){
            time.second=0
            time.minute=0
        }
    })
    socket.on('disconnect', () => {
        numberOfActiveUsers-=1
        console.log(numberOfActiveUsers)
        if(numberOfActiveUsers==0){
            time.second=0
            time.minute=0
        }
    })
})
//Socket functions - End

//MaticVigil Websocket function - Start
let wsConnection;
const wsTries = 5;
const timeout = 1000;
let wsSessionID;

initWS('284808ef-13f0-4537-bf73-0270d7881405'); //pass the read key.

function initWS(key){
    console.log('tries', wsTries);
    if (wsTries <= 0){
        console.error('unable to estabilish WS after 5 tries!');
        wsConnection = null;
        wsTries = 5;
        wsSessionID = null;
        return;
    }
    wsConnection = new WebSocket('wss://beta.ethvigil.com/ws');
    wsConnection.onopen = function () {
        wsConnection.send(JSON.stringify({
            'command': 'register',
            'key': key
        }));
    };

    // Log errors
    wsConnection.onerror = function (error) {
        wsTries--;
        console.error('WebSocket Error ', error);
    };

    //Log messages from the server
    wsConnection.onmessage = function (d) {
        try {
            var data = JSON.parse(d.data);
            if (data.command){
                if (data.command == 'register:nack'){
                    console.error('bad auth from WS');
                    closeWS();
                }
                if (data.command == 'register:ack'){
                    wsSessionID = data.sessionID;
                    console.log('got sessionID', wsSessionID);
                    heartbeat();
                }
                return;
            }
            if (data.type){
                if (data.type == 'event'){
                    if(data.event_name=='SubmitPick'){
                        gameFunctions.settleBets(data.event_data._roundId)
                    }
                }
                return;
            }
            console.warn('got unrecognized json data', data);
        }
        catch (e){
            console.error('got non json data', d.data, e);
        }
    };
    wsConnection.onclose = function(e){
        console.error('websocket error', e);
        if (e.code != 1000){
            closeWS();
        } else {
            setTimeout(function(){
                initWS(key);
            }, timeout);
        }
    };
}

function closeWS(){
    if (wsConnection){
        console.log('closing ws');
        wsSessionID = null;
        wsConnection.onclose = function(){
            wsConnection = null;
        };
        wsConnection.close();
    }
}

function heartbeat() {
    if (!wsSessionID || !wsConnection || wsConnection.readyState !== 1){
        return;
    }
    wsConnection.send(JSON.stringify({
        command: "heartbeat",
        sessionID: wsSessionID
    }));
    setTimeout(heartbeat, 30000);
}
//MaticVigil Websocket function - End

//Routers - Start
app.use('/user', userAuth)
app.use('/user', user)

// @route GET api/allrounds
// @desc Return list of all the rounds and its result
// @access Public
app.get('/allrounds', async (req, res) => {
    const rounds = await Bets.find({})
                    .catch(e => res.status(404).json({msg: 'Some error has occured'}))
    res.status(200).json({allRounds: rounds})
})

// @route GET api/getscores
// @desc Return list of all the players and their bet scores for leadeboard
// @access Public
app.get('/getscores', async(req, res) => {
    const scores = await Score.find({})
                        .catch(e => res.status(404).json({msg: 'Some error has occured'}))
    res.status(200).json({scores: scores})
})
//Routes - End

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {console.log(`Server started ${PORT}`)})