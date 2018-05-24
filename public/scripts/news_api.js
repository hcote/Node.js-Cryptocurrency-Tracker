$(document).ready(function() {

console.log('jQuery hooked up');

var newsAPI = 'https://newsapi.org/v2/top-headlines?sources=crypto-coins-news&apiKey=2c77471c420d43dc91a377357de30937'

$.ajax({
   method: 'GET',
   url: newsAPI,
   success: handleSuccess,
   error: handleError
 });

 function handleSuccess(json) {
   json.articles.map(function(data, i) {
     console.log(json);
     $('.big_div').append(`
       <a href="${data.url}" target="_blank" class="news_anchor_tags">
       <img src="${data.urlToImage}" alt="Image for ${data.title}" class="news_image">
       <h1 class="newsHeadline">${data.title}</h1>
       <p>${data.description}</p>
       <p class="article_footer">${data.publishedAt}</p>
       </a>
       <hr />
       <br>
       `)
     })
   }

 function handleError(err) {
   console.log(err);
 }

})
