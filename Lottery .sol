// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Lottery {
    address public manager;
    address payable[] public players;
    address payable public winner;
    bool public isComplete;
    bool public claimed;
    
    event Enter(address indexed player);
    event WinnerPicked(address indexed winner);
    event PrizeClaimed(address indexed winner, uint amount);
    event LotteryReset();

    constructor() {
        manager = msg.sender;
        isComplete = false;
        claimed = false;
    }

    modifier restricted() {
        require(msg.sender == manager, "Only the manager can call this function");
        _;
    }

    function getManager() public view returns (address) {
        return manager;
    }

    function getWinner() public view returns (address) {
        return winner;
    }

    function status() public view returns (bool) {
        return isComplete;
    }
    
    function enter() public payable {
        require(msg.value >= 0.001 ether, "Minimum entry is 0.001 ether");
        require(!isComplete, "Lottery is complete");
        players.push(payable(msg.sender));
        emit Enter(msg.sender);
    }
    
    function pickWinner() public restricted {
        require(players.length > 0, "No players entered");
        require(!isComplete, "Lottery is complete");
        winner = players[randomNumber() % players.length];
        isComplete = true;
        emit WinnerPicked(winner);
    }
    
    function claimPrize() public {
        require(msg.sender == winner, "Only the winner can claim the prize");
        require(isComplete, "Lottery is not complete");
        require(!claimed, "Prize already claimed");
        uint prizeAmount = address(this).balance;
        winner.transfer(prizeAmount);
        claimed = true;
        emit PrizeClaimed(winner, prizeAmount);
    }
    
    function resetLottery() public restricted {
        require(isComplete, "Lottery is not complete");
        require(claimed, "Prize has not been claimed yet");
        
        // Reset the lottery state
        delete players; // This clears the array
        isComplete = false;
        claimed = false;
        winner = payable(address(0));
        emit LotteryReset();
    }
    
    function getPlayers() public view returns (address payable[] memory) {
        return players;
    }
    
    function randomNumber() private view returns (uint) {
        return uint(keccak256(abi.encodePacked(block.prevrandao, block.timestamp, players.length)));
    }
}


/*pragma solidity ^0.8.0;

contract Lottery {
    address public manager;
    address payable[] public players;
    address payable winner;
    bool public isComplete;
    bool public claimed;
    
    constructor() {
        manager = msg.sender;
        isComplete = false;
        claimed = false;
    }

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    function getManager() public view returns (address) {
        return manager;
    }

    function getWinner() public view returns (address) {
        return winner;
    }

    function status() public view returns (bool) {
        return isComplete;
    }
    
    function enter() public payable {
        require(msg.value >= 0.001 ether);
        require(!isComplete);
        players.push(payable(msg.sender));
    }
    
    function pickWinner() public restricted {
        require(players.length > 0);
        require(!isComplete);
        winner = players[randomNumber() % players.length];
        isComplete = true;
    }
    
    function claimPrize() public {
        require(msg.sender == winner);
        require(isComplete);
        winner.transfer(address(this).balance);
        claimed = true;
    }
    
    function getPlayers() public view returns (address payable[] memory) {
        return players;
    }
    
    
    
    function randomNumber() private view returns (uint) {
        return uint(keccak256(abi.encodePacked(block.prevrandao, block.timestamp, players.length)));
    }
}
*/
 

/*pragma solidity ^0.8.0;


contract Lottery {
    address public manager;
    address payable[] public players;
    address payable public winner;
    bool public isComplete;
    bool public claimed;
    
    constructor() {
        manager = msg.sender;
        isComplete = false;
        claimed = false;
    }

    modifier restricted() {
        require(msg.sender == manager, "Only the manager can call this function");
        _;
    }

    function getManager() public view returns (address) {
        return manager;
    }

    function getWinner() public view returns (address) {
        return winner;
    }

    function status() public view returns (bool) {
        return isComplete;
    }
    
    function enter() public payable {
        require(msg.value >= 0.001 ether, "Minimum entry is 0.001 ether");
        require(!isComplete, "Lottery is complete");
        players.push(payable(msg.sender));
    }
    
    function pickWinner() public restricted {
        require(players.length > 0, "No players entered");
        require(!isComplete, "Lottery is complete");
        winner = players[randomNumber() % players.length];
        isComplete = true;
    }
    
    function claimPrize() public {
        require(msg.sender == winner, "Only the winner can claim the prize");
        require(isComplete, "Lottery is not complete");
        require(!claimed, "Prize already claimed");
        winner.transfer(address(this).balance);
        claimed = true;
    }
    
    function resetLottery() public restricted {
        require(isComplete, "Lottery is not complete");
        require(claimed, "Prize has not been claimed yet");
        
        // Reset the lottery state
        delete players; // This clears the array
        isComplete = false;
        claimed = false;
        winner = payable(address(0));
    }
    
    function getPlayers() public view returns (address payable[] memory) {
        return players;
    }
    
    function randomNumber() private view returns (uint) {
        return uint(keccak256(abi.encodePacked(block.prevrandao, block.timestamp, players.length)));
    }
}
*/