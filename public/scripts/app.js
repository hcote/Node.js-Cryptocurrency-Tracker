$( document ).ready(function() {
    console.log( "ready!" );

var oneDayChange = parseFloat($('.1d').html());
var sevenDayChange = parseFloat($('.7d').html());
var zero = 0;
console.log(oneDayChange);
console.log(sevenDayChange);



$(".1d").each(function(i) {
  if (parseFloat($(this).html()) > 0) {
    $(this).removeClass('red');
    $(this).addClass('green');
  } else {
    $(this).removeClass('green');
    $(this).addClass('red');
    }
});


$(".7d").each(function(i) {
  if (parseFloat($(this).html()) > 0) {
    $(this).removeClass('red');
    $(this).addClass('green');
  } else {
    $(this).removeClass('green');
    $(this).addClass('red');
    }
});


$('.oneday').on('click', function() {
  $('.7d').addClass('hide');
  $('.1d').removeClass('hide');
  $('.7day').addClass('hide');
  $('.1day').removeClass('hide');
  $('.oneday').addClass('gray');
  $('.sevenday').removeClass('gray');
})

$('.sevenday').on('click', function() {
  $('.1d').addClass('hide');
  $('.7d').removeClass('hide');
  $('.1day').addClass('hide');
  $('.7day').removeClass('hide');
  $('.sevenday').addClass('gray');
  $('.oneday').removeClass('gray');
})

$('#notUser').on('click', function() {
  alert('Please log in to create your portfolio.')
})

$('#notUser2').on('click', function() {
  alert('Please log in to add favorites.')
})

});
