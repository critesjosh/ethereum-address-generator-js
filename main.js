const BIP39 = require("bip39")
const bitcore = require("bitcore-lib")
const createKeccakHash = require('keccak')

// Generate a random mnemonic (uses crypto.randomBytes under the hood), defaults to 128-bits of entropy
var mnemonic = BIP39.generateMnemonic()

var hexSeed = BIP39.mnemonicToSeedHex(mnemonic)

// Creates a private key from a hexa encoded number
// The hexSeed is too large, so we shorten in
var privateKey = new bitcore.PrivateKey(hexSeed.substring(0,65))
console.log(privateKey.bn.toString(16).length)

var publicKey = new bitcore.PublicKey(privateKey)

var hashToTrim = createKeccakHash('keccak256').update(publicKey.point.x.toString()).digest('hex')

var ETHaddress = "0x" + hashToTrim.substring(hashToTrim.length - 40, hashToTrim.length)

console.log(ETHaddress)

/*

Do not edit code below this line.

*/

var mnemonicVue = new Vue({
    el:"#mnemonic",
    data() {
        return { mnemonic: mnemonic }  
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

var keyVue = new Vue({
    el:"#keys",
    data(){
        return {
            privKey: privateKey,
            pubKey: publicKey.point.x
        }
    },
    computed: {

    }
})