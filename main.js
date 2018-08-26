const BIP39 = require("bip39")
const bitcore = require("bitcore-lib")
const keccak256 = require('js-sha3').keccak256;

// Generate a random mnemonic (uses crypto.randomBytes under the hood), defaults to 128-bits of entropy
var mnemonic = BIP39.generateMnemonic()

var hexSeed = BIP39.mnemonicToSeedHex(mnemonic)

// Creates a private key from a hexa encoded number
// The hexSeed is too large, so we shorten in
var privateKey = new bitcore.PrivateKey(hexSeed.substring(0,65))

var publicKey = new bitcore.PublicKey(privateKey)

var x = publicKey.point.x.toBuffer()
var y = publicKey.point.y.toBuffer()

publicKey = Buffer.concat([x,y])

const address = keccak256(publicKey) // keccak256 hash of  publicKey

var ETHaddress = "0x" + address.substring(address.length - 40, address.length)

/*

Do not edit code below this line.

*/

var mnemonicVue = new Vue({
    el:"#app",
    data() {
        return { 
            mnemonic: mnemonic,
            privKey: privateKey.bn.toString('hex'),
            pubKey: publicKey.toString('hex'),
            ETHaddress: ETHaddress
        }  
    },
    methods:{
        generateNew: function(){
            this.mnemonic = BIP39.generateMnemonic()
        }
    },
    computed: {
        validMnemonic: function() {
            return BIP39.validateMnemonic(this.mnemonic)
        }
    }
})