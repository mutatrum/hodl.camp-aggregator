require('log-timestamp');
const cron = require('node-cron');
const fs = require('fs');

const halvings = require('./halvings.js');
const inflation = require('./inflation.js');
const coinmetrics = require('./coinmetrics.js');
const quandl = require('./quandl.js');
const config = require('./config.js');

(function () {
  console.log('init')
  cron.schedule('0 0 3 * * *', () => onSchedule());
})();

async function onSchedule() {
  console.log('start');
  var result = new Object();

  result.halvings = await halvings.getHalvings(config.bitcoin_rpc);

  console.log(`halvings: ${result.halvings.length} records`);

  var bitcoin = await coinmetrics.getBitcoin();

  result.bitcoin = bitcoin.prices;
  result.since = bitcoin.since;

  console.log(`since: ${result.since}`);
  console.log(`bitcoin: ${result.bitcoin.length} records`);

  result.inflation = await inflation.getInflation(result.halvings[0]);

  console.log(`inflation: ${Object.keys(result.inflation).length} records`);

  result.gold = await quandl.getGold(config.quandl, result.since, result.bitcoin.length);

  console.log(`gold: ${result.gold.length} records`);

  fs.writeFileSync('data.json', JSON.stringify(result));

  console.log('done');
}
