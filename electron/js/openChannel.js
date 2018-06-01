const axios = require('axios')
const ethers = require('ethers')
const solc = require('solc')

/*
total: amount in wei 
    1000000000000000000 wei === 1 ETH
channelTimeout: in seconds
*/
async function openChannel (total, channelTimeout) {
    const provider = ethers.providers.getDefaultProvider('rinkeby') // or mainnet

    // start wallet
    const privateKey = '0x536a06fd1ad840e16d85ed3d36d1a1f526c8a16a7b8bcf7b90a574d3b089e03f'
    const wallet = new ethers.Wallet(privateKey, provider)
    
    // data for solidity code
    const address1 = wallet.address
    const address2 = '0xdD6fBbd0b8A23aF5eFbDefBF16A3A22497E203c4'
    const startDate = Math.floor(Date.now()/1000)

    // solidity code
    const solidityCode = `pragma solidity ^0.4.0; contract Channel { address public address1 = ${address1}; address public address2 = ${address2}; uint public startDate = ${startDate}; uint public channelTimeout = ${channelTimeout}; constructor() payable {} function CloseChannel(bytes32 _h, uint8 _v, bytes32 _r, bytes32 _s, uint _wei, string _key, bytes32 _hashedKey) public { address signer; bytes32 proof; if (keccak256(_key) != _hashedKey) revert(); signer = ecrecover(_h, _v, _r, _s); if (signer != address2) revert(); proof = keccak256(this, _wei, _hashedKey); if (proof != _h) revert(); address2.transfer(_wei); selfdestruct(address1); } function ChannelTimeout() public { if (startDate + channelTimeout > now) revert(); selfdestruct(address1); } }`

    // compile solidity code
    const output = solc.compile(solidityCode, 1)
    let bytecode
    let abi
    for (const contractName in output.contracts) {
        bytecode = output.contracts[contractName].bytecode
        abi = JSON.parse(output.contracts[contractName].interface)
    }
    bytecode = '0x' + bytecode

    // create contract
    const rawTransaction = ethers.Contract.getDeployTransaction(bytecode, abi)

    // deploy contract
    const transaction = await wallet.sendTransaction({
        data: rawTransaction.data,
        value: ethers.utils.bigNumberify(total.toString())
    })

    // wait for contract address
    let contractAddress
    while (contractAddress === undefined) {
        await pause(5000)
        console.log('waiting for contract address...', transaction.hash)
        contractAddress = await getContractAddress(transaction.hash)
    }

    return { contractAddress, address1, address2, startDate, channelTimeout, total, sent = 0}
}

// return contract address or undefined
async function getContractAddress(_addressHash) {
    try {
        // mainnet: https://api.etherscan.io/api?module=proxy&action=eth_getTransactionReceipt&txhash=${_addressHash}
        // testnet: https://api-rinkeby.etherscan.io/api?module=proxy&action=eth_getTransactionReceipt&txhash=${_addressHash}
        const response = await axios.get(`https://api-rinkeby.etherscan.io/api?module=proxy&action=eth_getTransactionReceipt&txhash=${_addressHash}`)
        return response.data.result.contractAddress
    } catch (e) {
        return undefined
    }
}

function pause(_milliseconds){
    return new Promise(resolve => {
        setTimeout(function(){
            resolve(true)
        }, _milliseconds)
    })
}

module.exports = { openChannel }