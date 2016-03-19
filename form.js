$(document).ready(function(){
  var fName         = '',
      fEmail        = '',
      fAge          = '',
      fMessage      = '',
      emailPattern  = /^([a-z0-9_\.-])+@[a-z0-9-]+\.([a-z]{2,4}\.)?[a-z]{2,4}$/i,
      agePattern    = /^\d{1,2}$/,
      fadeTime      = 200,
      validate = {
        name:true,
        email:true,
        age:true
      },
      files = [];

  $('#choose-files').on('change',prepareUpload);
  function prepareUpload(event)
    {
      // files = event.target.files;
      // if (files.length>0) {
      //   var lastLength = files.length,
      //       newLength = 0;
      //   for (var key in event.target.files) {
      //     if (/^\d+$/.test(key)) {
      //       newLength = lastLength+1+parseInt(key);
      //       files[newLength] = event.target.files[key];
      //     }
      //   }
      // } else {
      //   files = event.target.files;
      // }
      files.push(event.target.files);
      console.log(files);
    };


  function submitForm(event, data){
    $form = $(event.target);
    var formData = $form.serialize();

    $.each(data.files, function(key, value){
      formData = formData + '&filenames[]=' + value;
    });

    $.ajax({
        url: 'submit.php',
        type: 'POST',
        data: formData,
        cache: false,
        dataType: 'json',
        success: function(data, textStatus, jqXHR){
          if (typeof data.error === 'undefined') {
            console.log('SUCCESS: ' + data.success);
          } else {
            console.log('ERRORS: ' + data.error);
          }
        },
        error: function(jqXHR, textStatus, errorThrown){
          console.log('ERRORS: ' + textStatus);
        },
        complete: function()
        {
          // STOP LOADING SPINNER
        }
    });
  }


  $('form').on('submit', uploadFiles);

  function uploadFiles(event){

    event.stopPropagation();
    event.preventDefault();

    var data = new FormData();
    $.each(files, function(key, value){
      data.append(key, value);
    });

    $.ajax({
      url: 'submit.php?files',
      type: 'POST',
      data: data,
      cache: false,
      dataType: 'json',
      processData: false,
      contentType: false,
      success: function(data, textStatus, jqXHR){
        if (typeof data.error === 'undefined') {
          submitForm(event, data);
        } else {
          console.log('ERRORS: ' + data.error);
        }
      },
      error: function(jqXHR, textStatus, errorThrown){
        console.log('ERRORS: ' + textStatus);
      }
    });
  }

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

        // показывем сообщение что форма отправлена
        $('body').prepend('<div id="form-success"><div class="close-cross"></div><div id="form-success-message">Спасибо за обращение!</ br>Сообщение отправлено.');
        var formSuccessTimer = setTimeout(function(){
          if ($('#form-success').length > 0) {
            $('#form-success').fadeOut(200,function(){
              $(this).remove();
            });
          }
        },2000);

        // прячем модальное окно успешной отправки данных формы
        $('#form-success').click(function(){
          if (formSuccessTimer) {
            clearTimeout(formSuccessTimer);
            $(this).fadeOut(200,function(){
              $(this).remove();
            });
          }
        });

        // очищаем все поля и переменные
        fName     = '';
        fEmail    = '';
        fAge      = '';
        fMessage  = '';
        $("#name").val('');
        $('#email').val('');
        $('#age').val('');
        $('#message').val('');
      }
    })
  }//end sendAjaxForm

  $('#online-diagnostics').bind('submit', function(e){
    e.preventDefault();
    fName = $("#name").val();
    fEmail = $('#email').val();
    fAge = $('#age').val();
    fMessage = $('#message').val();

    // проверка содержимого поля "Имя"
    if ((fName == '')&&($('#name-blk').children('.error-box').length < 1)) {
      validate.name = false;
      $('#name-blk').append('<div class="error-box">').find('.error-box').html('Введите имя!').css({
        "bottom":"1px",
        "right":"-113px",
        "display":"none"
      }).fadeIn(fadeTime);
    } else if (fName == '') {
      validate.name = false;
    } else {
      validate.name = true;
    }

    //проверка содержимого поля "email"
    if ((fEmail == '')&&($('#email-blk').children('.error-box').length < 1)) {
      validate.email = false;
      $('#email-blk').append('<div class="error-box">').find('.error-box').html('Введите email!').css({
        "bottom":"0px",
        "right":"-124px",
        "display":"none"
      }).fadeIn(fadeTime);
    } else if (!emailPattern.test(fEmail)) {
      validate.email = false;
      $('#email-blk').append('<div class="error-box">').find('.error-box').html('Введите email в формате name@example.ru').css({
        "bottom":"-7px",
        "right":"-202px",
        "width":"190px",
        "display":"none"
      }).fadeIn(fadeTime);
    } else {
      validate.email = true;
    }

    // проверка содержимого поля "возраст"
    if ((fAge == '')&&($('#age-blk').children('.error-box').length < 1)) {
      validate.age = false;
      $('#age-blk').append('<div class="error-box">').find('.error-box').html('Введите возраст!').css({
        "bottom":"0px",
        "right":"-144px",
        "display":"none"
      }).fadeIn(fadeTime);
    } else if (!agePattern.test(fAge)||(fAge < 1)||(fAge > 99)) {
      validate.age = false;
      $('#age-blk').append('<div class="error-box">').find('.error-box').html('Введите число от 1 до 99').css({
        "bottom":"-7px",
        "right":"-129px",
        "width":"115px",
        "display":"none"
      }).fadeIn(fadeTime);
    } else {
      validate.age = true;
    }

    // проверка правильности валидации всех полей
    // если валидация выполнена то отправляем данные на сервер
    if (validate.name&&validate.email&&validate.age) {
      // sendAjaxForm();
    }

  });//end bind submit

  // прячем красную подсказку возле полей ввода данных клиента
  $('input').on('keyup',function(e){
    if (($(this).parent().find('.error-box').length != 0)&&(e.keyCode != 13)) {
      $(this).parent().find('.error-box').fadeOut(fadeTime,function(){
        $(this).remove();
      });
    }
  });



  // $('input').change(function(){
  //   console.log($(this));
  // });



});//end ready
