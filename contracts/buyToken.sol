//SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.0;
//import "D:/sampleProject/node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract buyToken is ERC20{
    address public owner;
    uint256 public tokenPrice=2;
    event evt(uint256 amount);
    
    constructor(uint256 _totalSupply) ERC20("SampleToken","SToken"){
        owner=msg.sender;
        _mint(msg.sender,_totalSupply);
    }
    
    receive() external payable{
        sendToken(msg.sender,msg.value);  
    }
    
    function sendToken(address _to,uint256 _amount) internal{// making it internal so can't be called publically.(or use msg.value so if called publically anyone needs to send the value)
        uint256 tokenToSend=(_amount/tokenPrice);
        _transfer(owner,_to,tokenToSend);
        emit evt(tokenToSend);
    }
    
    function setPrice(uint256 _price) public{
        require(msg.sender==owner,"You should be owner for calling this function!");
        tokenPrice=_price;
    }
    
     function getPrice() public view returns (uint) {
    return tokenPrice;
  }
}