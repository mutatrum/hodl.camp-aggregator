exports.getBitcoin = getBitcoin;

const https = require("https");

const url = "https://community-api.coinmetrics.io/v4/timeseries/asset-metrics?page_size=10000&metrics=PriceUSD&assets=btc";

function process(body) {
  var result = new Object();

  result.since = body.data[0].time.substring(0,10);

  result.prices = body.data.map(entry => Number(entry.PriceUSD).toFixed(4));
  
  return result;
}

function getBitcoin() {
  return new Promise(function(resolve, reject) {
    https.get(url, res => {
      res.setEncoding("utf8");
      let body = "";
      res.on("data", data => {
        body += data;
      });
      res.on("end", () => {
        resolve(process(JSON.parse(body)));
      });
    });
  });
}
