var Web3 = require('web3');

var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

setInterval(update, 5000);

var contractAddress = '0x2a0c0dbecc7e4d658f48e01e3fa353f44050c208';


async function update() {
	try{	
	var blockAmount = 100 //6171;//block time of 14s.  24h interval
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
	blocksData.forEach((block)=>{
		block.transactions.forEach((transaction)=>{
			if (transaction.to != null) {
				if (transaction.to.toLowerCase() == contractAddress || transaction.from.toLowerCase() == contractAddress) {
					console.log(typeof transaction.value);
					volume += Number( web3.utils.fromWei(transaction.value, 'ether'));
					transactionCount+=1;
				}
			}
		});
	});
	console.log('volume is ' + volume, 'transaction count is ' + transactionCount);
		
	} catch(e){ 
		console.log(e);	
	}
}
