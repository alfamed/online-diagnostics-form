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
        age:true,
        file:true
      },
      files = [],
      filecount = 0,
      fileExt = ['jpg', 'jpeg', 'gif', 'png', 'tiff', 'bmp'],
      formData;

  $('#choose-files').on('change',prepareUpload);
  function prepareUpload(event){

    if ((event.target.files.length+filecount)<=5) {

      var fileCorrect = true;
      $.each(event.target.files, function(){
        if (!(fileExt.join().search(this.type.split('/')[1]) != -1)||(this.size > 2097152)) {

          // показывем сообщение что формат не верный
          $('body').prepend('<div id="form-success"><div class="close-cross"></div><div id="form-success-message" class="error-bg">Фотографии должны быть в формате jpeg, jpg, png, tiff, bmp, до 2Мб объемом');
          var formSuccessTimer = setTimeout(function(){
            if ($('#form-success').length > 0) {
              $('#form-success').fadeOut(200,function(){
                $(this).remove();
              });
            }
          },20000);

          // прячем модальное окно успешной отправки данных формы
          $('#form-success').click(function(){
            if (formSuccessTimer) {
              clearTimeout(formSuccessTimer);
              $(this).fadeOut(200,function(){
                $(this).remove();
              });
            }
          });

          fileCorrect = false;
        };
      });

      if (fileCorrect) {
        $.each(event.target.files, function(){
          files.push(this);
          filecount++;
          $('#uploaded-file-name').append('<span class="uploaded-name">'+this['name']);
          $('.uploaded-name:last-child').slideDown();
        });
      }
    } else {
      // показывем сообщение что количество файлов должно быть не более 5
      $('body').prepend('<div id="form-success"><div class="close-cross"></div><div id="form-success-message" class="error-bg">Количество файлов должно быть не более 5');
      var formSuccessTimer = setTimeout(function(){
        if ($('#form-success').length > 0) {
          $('#form-success').fadeOut(200,function(){
            $(this).remove();
          });
        }
      },20000);

      // прячем модальное окно успешной отправки данных формы
      $('#form-success').click(function(){
        if (formSuccessTimer) {
          clearTimeout(formSuccessTimer);
          $(this).fadeOut(200,function(){
            $(this).remove();
          });
        }
      });

    }

    $('#choose-files').val('');

  };
  // Сбрасываем все добавленные файлы
  $('#reset-files').on('click',function(){

    if (filecount > 0) {
      filecount = 0;
      files = [];

      $('#choose-files').val('');

      $('.uploaded-name').each(function(){
        $(this).slideUp("normal",function(){
          $(this).remove();
        });
      });
    }

  });

  $('#send-files').on('click', function(){

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
    } else if (fName.length > 80) {
      validate.name = false;
      $('#name-blk').append('<div class="error-box">').find('.error-box').html('Максимально допустимо 80 символов!').css({
        "bottom":"-16px",
        "right":"-119px",
        "display":"none",
        "width":"105px"
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

    // проверка наличия прикрепленного хотя бы одного файла
    if (filecount>0) {
      validate.file = true;
    } else {
      alert('Файлы для отправки не выбраны!')
      validate.file = false;
    }

    // проверка правильности валидации всех полей
    // если валидация выполнена то отправляем данные на сервер
    if (validate.name&&validate.email&&validate.age&&validate.file) {

      formData = new FormData();
      formData.append('name', fName);
      formData.append('email', fEmail);
      formData.append('age', fAge);
      formData.append('message', fMessage);

      // push all files from files-array to formData
      for (var i = 0; i < files.length; i++) {
        formData.append('file_attach'+i,files[i]);
      }

      $.ajax({
        url:'engine.php',
        type: 'POST',
        data: formData,
        dataType:'json',
        processData: false,
        contentType: false,
        success: function(response){

          if(response.type == 'error'){ //load json data from server and output message
            $('body').prepend('<div id="form-success"><div class="close-cross"></div><div id="form-success-message" class="error-msg">'+response.text);
  				}else{
            $('body').prepend('<div id="form-success"><div class="close-cross"></div><div id="form-success-message">'+response.text);
  				}
          // показывем сообщение что форма отправлена
          // $('body').prepend('<div id="form-success"><div class="close-cross"></div><div id="form-success-message">Спасибо за обращение!</ br>Сообщение отправлено.');
          var formSuccessTimer = setTimeout(function(){
            if ($('#form-success').length > 0) {
              $('#form-success').fadeOut(200,function(){
                $(this).remove();
              });
            }
          },20000);

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

          filecount = 0;
          files = [];

          $('#choose-files').val('');

          if ($('.uploaded-name')) {
            $('.uploaded-name').each(function(){
              this.remove();
            });
          }

        },//end success
        error: function(jqXHR, textStatus, errorThrown){
        }

      })
    }//конец условия проверки валидации

  });//end submit

  // прячем красную подсказку возле полей ввода данных клиента
  $('input').on('keyup',function(e){
    if (($(this).parent().find('.error-box').length != 0)&&(e.keyCode != 13)) {
      $(this).parent().find('.error-box').fadeOut(fadeTime,function(){
        $(this).remove();
      });
    }
  });

});//end ready
