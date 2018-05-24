
$( document ).ready(function() {
    console.log("jQuery linked up");

// ----------- makes price % change red / green
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

// ---------- toggle 1d prices vs 7d
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

});
