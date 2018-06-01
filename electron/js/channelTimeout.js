const axios = require('axios')
const ethers = require('ethers')
const solc = require('solc')

/*
_tx = { 
  contractAddress: '0xeba3dd2d7b2ae2171cd6f90f7cc16c0ae66a5ec4',
  address1: '0x096D8e86c0385b2c11E076Bce4aAF48D8d06F131',
  address2: '0xdD6fBbd0b8A23aF5eFbDefBF16A3A22497E203c4',
  startDate: 1527827308,
  channelTimeout: 1 }
*/
async function channelTimeout(_tx) {
    const provider = ethers.providers.getDefaultProvider('rinkeby') // or mainnet

    // start wallet
    const privateKey = '0x536a06fd1ad840e16d85ed3d36d1a1f526c8a16a7b8bcf7b90a574d3b089e03f'
    const wallet = new ethers.Wallet(privateKey, provider)

    // solidity code
    const solidityCode = `pragma solidity ^0.4.0; contract Channel { address public address1 = ${_tx.address1}; address public address2 = ${_tx.address2}; uint public startDate = ${_tx.startDate}; uint public channelTimeout = ${_tx.channelTimeout}; constructor() payable {} function CloseChannel(bytes32 _h, uint8 _v, bytes32 _r, bytes32 _s, uint _wei, string _key, bytes32 _hashedKey) public { address signer; bytes32 proof; if (keccak256(_key) != _hashedKey) revert(); signer = ecrecover(_h, _v, _r, _s); if (signer != address2) revert(); proof = keccak256(this, _wei, _hashedKey); if (proof != _h) revert(); address2.transfer(_wei); selfdestruct(address1); } function ChannelTimeout() public { if (startDate + channelTimeout > now) revert(); selfdestruct(address1); } }`

    // compile solidity code
    const output = solc.compile(solidityCode, 1)
    let bytecode
    let abi
    for (const contractName in output.contracts) {
        bytecode = output.contracts[contractName].bytecode
        abi = JSON.parse(output.contracts[contractName].interface)
    }
    bytecode = '0x' + bytecode

    // call ChannelTimeout()
    const contract = new ethers.Contract(_tx.contractAddress, abi, wallet)
    const closedChannel = await contract.ChannelTimeout()
    
    _tx.closedChannel = closedChannel.hash
    return _tx
}

module.exports = { channelTimeout }