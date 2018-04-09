$(document).ready(function() {

console.log(`jQuery hooked up`);

var cryptoAPI = "https://api.coinmarketcap.com/v1/ticker/"

$.ajax({
   method: 'GET',
   url: cryptoAPI,
   success: handleSuccess,
   error: handleError
 });

 function handleSuccess(json) {
   json.map(function(data, i) {
     console.log(data);
     $('.tbl_header').append(`<td></td>`)
     // $('.rank').append(data.rank);
     // $('.name').append(data.name);
     // $('.symbol').append(data.symbol);
     // $('.price_use').append(data.price_usd);
     // $('.price_btc').append(data.price_btc);
     // $('.volume').append(data.24h_volume_usd);
     // $('.mktcap').append(data.market_cap_usd);
     // $('.pctOneDay').append(data.percent_change_24);
     // $('.pctOneWeek').append(data.percent_change_7d);
   })
   console.log(json[0].name);
 }

 function handleError(err) {
   console.log(err);
 }

  // var button = document.getElementById('something');
  // console.log(button);
  // if(!!button) {
  //   for (i=0; i < button.length; i++) {
  //     button[i].addEventListenter('click', getCryptoData, false);
  //     console.log('hello');
  //   }
  // } else {
  //   console.log(`button is null`);
  // }

})
