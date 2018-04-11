$(document).ready(function() {

console.log(`jQuery hooked up`);

var cryptoAPI = "https://api.coinmarketcap.com/v1/ticker/" + symbol

$.ajax({
   method: 'GET',
   url: cryptoAPI,
   success: handleSuccess,
   error: handleError
 });

 function handleSuccess(json) {
   json.map(function(data, i) {
     $('.tbl_header').append(`<tr class='table-row'>
       <td>${data.rank}</td>
       <td>${data.name}</td>
       <td>${data.symbol}</td>
       <td>${data.price_usd}</td>
       <td>${data.price_btc}</td>
       <td>${data.price_btc}</td>
       <td>${data.market_cap_usd}</td>
       <td>${data.percent_change_24}</td>
       <td>${data.percent_change_7d}</td>
       <td>
       <span  class="btn" data-toggle="modal" data-target=".bd-example-modal-sm">⋯</button>
       <div class="modal fade bd-example-modal-sm" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-edit modal-sm">
          <div class="modal-content">
           <button type="button" class="btn btn-primary"><a class='modal-button' href='/portfolio'>Add to Portfolio</a></button>
           <br />
           <button type="button" class="btn btn-primary"><a class='modal-button' href='/favorites'>Add to Favorites</a></button>
           <br />
           <button type="button" class="btn btn-primary"><a class='modal-button' href='/${data.symbol}'>View ${data.name}</a></button>
          </div>
        </div>
       </div>
       </td>
       </tr>`)
 })
}

 function handleError(err) {
   console.log(err);
 }


})
