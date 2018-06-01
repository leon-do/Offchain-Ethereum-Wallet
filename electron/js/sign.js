/*
_tx = { 
    contractAddress: '0xeba3dd2d7b2ae2171cd6f90f7cc16c0ae66a5ec4',
    address1: '0x096D8e86c0385b2c11E076Bce4aAF48D8d06F131',
    address2: '0xdD6fBbd0b8A23aF5eFbDefBF16A3A22497E203c4',
    startDate: 1527827308,
    channelTimeout: 1
    total: 100000000,
    sent: 0
    }
*/
function sign(_wei, _tx) {
    const privateKey = '0x536a06fd1ad840e16d85ed3d36d1a1f526c8a16a7b8bcf7b90a574d3b089e03f'
    const signingKey = new ethers.SigningKey(privateKey)
    const signerAddress = signingKey.address

    const key = 'password'
    const hashedKey =  ethers.utils.keccak256(ethers.utils.toUtf8Bytes(key))

    // update amount
    const sent = _tx.sent + _wei

    // hash message
    const h = ethers.utils.solidityKeccak256(['address', 'int', 'bytes32'], [contractAddress, amount.toString(), hashedKey])

    // sign and split message: https://github.com/ethers-io/ethers.js/issues/85
    const {r, s, recoveryParam} = signingKey.signDigest(h)
    const v = 27 + recoveryParam

    return { h, v, r, s, sent, key, hashedKey}
}

module.exports = { sign }