function supportTransform() {
  if (!window.getComputedStyle) {
    return false;
  }
  var el = document.createElement('div');
  var has3d;
  var transforms = {
    'webkitTransform': '-webkit-transform',
    'OTransform': '-o-transform',
    'msTransform': '-ms-transform',
    'MozTransform': '-moz-transform',
    'transform': 'transform'
  };
  document.body.insertBefore(el, null);
  for (var t in transforms) {
    if (el.style[t] !== undefined) {
      el.style[t] = "translate3d(1px,1px,1px)";
      has3d = window.getComputedStyle(el).getPropertyValue(transforms[t]);
    }
  }
  document.body.removeChild(el);
  return (has3d !== undefined && has3d.length > 0 && has3d !== "none");
}


function makeResizeHandler(container) {
  var $win = $(window);
  var $container = $(container)
  var $slideWrap = $container.children('.slide-wrap');
  var $descriptions = $slideWrap.find('.description');
  // var fontSize = parseInt($slideWrap.css("font-size"));
  // var remWidth = $slideWrap.width() / fontSize;
  // var remHeight = $slideWrap.height() / fontSize;

  var originalWidth = $slideWrap.width();
  var originalHeight = $slideWrap.height();

  var otherHeight = $container.find('h1').outerHeight(true) + $container.find('ul').outerHeight(true);
  var diffHeight = $container.outerHeight(true) - $slideWrap.height();

  console.log($slideWrap.height());

  return function() {
    var winHeight = $win.height();
    var maxWidth = $container.innerWidth();
    var maxHeight = winHeight - diffHeight;

    // console.log(maxHeight)
    // var targetFontSize = Math.min(maxWidth / remWidth, maxHeight / remHeight);
    // var scale = 1;

    var scale = Math.min(1, maxWidth / originalWidth, maxHeight / originalHeight);

    $descriptions.css({
      "transform": "scale(" + (1 / scale) + ")",
      "width": maxWidth,
      "margin-left": -maxWidth / 2
    });

    $container.height(originalHeight * scale + otherHeight);


    // if (targetFontSize < 10) {
    //   scale = targetFontSize / 10;
    //   targetFontSize = 10;

    //   $descriptions.css({
    //     "transform": "scale(" + (1 / scale) + ")",
    //     "width": (maxWidth) + "px",
    //     "margin-left": "-" + (maxWidth / 2) + "px"
    //   });

    //   var descriptionHeight = 0;
    //   $descriptions.each(function() {
    //     descriptionHeight = Math.max(descriptionHeight, $(this).height());
    //   });

    //   var tempRemHeight = remHeight;
    //   var minDescriptionHeight = targetFontSize * scale * 4;

    //   if (descriptionHeight > minDescriptionHeight) {
    //     tempRemHeight += ((descriptionHeight - minDescriptionHeight) / targetFontSize) / scale;
    //     $slideWrap.css({
    //       "height": tempRemHeight + "em"
    //     });
    //   }
    //   $container.height(tempRemHeight * targetFontSize * scale + otherHeight);
    // } else {
    //   $container.css("height", "auto");
    //   $slideWrap.css({
    //     "height": remHeight + "em"
    //   });
    //   $descriptions.css({
    //     "transform": "scale(1)",
    //     "width": "100%",
    //     "margin-left": "-50%"
    //   });
    // }

    $slideWrap.css({
      // "font-size": targetFontSize + "px",
      "transform": "scale(" + scale + ")"
    });
  }
}


function makeSlideClickHandler(container) {
  var $slideWrap = $(container).children(".slide-wrap");
  var $documentImageFrame = $slideWrap.find(".document-image-frame");

  return function(event) {
    event.preventDefault();

    var $anchor = $(event.target);
    var targetSlideId = $anchor.attr("href").replace(/^#/, '');

    if ($anchor.parent().is(".active")) {
      return false;
    }

    $anchor.parent().addClass("active").siblings("li").removeClass("active");

    $("#" + targetSlideId).addClass("active").siblings(".slide").removeClass("active");

    var prevSlideId = "";

    $slideWrap.removeClass(function(index, classNames) {
      prevSlideId = classNames.match(/(^|\s)active-([\w-]+)/g)[0].replace(/\s?active-/, "");
      return (classNames.match(/(^|\s)(active-|prev-)([\w-]+)/g) || []).join(" ");
    }).addClass("active-" + targetSlideId + " prev-" + prevSlideId);

    $documentImageFrame.addClass("animate").one("animationend", function() {
      $(this).removeClass("animate");
    });

    $documentImageFrame.addClass("transition").one("transitionend", function() {
      $(this).removeClass("transition");
    });
  }
}


$.fn.slideDemo = function() {
  return this.each(function() {
    var $slideContainer = $(this)
    var clickHandler = makeSlideClickHandler(this);
    var resizeHandler = makeResizeHandler(this);

    $slideContainer.children(".slide-list").on("click", "a", clickHandler);
    $(window).on('resize orientationchange', resizeHandler);
    resizeHandler();
  });
};


$(function() {
  if (!supportTransform()) {
    $(document.body).addClass("no-transform");
  }
  $(".slide-container").slideDemo();
});
