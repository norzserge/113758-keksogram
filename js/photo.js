'use strict';

(function() {

  var REQUEST_FAILURE_TIMEOUT = 10000;
  var pictureTemplate = document.getElementById('picture-template');

// создаем конструктор (класс) Photo
  var Photo = function(data) {
    this._data = data;
    this.onClick = this.onClick.bind(this);
  };

  Photo.prototype.render = function(container) {
    var newPictureElement = pictureTemplate.content.children[0].cloneNode(true);

    newPictureElement.querySelector('.picture-comments').textContent = this._data['comments'];
    newPictureElement.querySelector('.picture-likes').textContent = this._data['likes'];

    // добавление в контейнер
    container.appendChild(newPictureElement);

    // добавляем изображение для каждого объекта типа Photo
    if (this._data['url']) {
      var newPicture = new Image();
      newPicture.src = this._data['url'];
      var oldPicture = newPictureElement.querySelector('img');

      var imageLoadTimeout = setTimeout(function() {
        newPictureElement.classList.add('picture-load-failure');
      }, REQUEST_FAILURE_TIMEOUT);

      newPicture.onload = function() {
        newPictureElement.replaceChild(newPicture, oldPicture);
        newPicture.style.width = '182px';
        newPicture.style.height = '182px';
        clearTimeout(imageLoadTimeout);
      };

      newPicture.onerror = function() {
        newPictureElement.classList.add('picture-load-failure');
      };
    }

    this._element = newPictureElement;
// Обработчик клика по картинке
    this._element.addEventListener('click', this.onClick);
  };

// метод, который удаляет элемент и обработчик клика из документа
  Photo.prototype.unrender = function() {
    this._element.parentNode.removeChild(this._element);
    this._element.removeEventListener('click', this.onClick);
    this._element = null;
  };

// Обработчик события клика по изображению
  Photo.prototype.onClick = function() {
    if (!this._element.classList.contains('picture-load-failure')) {
      var galleryEvent = new CustomEvent('showgallery', { detail: { pictureElement: this }});
      window.dispatchEvent(galleryEvent);
    }
  };

// делаем класс Photo глобальным
  window.Photo = Photo;

})();
