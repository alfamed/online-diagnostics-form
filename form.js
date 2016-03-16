$(document).ready(function(){
  var fName     = '',
      fEmail    = '',
      fAge      = '',
      fMessage  = '',
      canSend   = true;

  function sendAjaxForm(){
    $.ajax({
      url:'engine.php',
      type: 'POST',
      data: {
        name : fName,
        email : fEmail,
        age : fAge,
        message : fMessage
      },
      success: function(){
        console.log('success');
      }
    })
  }//end sendAjaxForm

  $('#online-diagnostics').bind('submit', function(e){
    e.preventDefault();
    fName = $("#name").val();
    fEmail = $('#email').val();
    fAge = $('#age').val();
    fMessage = $('#message').val();

    if ((fName == '')&&($('#name-blk').children('.error-box').length < 1)) {
      $('#name-blk').append('<div class="error-box">').find('.error-box').html('Введите имя!').css({
        "bottom":"1px",
        "right":"-113px"
      });
    }

    if ((fEmail == '')&&($('#email-blk').children('.error-box').length < 1)) {
      $('#email-blk').append('<div class="error-box">').find('.error-box').html('Введите email!').css({
        "bottom":"0px",
        "right":"-124px"
      });
    }

    if ((fAge == '')&&($('#age-blk').children('.error-box').length < 1)) {
      $('#age-blk').append('<div class="error-box">').find('.error-box').html('Введите возраст!').css({
        "bottom":"0px",
        "right":"-144px"
      });
    }

  });//end bind submit

  $('input').on('keyup',function(){
    if ($(this).parent().find('.error-box').length != 0) {
      $(this).parent().find('.error-box').remove();
    }
  });

  // $('input').change(function(){
  //   console.log($(this));
  // });



});//end ready
