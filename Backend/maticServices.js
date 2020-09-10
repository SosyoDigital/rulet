const axios = require('axios');
const config = require('./config');

const ercInstance = axios.create({
    baseURL: config.api+config.ercContract,
    timeout: 5000,
    headers: {'X-API-KEY': config.apiKey}
})

const gameInstance = axios.create({
    baseURL: config.api+config.gameContract,
    timeout: 5000,
    headers: {'X-API-KEY': config.apiKey}
})


module.exports = {
    erc: {
        signUpTransfer(payload){
            return ercInstance.post('/transferFrom', payload)
        },
        getBalance(payload){
            return ercInstance.get('/balanceOf/'+payload)
        }
    },
    game: {
        placeBet(payload){
            console.log(payload)
            return gameInstance.post('/placeBet', {
                _roundId: payload._roundId,
                _addr: payload._addr,
                _pick: payload._pick,
                _amt: payload._amt
            })
        },
        submitWinningPick(payload){
            return gameInstance.post('/submitWinningPick', {
                _roundId: payload._roundId,
                _sysPick: payload._sysPick
            })
        },
        getWinners(payload){
            return gameInstance.get('/getWinners/'+payload._roundId)
        },
        claimBet(payload){
            return gameInstance.post('/claimBet', payload)
        },
        closeRound(payload){
            return gameInstance.post('/closeRound', payload)
        }
    }
}