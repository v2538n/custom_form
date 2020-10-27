"use strict"; // Строгий режим. Включение новых функций из ECMAScript 5 +

// const - присвоить переменной другой значение нельзя, однако, можно обьявить заново переменную с таким же именем и другим модификатором (let/var) и новое значение присваивается легко )
// let   - вроде как ограничивает область видимости одним блоком {}, но воспроизвести не получилось
// var   - максимальная область видимости, переменная доступна внутри функции и всех вложенных функций


document.addEventListener('DOMContentLoaded', function(){ // Прослушка на загрузку документа
	const form = document.getElementById('form'); // Константа с айди формы
	form.addEventListener('submit', formSend); // при нажатии кнопки сабмита, запускать функцию formSend

	async function formSend(e){ // асинхронное выполнение функции 
		e.preventDefault(); // отмена нативного поведения (отправки формы по нажатию на кнопку сабмита)

		let error = formValidate(form); // переменная, в которую попадает результирующее значение из функции проверки формы

		let formData = new FormData(form); // получаем все данные из полей формы
		formData.append('image', formImage.files[0]); // добавляем в переменную изображение

		if(error === 0){
			form.classList.add('_sending');
			let response = await fetch('sendmail.php', { // ожидание выполнения функий из файла sendmail.php
				method: 'POST',
				body: formData
			});

			if(response.ok){ // если все ок
				let result = await response.json(); // файл sendmail.php возвращает json объект
				alert(result.message); // вывод сообщения о результате выполнения
				formPreview.innerHTML = ''; // очистка дива с превью изображения
				form.reset(); // очистка всех полей формы
				form.classList.remove('_sending'); // удаляем временный класс, который ранее добавили для отображения процесса загрузки
			} else {
				alert('Send error');
				form.classList.remove('_sending');  // удаляем временный класс и в случае получения ошибки тоже
			}
		} else {
			alert('Необходимо корректно заполнить все обязательные поля формы!');
		}
	}

	function formValidate(form) {
		let error   = 0; // переменная, с количеством ошибок
		let formReq = document.querySelectorAll('._req'); // выборка всех html элементов, у которых есть класс _req

		for (let index = 0; index < formReq.length; index++) { // перебираем все элементы с классом _req
		   const input = formReq[index]; // элемент текущей итерации цикла
		   formRemoveError(input); // удаляем класс ошибки с элемента и его родителя, оставшийся, видимо, от предыдущей итерации проверки

		   if(input.classList.contains('_email')){ // для проверки email свой шаблон проверки... ну и все поля, с нестандартной проверкой, выделяются на этом шаге
		   		if(emailTest(input)) { // функци emailTest возвращает true, если проверка не пройдена
		   			formAddError(input); // добавляем элементу и его родителю класс _error
		   			error++; // увиличиваем счетчик ошибок
		   		}
		   } else if (input.getAttribute('type') === 'checkbox' && input.checked === false) { // тут мы решили, почему-то, проверять не по наличию класса, а по атрибуту тип, ну да ладно
		   		formAddError(input); // тоже самое, что и выше
		   		error++; // тоже самое, что и выше
		   } else if (input.classList.contains('_name')){

		   		console.log(nameTest(input));
		   		if(nameTest(input)){
		   			formAddError(input);
		   			error++;
		   		}
		   } 

		   else {
		   		if(input.value === '') { // если поле не заполнено вовсе - делаем тоже
		   			formAddError(input); // тоже самое, что и выше
		   			error++; // тоже самое, что и выше
		   		}
		   }
		}

		console.log(error);
		return error; 
	}

	function formAddError(input) {
		input.parentElement.classList.add('_error'); // добавляем класс ошибки
		input.classList.add('_error');
	}

	function formRemoveError(input) {
		input.parentElement.classList.remove('_error'); // удаляем класс ошибки
		input.classList.remove('_error');
	}

	function emailTest(input) {
		return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(input.value); // функция валидации, собственно 
	}

	function nameTest(input) {
		return !/^[\wа-я]{3,10}$/gi.test(input.value); // функция валидации, от 3 до 10 символов русс и англ алфавита
	}


	const formImage = document.getElementById('formImage'); // переменная для инпута выбора изображения

	const formPreview = document.getElementById('formPreview'); // переменная для дива, в который будет выводиться превью изображения

	formImage.addEventListener('change', () => {
		uploadFile(formImage.files[0]); // отслеживание изменения данных в поле инпут для загрузки картинки
	});

	function uploadFile(file) { // функция загрузки изображения
		if(!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)){ // проверка типа файла
			alert('Разрешены только изображения');
			formImage.value = '';
			return;
		}

		if(file.size > 1 * 1024 * 1024){
			alert('Файл должен быть меньше 1 МБ');
			return;
		}

		var reader = new FileReader(); 

/*Обработчик для события load. Это событие срабатывает при каждом успешном завершении операции чтения.*/
		reader.onload = function(e) {
			formPreview.innerHTML = `<img src="${e.target.result}" alt="Фото">`; // вставка изображения в див превью
		}

		reader.onerror = function(e) { // обработчик ошибки загрузки
			alert('Photo upload error');
		}
/*Запускает процесс чтения данных указанного Blob, по завершении, 
аттрибут result будет содержать данные файла в виде data: URL.*/
		reader.readAsDataURL(file);
	}

});