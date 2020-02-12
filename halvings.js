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

  const quarter = 210000 / 4;

  bitcoin_rpc.init(config.host, config.port, config.user, config.password);
  bitcoin_rpc.setTimeout(1000);

  var result = new Array();

  var currentblockheight = await call('getblockcount');

  console.log(`block height ${currentblockheight}`);
  
  for(var height = 0; height < currentblockheight; height += quarter) {
    
    var blockHash = await call('getblockhash', [height]);
    
    var block = await call('getblock', [blockHash]);
    
    result.push(formatDate(block.mediantime));
  }
  
  var currentblockhash = await call('getblockhash', [currentblockheight]);
  var currentblock = await call('getblock', [currentblockhash]);
  var halvingblockheight = Math.ceil(currentblockheight / quarter ) * quarter;
  var blockheightdelta = halvingblockheight - currentblockheight;
  var previousblockheight = currentblockheight - blockheightdelta;
  var previousblockhash = await call('getblockhash', [previousblockheight]);
  var previousblock = await call('getblock', [previousblockhash]);
  var deltatime = currentblock.mediantime - previousblock.mediantime;
  var halving = formatDate(currentblock.mediantime + deltatime);
  
  console.log(`next halving quarter ${halving}`);
  
  result.push(halving);
  
  return result;
}
