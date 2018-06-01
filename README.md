`npm start`

```
pragma solidity ^0.4.0;

contract Channel {

    address public address1 = ${address};
    address public address2 = 0x14791697260E4c9A71f18484C9f997B308e59325;
    uint public startDate = ${Math.floor(Date.now()/1000)};
    uint public channelTimeout = ${_channelTimeout};
    
    constructor() payable {}

    function CloseChannel(bytes32 _h, uint8 _v, bytes32 _r, bytes32 _s, uint _wei, string _key, bytes32 _hashedKey) public {
        address signer;
        bytes32 proof;

        if (keccak256(_key) != _hashedKey) revert();
        
        signer = ecrecover(_h, _v, _r, _s);

        if (signer != address2) revert();

        proof = keccak256(this, _wei, _hashedKey);

        if (proof != _h) revert();

        address2.transfer(_wei);
        
        selfdestruct(address1);
    }

    function ChannelTimeout() public {
        if (startDate + channelTimeout > now) revert();

        selfdestruct(address1);
    }

}
```