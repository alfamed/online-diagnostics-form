<?php

// локальные переменные
$mailTo         = 'webmaster.alfamed@gmail.com'; //e-mail куда будут приходить письма с сайта (с заполненными данными и картинками)
$postError      = false; //флаг определяющий ошибку при считывании данных из фронтенда (AJAX)

if (isset($_POST)) {

  //check if its an ajax request, exit if not
  if(!isset($_SERVER['HTTP_X_REQUESTED_WITH']) AND strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) != 'xmlhttprequest') {
      $output = json_encode(array( //create JSON data
          'type'=>'error',
          'text' => 'Sorry Request must be Ajax POST'
      ));
      die($output); //exit script outputting json data
    }

  // если в поле имя ничего не заполнено то генерируем ошибку
  if (trim($_POST['name']) == '') {
    $postError = true;

  } else {
    $clientName = filter_var($_POST["name"], FILTER_SANITIZE_STRING);
  };
  // если в email имя ничего не заполнено то генерируем ошибку
  if (trim($_POST['email']) == '') {
    $postError = true;

  } else {
    if (!filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)) {
      $postError = true;

    } else {
      $clientEmail = filter_var($_POST["email"], FILTER_SANITIZE_EMAIL);
    }
  };
  // если в age имя ничего не заполнено то генерируем ошибку
  if (trim($_POST['age']) == '') {
    $postError = true;

  } else {
    $clientAge = filter_var($_POST["age"], FILTER_SANITIZE_NUMBER_INT);
  };
  // если в message имя ничего не заполнено то В поле сообщение вписываем стандартный текст
  if (trim($_POST['message']) == '') {
    $clientMessage = 'Клиент ничего не ввел в поле "Сообщение"';
  } else {
    $clientMessage = filter_var($_POST["message"], FILTER_SANITIZE_STRING);
  };
  //если нету файлов то генерируем ошибку
  if(!isset($_FILES)) {
    $postError = true;
  }

  // тело письма до кодировки
  // $mailMessage = 'Заявка на онлайн-диагностику'."\n\n".'Имя: '.$clientName."\r\n".'e-mail: '.$clientEmail."\r\n".'Возраст: '.$clientAge."\r\n".'Сообщение: '.$clientMessage."\r\n";
  $mailMessage = 'Заявка на онлайн-диагностику'."\n\n";
  $mailMessage .= "<html><body style='font-family:Arial,sans-serif;'>";
  $mailMessage .= "<h2 style='font-weight:bold;border-bottom:1px dotted #ccc;'>Cообщение с сайта</h2>\r\n";
  $mailMessage .= "<p><strong>От кого:</strong> ".$clientName."</p>\r\n";
  $mailMessage .= "<p><strong>Почта:</strong> ".$clientEmail."</p>\r\n";
  $mailMessage .= "<p><strong>Возраст:</strong> ".$clientAge."</p>\r\n";
  $mailMessage .= "<p><strong>Сообщение:</strong> ".$clientMessage."</p>\r\n";
  $mailMessage .= "</body></html>";

  // служебный разделитель сгенерирован произвольным
  $boundary = md5("alfamed");

  // стандартный заголовок письма
  $subject  = 'Заявка на онлайн-диагностику';
  $headers  = "From: " . strip_tags($clientEmail) . "\r\n";
  $headers .= "Reply-To: ". strip_tags($clientEmail) . "\r\n";
  $headers .= 'Mime-Version: 1.0' . "\r\n";
  $headers .= "Content-Type: multipart/mixed; boundary = $boundary\r\n\r\n";

  // тело письма после кодировки
  $body = "--$boundary\r\n";
  $body .= "Content-Type: text/html; charset=utf-8\r\n";
  $body .= "Content-Transfer-Encoding: base64\r\n\r\n";
  $body .= chunk_split(base64_encode($mailMessage));

  foreach ($_FILES as $index => $file) {
    //get file details we need
    $file_tmp_name 	  = $file['tmp_name'];
    $file_name 		  = $file['name'];
    $file_size 		  = $file['size'];
    $file_type 		  = $file['type'];
    $file_error 	  = $file['error'];

    //exit script and output error if we encounter any
    if($file_error>0)
    {
      $mymsg = array(
        1=>"The uploaded file exceeds the upload_max_filesize directive in php.ini",
        2=>"The uploaded file exceeds the MAX_FILE_SIZE directive that was specified in the HTML form",
        3=>"The uploaded file was only partially uploaded",
        4=>"No file was uploaded",
        6=>"Missing a temporary folder" );

        $output = json_encode(array('type'=>'error', 'text' => $mymsg[$file_error]));
        die($output);
      }

      //read from the uploaded file & base64_encode content for the mail
      $handle = fopen($file_tmp_name, "r");
      $content = fread($handle, $file_size);
      fclose($handle);
      $encoded_content = chunk_split(base64_encode($content));

      //attachment
      $body .= "--$boundary\r\n";
      $body .="Content-Type: $file_type; name=\"$file_name\"\r\n";
      $body .="Content-Disposition: attachment; filename=\"$file_name\"\r\n";
      $body .="Content-Transfer-Encoding: base64\r\n";
      $body .="X-Attachment-Id: ".rand(1000,99999)."\r\n\r\n";
      $body .= $encoded_content;
  }

  // отправляем письмо
  // mail($mailTo, $subject, $body, $headers);
  if (!$postError) {
    header("Content-type: application/json; charset=UTF-8");
    $send_mail = mail($mailTo, $subject, $body, $headers);
    if(!$send_mail)
    {
        //If mail couldn't be sent output error. Check your PHP email configuration (if it ever happens)
        $output = json_encode(array('type'=>'error', 'text' => 'Ошибка отправка формы! Проверьте введенные Вами данные.'));
        die($output);
    }else{
        $output = json_encode(array('type'=>'message', 'text' => 'Спасибо '.$clientName .'. Ваша форма успешно отправлена'));
        die($output);
    }
  }//end postError check

}

?>
