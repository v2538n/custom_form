"use strict" // Строгий режим. Включение новых функций из ECMAScript 5 +

// const - присвоить переменной другой значение нельзя, однако, можно обьявить заново переменную с таким же именем и другим модификатором (let/var) и новое значение присваивается легко )
// let   - вроде как ограничивает область видимости одним блоком {}, но воспроизвести не получилось
// var   - максимальная область видимости, переменная доступна внутри функции и всех вложенных функций


document.addEventListener('DOMContentLoaded', function(){ // Прослушка на загрузку документа
	const form = document.getElementById('form'); // Константа с айди формы
	form.addEventListener('submit', formSend); // при нажатии кнопки сабмита, запускать функцию formSend

	async function formSend(e){ // асинхронное выполнение функции 
		e.preventDefault(); // отмена нативного поведения (отправки формы по нажатию на кнопку сабмита)

		let error = formValidate(form); // переменная, в которую попадает результирующее значение из функции проверки формы

		if(error === 0){
			alert('Все круто! Форма заполнена верно!');
		} else {
			alert('Заполните все обязательные поля формы!');
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


	const formImage = document.getElementById('formImage');

	const formPreview = document.getElementById('formPreview');

	formImage.addEventListener('change', () => {
		uploadFile(formImage.files[0]);
	});

	function uploadFile(file){
		if(!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)){
			alert('Разрешены только изображения');
			formImage.value = '';
			return;
		}

		if(file.size > 0.5 * 1024 * 1024){
			alert('Файл должен быть меньше 1 МБ');
			return;
		}

		var reader = new FileReader();

		reader.onload = function(e) {
			console.log(formPreview);
			formPreview.innerHTML = `<img src="${e.target.result}" alt="Фото">`;
		}

		reader.onerror = function(e) {
			alert('Photo upload error');
		}

		reader.readAsDataURL(file);
	}

});