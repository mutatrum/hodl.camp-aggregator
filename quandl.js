exports.getGold = getGold;

const https = require("https");
const url = "https://www.quandl.com/api/v3/datasets/6423802/data?collapse=daily&start_date=";

function process(body, since, count) {
  var result = new Array();
  
  var content = JSON.parse(body);
  
  var entries = content.dataset_data.data.reverse();
  
  var data = entries.reduce((obj, item) => {
    obj[item[0]] = item[1];
    return obj;
  }, {});
  
  var date = new Date(since);
  var today = new Date();

  var lastPrice = entries[0][1];
  while (result.length < count) {
    var i = formatDate(date);
    if (data.hasOwnProperty(i)) {
      lastPrice = data[i];
    }
    result.push(lastPrice);
    
    date.setDate(date.getDate() + 1); 
  }
  
  return result;
}

function formatDate(date) {
  return date.getFullYear().toString() + '-' + (date.getMonth() + 1).toString().padStart(2, '0') + '-' + date.getDate().toString().padStart(2, '0');
}

function getGold(since, count) {
  return new Promise(function(resolve, reject) {
    https.get(url + since, { headers : { "accept" : "application/json" }}, res => {
      let body = "";
      res.on("data", data => {
        body += data;
      });
      res.on("end", () => {
        resolve(process(body, since, count));
      });
    });
  });
}

