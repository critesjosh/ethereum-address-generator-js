# Generating Ethereum accounts in Javascript

Public pey cryptography and digital signatures are a foundational technology that enable blockchains to work. In this project you are going to get your hands dirty and understand how they work at the code level. You will be using Javascript and a simple web interface to see what is going on.

First, we are going to generate a private key, derive public keys from the private key and determine the
associated accounts.

To get started clone the project and

```
$ npm install
$ npm watch         # this will watch for updates in main.js and update bundle.js
$ npm reload        # this will serve the app @ localhost:8081 and refresh the page when there are updates 
```

## Generating randomness

In the main.js file include the [bip39 package](https://www.npmjs.com/package/bip39). We will use this to generate random input to generate a private key.

```javascript
const BIP39 = require("bip39")
```
and directly below that include
```javascript
// Generate a random mnemonic (uses crypto.randomBytes under the hood), defaults to 128-bits of entropy
function generateMnemonic(){
    return BIP39.generateMnemonic()
}
```
Not all strings of characters are valid mneomics for generating keys. You can check if a mnemonic is valid using
```javascript
var isValid = BIP39.validateMnemonic("Enter your mnemonic here")
// This will return false
```

With this mnemonic, you can generate a seed from which to generate a private key. Add the following line to main.js
```javascript
function generateHexSeed(mnemonic){
    return BIP39.mnemonicToSeedHex(mnemonic)
}
```

## Generate Public / Private Keypair

Using this mnemonic as a source of randomness, you can now create signing keypair.

To generate a private key from the hex seed, we will to use the [bitcore library](https://bitcore.io/api/lib)
```javascript
const bitcore = require("bitcore-lib")
```

__*Note that the method by which randomness is passed to the private key generator in this demonstration application is different than other common tools such as [myetherwallet.com](https://www.myetherwallet.com/) or the [Metamask chrome extension](https://metamask.io/). Explore a much more robust address derivation application at [iancoleman.io](https://iancoleman.io/bip39/)*__

```javascript
function generatePrivKey(mnemonic){
    const seed = generateHexSeed(mnemonic)
    return new bitcore.PrivateKey(seed.substring(0,65))
}
```
With the private key, we can generate the public key.

The public key returned here is actually a point on a curve. A public key in Ethereum is a byte array formed by the concatenation of the x-coordinate and the y-coordinate returned by the previous function, so to get the public key as defined in the [yellow paper](http://gavwood.com/paper.pdf), you must concatenate them
```javascript
function derivePubKey(privKey){
    const publicKey = new bitcore.PublicKey(privKey)

    var x = publicKey.point.x.toBuffer()
    var y = publicKey.point.y.toBuffer()  
    
    return Buffer.concat([x,y])
}
```

Generating the private key and public key is the same for both Bitcoin and Ethereum, the both use [secp256k1 elliptic curve cryptography](https://en.bitcoin.it/wiki/Secp256k1). Deriving an account address
from the public differs slightly. We will see how to generate an Ethereum address.

## Generate Address

Generating an Ethereum address from a public key requires an additional hashing algorithm. Import it like so
```javascript
const keccak256 = require('js-sha3').keccak256;
```
Taking the keccak-256 hash of the public key will return 32 bytes which you need to trim down to the last 20 bytes (40 characters in hex) to get the address
```javascript
function deriveEthAddress(pubKey){
    const address = keccak256(pubKey) // keccak256 hash of  publicKey
    // Get the last 20 bytes of the public key
    return "0x" + address.substring(address.length - 40, address.length)    
}
```

You can check this private key and address against [myetherwallet](https://www.myetherwallet.com/#view-wallet-info). Select restore from private key and verify that the derived address matches the one in this app.


## Using your key

Using this private key we can sign transactions from this address and broadcast them to the network.

Nodes that are verifying transactions in the network will use the signature to determine the address of the signatory, cryptographically verifying that every transaction from this account is coming from someone who has access to the corresponding private key. 

### Resources

[Understanding the concept of private keys, public keys and addresses in Ethereum](https://etherworld.co/2017/11/17/understanding-the-concept-of-private-key-public-key-and-address-in-ethereum-blockchain/)

[Bitcoin wiki on Secp256k1](https://en.bitcoin.it/wiki/Secp256k1)

[Ethereum yellow paper](http://gavwood.com/paper.pdf)