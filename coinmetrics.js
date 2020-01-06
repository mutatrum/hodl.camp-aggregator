exports.getBitcoin = getBitcoin;

const https = require("https");

const url = "https://coinmetrics.io/newdata/split/btc_PriceUSD.txt";

function process(body) {
  var result = new Object();

  var lines = body.split('\n');

  result.since = lines[0];
  
  result.prices = lines.slice(2).map(price => Number(Number(price).toFixed(4)));
  
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
        resolve(process(body));
      });
    });
  });
}
