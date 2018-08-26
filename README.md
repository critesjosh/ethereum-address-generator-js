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

## Generate Public / Private Keypair

Using this mnemonic as a source of randomness, you can now create signing keypai

## Generate Address