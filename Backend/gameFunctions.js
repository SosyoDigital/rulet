const apiCalls = require('./maticServices');
const claim = require('./claimFunctions');
const Bets = require('./models/bets')

async function pickWinningNumber(roundId){
    const pick = Math.floor(Math.random() * Math.floor(10))
    roundPick = pick
    let isGreen = false
    if(claim.testprime(roundId)){
        if(Math.random() >= 0.7){
            isGreen=true
        }
    }
    const result = {
        _roundId: roundId,
        _sysPick: pick,
        _isGreen: isGreen
    }
    const bet = new Bets(result)
    console.log(pick, isGreen)
    await bet.save()
            .catch(err => console.log(err))
    const resp = await apiCalls.game.submitWinningPick(result)
                    .catch(err => {console.log(err.response.data.error); console.log(err.response.data.error.details.data)})
    if (!resp.data.success) console.log("Some error occured")
}

async function settleBets(roundId){
    const response = await apiCalls.game.getWinners({_roundId: roundId})
        .catch(e => console.log(e))
    const numberWinners = response.data.data[0].numberwinners
    const colorWinners = response.data.data[0].colorWinners
    const greenWinners = response.data.data[0].greenWinners
    let winnersSingle = new Array
    let winners = []
    let n = 0
    winnersSingle = claim.getAllWinner(numberWinners, colorWinners, greenWinners)
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
        claim.claimBets(winners[i], roundId, i)
    }
    setTimeout(() => {
        claim.closeRound(roundId)
    }, 10000)
}

//GAME LOGIC FUNCTIONS - End

module.exports = {
    pickWinningNumber: pickWinningNumber,
    settleBets: settleBets
}