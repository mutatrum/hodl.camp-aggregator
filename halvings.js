exports.getHalvings = getHalvings;

var bitcoin_rpc = require('node-bitcoin-rpc');

function call(command, parameters) {
  return new Promise(function(resolve, reject) {
    bitcoin_rpc.call(command, parameters, function (error, result) {
      if (error !== null) {
        reject(error);
      } else {
        resolve(result.result);
      }
    });
  });
}

function formatDate(time) {
  var date = new Date(time * 1000);
  return date.getFullYear().toString() + '-' + (date.getMonth() + 1).toString().padStart(2, '0') + '-' + date.getDate().toString().padStart(2, '0');
}

async function getHalvings(config) {

  bitcoin_rpc.init(config.host, config.port, config.user, config.password);
  bitcoin_rpc.setTimeout(1000);

  var result = new Array();
  var blockChainInfo = await call('getblockchaininfo');
  
  for(var height = 0; height< blockChainInfo.blocks; height += (210000 / 4)) {
    var blockHash = await call('getblockhash', [height]);
    
    var block = await call('getblock', [blockHash]);
    
    result.push(formatDate(block.time));
  }
  
  return result;
}
