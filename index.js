var Web3 = require('web3');

var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

var contractAddress = '0x2a0c0dbecc7e4d658f48e01e3fa353f44050c208';

var contractsArray = ['0xb1690c08e213a35ed9bab7b318de14420fb57d8c','0xc7af99fe5513eb6710e6d5f44f9989da40f27f26','0x06012c8cf97bead5deae237070f9587f8e7a266d'];


update();

//setInterval(update, 20000);

async function update() {
	try{	
	var blockAmount = 43 //block time of 14s.  10 minutes interval = > 42.8 blocks
	let getBalancePromise = web3.eth.getBalance(contractAddress);		
	let latestBlock = await web3.eth.getBlock('latest', true);
	let latestBlockNumber = latestBlock.number;
	let blocksDataPromises=[];
	for (var i=1; i<blockAmount;i++) {
		blocksDataPromises.push(web3.eth.getBlock(latestBlockNumber - i, true));			
	}
	let blocksData = await Promise.all(blocksDataPromises);
	blocksData.unshift(latestBlock);
	let volume =0;
	let transactionCount=0;
	contractsArray.forEach((contract) =>{
		blocksData.forEach((block)=>{
			console.log('processsing block ' + block.number);
			block.transactions.forEach((transaction)=>{
				if (transaction.to != null) {
					if (transaction.to.toLowerCase() == contract || transaction.from.toLowerCase() == contract) {
						volume += Number( web3.utils.fromWei(transaction.value, 'ether'));
						transactionCount+=1;
					}
				}
			});
		});
	});
	console.log('volume is ' + volume, 'transaction count is ' + transactionCount);
		
	} catch(e){ 
		console.log(e);	
	}
}
