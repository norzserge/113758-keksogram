'use strict';

(function() {
  var uploadForm = document.forms['upload-select-image'];
  var resizeForm = document.forms['upload-resize'];
  var filterForm = document.forms['upload-filter'];

  var previewImage = resizeForm.querySelector('.resize-image-preview');
  var prevButton = resizeForm['resize-prev'];

// объявляем переменные для ширины, высоты и минимальной стороне изображения

  var previewImageWidth;
  var previewImageHeight;
  var previewImageMinSide;

// записываем в переменные элементы input#resize-x, input#resize-y, input#resize-size

  var reSizeX = resizeForm['resize-x'];
  var reSizeY = resizeForm['resize-y'];
  var reSizeSize = resizeForm['resize-size'];

// получаем размер загруженного изображению по событию onload, т.к. до загрузки изображения скрипт определит его размер как 0 х 0

  previewImage.onload = function() {           // в параметр функции добавляем объект event, содержащий всю информацию о событии
    previewImageWidth = previewImage.width;       // присваиваем переменной значение width изображения
    previewImageHeight = previewImage.height;     // присваиваем переменной значение height изображения
    console.log(previewImageWidth);               // выводим width изображения для проверки
    console.log(previewImageHeight);              // выводим height изображения для проверки

    // ищем наименьшую сторону изображения для ограничения на ввод значения в поле "Сторона"

    if (previewImageWidth < previewImageHeight) { // если ширина меньше высоты, то она является наименьшим значением
      previewImageMinSide = previewImageWidth;
    } else {                                      // в противном случае наименьшая - высота
      previewImageMinSide = previewImageHeight;
    }
    console.log(previewImageMinSide);             // выводим в консоль наименьшую сторону для проверки
    reSizeSize.max = previewImageMinSide;           // максимальное значение для поле "Сторона" = наименьшей стороне изображения
  };

// устанавливаем минимальные значения для полей ввода "Слева", "Сверху" и "Сторона"

  reSizeX.min = 0;
  reSizeY.min = 0;
  reSizeSize.min = 0;

// вводим функцию поиска максимального значения для ввода в поле "Слева"

  function reSizeXLimit() {
    if (reSizeSize.value !== '') {                                            // условие: если значение поле "Сторона" не пустое - выполняем код
      var reSizeSumX = parseInt(reSizeX.value) + parseInt(reSizeSize.value);  // складываем значение смещения по Х и длину стороны
      if (reSizeSumX >= previewImageWidth) {                                  // если сумма смещения и длины стороны больше ширины изображения
        reSizeX.max = previewImageWidth - reSizeSize.value;                   // устанавливаем reSizeX.max равное previewImageWidth - reSizeSize.value
        reSizeX.value = reSizeX.max;                                          // устанавливаем максимальное значение для пользователя если он ввел значение, выходящее за ограничение
      }
    } else {
      reSizeX.value = '0';                                                     // обнуляем значение "Слева"
    }
  }

// вводим функцию поиска максимального значения для ввода в поле "Сверху"

  function reSizeYLimit() {
    if (reSizeSize.value !== '') {
      var reSizeSumY = parseInt(reSizeY.value) + parseInt(reSizeSize.value);
      if (reSizeSumY >= previewImageHeight) {
        reSizeY.max = previewImageHeight - reSizeSize.value;
        reSizeY.value = reSizeY.max;                                           // устанавливаем максимальное значение для пользователя если он ввел значение, выходящее за ограничение
      }
    } else {
      reSizeY.value = '0';
    }
  }

// вводим функцию ограничения максимального значения для ввода в поле "Сторона"

  function reSizeSizeLimit() {
    if (reSizeSize.value > previewImageMinSide) {
      reSizeSize.value = previewImageMinSide;
    } else {
      reSizeX.value = '0';                // обнуляем значения полей при изменении размера стороны
      reSizeY.value = '0';
    }
  }

  reSizeSize.onchange = reSizeSizeLimit;  // инициализируем функцию при событии onchange (изменение значения поля input#resize-size)
  reSizeX.onchange = reSizeXLimit;        // инициализируем функцию при событии onchange (изменение значения поля input#resize-x)
  reSizeY.onchange = reSizeYLimit;        // инициализируем функцию при событии onchange (изменение значения поля input#resize-y)


  prevButton.onclick = function(evt) {
    evt.preventDefault();

    resizeForm.reset();
    uploadForm.reset();
    resizeForm.classList.add('invisible');
    uploadForm.classList.remove('invisible');
  };

  resizeForm.onsubmit = function(evt) {
    evt.preventDefault();
    filterForm.elements['filter-image-src'] = previewImage.src;

    resizeForm.classList.add('invisible');
    filterForm.classList.remove('invisible');
  };
})();
