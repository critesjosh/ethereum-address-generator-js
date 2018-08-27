const BIP39 = require("bip39")
const bitcore = require("bitcore-lib")
const keccak256 = require('js-sha3').keccak256;

// Generate a random mnemonic (uses crypto.randomBytes under the hood), defaults to 128-bits of entropy
function generateMnemonic(){
    return BIP39.generateMnemonic()
}

function generateHexSeed(mnemonic){
    return BIP39.mnemonicToSeedHex(mnemonic)
}

function generatePrivKey(mnemonic){
    const seed = generateHexSeed(mnemonic)
    return new bitcore.PrivateKey(seed.substring(0,65))
}

function derivePubKey(privKey){
    const publicKey = new bitcore.PublicKey(privKey)

    var x = publicKey.point.x.toBuffer()
    var y = publicKey.point.y.toBuffer()  
    
    return Buffer.concat([x,y])
}

function deriveEthAddress(pubKey){
    const address = keccak256(pubKey) // keccak256 hash of  publicKey

    return "0x" + address.substring(address.length - 40, address.length)    
}


//var hexSeed = BIP39.mnemonicToSeedHex(mnemonic)

// Creates a private key from a hexa encoded number
// The hexSeed is too large, so we shorten in
// var privateKey = new bitcore.PrivateKey(hexSeed.substring(0,65))

// var publicKey = new bitcore.PublicKey(privateKey)

// var x = publicKey.point.x.toBuffer()
// var y = publicKey.point.y.toBuffer()

// publicKey = Buffer.concat([x,y])

// const address = keccak256(publicKey) // keccak256 hash of  publicKey

// var ETHaddress = "0x" + address.substring(address.length - 40, address.length)

/*

Do not edit code below this line.

*/

var mnemonicVue = new Vue({
    el:"#app",
    data: {  
        mnemonic: "",
        privKey: "",
        pubKey: "",
        ETHaddress: ""
    },
    methods:{
        generateNew: function(){
            this.mnemonic = generateMnemonic()
        }
    },
    watch: {
        mnemonic: function(val){
            if(!this.validMnemonic) return
            this.privKey = generatePrivKey(val)
        },
        privKey: function(val){
            this.pubKey = derivePubKey(val)
        },
        pubKey: function(val){
            this.ETHaddress = deriveEthAddress(val)
        }
    },
    computed: {
        validMnemonic: function() {
            return BIP39.validateMnemonic(this.mnemonic)
        }
    }
})