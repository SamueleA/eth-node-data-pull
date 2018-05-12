var Web3 = require('web3');
var fs = require('fs');
var moment = require('moment');

var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

var contractsArray = ['0xb1690c08e213a35ed9bab7b318de14420fb57d8c','0xc7af99fe5513eb6710e6d5f44f9989da40f27f26','0x06012c8cf97bead5deae237070f9587f8e7a266d'];

var now =  moment();
var formattedDate = now.format('YYYY-MM-DD HH:mm:ss Z');
 fs.appendFile('ethNodePollingLog.txt', '\nProgram started. Time UTC is : ' + formattedDate + '. Block polling every 10 minutes' , (err)=>{
 	if (err) throw err;
 	console.log('file updated');
 });


setInterval(update, 600000);

async function update() {
	try{	
		let timeIntervalLimit = 60 * 10; //10 minutes time interval
		let timeInterval = 0;
	
		let currentBlock = await web3.eth.getBlock('latest', true);
		let latestTimestamp = currentBlock.timestamp;
		let currentBlockNumber = currentBlock.number;
	        
		let volume = 0;
	        let transactionCount = 0;
	
		//exact block number which is out of time window is unknown
		while (timeInterval < timeIntervalLimit) {
			for(var i=0; i<contractsArray.length;i++){
				let contractAddress = contractsArray[i];
				for(var j=0; j<currentBlock.transactions.length;j++){
					let transaction = currentBlock.transactions[j];
					if (transaction.to != null) {
                                                if (transaction.to.toLowerCase() == contractAddress || transaction.from.toLowerCase() == contractAddress) {
                                                        //verify if the transaction succeeded
                                                        let receipt = await web3.eth.getTransactionReceipt(transaction.hash);
                                                        let txStatus =  receipt.status;
                                                        if (txStatus == true) {
                                                       		volume += Number( web3.utils.fromWei(transaction.value, 'ether'));
                                                        	transactionCount+=1;
							}
                                                }   
                                        }   
					
				}
			}
			currentBlockNumber -= 1;
			currentBlock = await web3.eth.getBlock(currentBlockNumber, true);
			timeInterval = latestTimestamp - currentBlock.timestamp;
		}
	
		console.log('volume is ' + volume, 'transaction count is ' + transactionCount);
		fs.appendFile('ethNodePollingLog.txt', '\nvolume is ' + volume + ' | transaction count is ' + transactionCount, (err)=>{
			if (err) throw err;
			console.log('file updated');
		});
			
	} catch(e){ 
		console.log(e);	
	}

}
