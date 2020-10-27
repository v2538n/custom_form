<?php

	use PHPMailer\PHPMailer\PHPMailer;
	use PHPMailer\PHPMailer\Exception;

	require 'phpmailer/src/Exception.php';
	require 'phpmailer/src/PHPMailer.php';

	$mail = new PHPMailer(true); // создание обьекта плагина phpmailer
	$mail->CharSet = 'UTF-8'; // Указание кодировки
	$mail->setLanguage('ru', 'phpmailer/language/'); // указание языка взаимодействия, вывод сообщений
	$mail->IsHTML(true); // указание возможности использования html тегов в письме

	// от кого письмо
	$mail->setForm('mail@mail.ru', 'Название сайта, на котором размещена данная форма');
	// адрес, на который будут приходить письма с этой формы
	$mail->addAddress('mail@mail.ru');
	// тема письма
	$mail->Subject = 'Тема письма. Например: Форма обратной связи или заявка';

	// обработка данный из формы
	$hand = "Правая";
	if($_POST['hand'] == 'left'){
		$hand = "Левая";
	}

	// тело письма
	$body = '<h1>Заголовок письма</h1>';

	// проверка полей

	if(trim(!empty($_POST['name']))){
		$body.='<p><strong>Имя:</strong> '.$_POST['name'].'</p>';
	}

	if(trim(!empty($_POST['email']))){
		$body.='<p><strong>E-mail:</strong> '.$_POST['email'].'</p>';
	}

	if(trim(!empty($_POST['hand']))){
		$body.='<p><strong>Рука:</strong> '.$_POST['hand'].'</p>';
	}

	if(trim(!empty($_POST['age']))){
		$body.='<p><strong>Возраст:</strong> '.$_POST['age'].'</p>';
	}

	if(trim(!empty($_POST['message']))){
		$body.='<p><strong>Сообщение:</strong> '.$_POST['message'].'</p>';
	}

	//прикрепить файл
	if(!empty($_FILES['image']['tmp_name'])){
		//путь загрузки файла
		$filePath = __DIR__ . "/files/" . $_FILES['image']['name'];
		//загружаем файл
		if(copy($_FILES['image']['tmp_name'], $filePath)){
			$fileAttach = $filePath;
			$body.='<p><strong>Фото в приложении</strong></p>';
			$mail->addAttachment($fileAttach); // сообщаем в плагин, что  необходимо прикрепить данный файл к письму
		}
	}

	$mail->Body = $body;

	//отправляем
	if(!$mail->send()){
		$message = 'Sending Error';
	} else {
		$message = 'Sending Success';
	}

	//$response = ['message' => $message]; // подгатавливаем переменную с информацией о выполнении отправки json объектом из php в js

	$response['message'] = $message;
	//$response = array('message' => $message);


	header('Content-type: application/json'); // указываем заголовок
	echo json_encode($response); // отправляем
?>