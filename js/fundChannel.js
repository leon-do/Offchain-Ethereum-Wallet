// go on chain to get channel info

function fundChannel() {
  const toAddress = document.getElementById("onChainToAddr").value;
  const eth = document.getElementById("onChainAmount").value;
  const contractAddress = "0x0e06f2a560fBc2bE6D1F67941f561925DDD8DA2D";
  const abi = [
    {
      "constant": false,
      "inputs": [
        {
          "name": "_h",
          "type": "bytes32"
        },
        {
          "name": "_v",
          "type": "uint8"
        },
        {
          "name": "_r",
          "type": "bytes32"
        },
        {
          "name": "_s",
          "type": "bytes32"
        },
        {
          "name": "amount",
          "type": "uint256"
        },
        {
          "name": "toAddress",
          "type": "address"
        }
      ],
      "name": "claim",
      "outputs": [
        {
          "name": "",
          "type": "bytes32"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "toAddress",
          "type": "address"
        }
      ],
      "name": "fund",
      "outputs": [],
      "payable": true,
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "ChannelFundingRecieved",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "name": "",
          "type": "uint256"
        },
        {
          "indexed": false,
          "name": "",
          "type": "bool"
        }
      ],
      "name": "ChannelClaimed",
      "type": "event"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "",
          "type": "address"
        },
        {
          "name": "",
          "type": "address"
        }
      ],
      "name": "channels",
      "outputs": [
        {
          "name": "exist",
          "type": "bool"
        },
        {
          "name": "onchainAmount",
          "type": "uint256"
        },
        {
          "name": "refundBlockHeight",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "refundDelay",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    }
  ];

  // convert amount from eth to wei
  const amount = ethers.utils.parseEther(eth);

  // https://ethereum.stackexchange.com/questions/25431/metamask-how-to-access-call-deployed-contracts-functions-using-metamask
  const contractInstance = web3.eth.contract(abi).at(contractAddress);

  // call the fund() function and send eth to contract
  contractInstance["fund"](toAddress, { value: amount }, (err, txHash) => {
    if (err) {console.log(err)}
    // display transaction hash
    document.getElementById("fundChannel").innerHTML = JSON.stringify(
        { txHash },
        null,
        4
      );
  });
}
