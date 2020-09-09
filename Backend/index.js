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
const Bets = require('./models/bets');
const middleware = require('./routes/middlewares/isLoggedIn');
const apiCalls = require('./maticServices');
mongoose.connect(mongoUri, {useNewUrlParser: true, useUnifiedTopology: true}, () => {console.log("Connected to DB")})
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
    cors({
      origin: "http://localhost:3000", // <-- location of the react app were connecting to
      credentials: true,
    })
);

let numberOfActiveUsers = 0
let numberOfLoggedinUsers = 0
let roundId = 1
let roundPick = null

const time = {
    second: 0,
    minute: 0
}


setInterval(() => {
    if(numberOfLoggedinUsers >= 1 && numberOfActiveUsers>=1){
        time.second += 1
        if(time.second == 60){
            time.second = 0
            time.minute += 1
        }
        console.log(time.minute, time.second)
        io.emit('time-update', time)
        if(time.minute == 2 && time.second == 30){
            io.emit('close-bets', true)
        }
        if(time.minute == 3 && time.second == 0){
            time.minute = 0
            time.second = 0
            roundId += 1
            io.emit('open-bets', false)
        }
    }
}, 1000)

function pickWinningNumber(){
    const pick = Math.floor(Math.random() * Math.floor(10))
    roundPick = pick
    let isGreen = false
    if(testprime(roundId)){
        if(Math.random() >= 0.7){
            isGreen=true
        }
    }
    const result = {
        _roundId: roundId,
        _sysPick: pick,
        _isGreen: isGreen
    }
    const bet = new Bets(result).then(() => bet.save())
    apiCalls.game.submitWinningPick(result).then(resp => {
        if (resp.data.success) settleBets()
        if (!resp.data.success) console.log("Some error occured")
    })
}

async function settleBets(){
    const response = await apiCalls.game.getWinners({_roundId: roundId})
    const numberWinners = response.data.data[0].numberwinners
    const colorWinners = response.data.data[0].colorWinners
    const greenWinners = response.data.data[0].greenWinners
    let winnersSingle = new Array
    let winners = []
    let n = 0
    winnersSingle = getAllWinner(numberWinners, colorWinners, greenWinners)
    for(let i = 0; i<winnersSingle.length/10; i++){
        winners.push([])
        for(let j=0; j<10; j++){
            if(winnersSingle[n]){
            winners[i].push(winnersSingle[n])
            }
            n+=1
        }
    }
    for(let i = 0; i<winners.length; i++){
        claimBets(winners[i], roundId, i)
    }
}


async function claimBets(winners, roundId, i){
    const w = JSON.stringify(winners)
    setTimeout(async() => {
        await apiCalls.game.claimBet({_addr: w, _roundId: roundId})
    }, 500*i)
}

function getAllWinner(numberWinners, colorWinners, greenWinners){
    let winners = new Array
    for(let i = 0; i<numberWinners.length; i++){
        winners.push(numberWinners[i][0])
    }
    for(let i = 0; i<colorWinners.length; i++){
        winners.push(colorWinners[i][0])
    }
    for(let i = 0; i<greenWinners.length; i++){
        winners.push(greenWinners[i][0])
    }
    return winners
}

function testprime(n){
    if(n===1){
        return false
    } else if(n===2){
        return true
    } else {
        for(let x=2; x<n; x++){
            if(n%x===0){
                return false
            }
        }
        return true
    }
}


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

app.use('/user', userAuth)
app.use('/user', user)


server.listen(4000, () => {console.log("Server started")})