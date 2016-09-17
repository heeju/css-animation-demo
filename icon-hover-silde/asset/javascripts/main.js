$(function() {
  var $iconHoverSlide = $('.icon-hover-slide');
  var $bigPicture = $iconHoverSlide.find('figure.big-picture');
  var $bigPictureCaption = $bigPicture.children('figcaption');
  var $iconList = $iconHoverSlide.find('.icon-list');
  var $icons = $iconList.find('.icon');

  var slideWidth = $iconHoverSlide.innerWidth();
  var iconWidth = $icons.eq(0).innerWidth();
  var arrowWidth = 167;
  var prevClass = '';

  $icons.on('mouseenter click', function(event) {
    event.preventDefault();
    $icons.removeClass('active')

    var $icon = $(this).addClass('active');
    var $image = $bigPicture.find('img');
    var imagePath = $icon.attr('href');
    var imageCaption = $icon.find('.caption').text();

    var $newImage = $('<img />').attr('src', imagePath);
    var $caption = $('<span></span>').text(imageCaption);

    var className = $icon.attr('class').replace('icon', '').replace('active', '').trim();
    console.log(className);
    $('body').removeClass(prevClass).addClass(className);
    prevClass = className;

    $bigPictureCaption.html($caption);

    var captionWidth = $caption.width();
    var iconPosition = $icon.position().left + (iconWidth / 2);
    var captionLeftPosition = Math.max(0, iconPosition - captionWidth / 2);
    var arrowPosition = iconPosition - arrowWidth / 2

    // if (captionWidth > slideWidth) {
    //   captionLeftPosition = 0;
    //   captionWidth = slideWidth;
    // } else if (captionLeftPosition + captionWidth > slideWidth) {
    //   captionLeftPosition = slideWidth - captionWidth;
    // }

    $bigPictureCaption.css({
      "left": captionLeftPosition,
      "width": captionWidth
    });

    $iconList.css({
      "background-position": arrowPosition +"px 0"
    });

    $newImage.insertBefore($bigPictureCaption);
    $image.removeClass('append').on('transitionend', function() {
      $(this).remove();
    });;
    setTimeout(function() {
      $newImage.addClass('append');
    }, 0);

  }).eq(0).trigger('click');
});
