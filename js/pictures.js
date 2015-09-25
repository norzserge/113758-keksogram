// скрываем фильтры, добавляя класс hidden

function filterHidden(){
	document.querySelector('.filters').classList.add('hidden');
};

filterHidden();

// функция показа фильтров (удаление класса hidden)

function filterShow(){
	document.querySelector('.filters').classList.remove('hidden');
};

(function(){

	var picturesContainer = document.querySelector('.pictures');				// записываем в переменную элемент, в который будем помещать img
	var pictureTemplate = document.getElementById('picture-template');			// записываем в переменную конструкцию, которая будет шаблоном для вывода img

	var picturesFragment = document.createDocumentFragment();					// записываем в fragment множество элементов для последующего добавления в DOM (ускоряет производительность)

	pictures.forEach(function(picture, i) {											// итерируемся по объектам массива pictures через forEach
		var newPictureElement = pictureTemplate.content.children[0].cloneNode(true);				// клонируем первый элемент шаблона вместе с вложенными элементами, за что отвечает cloneNode(true);

	    newPictureElement.querySelector('.picture-comments').textContent = picture['comments'];		// в элемент шаблона .picture-comments добавляем соответствуюющее значение из объекта массива pictures
	    newPictureElement.querySelector('.picture-likes').textContent = picture['likes'];			// в элемент шаблона .picture-likes добавляем соответствуюющее значение из объекта массива pictures

	    picturesFragment.appendChild(newPictureElement);											// добавляем в picturesFragment новые эелементы

	    if (picture['url']) {														// если элемент объекта имеет url 
	    	var newPicture = new Image();											// создаем новый объект Image
	    	newPicture.src = picture['url'];										// присваиваем url новому объекту
	    	var oldPicture = newPictureElement.querySelector('img');				// находим старый элемент img и присваиваем переменной
	    	
	    	newPicture.onload = function() {										// по загрузке изображения выполняем: 
	    		newPictureElement.replaceChild(newPicture,oldPicture);				// заменяем старый img новым img
	    		newPicture.style.height = '182px';
	    		newPicture.style.width = '182px';
	    	}

			newPicture.onerror = function(evt) {
		        newPictureElement.classList.add('picture-load-failure');
		    };
	    }

	});

	picturesContainer.appendChild(picturesFragment);												// добавляем в <div class="pictures"></div> новые эелементы через picturesFragment

	filterShow();		// инициализируем функцию показа фильтров

})();
