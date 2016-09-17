function supportTransition() {
  var div = document.createElement('div');
  var transEndEventNames = {
    "WebkitTransition": 'webkitTransitionEnd',
    "MozTransition": 'transitionend',
    "OTransition": 'oTransitionEnd otransitionend',
    "transition": 'transitionend'
  };
  var result = false;

  for (var name in transEndEventNames) {
    if (div.style[name] !== undefined) {
      result = true;
    }
  }
  return result;
}

function isMobile() {
  var ua = navigator.userAgent || navigator.vendor || window.opera;
  return (
    /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(ua) ||
    /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(ua.substr(0, 4))
  );
}

function VideoDialog(options) {
  this.options = $.extend({
    "src": "",
    "videoRaito": 1.778, //16:9
    "closeButton": true,
    "overlayClose": false,
    "fromTarget": null,
    "delay": 0,
    "duration": 700
  }, options);

  this.$doc = $(document);
  this.$body = $(document.body);
  this.supportTransition = supportTransition();

  this.elements = {
    "$dialog": $('<div class="video-dialog" tabindex="-1"></div>'),
    "$overlay": $('<div class="video-dialog-overlay"></div>'),
    "$wrap": $('<div class="video-dialog-wrap"></div>'),
    "$close": $('<a class="video-dialog-close" href="#">close</a>'),
    "$videoFrame": $('<iframe frameborder="0" allowfullscreen></iframe>')
  };
}

VideoDialog.open = function() {
  if (!this instanceof VideoDialog) {
    return false;
  }

  $(window).on('resize orientationchange', VideoDialog.adjust.bind(this));

  var self = this;
  var $wrap = self.elements.$wrap;
  var $dialog = self.elements.$dialog;
  var options = self.options;

  var transitionHandler = function() {
    VideoDialog.insertContents.call(self);
    $wrap.removeAttr("style").off('transitionend webkitTransitionEnd');
    VideoDialog.adjust.call(self);
  };

  if (self.supportTransition === true) {
    $wrap.css(options.after).one("transitionend webkitTransitionEnd", transitionHandler);
  } else {
    setTimeout(transitionHandler, 0);
  }
};


VideoDialog.insertContents = function() {
  if (!this instanceof VideoDialog) {
    return false;
  }

  this.elements.$videoFrame.attr('src', this.options.src)
  this.elements.$wrap.append(this.elements.$videoFrame);
};


VideoDialog.adjust = function() {
  if (!this instanceof VideoDialog) {
    return false;
  }

  var $dialog = this.elements.$dialog;
  var $wrap = this.elements.$wrap;
  var dialogHeight = $dialog.height();

  var width = $dialog.width();
  var height = dialogHeight;
  var raito = this.options.videoRaito;

  if (width / height > raito) {
    width = height * raito;
  }

  $wrap.width(width);
  width = $wrap.width();
  height = width / raito;

  $wrap.width(width).height(height).css('margin-top', (dialogHeight - height) / 2);

  if (this.elements.$videoFrame) {
    this.elements.$videoFrame.css({
      'width': width,
      'height': height
    });
  }
};


VideoDialog.close = function() {
  if (!this instanceof VideoDialog) {
    return false;
  }

  var self = this;

  $(window).off('resize orientationchange', VideoDialog.adjust.bind(this));

  var $dialog = this.elements.$dialog;
  var $wrap = this.elements.$wrap;
  var $overlay = this.elements.$overlay;
  var duration = " " + this.options.duration + "ms";
  var options = this.options;

  var $from = $(options.fromTarget);
  var offset = $wrap.offset();
  var docScrollTop = self.$doc.scrollTop();

  $wrap.empty().css({
    "position": "absolute",
    "top": (offset.top - docScrollTop) + "px",
    "left": offset.left + "px",
    "width": $wrap.width() + "px",
    "height": $wrap.height() + "px",
    "margin-top": "0",
    "opacity": "1",
    "transition": [
      "top",
      "left",
      "width",
      "height",
      "opacity"
    ].join(duration + ",") + duration
  });

  offset = $from.offset();

  console.log('close', offset)

  var goWidth = $from.outerWidth();
  var goHeight = $from.outerHeight();

  $wrap.css({
    "top": (offset.top - docScrollTop) - goHeight * 0.16 + "px",
    "left": offset.left + goWidth * 0.16 + "px",
    "width": goWidth + "px",
    "height": goHeight + "px",
    "opacity": 0
  });

  this.$body.removeClass("video-dialog-open");
  $dialog.removeClass("open").addClass("close");

  var transitionHandler = function() {
    self.$body.removeClass("overflow-hidden");
    $(this).off("transitionend webkitTransitionEnd");
    $wrap.removeAttr('style');
    $dialog.remove();
    self.dialogOption = null;
  };

  if (this.supportTransition === true) {
    $wrap.one("transitionend webkitTransitionEnd", transitionHandler);
  } else {
    transitionHandler();
  }
};


VideoDialog.prototype.open = function() {
  var self = this;
  var el = this.elements;
  var $body = this.$body;
  var options = this.options;

  el.$overlay.appendTo(el.$dialog);

  $body.addClass('video-dialog-open');

  el.$wrap.css('visibility', 'hidden').appendTo(el.$dialog);
  el.$dialog.show().appendTo($body);

  VideoDialog.adjust.call(this);

  var $from = $(options.fromTarget);
  var offset = $from.offset();
  var duration = " " + options.duration + "ms";
  var docScrillTop = this.$doc.scrollTop();

  options.before = {
    "position": "absolute",
    "top": (offset.top - docScrillTop) + "px",
    "left": offset.left + "px",
    "width": $from.outerWidth() + "px",
    "height": $from.outerHeight() + "px",
    // "opacity": .2,
    "margin-top": "0px"
  };

  offset = el.$wrap.offset();


  options.after = {
    "top": (offset.top - docScrillTop) + "px",
    "left": offset.left + "px",
    "width": el.$wrap.width() + "px",
    "height": el.$wrap.height() + "px",
    "opacity": "1",
    "transition": [
      "top",
      "left",
      "width",
      "height",
      // "opacity"
    ].join(duration + ",") + duration
  };

  el.$wrap.css("visibility", "visible").css(options.before);
  el.$dialog.addClass('open');


  setTimeout(function() {
    VideoDialog.open.call(self);
  }, options.delay);

  el.$dialog.one("dialogclose", function() {
    VideoDialog.close.call(self);
  });

  if (options.closeButton === true) {
    el.$close.one("click", function(event) {
      event.preventDefault();
      el.$dialog.trigger("dialogclose");
    }).appendTo(el.$wrap);
  }

  if (options.overlayClose === true) {
    el.$overlay.addClass("dialog-close").one("click", function(event) {
      event.preventDefault();
      el.$dialog.trigger("dialogclose");
    });
  }
};


VideoDialog.prototype.close = function() {
  this.el.$dialog.trigger("dialogclose");
};


$(function() {
  if (isMobile() === false) {
    var $trigger = $(".watch-button");

    var videoDialog = new VideoDialog({
      src: $trigger.attr('href'),
      videoRaito: 1.778,
      fromTarget: $trigger,
      delay: 0,
      duration: 700
    });

    $trigger.on("click", function(event) {
      event.preventDefault();
      videoDialog.open();
    });
  }
});
