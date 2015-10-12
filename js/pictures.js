'use strict';

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
  }

  filterHidden();

// функция показа фильтров (удаление класса hidden)

  function filterShow() {
    document.querySelector('.filters').classList.remove('hidden');
  }

  var REQUEST_FAILURE_TIMEOUT = 10000;																												  // устанавливаем максимальное количество времени для загрузки img с сервера
  var PAGE_SIZE = 12;                                                                           // устанавливаем количество выводимых фотографий на странице

  var picturesContainer = document.querySelector('.pictures');                                  // записываем в переменную элемент, в который будем помещать img
  var pictures;
  var currentPictures;
  var currentPage = 0;
  var renderedPictures = [];


  function renderPictures(picturesToRendered, pageNumber, replace) {
    replace = typeof replace !== 'undefined' ? replace : true;
    pageNumber = pageNumber || 0;                                                               // на случай если pageNumber не передали в функцию - она возьмет 0 (при pageNumber = false)
/*
Удаляем список фотографий. Если массив renderedPictures не пустой - вызываем функцию .shift,
которая выталкивает первый элемент массива и позволяет дальше с ним работать, а именно удалять
с помощью .unrender()
*/
    if (replace) {                                                                              // если replace == true, то чистим контейнер и удаляем дополнительные классы, а если false, то не чистя контейнер добавляем следующую страницу
      var el;
      while ((el = renderedPictures.shift())) {
        el.unrender();
      }

      picturesContainer.classList.remove('picture-load-failure');
    }

    var picturesFragment = document.createDocumentFragment();

    var picturesFrom = pageNumber * PAGE_SIZE;
    var picturesTo = picturesFrom + PAGE_SIZE;
    picturesToRendered = picturesToRendered.slice(picturesFrom, picturesTo);
/*
Рисуем список фотографий. На каждой итерации цикла создаем объект Photo.
Он отрисовывается в контейнер picturesFragment и добавляется в массив renderedPictures
*/
    picturesToRendered.forEach(function(pictureData) {																							// итерируемся по объектам массива pictures через forEach
      var newPictureElement = new Photo(pictureData);
      newPictureElement.render(picturesFragment);
      renderedPictures.push(newPictureElement);
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
          if (loadedXhr.status === 200) {
            var data = loadedXhr.response;
            picturesContainer.classList.remove('pictures-loading');
            return callback(JSON.parse(data));
          }

          if (loadedXhr.status > 400) {
            showLoadFailure();
          }
          break;
      }
    };

    xhr.ontimeout = function() {
      showLoadFailure();
    };
  }

  function filterPictures(picturesToFilter, filterID) {
    var filteredPictures = picturesToFilter.slice(0);																								// копируем массив pictures с первого элемента .slice(0)

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
        filteredPictures = picturesToFilter.slice(0);
        break;
    }

    localStorage.setItem('filterID', filterID);
    return filteredPictures;
  }

  function initFilters() {                                                                          // функция пробегается по всем фильтрам и каждому цепляет обработчик событий клика
    var filtersContainer = document.querySelector('.filters');                                      // вешаем один обработчик на весь контейнер, в котором лежат кнопки с фильтрами

    filtersContainer.addEventListener('click', function(evt) {
      var clickedFilter = evt.target;                                                             // в перменную записываем элемент, по которому произошел клик (эта информация содержиться в объекте event)
      setActiveFilter(clickedFilter.id);
    });
  }

  function setActiveFilter(filterID) {
    currentPictures = filterPictures(pictures, filterID);
    currentPage = 0;
    renderPictures(currentPictures, currentPage, true);
  }

  function isNextPageAvailable() {
    return currentPage < Math.ceil(pictures.length / PAGE_SIZE);
  }

  function isAtTheBottom() {
    var GAP = 100;
    return picturesContainer.getBoundingClientRect().bottom - GAP <= window.innerHeight;
  }

  function checkNextPage() {
    if (isAtTheBottom() && isNextPageAvailable()) {
      window.dispatchEvent(new CustomEvent('loadneeded'));
    }
  }

  function initScroll() {
    var someTimeout;
    window.addEventListener('scroll', function() {
      clearTimeout(someTimeout);
      someTimeout = setTimeout(checkNextPage, 100);                                                 // устанавливаем таймаут для вызова функции по событию скрола
    });

    window.addEventListener('loadneeded', function() {
      renderPictures(currentPictures, currentPage++, false);
    });
  }

  initFilters();
  initScroll();


  loadPictures(function(loadedPictures) {
    pictures = loadedPictures;
    setActiveFilter(localStorage.getItem('filterID') || 'filter-popular');                          // выводим изображению по фильтру, который был выбран при предыдущей загрузке, либо фильтры по умолчанию если фильтр не был выбран
  });

  filterShow();																																									    // инициализируем функцию показа фильтров

})();
