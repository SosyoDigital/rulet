const express = require('express');
const app = express()
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const mongoose = require('mongoose');
const mongoUri = "mongodb+srv://casualita-admin:vaibhav123V@cluster0.2czvc.mongodb.net/casualita?retryWrites=true&w=majority"
const bodyParser = require('body-parser');
const cors = require('cors')
const userAuth = require('./routes/auth');
const middleware = require('./routes/middlewares/isLoggedIn')
mongoose.connect(mongoUri, {useNewUrlParser: true, useUnifiedTopology: true}, () => {console.log("Connected to DB")})
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
    cors({
      origin: "http://localhost:3000", // <-- location of the react app were connecting to
      credentials: true,
    })
);

const time = {
    second: 0,
    minute: 0
}
setInterval(() => {
    time.second += 1
    if(time.second == 60){
        time.second = 0
        time.minute += 1
    }
    io.emit('time-update', time)
    if(time.minute == 2 && time.second == 30){
        io.emit('close-bets', true)
    }
    if(time.minute == 3 && time.second == 0){
        time.minute = 0
        time.second = 0
        io.emit('open-bets', false)
    }
}, 1000)

app.use('/user', userAuth)


server.listen(4000, () => {console.log("Server started")})