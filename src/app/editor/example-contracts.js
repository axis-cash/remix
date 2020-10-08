'use strict'

const owner = `pragma solidity >=0.4.22 <0.7.0;

/**
 * @title Owner
 * @dev Set & change owner
 */
contract Owner {

    address private owner;
    
    // event for EVM logging
    event OwnerSet(address indexed oldOwner, address indexed newOwner);
    
    // modifier to check if caller is owner
    modifier isOwner() {
        // If the first argument of 'require' evaluates to 'false', execution terminates and all
        // changes to the state and to Ether balances are reverted.
        // This used to consume all gas in old EVM versions, but not anymore.
        // It is often a good idea to use 'require' to check if functions are called correctly.
        // As a second argument, you can also provide an explanation about what went wrong.
        require(msg.sender == owner, "Caller is not owner");
        _;
    }
    
    /**
     * @dev Set contract deployer as owner
     */
    constructor() public {
        owner = msg.sender; // 'msg.sender' is sender of current call, contract deployer for a constructor
        emit OwnerSet(address(0), owner);
    }

    /**
     * @dev Change owner
     * @param newOwner address of new owner
     */
    function changeOwner(address newOwner) public isOwner {
        emit OwnerSet(owner, newOwner);
        owner = newOwner;
    }

    /**
     * @dev Return owner address 
     * @return address of owner
     */
    function getOwner() external view returns (address) {
        return owner;
    }
}`

var axisIntereface=`
pragma solidity >=0.4.25 <0.6.8;

contract AxisInterface {

   /**
    * the follow topics is system topics,can not be changed at will
    */ 
  bytes32 private topic_axis_issueToken     =  0x3be6bf24d822bcd6f6348f6f5a5c2d3108f04991ee63e80cde49a8c4746a0ef3;
  bytes32 private topic_axis_balanceOf      =  0xcf19eb4256453a4e30b6a06d651f1970c223fb6bd1826a28ed861f0e602db9b8;
  bytes32 private topic_axis_send           =  0x868bd6629e7c2e3d2ccf7b9968fad79b448e7a2bfb3ee20ed1acbc695c3c8b23;
  bytes32 private topic_axis_currency       =  0x7c98e64bd943448b4e24ef8c2cdec7b8b1275970cfe10daf2a9bfa4b04dce905;
  bytes32 private topic_axis_allotTicket    =  0xa6a366f1a72e1aef5d8d52ee240a476f619d15be7bc62d3df37496025b83459f;
  bytes32 private topic_axis_category       =  0xf1964f6690a0536daa42e5c575091297d2479edcc96f721ad85b95358644d276;
  bytes32 private topic_axis_ticket         =  0x9ab0d7c07029f006485cf3468ce7811aa8743b5a108599f6bec9367c50ac6aad;
  bytes32 private topic_axis_setCallValues  =  0xa6cafc6282f61eff9032603a017e652f68410d3d3c69f0a3eeca8f181aec1d17;
  bytes32 private topic_axis_setTokenRate   =  0x6800e94e36131c049eaeb631e4530829b0d3d20d5b637c8015a8dc9cedd70aed;
  bytes32 private topic_axis_closePkg       =  0xbbf1aa2159b035802d0a4d44611849d5d4ada0329c81580477d5ec3e82f4f0a6;
  bytes32 private topic_axis_transferPkg    =  0xa8b83585a613dcf6c905ad7e0ce34cd07d1283cc72906d1fe78037d49adae455;

  /**
  * @dev convert bytes 32 to string
  * @param  x the string btyes32
  */
  function bytes32ToString(bytes32 x) public pure returns (string) {
        uint charCount = 0;
        bytes memory bytesString = new bytes(32);
        for (uint j = 0; j < 32; j++) {
            byte char = byte(bytes32(uint(x) * 2 ** (8 * j)));
            if (char != 0) {
                bytesString[charCount] = char;
                charCount++;
            } else if (charCount != 0){
                break;
            }
        }
        bytes memory bytesStringTrimmed = new bytes(charCount);
        for (j = 0; j < charCount; j++) {
            bytesStringTrimmed[j] = bytesString[j];
          
        }
        return string(bytesStringTrimmed);
    }

  /**
  * @dev set the call method params
  * @param _currency the crurrency of the token
  * @param _amount the value of the token
  * @param _category the category of the ticket
  * @param _ticket the tickeId of the ticket
  */
  function axis_setCallValues(string memory _currency, uint256 _amount, string memory _category, bytes32 _ticket) internal {
        bytes memory temp = new bytes(0x80);
        assembly {
            mstore(temp, _currency) 
            mstore(add(temp, 0x20), _amount)
            mstore(add(temp, 0x40), _category)
            mstore(add(temp, 0x60), _ticket)
            log1(temp, 0x80, sload(topic_axis_setCallValues_slot))
        }
        return;
    }


  /**
  * @dev the get currency from the tx params
  */
  function axis_msg_currency() internal returns (string) {
    bytes memory tmp = new bytes(32);
    bytes32 b32;
    assembly {
      log1(tmp, 0x20, sload(topic_axis_currency_slot))
      b32 := mload(tmp)
    }
    return bytes32ToString(b32);
  }

  /**
  * @dev issue the token
  * @param _total the totalsupply of the token
  * @param _currency the currency ot the token
  */
  function axis_issueToken(uint256 _total,string memory _currency) internal returns (bool success){
    bytes memory temp = new bytes(64);
    assembly {
      mstore(temp, _currency)
      mstore(add(temp, 0x20), _total)
      log1(temp, 0x40, sload(topic_axis_issueToken_slot))
      success := mload(add(temp, 0x20))
    }
    return;
  }

  /**
   * @dev the balance of this contract
   * @param _currency the currency ot the token
   */
  function axis_balanceOf(string memory _currency) internal returns (uint256 amount){
    bytes memory temp = new bytes(32);
    assembly {
      mstore(temp, _currency)
      log1(temp, 0x20, sload(topic_axis_balanceOf_slot))
      amount := mload(temp)
    }
    return;
  }
  
  /**
   * @dev transfer the token to the receiver
   * @param _receiver the address of receiver
   * @param _currency the currency of token 
   * @param _amount the amount of token
   */
  function axis_send_token(address _receiver, string memory _currency, uint256 _amount)internal returns (bool success){
      return axis_send(_receiver,_currency,_amount,"",0);
  }

  /**
   * @dev transfer the token or ticket to the receiver
   * @param _receiver the address of receiver
   * @param _currency the currency of token 
   * @param _amount the amount of token
   * @param _category the category of the ticket
   * @param _ticket the Id of the ticket
   */
  function axis_send(address _receiver, string memory _currency, uint256 _amount, string memory _category, bytes32 _ticket)internal returns (bool success){
    bytes memory temp = new bytes(160);
    assembly {
      mstore(temp, _receiver)
      mstore(add(temp, 0x20), _currency)
      mstore(add(temp, 0x40), _amount)
      mstore(add(temp, 0x60), _category)
      mstore(add(temp, 0x80), _ticket)
      log1(temp, 0xa0, sload(topic_axis_send_slot))
      success := mload(add(temp, 0x80))
    }
    return;
  }
  
   /**
    * @dev the get category from the tx params
    */
    function axis_msg_category() internal returns (string) {
        bytes memory tmp = new bytes(32);
        bytes32 b32;
        assembly {
            log1(tmp, 0x20, sload(topic_axis_category_slot))
            b32 := mload(tmp)
        }
      return bytes32ToString(b32);
    }
    
    /**
    * @dev the get ticketId from the tx params
    */
    function axis_msg_ticket() internal returns (bytes32 value) {
        bytes memory tmp = new bytes(32);
        assembly {
            log1(tmp, 0x20, sload(topic_axis_ticket_slot))
            value := mload(tmp)
        }
        return;
    }
    
    /**
     * @dev generate a tickeId and allot to the receiver address
     * @param _receiver receiving address of tickeId
     * @param _value  the seq of tickeId,can be zero. if zero the system ，the system randomly generates
     * @param _category the category of the ticket
     */ 
    function axis_allotTicket(address _receiver, bytes32 _value, string memory _category) internal returns (bytes32 ticket){
        bytes memory temp = new bytes(96);
        assembly {
            let start := temp
            mstore(start, _value)
            mstore(add(start, 0x20), _receiver)
            mstore(add(start, 0x40), _category)
            log1(start, 0x60, sload(topic_axis_allotTicket_slot))
            ticket := mload(add(start, 0x40))
        }
        return;
    }
    
    
    /**
   * @dev transfer the tickeId to the receiver
   * @param _receiver the address of receiver
   * @param _category the category of ticket 
   * @param _ticket the tickeId 
   */
  function axis_send_ticket(address _receiver, string memory _category, bytes32 _ticket)internal returns (bool success){
      return axis_send(_receiver,"",0,_category,_ticket);
  }
  
  /**
   * @dev Set the exchange rate of the AXIS against the other token, the unit is the minimum unit of token
   * @param _currency the currency of other token 
   * @param _tokenAmount the amount of  the other token,unit is minimum unit
   * @param _taAmount the amount of AXIS ,unit is ta
   */
  function axis_setToketRate(string memory _currency, uint256 _tokenAmount, uint256 _taAmount) internal returns (bool success){
        bytes memory temp = new bytes(96);
        assembly {
            let start := temp
            mstore(start, _currency)
            mstore(add(start, 0x20), _tokenAmount)
            mstore(add(start, 0x40), _taAmount)
            log1(start, 0x60, sload(topic_axis_setTokenRate_slot))
            success := mload(add(start, 0x40))
        }
        return;
  }
  
  /**
   * @dev close pkg by pkgId and the _key
   * @param _id the pkg Id 
   * @param _key the key that can decrypt data content of pkg
   */ 
  function axis_ClosePkg(bytes32 _id, bytes32 _key) internal 
    returns (address from, string currency, uint256 tokenAmount, string category, bytes32 ticketValue, uint256 blockNumber, bytes data) {
        bytes memory temp = new bytes(256);
        bytes32 currencyBytes;
        bytes32 categoryBytes;
        data = new bytes(64);
        bytes32 height;
        bytes32 low;
        assembly {
            let start := temp
            mstore(start, _id)
            mstore(add(start, 0x20), _key)
            log1(start, 0xa0, sload(topic_axis_closePkg_slot))
            currencyBytes:=mload(start)
            tokenAmount:=mload(add(start, 0x20))
            categoryBytes:=mload(add(start, 0x40))
            ticketValue:=mload(add(start, 0x60))
            from := mload(add(start, 0x80))
            blockNumber := mload(add(start, 0xa0))
            height := mload(add(start, 0xc0))
            low := mload(add(start, 0xe0))
        }
        currency = bytes32ToString(currencyBytes);
        category = bytes32ToString(categoryBytes);
        for (uint i = 0;i < 32; i++) {
            data[i] = height[i];
        }
        for (i = 0;i < 32; i++) {
            data[32 + i] = low[i];
        }
        return;
  }
  
  /**
   * @dev transfer  pkg to another address
   * @param _id the pkg Id 
   * @param _toAddress the receiver 
   */ 
  function axis_TransferPkg(bytes32 _id, address _toAddress) internal returns (bool success) {
        bytes memory temp = new bytes(64);
        assembly {
            let start := temp
            mstore(start, _id)
            mstore(add(start, 0x20), _toAddress)
            log1(start, 0x40, sload(topic_axis_transferPkg_slot))
            success := mload(add(start, 0x20))
        }
        return;
  }
  
}
`
var test_Token=`

pragma solidity >=0.4.25 <0.6.8;

import "./1_Owner.sol";
import "./2_SafeMath.sol";
import "./3_AxisInterface.sol";

contract test_token is AxisInterface ,Owner { 
    
    string private _name;
    string private _symbol;
    uint8 private _decimals;
    uint256 private _totalSupply;

    using SafeMath for uint256;
    

    /**
     * Constrctor function
     *
     * Initializes contract with initial supply tokens to the creator of the contract
     */
    constructor(
        uint256 initialSupply,
        string tokenName,
        string tokenSymbol,
        uint8 decimals
    ) public payable{
        _totalSupply = initialSupply * 10 ** uint256(decimals);
        require(axis_issueToken(_totalSupply,tokenSymbol));
        _name = tokenName;                                       // Set the name for display purposes
        _symbol = tokenSymbol;                               // Set the currency for display purposes
        _decimals = decimals;
        
       
    }
    
    /**
     * @return the name of the token.
     */
    function name() public view returns (string memory) {
        return _name;
    }

    /**
     * @return the symbol of the token.
     */
    function symbol() public view returns (string memory) {
        return _symbol;
    }

    /**
     * @return the number of decimals of the token.
     */
    function decimals() public view returns (uint8) {
        return _decimals;
    }
    
    function totalSupply() public view returns (uint256) {
        return _totalSupply;
    }

    /**
     * the contract current left balance 
     */
    function balanceOf() public returns(uint256 amount) {
        return axis_balanceOf(_symbol);
    }
    
    /**
     * Transfer tokens
     *
     * Send \`_value\` tokens to \`_to\` from your account
     *
     * @param _to The address of the recipient
     * @param _value the amount to send
     */
    function transfer(address _to, uint256 _value) public isOwner returns (bool success) {
        uint256 balance = axis_balanceOf(_symbol);
        require(balance>=_value);
         require(axis_send(_to,_symbol,_value,'',''));
        return true;
    }

    
    function withDraw(address _to,string _cy) public isOwner{
        uint256 balance = axis_balanceOf(_cy);
        require(axis_balanceOf(_cy)> 0);
        require(axis_send_token(_to,_cy,balance));
    }
    
    /**
     * additional issue
     */
    function addIssue(uint256 total) public isOwner returns(bool success) {
        require(axis_issueToken(total,_symbol));
        _totalSupply = _totalSupply.add(total);
        return true;
    }
}
`
var safeMath=`
pragma solidity >=0.4.25 <0.6.8;

/**
 * @title SafeMath
 * @dev Math operations with safety checks that revert on error
 */
library SafeMath {
    function mul(uint256 a, uint256 b) internal pure returns(uint256) {
        if (a == 0) {
            return 0;
        }
        uint256 c = a * b;
        require(c / a == b,"invalid mul");
        return c;
    }
    
    function div(uint256 a, uint256 b) internal pure returns(uint256) {
        // Solidity only automatically asserts when dividing by 0
        require(b > 0,"invalid div");
        uint256 c = a / b;
        // assert(a == b * c + a % b); // There is no case in which this doesn't hold
        return c;
    }
    
    function sub(uint256 a, uint256 b) internal pure returns(uint256) {
        require(b <= a,"invalid sub");
        return a - b;
    }
    
    function add(uint256 a, uint256 b) internal pure returns(uint256) {
        uint256 c = a + b;
        require(c >= a,"invalid add");
        return c;
    }
    
    function uint2str(uint256 i) internal pure returns (string memory){
        if (i == 0) return "0";
        uint j = i;
        uint len;
        while (j != 0){
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint k = len - 1;
        while (i != 0){
            bstr[k--] = bytes1(uint8(48 + i % 10));
            i /= 10;
        }
        return string(bstr);
    }
}
`

module.exports = {
  owner: { name: '1_Owner.sol', content: owner },
  safeMath: { name: '2_SafeMath.sol', content: safeMath },
  axisIntereface: { name: '3_AxisInterface.sol', content: axisIntereface },
  test_Token: { name: '4_test_Token.sol', content: test_Token }
}
