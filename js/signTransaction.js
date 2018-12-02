// signs offhcain messages
async function signTransaction() {
  const toAddress = document.getElementById("toAddr").value;
  const eth = document.getElementById("offChainAmount").value;
  const fromAddress = web3.currentProvider.selectedAddress;

  // convert amount from eth to wei
  const amount = ethers.utils.parseEther(eth);

  // get when timelock expires
  const expires = await getChannelInfo(toAddress).then(info => info.refundBlockHeight)

  // https://docs.ethers.io/ethers.js/html/api-utils.html
  const h = ethers.utils.solidityKeccak256(
    ['address', 'uint', 'uint'],
    [toAddress, amount, expires]
  );
  web3.eth.sign(fromAddress, h, function (err, sig) {
    if (err) return console.error(err)
    // parse signature
    const r = sig.slice(0, 66)
    const s = '0x' + sig.slice(66, 130)
    const v = web3.toDecimal('0x' + sig.slice(130, 132))
    // display signed message
    document.getElementById("signTransaction").innerHTML = JSON.stringify(
      { fromAddress, h, v, r, s, amount: amount.toString(), toAddress, expires},
      null,
      4
    );
  })


}
