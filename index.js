var Web3 = require('web3');

var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

web3.eth.getTransactionReceipt("0x4e1ee8ff4d2735f67e75de3c67b2da2ef330ee7242e06ce7c49ae7f462033866").then((err, res)=>{

	console.log(err);
	console.log(res);
});
