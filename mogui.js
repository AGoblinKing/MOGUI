// MOGUI.js
// Joshua Galvin
// 2013-05-23

// MIT License
var MOGUI = (function () {

  function fillStroke(moctx, fill, stroke) {
    if (fill !== undefined) {
        moctx.setFillStyle(fill);
      }
      if (stroke !== undefined) {
        moctx.setStrokeStyle(stroke);
      }
  }

  var iconIMGs = new Image(), loaded = false;
  iconIMGs.src = "../images/glyphicons-halflings.png";
  iconIMGs.onload = function() {
    loaded = true;
    for(var i in fineUpstandingMaleCallers) {
      fineUpstandingMaleCallers[i]();
    }
  }
  var fineUpstandingMaleCallers = [];
  var icons = {
    "body": [7, 0],
    "support": [10, 5],
    "system": [16, 0]
  };

  var MOGUI = XMONAD(function (monad, value) {
    if (value === undefined) {
      return MOCTX()
    }
    return value;
  })
    .lift("load", function(moctx, callback) {
      if(loaded) {
        callback();
      } else {
        fineUpstandingMaleCallers.push(callback);
      }
      return MOGUI(moctx);
    })  
    .lifts("setSize", "hide", "show")
    .lift_values("getCanvas")
    .lift("circleButton", function(moctx, num, radius, icon) {
      fillStroke(moctx, "black", "black");
      var x = moctx.getWidth() / 2,
        y =  radius + 5 + 2 * radius * num + num*radius/5;

      var ico = icons[icon];

      moctx
        .setLineWidth(5)
        .beginPath()
        .arc(x, y, radius-10, 0, Math.PI * 2, true)
        .closePath()
        .fill()

      moctx
        .beginPath()
        .arc(x, y, radius, 0, Math.PI * 2, true)
        .closePath()
        .stroke()


      if (ico !== undefined) {
        moctx
          .setGlobalCompositeOperation("xor")
          .drawImage(iconIMGs, 24*ico[0], 24*ico[1], 24, 24, x - 21, y - 21, radius*1.5, radius*1.5);
      }

      return MOGUI(moctx);
    })
    .lift("circle", function (moctx, x, y, radius, fill, stroke) {
      fillStroke(moctx, fill, stroke);
      return MOGUI(moctx
        .beginPath()
        .arc(x, y, radius, 0, Math.PI * 2, true)
        .closePath()
        .fill().stroke()
        );
    })
    .lift("box", function (moctx, x, y, width, height, fill, stroke, radius) {
      fillStroke(moctx, fill, stroke);
      radius = radius === undefined ? 0 : radius;

      return MOGUI(moctx
        .beginPath()
        .moveTo(x + radius, y)
        .lineTo(x + width - radius, y)
        .quadraticCurveTo(x + width, y, x + width, y + radius)
        .lineTo(x + width, y + height - radius)
        .quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
        .lineTo(x + radius, y + height)
        .quadraticCurveTo(x, y + height, x, y + height - radius)
        .lineTo(x, y + radius)
        .quadraticCurveTo(x, y, x + radius, y)
        .closePath()
        .fill().stroke());
    })
    .lift("clear", function(moctx) {
      return MOGUI(moctx.clearRect(0, 0, moctx.getWidth(), moctx.getHeight()));
    })
    .lift("text", function (moctx, text, x, y, color, font) {
      fillStroke(moctx, color, color);
      if (font !== undefined) {
        moctx.setFont(font);
      }
      return MOGUI(moctx.fillText(text, x, y));
    });
  return MOGUI;
}());