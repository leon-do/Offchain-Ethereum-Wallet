https://leon-do.github.io/Offchain-Ethereum-Wallet/

python -m SimpleHTTPServer

```
pragma solidity ^0.4.0;

contract OnChainWallet {
 
    struct Channel {
        bool exist;
        uint onchainAmount;
        uint refundBlockHeight;
    }
 
    // channels[fromAddress][toAddress].exist == true
    mapping (address  => mapping (address => Channel)) public channels;
    
    // Refund delay. Default: 4 hours
    uint public refundDelay = 4 * 60 * 4;
    
    
    event ChannelFundingRecieved(uint);
    event ChannelClaimed(uint, bool);
    
    function claim(
        bytes32 _h, 
        uint8 _v, 
        bytes32 _r, 
        bytes32 _s, 
        uint amount, 
        address toAddress,
        uint expires
    ) public returns (bytes32){
        address fromAddress = ecrecover(_h, _v, _r, _s);
        
        Channel storage channel = channels[fromAddress][toAddress];

        require(channel.exist == true, "Channel does not exist");
        require(channel.onchainAmount >= amount, "Amount exceeds balance");
        require(channel.refundBlockHeight >= block.number , "Too late to claim");
        require(expires <= channel.refundBlockHeight, "Expired message");
        require (_h == keccak256(toAddress, amount, expires), 'Invalid Signature');

        // send to address
        toAddress.transfer(amount);
        // return leftovers
        fromAddress.transfer(channel.onchainAmount - amount);

        // reset channel
        delete channels[fromAddress][toAddress];
        emit ChannelClaimed(amount, channel.exist);

    }
    
    // fund a channel
    function fund(address toAddress)  public payable {
        Channel storage channel = channels[msg.sender][toAddress];

        if (!channel.exist) {
            channel.exist = true;
            channel.onchainAmount = 0;
            channel.refundBlockHeight = block.number + refundDelay;
        }
        
        channel.onchainAmount += msg.value;
        
        emit ChannelFundingRecieved(msg.value);
    }
    
    function refund(address toAddress){
        Channel storage channel = channels[msg.sender][toAddress];
        
        require(channel.refundBlockHeight <= block.number);

         // return leftovers
        msg.sender.transfer(channel.onchainAmount);

        // reset channel
        delete channels[msg.sender][toAddress];
        emit ChannelClaimed(channel.onchainAmount, channel.exist);
    }
    
}
```
