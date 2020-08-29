pragma solidity ^0.6.10;
pragma experimental ABIEncoderV2;

contract CasualitaTest { 
    struct Bet {
        address userAddress;
        uint256 amount;
        uint8 pick;
    }
    
    mapping (uint => Bet[]) public roundBets;
    mapping (address => Bet[]) public allPersonalBets;
    mapping (uint => mapping (uint => Bet[])) private winners;
    mapping (uint => mapping (uint => mapping (address => uint))) private roundbetAmount;
    mapping (uint => mapping (uint => mapping (address => uint))) private rounduserPick;
    mapping (uint => uint) public winningpick;
    mapping (uint => bool) public isRoundOver;
    
    
    //Pick is 11 for red color bet, 12 for black color bet and 13 for green bet 
    
    function placeBet(uint256 _roundId,address _addr, uint8 _pick, uint256 _amt) public returns(bool){
        Bet memory b = Bet(_addr, _amt, _pick);
        roundBets[_roundId].push(b);
        winners[_roundId][_pick].push(b);
        roundbetAmount[_roundId][_pick][_addr] = _amt;
        rounduserPick[_roundId][_pick][_addr] = _pick;
        allPersonalBets[_addr].push(b);
        return true;
    }
    
    function getAllPersonalBets(address _addr) public view returns (Bet[] memory bets){
        return allPersonalBets[_addr];
    }
    
    function submitWinningPick(uint256 _roundId, uint8 _sysPick) public {
        winningpick[_roundId] = _sysPick;
    }
    
    function getWinners(uint256 _roundId) public view returns (Bet[] memory numberwinners, Bet[] memory colorWinners, Bet[] memory greenWinners){
        uint256 winningPick = winningpick[_roundId];
        if(winningPick == 0 || winningPick%2 == 0){
            return (winners[_roundId][winningPick], winners[_roundId][12], winners[_roundId][13]);
        } else {
            return (winners[_roundId][winningPick], winners[_roundId][11], winners[_roundId][13]);
        }
        
    }
    
    function claimBet(address _addr, uint256 _roundId) public view returns(uint) {
        require(isRoundOver[_roundId] == false, "Claim not allowed, round is over!");
        uint256 winningPick = winningpick[_roundId];
        if(rounduserPick[_roundId][11][_addr] == 11){
            if(winningPick != 5){
                return roundbetAmount[_roundId][11][_addr] * 2;
            } else {
                return roundbetAmount[_roundId][11][_addr] * 1;
            }
        } else if(rounduserPick[_roundId][12][_addr] == 12){
            if(winningPick != 0){
                return roundbetAmount[_roundId][12][_addr] * 2;
            } else {
                return roundbetAmount[_roundId][12][_addr] * 1;
            }
        } else if(rounduserPick[_roundId][winningPick][_addr] == winningPick){
            return roundbetAmount[_roundId][winningPick][_addr]*8;
        } else {
            return roundbetAmount[_roundId][13][_addr]*4;
        }
    }
    
    function closeRound(uint256 _roundId) public {
        isRoundOver[_roundId] = true;
    }
}
