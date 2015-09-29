'use strict';                                                      // строгий режим для соответствия современному стандарту

(function() {
  var uploadForm = document.forms['upload-select-image'];
  var resizeForm = document.forms['upload-resize'];
  var filterForm = document.forms['upload-filter'];

  var previewImage = filterForm.querySelector('.filter-image-preview');
  var prevButton = filterForm['filter-prev'];
  var selectedFilter = filterForm['upload-filter'];

  var filterMap;

// добавляем функцию чтения cookies

  function restoreFormValueFromCookies(form) {
    var element;
    for (var i = 0; i < form.elements.length; i++) {              // записываем в переменную элементы формы
      element = form.elements[i];

      if (element.value === docCookies.getItem(element.name)) {    // условие: если значение элемента равно значению из cookie
        element.checked = true;                                   // присваеваем элементу свойство checked
        previewImage.className = 'filter-image-preview' + ' ' + filterMap[selectedFilter.value];   // присваиваем элементу соответствующий класс фильтра
      }
    }
  }

// конец моего кода

  function setFilter() {
    if (!filterMap) {
      filterMap = {
        'none': 'filter-none',
        'chrome': 'filter-chrome',
        'sepia': 'filter-sepia'
      };
    }

    previewImage.className = 'filter-image-preview' + ' ' + filterMap[selectedFilter.value];
  }

  for (var i = 0, l = selectedFilter.length; i < l; i++) {
    selectedFilter[i].onchange = function() {
      setFilter();
    };
  }

  prevButton.onclick = function(evt) {
    evt.preventDefault();

    filterForm.reset();
    filterForm.classList.add('invisible');
    resizeForm.classList.remove('invisible');
  };

  filterForm.onsubmit = function(evt) {
    evt.preventDefault();
    // перебираем элементы формы filterForm перед отправкой изображения на сервер
    var element;                                              // объявляем переменную
    for (i = 0; i < filterForm.elements.length; i++) {    // циклом перебираем элементы формы document.forms['upload-filter']
      element = filterForm.elements[i];                       // записываем в переменную все элементы формы
      if (element.checked) {                                  // если значение свойства checked равно true
        docCookies.setItem(element.name, element.value);      // записываем в cookie значения name и value элементов
      } else {
        docCookies.removeItem(element.name);
      }
    }

// конец моего кода
    uploadForm.classList.remove('invisible');
    filterForm.classList.add('invisible');

    filterForm.submit();                       // submit формы после записи элементов в cookie

  };

  setFilter();
  restoreFormValueFromCookies(filterForm);     // вызываем функцию чтения cookies


})();
