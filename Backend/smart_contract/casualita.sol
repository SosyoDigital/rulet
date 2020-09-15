pragma solidity ^0.5.10;
pragma experimental ABIEncoderV2;
import "./CasuERC20Mintable.sol";

contract CasualitaTest {
    CasuERC20Mintable public erc20;
    address owner;
    
    constructor(CasuERC20Mintable addr) public {
        erc20 = addr;
        owner = msg.sender;
    }
    
    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }
    
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
    mapping (uint => bool) public isGreen;
    mapping (uint => bool) public isRoundOver;
    event SubmitPick(uint _roundId);
    
    
    //Pick is 11 for red color bet, 12 for black color bet and 13 for green bet 
    
    function placeBet(uint256 _roundId,address _addr, uint8 _pick, uint256 _amt) public returns(bool){
        Bet memory b = Bet(_addr, _amt, _pick);
        erc20.transferFrom(_addr, address(this), _amt);
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
    
    function submitWinningPick(uint256 _roundId, uint8 _sysPick, bool _isGreen) onlyOwner public {
        winningpick[_roundId] = _sysPick;
        isGreen[_roundId] = _isGreen;
        emit SubmitPick(_roundId);
    }
    
    function getWinners(uint256 _roundId) public view returns (Bet[] memory numberwinners, Bet[] memory colorWinners, Bet[] memory greenWinners){
        uint256 winningPick = winningpick[_roundId];
        if(winningPick == 0 && isGreen[_roundId]){
            return (winners[_roundId][winningPick], winners[_roundId][12], winners[_roundId][13]);
        } else if (winningPick == 5 && isGreen[_roundId]){
            return (winners[_roundId][winningPick], winners[_roundId][11], winners[_roundId][13]);
        }else if (winningPick == 0 || winningPick%2 == 0){
            return (winners[_roundId][winningPick], winners[_roundId][12], winners[0][0]);
        } else {
            return (winners[_roundId][winningPick], winners[_roundId][11], winners[0][0]);
        }
    }
    
    function claimBet(address[] memory _addr, uint256 _roundId) public onlyOwner returns(bool) {
        require(isRoundOver[_roundId] == false, "Claim not allowed, round is over!");
        uint256 winningPick = winningpick[_roundId];
        for(uint i = 0; i<_addr.length; i++){
            if(rounduserPick[_roundId][11][_addr[i]] == 11){
                if(winningPick != 5){
                    erc20.transferFrom(address(this), _addr[i], roundbetAmount[_roundId][11][_addr[i]] * 2);
                } else {
                    erc20.transferFrom(address(this), _addr[i], roundbetAmount[_roundId][11][_addr[i]] * 1);
                }
            } else if(rounduserPick[_roundId][12][_addr[i]] == 12){
                if(winningPick != 0){
                    erc20.transferFrom(address(this), _addr[i], roundbetAmount[_roundId][12][_addr[i]] * 2);
                } else {
                    erc20.transferFrom(address(this), _addr[i], roundbetAmount[_roundId][12][_addr[i]] * 1);
                }
            } else if(rounduserPick[_roundId][winningPick][_addr[i]] == winningPick){
                erc20.transferFrom(address(this), _addr[i], roundbetAmount[_roundId][winningPick][_addr[i]]*8);
            } else {
                erc20.transferFrom(address(this), _addr[i], roundbetAmount[_roundId][13][_addr[i]]*4);
            }
        }
    }
    
    function closeRound(uint256 _roundId) onlyOwner public {
        isRoundOver[_roundId] = true;
    }
}
