(function() {

	var ReadyState = {
    'UNSENT': 0,
    'OPENED': 1,
    'HEADERS_RECEIVED': 2,
    'LOADING': 3,
    'DONE': 4
  };

// скрываем фильтры, добавляя класс hidden

	function filterHidden() {
		document.querySelector('.filters').classList.add('hidden');
	};

	filterHidden();

// функция показа фильтров (удаление класса hidden)

	function filterShow() {
		document.querySelector('.filters').classList.remove('hidden');
	};

	var picturesContainer = document.querySelector('.pictures');																		// записываем в переменную элемент, в который будем помещать img
	var REQUEST_FAILURE_TIMEOUT = 10000;																														// устанавливаем максимальное количество времени для загрузки img с сервера
	var pictures;

	function renderPictures(pictures) {

    picturesContainer.classList.remove('picture-load-failure');
    picturesContainer.innerHTML = '';

		var pictureTemplate = document.getElementById('picture-template');
		var picturesFragment = document.createDocumentFragment();

		pictures.forEach(function(picture, i) {																												// итерируемся по объектам массива pictures через forEach
			var newPictureElement = pictureTemplate.content.children[0].cloneNode(true);								// клонируем первый элемент шаблона вместе с вложенными элементами, за что отвечает cloneNode(true);

		    newPictureElement.querySelector('.picture-comments').textContent = picture['comments'];		// в элемент шаблона .picture-comments добавляем соответствуюющее значение из объекта массива pictures
		    newPictureElement.querySelector('.picture-likes').textContent = picture['likes'];					// в элемент шаблона .picture-likes добавляем соответствуюющее значение из объекта массива pictures

		    picturesFragment.appendChild(newPictureElement);																					// добавляем в picturesFragment новые эелементы

		    if (picture['url']) {																																			// если элемент объекта имеет url
		    	var newPicture = new Image();																														// создаем новый объект Image
		    	newPicture.src = picture['url'];																												// присваиваем url новому объекту

			    var imageLoadTimeout = setTimeout(function() {																					// устанавливаем тайм-аут для загрузки img
			    	newPictureElement.classList.add('picture-load-failure');															// если в течении 10 сек img не загрузится, то присваиваем ей класс .picture-load-failure
			    }, REQUEST_FAILURE_TIMEOUT);

		    	newPicture.onload = function() {																												// по загрузке изображения выполняем:
		    		var oldPicture = newPictureElement.querySelector('img');															// находим старый элемент img и присваиваем переменной
		    		newPicture.style.height = '182px';
		    		newPicture.style.width = '182px';
            // Date.parse(newPicture['date']);

		    		newPictureElement.replaceChild(newPicture,oldPicture);																// заменяем старый img новым img
		    		clearTimeout(imageLoadTimeout);																												// отменяем тайм-аут если изображение загрузилось не позднее 10 сек
		    	}

					newPicture.onerror = function(evt) {
			      newPictureElement.classList.add('picture-load-failure');
			      clearTimeout(imageLoadTimeout);
			    };
		    }

		});

		picturesContainer.appendChild(picturesFragment);																							// добавляем в <div class="pictures"></div> новые эелементы через picturesFragment

	}

  function showLoadFailure() {
    picturesContainer.classList.add('pictures-failure');
  }

	function loadPictures(callback) {
	  var xhr = new XMLHttpRequest();
	  xhr.timeout = REQUEST_FAILURE_TIMEOUT;
	  xhr.open('get', 'data/pictures.json');
	  xhr.send();

	  xhr.onreadystatechange = function(evt) {
	    var loadedXhr = evt.target;

	    switch (loadedXhr.readyState) {
	      case ReadyState.OPENED:
	      case ReadyState.HEADERS_RECEIVED:
	      case ReadyState.LOADING:
	        picturesContainer.classList.add('pictures-loading');
	        break;

	      case ReadyState.DONE:
	      default:
	        if (loadedXhr.status == 200) {
	          var data = loadedXhr.response;
	          picturesContainer.classList.remove('pictures-loading');
	          callback(JSON.parse(data));
	        }

	        if (loadedXhr.status > 400) {
	          showLoadFailure();
	        }
	        break;
	    }
	  };

	  xhr.ontimeout = function() {
	    showLoadFailure();
	  }
	}

  function filterPictures(pictures, filterID) {
    var filteredPictures = pictures.slice(0);																								// копируем массив pictures с первого элемента .slice(0)

    switch (filterID) {

      case 'filter-new':
        filteredPictures = filteredPictures.sort(function(first, second) {
          return Date.parse(second.date) - Date.parse(first.date);
        });

        break;

      case 'filter-discussed':
        filteredPictures = filteredPictures.sort(function(first, second) {
        	return second.comments - first.comments;
        });

        break;

      default:
        filteredPictures = pictures.slice(0);
        break;
    }

    return filteredPictures;
  }

  function initFilters() {
    var filterElements = document.querySelectorAll('.filters-radio');
    for (var i = 0, l = filterElements.length; i < l; i++) {
      filterElements[i].onclick = function(evt) {
        var clickedFilter = evt.currentTarget;
        setActiveFilter(clickedFilter.id);

        document.querySelector('.picture-filter-selected').classList.remove('picture-filter-selected');
        clickedFilter.classList.add('picture-filter-selected');
      }
    }
  }

  function setActiveFilter(filterID) {
    var filteredPictures = filterPictures(pictures, filterID);
    renderPictures(filteredPictures);
  }

	initFilters();

	loadPictures(function(loadedPictures){
		pictures = loadedPictures;
		setActiveFilter('filter-popular');
	});

	filterShow();																																									// инициализируем функцию показа фильтров



})();
