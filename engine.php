<?php

// локальные переменные
$mailTo         = 'webmaster.alfamed@gmail.com'; //e-mail куда будут приходить письма с сайта (с заполненными данными и картинками)
$postError      = false; //флаг определяющий ошибку при считывании данных из фронтенда (AJAX)
// TODO: В условие проверки post-запроса дописать проверку по отдельным полям с выводом предупреждающих сообщений если поля не заполнены
// проверка если форма отправлена

if (isset($_POST)) {
  // если в поле имя ничего не заполнено то генерируем ошибку
  if (trim($_POST['name']) == '') {
    $postError = true;

  } else {
    $clientName = $_POST['name'];
  };
  // если в email имя ничего не заполнено то генерируем ошибку
  if (trim($_POST['email']) == '') {
    $postError = true;

  } else {
    if (!eregi("^([a-z0-9_\.-])+@[a-z0-9-]+\.([a-z]{2,4}\.)?[a-z]{2,4}$", trim($_POST['email']))) {
      $postError = true;

    } else {
      $clientEmail = $_POST['email'];
    }
  };
  // если в age имя ничего не заполнено то генерируем ошибку
  if (trim($_POST['age']) == '') {
    $postError = true;

  } else {
    $clientAge = $_POST['age'];
  };
  // если в message имя ничего не заполнено то В поле сообщение вписываем стандартный текст
  if (trim($_POST['message']) == '') {
    $clientMessage = 'Клиент ничего не ввел в поле "Сообщение"';
  } else {
    $clientMessage = $_POST['message'];
  };

  $mailMessage = 'Имя: '.$clientName."\n".'e-mail: '.$clientEmail."\n".'Возраст: '.$clientAge."\n".'Сообщение: '.$clientMessage."\n";
  // стандартный заголовок письма
  $subject  = 'Заявка на онлайн-диагностику';
  $headers  = "From: " . strip_tags($clientEmail) . "\r\n";
  $headers .= "Reply-To: ". strip_tags($clientEmail) . "\r\n";
  $headers .= 'Mime-Version: 1.0' . "\r\n";
  $headers .= 'Content-Type: text/html;charset=utf-8 ' . "\r\n";

  // тело письма
  $msg  = "<html><body style='font-family:Arial,sans-serif;'>";
  $msg .= "<h2 style='font-weight:bold;border-bottom:1px dotted #ccc;'>Cообщение с сайта</h2>\r\n";
  $msg .= "<p><strong>От кого:</strong> ".$clientName."</p>\r\n";
  $msg .= "<p><strong>Почта:</strong> ".$clientEmail."</p>\r\n";
  $msg .= "<p><strong>Возраст:</strong> ".$clientAge."</p>\r\n";
  $msg .= "<p><strong>Сообщение:</strong> ".$clientMessage."</p>\r\n";
  $msg .= "</body></html>";

  // отправляем письмо
  if (!$postError) {
    if (mail($mailTo, $subject, $msg, $headers)) {

    } else {

    }

  }

}

?>
