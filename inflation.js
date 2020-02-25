exports.getInflation = getInflation;

const fetch = require('node-fetch');

const url = 'https://beta.bls.gov/dataViewer/csv';

async function getInflation(since) {
  
  var startDate = new Date(since);
  
  const params = new URLSearchParams();
  params.append('selectedSeriesIds', 'CUSR0000SA0');
  params.append('startYear', startDate.getFullYear());
  params.append('endYear', new Date().getFullYear());
  
  const response = await fetch(url, { method: 'POST', body: params });
  const csv = await response.text();
  
  var base = 0;
  
  return csv.split('\n').slice(1).reduce(function(map, line) {
    if (line.indexOf(',') != -1) {
      var values = line.split(',');
      var date = formatDate(new Date(values[3]));
      var inflation = values[4];
      if (base == 0) {
        base = inflation;
      }
      map[date] = parseFloat(inflation / base).toFixed(4);
    }
    return map;
  }, {});
}

function formatDate(date) {
  return date.getFullYear().toString() + '-' + (date.getMonth() + 1).toString().padStart(2, '0') + '-' + date.getDate().toString().padStart(2, '0');
}
