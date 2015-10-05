'use strict';

(function() {

  var Key = {                                                                 // объект с кодами кнопок клавиатуры
    'ESC': 27,
    'LEFT': 37,
    'RIGHT': 39
  };

  var picturesContainer = document.querySelector('.pictures');
  var galleryElement = document.querySelector('.gallery-overlay');
  var closeButton = galleryElement.querySelector('.gallery-overlay-close');

  function doesHaveParent(element, className) {                               // функция проверяет, есть ли у элемента, по которому кликнули родительский элемент с опред. классом. Возвращает true/false
    do {                                                                      // в нашем случае мы с evt.target поползем по DOM вверх через .parentElement
      if (element.classList.contains(className)) {
        return !element.classList.contains('picture-load-failure');           // возвращаем true если у элемента есть фото и false если нет
      }
      element = element.parentElement;
    } while (element);                                                        // цикл остановится, когда parentElement дойдет до самого верха и будет равен null

    return false;
  }

  function hideGallery() {
    galleryElement.classList.add('invisible');                                // добавляем класс invisible к .gallery-overlay
    closeButton.removeEventListener('click', closeHandler);                   // удаляем событие click с крестика, т.к. галерея скрыта
    document.body.removeEventListener('keydown', keyHandler);
  }

  function closeHandler(evt) {
    evt.preventDefault();                                                     // отменяем действие возможной ссылки (если крестик сделан через ссылку с href="#")
    hideGallery();
  }

  function keyHandler(evt) {
    switch (evt.keyCode) {
      case Key.LEFT:
        console.log('показываем предыдущее фото');
        break;
      case Key.RIGHT:
        console.log('показываем следующее фото');
        break;
      case Key.ESC:
        hideGallery();
      default: break;
    }
  }

  function showGallery(evt){                                                  // функция показа галереи (оверлея)
    galleryElement.classList.remove('invisible');
    closeButton.addEventListener('click', closeHandler);                      // вешаем на крестик по клику функцию закрытия галереи
    document.body.addEventListener('keydown', keyHandler);
  }

  picturesContainer.addEventListener('click', function(evt) {
    if (doesHaveParent(evt.target, 'picture')) {                              // проверяем, имеет ли target (объект, по которому кликнули) родительский элемент с классом .picture
      showGallery();                                                          // если имеет - показываем галерею
    }
  });
})();
