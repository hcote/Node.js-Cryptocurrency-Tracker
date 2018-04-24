$( document ).ready(function() {
    console.log( "ready!" );

$('.oneday').on('click', function() {
  $('.7d').addClass('hide');
  $('.1d').removeClass('hide');
  $('.oneday').addClass('gray');
  $('.sevenday').removeClass('gray');
})

$('.sevenday').on('click', function() {
  $('.1d').addClass('hide');
  $('.7d').removeClass('hide');
  $('.sevenday').addClass('gray');
  $('.oneday').removeClass('gray');
})

});
