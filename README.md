# Generating accounts and Signing Transactions

In this project we are going to generate a private key, derive public keys from the private key and determine the
associated accounts.

To get started clone the project and

```
$ npm install
```

## Generating randomness
In the main.js file include the bip39 package. We will use this to generate random input to generate a private key.

```javascript
const BIP39 = require("bip39")
```
and directly below that include
```javascript
// Generate a random mnemonic (uses crypto.randomBytes under the hood), defaults to 128-bits of entropy
var mnemonic = BIP39.generateMnemonic()
```
Not all strings of characters are valid mneomics for generating keys. You can check if a mnemonic is valid using
```javascript
var isValid = BIP39.validateMnemonic("Enter your mnemonic here")
// This will return false
```
With this mnemonic, you can generate a seed from which to generate a private key. Add the following line to main.js
```javascript
var hexSeed = BIP39.mnemonicToSeedHex(mnemonic)
```
To actually generate a private key from the hex seed, we need to use the [bitcore library](https://bitcore.io/api/lib)
```javascript
const bitcore = require("bitcore-lib")
```

## Generate Public / Private Keypair

Using this mnemonic as a source of randomness, you can now create signing keypair.
```javascript
// Creates a private key from a hexa encoded number
// The hexSeed is too large, so we shorten in
var privateKey = new bitcore.PrivateKey(hexSeed.substring(0,65))
```
With the private key, we can generate the public key.
```javascript
var publicKey = new bitcore.PublicKey(privateKey)
```
The public key is actually a point on a curve (it uses elliptic curve cyrptography). The public key is the x-coordinate
of this point.

Generating the private key and public key is the same for both Bitcoin and Ethereum. Deriving an account address
from the public differs slightly. We will see how to generate an Ethereum address.

## Generate Address

Generating an Ethereum address from a public key requires an additional hashing algorithm. Import it like so
```javascript
const createKeccakHash = require('keccak')
```
Taking the keccak-256 hash of the public key will return 32 bytes
```javascript
var hashToTrim = createKeccakHash('keccak256').update(publicKey.point.x.toString()).digest('hex')
```
which you need to trim down to the last 20 bytes (40 characters in hex) to get the address
```javascript
var ETHaddress = "0x" + hashToTrim.substring(toTrim.length - 40, toTrim.length)
```

## Using your key

Using this key we can sign transactions from this address and broadcast them to the network.