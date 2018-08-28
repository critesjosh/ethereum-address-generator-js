// add imports here
const BIP39 = require("bip39")
const bitcore = require("bitcore-lib")
const keccak256 = require('js-sha3').keccak256;

// Generate a random mnemonic (uses crypto.randomBytes under the hood), defaults to 128-bits of entropy
function generateMnemonic(){
    // add code here
}

function generateHexSeed(mnemonic){
    // add code here
}

function generatePrivKey(mnemonic){
    // add code here
}

function derivePubKey(privKey){
    // add code here
}

function deriveEthAddress(pubKey){
     // add code here 
}

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