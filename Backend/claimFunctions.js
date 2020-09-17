const apiCalls = require('./maticServices');

async function claimBets(winners, roundId, i){
    const w = JSON.stringify(winners)
    setTimeout(async() => {
        await apiCalls.game.claimBet({_addr: w, _roundId: roundId})
                .catch(err => {console.log(err.response.data.error); console.log(err.response.data.error.details.data)})
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

async function closeRound(roundId){
    await apiCalls.game.closeRound({_roundId: roundId})
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

module.exports = {
    claimBets: claimBets,
    getAllWinner: getAllWinner,
    closeRound: closeRound,
    testprime: testprime
}